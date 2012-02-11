/***************************************************************************************************************
 *  File : actions.js
 * 
 *  Gère les actions (extension de l'objet Deckbuilder)
 */




/***************************************************************************************************************
 *  Function : newDeck
 *
 *  Chargement d'un nouveau deck vierge
 */
Deckbuilder.newDeck = function () {
  // Si le deck actuel n'est pas enregistré, il faut le proposer
  if (Deckbuilder.deck_not_saved) {
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var save = prompts.confirm(window, $("i18n").getString("deck.confirmsaving.title"), $("i18n").getString("deck.confirmsaving.message"));
    if (save) { Deckbuilder.saveDeck(); }
  }

  Deckbuilder.deck = new Deck();
  Deckbuilder.deck.loadNew();
  Deckbuilder.loadDeck();
  Deckbuilder.deck_not_saved = false;
}
/***************************************************************************************************************
 *  Function : openDeck
 *
 *  Chargement d'un deck existant
 * 
 *  Parameters :
 *    (String) path - chemin vers un deck récent (optionnel)
 */
Deckbuilder.openDeck = function (path) {
  // Si le deck actuel n'est pas enregistré, il faut le proposer
  if (Deckbuilder.deck_not_saved) {
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var save = prompts.confirm(window, $("i18n").getString("deck.confirmsaving.title"), $("i18n").getString("deck.confirmsaving.message"));
    if (save) { Deckbuilder.saveDeck(); }
  }
  // Ouverture d'un deck
  Deckbuilder.deck = new Deck();
  if (path) {
    var deck_file = getFolder("ProfD");
    deck_file.initWithPath(path);
    Components.utils.import("resource://gre/modules/NetUtil.jsm");
    NetUtil.asyncFetch(deck_file, function(inputStream, status) {
      if (!Components.isSuccessCode(status)) {
        window.top.Notifs.add({"type": "deckbuilder_file_read_error", "top": false, "timer": true, "time": 4000});
        return;
      }
      var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
      Deckbuilder.deck.loadFromXyd(deck_file,data);
      Deckbuilder.loadDeck();
      Deckbuilder.deck_not_saved = false;
      Deckbuilder.updateLastDecks();
      window.top.Notifs.add({"type": "deckbuilder_file_read_success", "top": false, "timer": true, "time": 4000});
    });
  }
  else {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, $("i18n").getString("opendeck.title"), nsIFilePicker.modeOpen);
    fp.appendFilter($("i18n").getString("opendeck.filter.xyd"), "*.xyd");
    fp.appendFilter($("i18n").getString("opendeck.filter.all"), "*.*");
    // Ouverture du dossier de Decks par défaut
    var decks_folder = getFolder("ProfD");
    decks_folder.initWithPath(Prefs.getChar("decks.folder"));
    fp.displayDirectory = decks_folder;
    if (fp.show() == nsIFilePicker.returnOK) {
      Components.utils.import("resource://gre/modules/NetUtil.jsm");
      NetUtil.asyncFetch(fp.file, function(inputStream, status) {
        if (!Components.isSuccessCode(status)) {
          window.top.Notifs.add({"type": "deckbuilder_file_read_error", "top": false, "timer": true, "time": 4000});
          return;
        }
        var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
        Deckbuilder.deck.loadFromXyd(fp.file,data);
        Deckbuilder.loadDeck();
        Deckbuilder.deck_not_saved = false;
        Deckbuilder.updateLastDecks();
        window.top.Notifs.add({"type": "deckbuilder_file_read_success", "top": false, "timer": true, "time": 4000});
      });
    }
  }
}
/***************************************************************************************************************
 *  Function : loadDeck
 *
 *  Chargement du deck (stocké en mémoire) dans l'interface
 */
Deckbuilder.loadDeck = function () {
  $("hbox_deck_button").setAttribute("tooltiptext",Deckbuilder.deck.name);
  clearListbox("maindeck");
  clearListbox("sidedeck");
  clearListbox("extradeck");
  var i_max = Deckbuilder.deck.main.length;
  for (var i = 0 ; i < i_max ; i++) {
    var deckcard = Deckbuilder.ycd.getCard(Deckbuilder.deck.main[i].card_id).getDeckcard(Deckbuilder.deck.main[i].number,Deckbuilder.deck_template);
    $("maindeck").appendChild(deckcard);
  }
  var i_max = Deckbuilder.deck.side.length;
  for (var i = 0 ; i < i_max ; i++) {
    var deckcard = Deckbuilder.ycd.getCard(Deckbuilder.deck.side[i].card_id).getDeckcard(Deckbuilder.deck.side[i].number,Deckbuilder.deck_template);
    $("sidedeck").appendChild(deckcard);
  }
  var i_max = Deckbuilder.deck.extra.length;
  for (var i = 0 ; i < i_max ; i++) {
    var deckcard = Deckbuilder.ycd.getCard(Deckbuilder.deck.extra[i].card_id).getDeckcard(Deckbuilder.deck.extra[i].number,Deckbuilder.deck_template);
    $("extradeck").appendChild(deckcard);
  }
  Deckbuilder.refreshStats();
}
/***************************************************************************************************************
 *  Function : updateDeck
 *
 *  MAJ de l'objet Deck à partir du Deck de l'interface courante
 */
Deckbuilder.updateDeck = function () {
  // MAJ du nom du Format (inclus dans un .xyd pour plus de lisibilité)
  Deckbuilder.deck.format_name = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getFormat(Deckbuilder.deck.format_id).name;
  Deckbuilder.deck.main = [];
  Deckbuilder.deck.side = [];
  Deckbuilder.deck.extra = [];
  var i_max = $("maindeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("maindeck").getItemAtIndex(i).firstChild;
    Deckbuilder.deck.main.push({"card_id": item.getAttribute("card_id"),
                                "reference": item.getAttribute("reference"),
                                "number": item.getAttribute("number"),
                                "name": item.getAttribute("name")});
  }
  var i_max = $("sidedeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("sidedeck").getItemAtIndex(i).firstChild;
    Deckbuilder.deck.side.push({"card_id": item.getAttribute("card_id"),
                                "reference": item.getAttribute("reference"),
                                "number": item.getAttribute("number"),
                                "name": item.getAttribute("name")});
  }
  var i_max = $("extradeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("extradeck").getItemAtIndex(i).firstChild;
    Deckbuilder.deck.extra.push({"card_id": item.getAttribute("card_id"),
                                  "reference": item.getAttribute("reference"),
                                  "number": item.getAttribute("number"),
                                  "name": item.getAttribute("name")});
  }
}
/***************************************************************************************************************
 *  Function : saveDeck
 *
 *  Enregistrement du deck courant
 */
Deckbuilder.saveDeck = function () {
  // Si le deck n'a pas déjà été enregistré une fois, il faut "Enregistrer sous"
  if (!Deckbuilder.deck.file) { Deckbuilder.saveDeckAs(); }
  else {
    Deckbuilder.updateDeck();
    Deckbuilder.deck.save();
    Deckbuilder.deck_not_saved = false;
  }
}
/***************************************************************************************************************
 *  Function : saveDeckAs
 *
 *  Enregistrement du deck courant
 */
Deckbuilder.saveDeckAs = function () {
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, $("i18n").getString("savedeck.title"), nsIFilePicker.modeSave);
  fp.appendFilter($("i18n").getString("savedeck.filter"), "*.xyd");
  fp.defaultExtension = "xyd";
  fp.defaultString = (Deckbuilder.deck.name != "") ? Deckbuilder.deck.name : "deck.xyd" ;
  // Ouverture du dossier de Decks par défaut
  var decks_folder = getFolder("ProfD");
  decks_folder.initWithPath(Prefs.getChar("decks.folder"));
  fp.displayDirectory = decks_folder;
  if (fp.show() == nsIFilePicker.returnOK) {
    // On met à jour les infos de l'objet "Deck"
    Deckbuilder.deck.file = fp.file;
    Deckbuilder.deck.name = fp.file.leafName;
    Deckbuilder.updateDeck();
    Deckbuilder.deck.save();
    Deckbuilder.deck_not_saved = false;
    Deckbuilder.updateLastDecks();
  }
}
/***************************************************************************************************************
 *  Function : exportToInternet
 *
 *  Ouvre une fenêtre d'export Internet (copie dans le presse-papier)
 */
Deckbuilder.exportToInternet = function () {
  Deckbuilder.updateDeck();
  var infos = {"Deckbuilder": Deckbuilder };
  window.openDialog('chrome://ylifecore/content/modules/deckbuilder/internetdeck.xul','internetdeck','chrome,modal,centerscreen',infos);
}
/***************************************************************************************************************
 *  Function : exportToYVD
 *
 *  Export au format YVD
 */
Deckbuilder.exportToYVD = function () {
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, $("i18n").getString("export.yvd.title"), nsIFilePicker.modeSave);
  fp.appendFilter($("i18n").getString("export.yvd.filter"), "*.dek");
  fp.defaultExtension = "xyd";
  fp.defaultString = "deck.dek" ;
  // Ouverture du dossier de Decks par défaut
  var decks_folder = getFolder("ProfD");
  decks_folder.initWithPath(Prefs.getChar("decks.folder"));
  fp.displayDirectory = decks_folder;
  if (fp.show() == nsIFilePicker.returnOK) {
    Deckbuilder.updateDeck();
    Deckbuilder.deck.exportToYVD(fp.file);
  }
}
/***************************************************************************************************************
 *  Function : print
 *
 *  Ouvre une fenêtre d'impression
 */
Deckbuilder.print = function () {
  Deckbuilder.updateDeck();
  var infos = {"Deckbuilder": Deckbuilder };
  window.openDialog('chrome://ylifecore/content/modules/deckbuilder/printdeck.xul','printdeck','chrome,modal,centerscreen',infos);
}
/***************************************************************************************************************
 *  Function : infoDeck
 *
 *  Ouvre une fenêtre contenant le détail du deck courant (nom, format, notes,...)
 */
Deckbuilder.infoDeck = function () {
  var infos = {"update": false,
                "formats" : Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getFormatsBy("Format_ID ASC"),
                "name" : Deckbuilder.deck.name,
                "created" : Deckbuilder.deck.created,
                "updated" : Deckbuilder.deck.updated,
                "format_id" : Deckbuilder.deck.format_id,
                "notes" : Deckbuilder.deck.notes };
  window.openDialog('chrome://ylifecore/content/modules/deckbuilder/infodeck.xul','infodeck','chrome,modal,centerscreen',infos);
  // Si on doit sauver les infos, on MAJ l'objet Deck
  if (infos.update) {
    Deckbuilder.deck.format_id = infos.format_id;
    Deckbuilder.deck.format_name = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getFormat(infos.format_id).name;
    Deckbuilder.deck.notes = infos.notes;
    Deckbuilder.saveDeck();
  }
}
/***************************************************************************************************************
 *  Function : refreshStats
 *
 *  Rafraichit le nombre de cartes (monster/spell/trap/main/side/extra)
 */
Deckbuilder.refreshStats = function () {
  var nb_monster = 0;
  var nb_spell = 0;
  var nb_trap = 0;
  var nb_main = 0;
  var nb_side = 0;
  var nb_extra = 0;
  var i_max = $("maindeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("maindeck").getItemAtIndex(i).firstChild;
    if (item.getAttribute("type_id") == 1) { nb_monster = nb_monster + parseInt(item.getAttribute("number")); }
    if (item.getAttribute("type_id") == 2) { nb_spell = nb_spell + parseInt(item.getAttribute("number")); }
    if (item.getAttribute("type_id") == 3) { nb_trap = nb_trap + parseInt(item.getAttribute("number")); }
  }
  var nb_main = nb_monster + nb_spell + nb_trap;
  var i_max = $("sidedeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("sidedeck").getItemAtIndex(i).firstChild;
    nb_side = nb_side + parseInt(item.getAttribute("number"));
  }
  var i_max = $("extradeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("extradeck").getItemAtIndex(i).firstChild;
    nb_extra = nb_extra + parseInt(item.getAttribute("number"));
  }
  $("nb_monster").value = nb_monster;
  $("nb_spell").value = nb_spell;
  $("nb_trap").value = nb_trap;
  $("nb_total").value = nb_main;
  $("nb_main").value = $("i18n").getString("main") + " ( " + nb_main + " )";
  $("nb_side").value = $("i18n").getString("side") + " ( " + nb_side + " )";
  $("nb_extra").value = $("i18n").getString("extra") + " ( " + nb_extra + " )";
}
/***************************************************************************************************************
 *  Function : getCardNb
 *
 *  Retourne le nombre de cartes du même groupe dans le deck courant
 * 
 *  Parameters :
 *    (Integer) group_id - Group_ID d'une carte Yugioh
 */
Deckbuilder.getCardNb = function (group_id) {
  var nb = 0;
  var i_max = $("maindeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("maindeck").getItemAtIndex(i).firstChild;
    if (item.getAttribute("group_id") == group_id) { nb = nb + parseInt(item.getAttribute("number")); }
  }
  var i_max = $("sidedeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("sidedeck").getItemAtIndex(i).firstChild;
    if (item.getAttribute("group_id") == group_id) { nb = nb + parseInt(item.getAttribute("number")); }
  }
  var i_max = $("extradeck").getRowCount();
  for (var i = 0 ; i < i_max ; i++) {
    var item = $("extradeck").getItemAtIndex(i).firstChild;
    if (item.getAttribute("group_id") == group_id) { nb = nb + parseInt(item.getAttribute("number")); }
  }
  return nb;
}
/***************************************************************************************************************
 *  Function : addCard
 *
 *  Ajoute une carte à un deck (et éventuellement à une position donnée)
 * 
 *  Parameters :
 *    (String) deck - Deck cible  : maindeck/sidedeck/extradeck
 *    (Integer) index - index où insérer la carte
 */
Deckbuilder.addCard = function (deck,index) {
  if (Deckbuilder.card) {
    // Combien d'exemplaires sont-ils déjà présents dans le Deck (Main + Side + Extra) ?
    var nb_instances = Deckbuilder.getCardNb(Deckbuilder.card.group_id);
    // Quelles sont les restrictions pour cette carte dans ce format ? (celui du Deck)
    var nb_restricts = Deckbuilder.card.getRestriction(Deckbuilder.deck.format_id);
    // Si on peut encore ajouter un exemplaire aux vues des Restrictions, on le fait.
    if (nb_instances < nb_restricts) {
      var target = deck;
      // Si c'est un Monstre Fusion ou Synchro, on l'ajoute à l'extradeck
      if ((Deckbuilder.card.subtype_id == "3")||(Deckbuilder.card.subtype_id == "14")) { target = "extradeck"; }
      // Sinon, c'est maindeck par défaut si par mégarde c'est l'ajout à l'extradeck demandé
      if ((Deckbuilder.card.subtype_id != "3")&&(Deckbuilder.card.subtype_id != "14")&&(target == "extradeck")) { target = "maindeck"; }
      // On essaie de trouver une ligne déjà existante pour cette carte
      var i_max = $(target).getRowCount();
      var i = 0;
      var addline = true;
      while ((addline)&&(i < i_max)) {
        var item = $(target).getItemAtIndex(i).firstChild;
        if (item.getAttribute("card_id") == Deckbuilder.card.card_id) {
          var number = parseInt(item.getAttribute("number")) + 1;
          item.setAttribute('number', number);
          addline = false;
        }
        i++;
      }
      // Si on est sorti sans trouver de ligne, on en ajoute une
      if (addline) {
        var deckcard = Deckbuilder.card.getDeckcard("1",Deckbuilder.deck_template);
        // Si on a un index spécifique pour l'insertion
        if ((index)||(index == 0)) { $(target).insertBefore(deckcard, $(target).getItemAtIndex(index)); }
        // Sinon, on l'ajoute à la fin
        else { $(target).appendChild(deckcard); }
      }
      Deckbuilder.refreshStats();
      Deckbuilder.deck_not_saved = true;
    }
    // Sinon, on a déjà atteint la limite d'exemplaires de la carte
    else {
      window.top.Notifs.add({"type": "deckbuilder_restrictions", "top": true, "timer": true, "time": 4000});
    }
  }
}
/***************************************************************************************************************
 *  Function : delCard
 *
 *  Ajoute une carte à un deck (et éventuellement à une position donnée)
 * 
 *  Parameters :
 *    (String) deck - Deck cible  : maindeck/sidedeck/extradeck
 */
Deckbuilder.delCard = function (deck) {
  if (Deckbuilder.card) {
    var i = 0;
    while ($(deck).getItemAtIndex(i).firstChild.getAttribute("card_id") != Deckbuilder.card.card_id) { i++; }
    var item = $(deck).getItemAtIndex(i).firstChild;
    var number = parseInt(item.getAttribute("number"));
    if (number > 1) { item.setAttribute('number', number - 1); }
    else { $(deck).removeItemAt(i); }
    Deckbuilder.refreshStats();
    Deckbuilder.deck_not_saved = true;
  }
}
/***************************************************************************************************************
 *  Function : indexCard
 *
 *  Déplace une carte dans un deck donné (permet de simuler un drag/drop)
 * 
 *  Parameters :
 *    (String) deck - Deck cible  : maindeck/sidedeck/extradeck
 *    (Integer) index - ID d'une carte Yugioh
 */
Deckbuilder.indexCard = function (deck,index) {
  if (Deckbuilder.card) {
    var i = 0;
    while ($(deck).getItemAtIndex(i).firstChild.getAttribute("card_id") != Deckbuilder.card.card_id) { i++; }
    var item = $(deck).getItemAtIndex(i).firstChild;
    // Si on vient du haut
    if (index < i) {
      // On supprime l'item en bas, aucune incidence sur son repositionnement plus haut
      $(deck).removeItemAt(i);
      $(deck).insertBefore(item.parentNode, $(deck).getItemAtIndex(index));
    }
    // Si on vient du bas
    if (index > i) {
      $(deck).insertBefore(item.parentNode,  $(deck).getItemAtIndex(index).nextSibling);
    }
    Deckbuilder.deck_not_saved = true;
  }
}
/***************************************************************************************************************
 *  Function : moveCard
 *
 *  Déplace une carte dans un deck donné (permet de simuler un drag/drop)
 * 
 *  Parameters :
 *    (String) source - Deck source  : maindeck/sidedeck/extradeck
 *    (String) target - Deck cible  : maindeck/sidedeck/extradeck
 */
Deckbuilder.moveCard = function (source,target) {
  if (Deckbuilder.card) {
    // Suppression avant ajout pour éviter que les restrictions ne posent problème
    Deckbuilder.delCard(source);
    Deckbuilder.addCard(target,null);
  }
}
/***************************************************************************************************************
 *  Function : setCard
 *
 *  Affichage d'une carte dans l'interface
 * 
 *  Parameters :
 *    (Integer) card_id - ID d'une carte Yugioh
 */
Deckbuilder.setCard = function (card_id) {
  // Nouvel onglet sélectionné
  var tab_selected = $("card_tabs").selectedItem.value;
  // Si changement de carte ou d'onglet, on met à jour
  if ((card_id != Deckbuilder.card.card_id)||(tab_selected != Deckbuilder.card_tab)) {
    Deckbuilder.card = Deckbuilder.ycd.getCard(card_id);
    Deckbuilder.card_tab = tab_selected;
    // Drapeau onglet carte
    $("tab_card_flag").setAttribute("src","chrome://ylifecore/skin/icons/flags/" + ylife_language[Deckbuilder.ycd.getExtension(Deckbuilder.card.extension_id).language_id] + ".png");
    // Référence onglet carte
    $("tab_card_reference").value = Deckbuilder.card.reference;
    // Drapeau onglet traduction
    $("tab_translation_flag").setAttribute("src","chrome://ylifecore/skin/icons/flags/" + Prefs.getChar("general.useragent.locale") + ".png");
    // ONGLET CARTE
    if ($("tab_card").selected) {
      Deckbuilder.card.view("card",Prefs.getChar("template.card"),Prefs.getChar("resolution.card"));
      // Rééditions
      reprints = [];
      var reprints_id = Deckbuilder.card.getReprints(Prefs.getLanguage());
      var i_max = reprints_id.length;
      for (var i = 0 ; i < i_max ; i++) {
        var reprint = Deckbuilder.ycd.getCard(reprints_id[i]);
        reprints.push({"card_id": reprint.card_id, "name": reprint.name, "reference": reprint.reference, "subtype_id": reprint.subtype_id});
      }
      reprintlistview.rowCount= reprints.length;
      $("nb_reprints").label = $("i18n").getString("reprints") + " ( " + reprints.length + " )";
      $("reprintlist").view = reprintlistview;
    }
    // ONGLET TRADUCTION
    if ($("tab_translation").selected) {
      Deckbuilder.card.viewTranslation("card_translation",Prefs.getChar("template.card"),Prefs.getChar("resolution.card"));
    }
    // ONGLET RULINGS
    if ($("tab_rulings").selected) {
      Deckbuilder.refreshRulings();
    }
    // ONGLET PLUS
    if ($("tab_more").selected) {
      // Raretés
      var result = [];
      var rarities = Deckbuilder.card.getRarities(Prefs.getLanguage());
      var i_max = rarities.length;
      for (var i = 0 ; i < i_max ; i++) { result.push(rarities[i].name); }
      $("card_rarities").value = result.join(" ,");
      // Tags YCD
      var result = [];
      var tags_ycd = Deckbuilder.card.getTags(Prefs.getLanguage());
      var i_max = tags_ycd.length;
      for (var i = 0 ; i < i_max ; i++) { result.push(tags_ycd[i].name); }
      $("card_tags_ycd").value = result.join(" ,");
      // Tags yLife
    }
  }
}
/***************************************************************************************************************
 *  Function : refreshRulings
 *
 *  Rafraichit les rulings dans la langue sélectionnée
 */
Deckbuilder.refreshRulings = function (card_id) {
  Deckbuilder.card.viewRulings("card_rulings",$("ruling_language").selectedItem.value);
}


