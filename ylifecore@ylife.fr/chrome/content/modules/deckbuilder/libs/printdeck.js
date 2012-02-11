/***************************************************************************************************************
 *  File : printdeck.js
 * 
 *  Charge les fichiers nécessaires au module
 */




/***************************************************************************************************************
 *  Chargement des fonctions nécessaires pour yLife
 */
var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://ylifecore/content/libs/utils.js");
loader.loadSubScript("chrome://ylifecore/content/modules/preferences/libs/prefs.js");


/***************************************************************************************************************
 *  Informations transmises à la fenêtre
 */
var infos = window.arguments[0];



/***************************************************************************************************************
 *  Function : onload
 * 
 *  Initialise la fenêtre d'informations
 */
window.onload = function()
{
  $("name").value = Prefs.getChar("lastname") + " " + Prefs.getChar("firstname");
  $("ude").value = Prefs.getChar("ude");
  $("date").value = getDate();
  var tpl_folder = getFolder("ProfD");
  tpl_folder.append("data");
  tpl_folder.append("templates");
  tpl_folder.append("deck");
  tpl_folder.append("print");
  var tpl_templates = getFolderContent(tpl_folder,"files");
  for (var i = 0 ; i < tpl_templates.length ; i++) {
    $("template").appendItem(tpl_templates[i].leafName,tpl_templates[i].leafName);
  }
  $("event").focus();
  refresh();
}
/***************************************************************************************************************
 *  Function : refresh
 * 
 *  Rafraichit l'aperçu avant impression
 */
function refresh () {
  var user_template = getFolder("ProfD");
  user_template.append("data");
  user_template.append("templates");
  user_template.append("deck");
  user_template.append("print");
  user_template.append($("template").selectedItem.value);
  var template_src = (user_template.exists()) ? "file://" + user_template.path : "chrome://ylifecore/skin/templates/deck/print/" + $("template").selectedItem.value ;
  $("preview").setAttribute('src', "chrome://ylifecore/skin/templates/deck/print/blank.xhtml");
  $("preview").setAttribute('src', template_src);
  setTimeout("refreshTimer()",200);
}
/***************************************************************************************************************
 *  Function : refreshTimer
 * 
 *  Rafraichit l'aperçu avant impression (laisse le temps du chargement du src)
 */
function refreshTimer () {
  var decklist_node = $("preview").contentWindow.document.getElementById("decklisttoclone").cloneNode(true);
  decklist_node.removeAttribute("id"); 
  var serializer = new XMLSerializer();
  var decklist = serializer.serializeToString(decklist_node);
  decklist = decklist.replace("{event}",$("event").value);
  decklist = decklist.replace("{date}",$("date").value);
  decklist = decklist.replace("{name}",$("name").value);
  decklist = decklist.replace("{ude}",$("ude").value);
  
  
  var main_nb_monsters = 0;
  var main_monsters = "";
  var main_nb_spells = 0;
  var main_spells = "";
  var main_nb_traps = 0;
  var main_traps = "";
  var side_nb_monsters = 0;
  var side_monsters = "";
  var side_nb_spells = 0;
  var side_spells = "";
  var side_nb_traps = 0;
  var side_traps = "";
  var extra_nb_monsters = 0;
  var extra_monsters = "";
  var card = "";
  
  // Template de la carte
  var card_node = $("preview").contentWindow.document.getElementById("cardtoclone").cloneNode(true);
  card_node.removeAttribute("id"); 
  var card_tpl = serializer.serializeToString(card_node);
  
  
  // Main Deck
  var i_max = infos.Deckbuilder.deck.main.length;
  for (var i = 0 ; i < i_max ; i++) {
    var card_object = infos.Deckbuilder.ycd.getCard(infos.Deckbuilder.deck.main[i].card_id);
    var number = parseInt(infos.Deckbuilder.deck.main[i].number);
    card = card_tpl.replace("{number}",number);
    card = card.replace("{reference}",card_object.reference);
    card = card.replace("{name}",card_object.name);
    card = card.replace("{description}",card_object.description);
    card = card.replace("{type}",card_object.getSubtype(Prefs.getLanguage()).name);
    if (card_object.type_id == "1") {
      // Fonctions d'affichage global des monstres
      card = card.replace("{monster_level_attribute_type}",
                          "<div class='monster_level_attribute_type'><strong>[</strong> "
                          + card_object.level + " *  / " + card_object.getMonsterAttribute(Prefs.getLanguage())
                          + " / " + card_object.getMonsterType(Prefs.getLanguage()) + " <strong>]</strong></div>");
      card = card.replace("{monster_atk_def}",
                          "<hr /><div class='monster_atk_def'><strong>ATK / </strong> " + card_object.atk
                          + "   <strong>DEF / </strong> " + card_object.def + "</div>");

      // Fonctions d'affichage au détail
      card = card.replace("{monster_level}",card_object.level);
      card = card.replace("{monster_attribute}",card_object.getMonsterAttribute(Prefs.getLanguage()));
      card = card.replace("{monster_type}",card_object.getMonsterType(Prefs.getLanguage()));
      card = card.replace("{monster_atk}",card_object.atk);
      card = card.replace("{monster_def}",card_object.def);
    }
    else {
      card = card.replace("{monster_level_attribute_type}","");
      card = card.replace("{monster_atk_def}","");
      card = card.replace("{monster_level}","");
      card = card.replace("{monster_attribute}","");
      card = card.replace("{monster_type}","");
      card = card.replace("{monster_atk_def}","");
    }
    switch (card_object.type_id) {
      case (1) : main_monsters += card + "\n"; main_nb_monsters = main_nb_monsters + number; break;
      case (2) : main_spells += card + "\n"; main_nb_spells = main_nb_spells + number; break;
      case (3) : main_traps += card + "\n"; main_nb_traps = main_nb_traps + number; break;
    }
  }
  var main_nb_cards = main_nb_monsters + main_nb_spells + main_nb_traps;
  
  
  // Side Deck
  var i_max = infos.Deckbuilder.deck.side.length;
  for (var i = 0 ; i < i_max ; i++) {
    var card_object = infos.Deckbuilder.ycd.getCard(infos.Deckbuilder.deck.side[i].card_id);
    var number = parseInt(infos.Deckbuilder.deck.side[i].number);
    card = card_tpl.replace("{number}",number);
    card = card.replace("{reference}",card_object.reference);
    card = card.replace("{name}",card_object.name);
    card = card.replace("{description}",card_object.description);
    card = card.replace("{type}",card_object.getSubtype(Prefs.getLanguage()).name);
    if (card_object.type_id == "1") {
      // Fonctions d'affichage global des monstres
      card = card.replace("{monster_level_attribute_type}",
                          "<div class='monster_level_attribute_type'><strong>[</strong> "
                          + card_object.level + " *  / " + card_object.getMonsterAttribute(Prefs.getLanguage())
                          + " / " + card_object.getMonsterType(Prefs.getLanguage()) + " <strong>]</strong></div>");
      card = card.replace("{monster_atk_def}",
                          "<hr /><div class='monster_atk_def'><strong>ATK / </strong> " + card_object.atk
                          + "   <strong>DEF / </strong> " + card_object.def + "</div>");

      // Fonctions d'affichage au détail
      card = card.replace("{monster_level}",card_object.level);
      card = card.replace("{monster_attribute}",card_object.getMonsterAttribute(Prefs.getLanguage()));
      card = card.replace("{monster_type}",card_object.getMonsterType(Prefs.getLanguage()));
      card = card.replace("{monster_atk}",card_object.atk);
      card = card.replace("{monster_def}",card_object.def);
    }
    else {
      card = card.replace("{monster_level_attribute_type}","");
      card = card.replace("{monster_atk_def}","");
      card = card.replace("{monster_level}","");
      card = card.replace("{monster_attribute}","");
      card = card.replace("{monster_type}","");
      card = card.replace("{monster_atk_def}","");
    }
    switch (card_object.type_id) {
      case (1) : side_monsters += card + "\n"; side_nb_monsters = side_nb_monsters + number; break;
      case (2) : side_spells += card + "\n"; side_nb_spells = side_nb_spells + number; break;
      case (3) : side_traps += card + "\n"; side_nb_traps = side_nb_traps + number; break;
    }
  }
  var side_nb_cards = side_nb_monsters + side_nb_spells + side_nb_traps;
  
  
  // Extra Deck
  var i_max = infos.Deckbuilder.deck.extra.length;
  for (var i = 0 ; i < i_max ; i++) {
    var card_object = infos.Deckbuilder.ycd.getCard(infos.Deckbuilder.deck.extra[i].card_id);
    var number = parseInt(infos.Deckbuilder.deck.extra[i].number);
    card = card_tpl.replace("{number}",number);
    card = card.replace("{reference}",card_object.reference);
    card = card.replace("{name}",card_object.name);
    card = card.replace("{description}",card_object.description);
    card = card.replace("{type}",card_object.getSubtype(Prefs.getLanguage()).name);
    if (card_object.type_id == "1") {
      // Fonctions d'affichage global des monstres
      card = card.replace("{monster_level_attribute_type}",
                          "<div class='monster_level_attribute_type'><strong>[</strong> "
                          + card_object.level + " *  / " + card_object.getMonsterAttribute(Prefs.getLanguage())
                          + " / " + card_object.getMonsterType(Prefs.getLanguage()) + " <strong>]</strong></div>");
      card = card.replace("{monster_atk_def}",
                          "<hr /><div class='monster_atk_def'><strong>ATK / </strong> " + card_object.atk
                          + "  <strong>DEF / </strong> " + card_object.def + "</div>");

      // Fonctions d'affichage au détail
      card = card.replace("{monster_level}",card_object.level);
      card = card.replace("{monster_attribute}",card_object.getMonsterAttribute(Prefs.getLanguage()));
      card = card.replace("{monster_type}",card_object.getMonsterType(Prefs.getLanguage()));
      card = card.replace("{monster_atk}",card_object.atk);
      card = card.replace("{monster_def}",card_object.def);
    }
    else {
      card = card.replace("{monster_level_attribute_type}","");
      card = card.replace("{monster_atk_def}","");
      card = card.replace("{monster_level}","");
      card = card.replace("{monster_attribute}","");
      card = card.replace("{monster_type}","");
      card = card.replace("{monster_atk_def}","");
    }
    extra_monsters += card + "\n";
    extra_nb_monsters = extra_nb_monsters + number;
  }
  
  
  
  decklist = decklist.replace("{maindeck_nb_cards}",main_nb_cards);
  decklist = decklist.replace("{maindeck_nb_monsters}",main_nb_monsters);
  decklist = decklist.replace("{maindeck_nb_spells}",main_nb_spells);
  decklist = decklist.replace("{maindeck_nb_traps}",main_nb_traps);
  decklist = decklist.replace("{maindeck_monsters}",main_monsters);
  decklist = decklist.replace("{maindeck_spells}",main_spells);
  decklist = decklist.replace("{maindeck_traps}",main_traps);
  decklist = decklist.replace("{sidedeck_nb_cards}",side_nb_cards);
  decklist = decklist.replace("{sidedeck_nb_monsters}",side_nb_monsters);
  decklist = decklist.replace("{sidedeck_nb_spells}",side_nb_spells);
  decklist = decklist.replace("{sidedeck_nb_traps}",side_nb_traps);
  decklist = decklist.replace("{sidedeck_monsters}",side_monsters);
  decklist = decklist.replace("{sidedeck_spells}",side_spells);
  decklist = decklist.replace("{sidedeck_traps}",side_traps);
  decklist = decklist.replace("{extradeck_nb_monsters}",extra_nb_monsters);
  decklist = decklist.replace("{extradeck_monsters}",extra_monsters);
  var parser = new DOMParser ();
  var decklist_dom = parser.parseFromString (decklist, "text/xml").documentElement;
  // Ajout de la decklist
  $("preview").contentWindow.document.getElementById("content").appendChild(decklist_dom);
}
/***************************************************************************************************************
 *  Function : print
 * 
 *  Imprime le deck
 */
function print () {
  var PSSVC = Components.classes["@mozilla.org/gfx/printsettings-service;1"].getService(Components.interfaces.nsIPrintSettingsService);
  var printSettings = PSSVC.newPrintSettings;
  printSettings.footerStrCenter = '';
  printSettings.footerStrLeft   = '';
  printSettings.footerStrRight  = '';
  printSettings.headerStrCenter = '';
  printSettings.headerStrLeft   = '';
  printSettings.headerStrRight  = '';
  $("preview").contentWindow.print(printSettings,null);
  return true;
}

