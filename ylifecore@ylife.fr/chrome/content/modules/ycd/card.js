/***************************************************************************************************************
 *  File : card.js
 * 
 *  Gère la classe Card
 */




/***************************************************************************************************************
 *  Class : Card
 * 
 *  Cette classe gère une carte donnée
 * 
 *  Parameters:
 *    (Ycd Object) ycd - Base de données YCD avec ses functions et properties
 *    (Integer) card_id - ID d'une carte
 */
function Card (ycd,card_id) {
  this.ycd = ycd;
  this.card_id = card_id;
  /***************************************************************************************************************
   *  Récupération des informations directement accessibles depuis la table "cards"
   */
  var data = this.ycd.db.query("SELECT ID_Card, Group_ID, Extension_ID, Name, Description, Reference, Level, Atk, Def, Code, Monster_Attribute_ID, Monster_Type_ID, Monster_Subtype_ID, Type_ID FROM cards WHERE Card_ID='"+this.card_id+"'");
  while (data.executeStep()) {
    this.id_card = data.getInt32(0);
    this.group_id = data.getInt32(1);
    this.extension_id = data.getInt32(2);
    this.name = data.getString(3);
    this.description = data.getString(4);
    this.reference = data.getString(5);
    this.level = data.getInt32(6);
    this.atk = (data.getInt32(7) != '-1') ? data.getInt32(7) : "?";
    this.def = (data.getInt32(8) != '-1') ? data.getInt32(8) : "?";
    this.code = data.getString(9);
    this.monster_attribute_id = data.getInt32(10);
    this.monster_type_id = data.getInt32(11);
    this.monster_subtype_id = data.getInt32(12);
    this.subtype_id = data.getInt32(13);
    this.type_id = this.ycd.getEnv(1).getSubtype(data.getInt32(13)).type_id;
  }
  data.reset();
  /***************************************************************************************************************
   *  Function : getImage
   *
   *  Retourne un nsIFile d'une image de la carte
   */
  this.getImage = function () {
    var image = Addons.getImagepack();
    // Si l'image source a été trouvée, c'est immédiat
    if (this.ycd.imageExists(this.getExtension().reference,this.reference)) {
      image.append(this.getExtension().reference);
      image.append(this.reference + ".jpg");
    }
    // Sinon, on lance la recherche sur les rééditions
    else {
      // On cherche les cartes partageant le même id_card (rééditions)
      var image_found = false;
      var data = this.ycd.db.query("SELECT Extension_ID, Reference FROM cards WHERE ID_Card='"+this.id_card+"' ORDER BY Card_ID ASC");
      // Tant qu'on ne trouve pas d'image dans nos rééditions, on avance
      while ((data.executeStep())&&(!image_found)) {
        // Si l'image de cette carte a été trouvée
        if (this.ycd.imageExists(this.ycd.getExtension(data.getInt32(0)).reference,data.getString(1))) {
          image.append(this.ycd.getExtension(data.getInt32(0)).reference);
          image.append(data.getString(1) + ".jpg");
          image_found = true;
        }
      }
      data.reset();
      // Si on est sorti de la boucle sans trouver d'image
      if (!image_found) { image.append("no_image.jpg"); }
    }
    return "file://" + image.path;
  };
  /***************************************************************************************************************
   *  Function : getExtension
   *
   *  Retourne une extension {country_id,language_id,model_id,name,reference,release_date}
   */
  this.getExtension = function () {
    var result = this.ycd.getExtension(this.extension_id);
    return result;
  };
  /***************************************************************************************************************
   *  Function : getTranslation
   *
   *  Retourne {name,description} dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getTranslation = function (language_id) {
    var result = {"name" : "?","description" : "?"};
    var data = this.ycd.db.query("SELECT Name, Description FROM local_cards WHERE ID_Card='"+this.id_card+"' AND Language_ID='"+language_id+"'");
    while (data.executeStep()) {
      result = {"name" : data.getString(0),"description" : data.getString(1)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterAttribute
   *
   *  Retourne l'attribut du monstre dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getMonsterAttribute = function (language_id) {
    var result = this.ycd.getEnv(language_id).getMonsterAttribute(this.monster_attribute_id);
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterType
   *
   *  Retourne le type du monstre dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getMonsterType = function (language_id) {
    var result = this.ycd.getEnv(language_id).getMonsterType(this.monster_type_id);
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterSubtype
   *
   *  Retourne le sous-type du monstre dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getMonsterSubtype = function (language_id) {
    var result = this.ycd.getEnv(language_id).getMonsterSubtype(this.monster_subtype_id);
    return result;
  };
  /***************************************************************************************************************
   *  Function : getType
   *
   *  Retourne le type de la carte dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getType = function (language_id) {
    var result = this.ycd.getEnv(language_id).getType(this.type_id);
    return result;
  };
  /***************************************************************************************************************
   *  Function : getSubtype
   *
   *  Retourne le sous-type de la carte dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getSubtype = function (language_id) {
    var result = this.ycd.getEnv(language_id).getSubtype(this.subtype_id);
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterEffects
   *
   *  Retourne les effets du monstre {id,name,description} dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getMonsterEffects = function (language_id) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT Monster_Effect_ID FROM cards_x_monster_effects WHERE ID_Card='"+this.id_card+"' ORDER BY Monster_Effect_ID ASC");
    while (data.executeStep()) {
      results.push(this.ycd.getEnv(language_id).getMonsterEffect(data.getInt32(0)));
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getRarities
   *
   *  Retourne les raretés de la carte {id,name,description} dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getRarities = function (language_id) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT Rarity_ID FROM cards_x_rarities WHERE Card_ID='"+this.card_id+"' ORDER BY Rarity_ID ASC");
    while (data.executeStep()) {
      results.push(this.ycd.getEnv(language_id).getRarity(data.getInt32(0)));
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getTags
   *
   *  Retourne les tags de la carte {id,name,description} dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getTags = function (language_id) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT Tag_ID FROM cards_x_tags WHERE ID_Card='"+this.id_card+"' ORDER BY Tag_ID ASC");
    while (data.executeStep()) {
      results.push(this.ycd.getEnv(language_id).getTag(data.getInt32(0)));
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getFormats
   *
   *  Retourne les formats de jeu autorisés de la carte {id,name,description} dans une langue donnée
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getFormats = function (language_id) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT Format_ID FROM extensions_x_formats WHERE Extension_ID'"+this.extension_id+"' ORDER BY Format_ID ASC");
    while (data.executeStep()) {
      results.push(this.ycd.getEnv(language_id).getFormat(data.getInt32(0)));
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getRestriction
   *
   *  Retourne le nombre maximum d'exemplaires de la carte {id,name,description} dans un format donné
   * 
   *  Parameters :
   *    (Integer) format_id - ID d'un format de jeu
   */
  this.getRestriction = function (format_id) {
    var result = (format_id == "0") ? 100 : 3;
    var data = this.ycd.db.query("SELECT Number FROM restrictions WHERE Group_ID='"+this.group_id+"' AND Format_ID='"+format_id+"'");
    while (data.executeStep()) {
      result = data.getInt32(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getReprints
   *
   *  Retourne les card_id des rééditions de la carte
   */
  this.getReprints = function () {
    var results = new Array();
    var data = this.ycd.db.query("SELECT Card_ID FROM cards WHERE ID_Card='"+this.id_card+"' AND Card_ID!='"+this.card_id+"' ORDER BY Reference ASC");
    while (data.executeStep()) {
      results.push(data.getInt32(0));
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getDeckcard
   *
   *  Retourne un richlistitem d'une carte de deck (pour Deckbuilder)
   * 
   *  Parameters :
   *    (Integer) number - Nombre d'exemplaires
   *    (String) template - Thème de carte (image/noimage/,...)
   */
  this.getDeckcard = function (number,template) {
    var deckcard_item = document.createElement('richlistitem');
      var deckcard_vbox = document.createElement('vbox');
      deckcard_vbox.setAttribute('id', "deckcard_" + randomString(6));
      deckcard_vbox.setAttribute('class', "deckcard_" + template);
      deckcard_vbox.setAttribute('class_card', ylife_type[this.subtype_id]);
      deckcard_vbox.setAttribute('card_id', this.card_id);
      deckcard_vbox.setAttribute('group_id', this.group_id);
      deckcard_vbox.setAttribute('type_id', this.type_id);
      deckcard_vbox.setAttribute('number', number);
      deckcard_vbox.setAttribute('name', this.name);
      deckcard_vbox.setAttribute('reference', this.reference);
      if (template == "image") {
        deckcard_vbox.setAttribute('image', this.getImage());
        var details = (this.type_id == 1) ? this.level + " *  - " + this.atk + " / " + this.def : this.getSubtype(Prefs.getLanguage()).name ;
        deckcard_vbox.setAttribute('details', details);
      }
      deckcard_vbox.setAttribute('ondragstart', "return deckcardDragStart(event)");
      deckcard_vbox.setAttribute('ondragend', "return deckcardDragEnd(event)");
      deckcard_vbox.setAttribute('flex', "1");
      deckcard_vbox.setAttribute('ondblclick', "Deckbuilder.addCard(this.parentNode.parentNode.getAttribute('id'),null);");
    deckcard_item.appendChild(deckcard_vbox);
    return deckcard_item;
  };
  /***************************************************************************************************************
   *  Function : view
   *
   *  Affiche une carte XBL reconstruite dans un vbox cible et selon un template et une résolution donnés
   * 
   *  Parameters :
   *    (String) target - ID du vbox contenant la carte
   *    (String) template - Thème de carte (oldish/scalable/...)
   *    (String) resolution - Résolution de carte (0/1/... selon la taille désirée)
   */
  this.view = function (target,template,resolution) {
    var card = $(target);
    card.setAttribute('class', "card_" + template + "_" + resolution);
    card.setAttribute('background', "chrome://ylifecore/skin/templates/card/" + template + "/backgrounds/" + ylife_type[this.subtype_id] + ".png");
    card.setAttribute('image', this.getImage());
    card.setAttribute('reference', this.reference);
    card.setAttribute('code', this.code);
    card.setAttribute('name', this.name);
    if (this.name.length < 20) { var class_card_name_size = ""; }
    else if ((this.name.length >= 20)&&(this.name.length < 25)) { var class_card_name_size = "_little_1"; }
    else { var class_card_name_size = "_little_2"; }
    // Si c'est un monstre
    if (this.type_id == 1) {
      card.setAttribute('class_card_name', "card_name_monster" + class_card_name_size);
      card.setAttribute('attribute', "chrome://ylifecore/skin/templates/card/" + template + "/attributes/" + ylife_attribute[this.type_id][this.monster_attribute_id] + ".png");
      card.setAttribute('type_bracket_left', "");
      card.setAttribute('type_name', "");
      card.setAttribute('type_icon', "");
      card.setAttribute('type_bracket_right', "");
      for (var i = 1 ; i < 13 ; i++) {
        if (i <= this.level) { card.setAttribute('level_' + i, "chrome://ylifecore/skin/templates/card/" + template + "/levels/level_1.png"); }
        else { card.setAttribute('level_' + i, ""); }
      }
      card.setAttribute('description_spelltrap', "");
      card.setAttribute('monster_type_bracket_left', "[");
      var monster_type = this.getMonsterType(this.getExtension().language_id);
      if (this.subtype_id == "14") { monster_type = monster_type + " / " + $("i18n").getString("synchro." + this.getExtension().language_id); }
      if (this.subtype_id == "3") { monster_type = monster_type + " / " + $("i18n").getString("fusion." + this.getExtension().language_id); }
      if (this.subtype_id == "4") { monster_type = monster_type + " / " + $("i18n").getString("ritual." + this.getExtension().language_id); }
      var effects = this.getMonsterEffects(this.getExtension().language_id);
      if (((this.subtype_id == "2")&&(this.monster_subtype_id == ""))
          ||((this.subtype_id == "14")&&(effects.length > 0))
          ||((this.subtype_id == "3")&&(effects.length > 0))
          ||((this.subtype_id == "4")&&(effects.length > 0))) {
        monster_type = monster_type + " / " + $("i18n").getString("effect." + this.getExtension().language_id);
      }
      if ((this.subtype_id == "2")&&(this.monster_subtype_id != "")) { monster_type = monster_type + " / " + this.getMonsterSubtype(this.getExtension().language_id); }
      card.setAttribute('monster_type', monster_type);
      card.setAttribute('monster_type_bracket_right', "]");
      card.setAttribute('description_monster', this.description);
      card.setAttribute('monster_atk_hide', false);
      card.setAttribute('monster_def_hide', false);
      card.setAttribute('monster_atk', this.atk);
      card.setAttribute('monster_def', this.def);
    }
    // Sinon, magie ou piège
    else {
      card.setAttribute('class_card_name', "card_name_spelltrap" + class_card_name_size);
      card.setAttribute('attribute', "chrome://ylifecore/skin/templates/card/" + template + "/attributes/" + ylife_attribute[this.type_id] + ".png");
      for (var i = 1 ; i < 13 ; i++) { card.setAttribute('level_' + i, ""); }
      card.setAttribute('type_bracket_left', "[");
      card.setAttribute('type_name', $("i18n").getString(ylife_type[this.subtype_id] +".card." + this.getExtension().language_id));
      if ((this.subtype_id == 6)||(this.subtype_id == 7)||(this.subtype_id == 8)|(this.subtype_id == 9)||(this.subtype_id == 10)||(this.subtype_id == 12)||(this.subtype_id == 13)) {
        card.setAttribute('type_icon', "chrome://ylifecore/skin/templates/card/" + template + "/icons/" + ylife_subtype[this.subtype_id] + ".png");
        card.setAttribute('type_icon_hide', false);
      }
      else { card.setAttribute('type_icon_hide', true); }
      card.setAttribute('type_bracket_right', "]");
      card.setAttribute('monster_type_bracket_left', "");
      card.setAttribute('monster_type', "");
      card.setAttribute('monster_type_bracket_right', "");
      card.setAttribute('description_monster', "");
      card.setAttribute('description_spelltrap', this.description);
      card.setAttribute('monster_atk_hide', true);
      card.setAttribute('monster_def_hide', true);
      card.setAttribute('monster_atk', "");
      card.setAttribute('monster_def', "");
    }
  };
  /***************************************************************************************************************
   *  Function : viewTranslation
   *
   *  Affiche une carte XBL traduite et reconstruite dans un vbox cible et selon un template et une résolution donnés
   * 
   *  Parameters :
   *    (String) target - ID du vbox contenant la carte
   *    (String) template - Thème de carte (oldish/scalable/...)
   *    (String) resolution - Résolution de carte (0/1/... selon la taille désirée)
   */
  this.viewTranslation = function (target,template,resolution) {
    var card = $(target);
    card.setAttribute('class', "card_" + template + "_" + resolution);
    card.setAttribute('background', "chrome://ylifecore/skin/templates/card/" + template + "/backgrounds/" + ylife_type[this.subtype_id] + ".png");
    card.setAttribute('image', this.getImage());
    card.setAttribute('reference', this.reference);
    card.setAttribute('code', this.code);
    card.setAttribute('name', this.getTranslation(Prefs.getLanguage()).name);
    if (this.name.length < 20) { var class_card_name_size = ""; }
    else if ((this.name.length >= 20)&&(this.name.length < 25)) { var class_card_name_size = "_little_1"; }
    else { var class_card_name_size = "_little_2"; }
    // Si c'est un monstre
    if (this.type_id == 1) {
      card.setAttribute('class_card_name', "card_name_monster" + class_card_name_size);
      card.setAttribute('attribute', "chrome://ylifecore/skin/templates/card/" + template + "/attributes/" + ylife_attribute[this.type_id][this.monster_attribute_id] + ".png");
      card.setAttribute('type_bracket_left', "");
      card.setAttribute('type_name', "");
      card.setAttribute('type_icon', "");
      card.setAttribute('type_bracket_right', "");
      for (var i = 1 ; i < 13 ; i++) {
        if (i <= this.level) { card.setAttribute('level_' + i, "chrome://ylifecore/skin/templates/card/" + template + "/levels/level_1.png"); }
        else { card.setAttribute('level_' + i, ""); }
      }
      card.setAttribute('description_spelltrap', "");
      card.setAttribute('monster_type_bracket_left', "[");
      var monster_type = this.getMonsterType(Prefs.getLanguage());
      if (this.subtype_id == "14") { monster_type = monster_type + " / " + $("i18n").getString("synchro." + Prefs.getLanguage()); }
      if (this.subtype_id == "3") { monster_type = monster_type + " / " + $("i18n").getString("fusion." + Prefs.getLanguage()); }
      if (this.subtype_id == "4") { monster_type = monster_type + " / " + $("i18n").getString("ritual." + Prefs.getLanguage()); }
      var effects = this.getMonsterEffects(Prefs.getLanguage());
      if (((this.subtype_id == "2")&&(this.monster_subtype_id == ""))
          ||((this.subtype_id == "14")&&(effects.length > 0))
          ||((this.subtype_id == "3")&&(effects.length > 0))
          ||((this.subtype_id == "4")&&(effects.length > 0))) {
        monster_type = monster_type + " / " + $("i18n").getString("effect." + Prefs.getLanguage());
      }
      if ((this.subtype_id == "2")&&(this.monster_subtype_id != "")) { monster_type = monster_type + " / " + this.getMonsterSubtype(Prefs.getLanguage()); }
      card.setAttribute('monster_type', monster_type);
      card.setAttribute('monster_type_bracket_right', "]");
      card.setAttribute('description_monster', this.getTranslation(Prefs.getLanguage()).description);
      card.setAttribute('monster_atk_hide', false);
      card.setAttribute('monster_def_hide', false);
      card.setAttribute('monster_atk', this.atk);
      card.setAttribute('monster_def', this.def);
    }
    // Sinon, magie ou piège
    else {
      card.setAttribute('class_card_name', "card_name_spelltrap" + class_card_name_size);
      card.setAttribute('attribute', "chrome://ylifecore/skin/templates/card/" + template + "/attributes/" + ylife_attribute[this.type_id] + ".png");
      for (var i = 1 ; i < 13 ; i++) { card.setAttribute('level_' + i, ""); }
      card.setAttribute('type_bracket_left', "[");
      card.setAttribute('type_name', $("i18n").getString(ylife_type[this.subtype_id] +".card." + Prefs.getLanguage()));
      if ((this.subtype_id == 6)||(this.subtype_id == 7)||(this.subtype_id == 8)|(this.subtype_id == 9)||(this.subtype_id == 10)||(this.subtype_id == 12)||(this.subtype_id == 13)) {
        card.setAttribute('type_icon', "chrome://ylifecore/skin/templates/card/" + template + "/icons/" + ylife_subtype[this.subtype_id] + ".png");
        card.setAttribute('type_icon_hide', false);
      }
      else { card.setAttribute('type_icon_hide', true); }
      card.setAttribute('type_bracket_right', "]");
      card.setAttribute('monster_type_bracket_left', "");
      card.setAttribute('monster_type', "");
      card.setAttribute('monster_type_bracket_right', "");
      card.setAttribute('description_monster', "");
      card.setAttribute('description_spelltrap', this.getTranslation(Prefs.getLanguage()).description);
      card.setAttribute('monster_atk_hide', true);
      card.setAttribute('monster_def_hide', true);
      card.setAttribute('monster_atk', "");
      card.setAttribute('monster_def', "");
    }
  };
  /***************************************************************************************************************
   *  Function : viewRulings
   *
   *  Affiche les rulings d'une carte dans une langue donnée
   * 
   *  Parameters :
   *    (String) target - ID du textbox contenant les rulings
   *    (Integer) language_id - ID d'une langue
   */
  this.viewRulings = function (target,language_id) {
    var rulings = "";
    var data = this.ycd.db.query("SELECT Ruling_ID FROM cards_x_rulings WHERE ID_Card='"+this.id_card+"' ORDER BY Ruling_ID ASC");
    while (data.executeStep()) {
      rulings += "# " + data.getInt32(0) + "\n";
      rulings += this.ycd.getEnv(language_id).getRuling(data.getInt32(0));
      rulings += "\n----------------------------------------\n";
    }
    data.reset();
     $(target).value = rulings;
  };
}
