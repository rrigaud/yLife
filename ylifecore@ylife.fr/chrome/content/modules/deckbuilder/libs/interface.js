/***************************************************************************************************************
 *  File : interface.js
 * 
 *  Gère l'interface (extension de l'objet Deckbuilder)
 */




/***************************************************************************************************************
 *  Function : init
 *
 *  Initialise l'interface (filtres,...)
 */
Deckbuilder.init = function () {
  // Formats de jeu
  $("format").appendItem($("i18n").getString("format.all"),"");
  $("format").selectedIndex = "0";
  var formats = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getFormatsBy("Format_ID ASC");
  var i_max = formats.length;
  for (var i = 0 ; i < i_max ; i++) { $("format").appendItem(formats[i].name,formats[i].id); }
  // Pays
  $("country").appendItem($("i18n").getString("country.all"),"");
  $("country").selectedIndex = "0";
  var countries = Deckbuilder.ycd.getCountriesBy("Name ASC");
  var i_max = countries.length;
  for (var i = 0 ; i < i_max ; i++) { $("country").appendItem(countries[i].name,countries[i].id); }
  // Langues
  $("language").appendItem($("i18n").getString("language.all"),"");
  $("language").selectedIndex = "0";
  var languages = Deckbuilder.ycd.getLanguagesBy("Name ASC");
  var i_max = languages.length;
  for (var i = 0 ; i < i_max ; i++) { $("language").appendItem(languages[i].name,languages[i].id); }
  // Types d'extension
  $("model").appendItem($("i18n").getString("model.all"),"");
  $("model").selectedIndex = "0";
  var models = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getModelsBy("Model_ID ASC");
  var i_max = models.length;
  for (var i = 0 ; i < i_max ; i++) { $("model").appendItem(models[i].name,models[i].id); }
  // Raretés
  $("rarity").appendItem($("i18n").getString("rarity.all"),"");
  $("rarity").selectedIndex = "0";
  var rarities = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getRaritiesBy("Rarity_ID ASC");
  var i_max = rarities.length;
  for (var i = 0 ; i < i_max ; i++) { $("rarity").appendItem(rarities[i].name,rarities[i].id); }
  // Extensions
  $("extension").appendItem($("i18n").getString("extension.all"),"");
  $("extension").selectedIndex = "0";
  var extensions = Deckbuilder.ycd.getExtensionsBy("Country_ID ASC, Language_ID ASC, Reference ASC");
  var i_max = extensions.length;
  for (var i = 0 ; i < i_max ; i++) { $("extension").appendItem(extensions[i].reference + " >> " + extensions[i].name,extensions[i].id); }
  // Sous-types de cartes
  $("subtype_1").appendItem($("i18n").getString("subtype.all"),"");
  $("subtype_1").selectedIndex = "0";
  $("subtype_2").appendItem($("i18n").getString("subtype.all"),"");
  $("subtype_2").selectedIndex = "0";
  $("subtype_3").appendItem($("i18n").getString("subtype.all"),"");
  $("subtype_3").selectedIndex = "0";
  var subtypes = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getSubtypesBy("Card_Type_ID ASC, Type_ID ASC");
  var i_max = subtypes.length;
  for (var i = 0 ; i < i_max ; i++) { $("subtype_" + subtypes[i].type_id).appendItem(subtypes[i].name,subtypes[i].id); }
  // Monstre : Attributs
  $("monster_attribute").appendItem($("i18n").getString("attribute.all"),"");
  $("monster_attribute").selectedIndex = "0";
  var monster_attributes = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getMonsterAttributesBy("Name ASC");
  var i_max = monster_attributes.length;
  for (var i = 0 ; i < i_max ; i++) { $("monster_attribute").appendItem(monster_attributes[i].name,monster_attributes[i].id); }
  // Monstre : Types
  $("monster_type").appendItem($("i18n").getString("type.all"),"");
  $("monster_type").selectedIndex = "0";
  var monster_types = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getMonsterTypesBy("Name ASC");
  var i_max = monster_types.length;
  for (var i = 0 ; i < i_max ; i++) { $("monster_type").appendItem(monster_types[i].name,monster_types[i].id); }
  // Monstre : Sous-types
  $("monster_subtype").appendItem($("i18n").getString("subtype.all"),"");
  $("monster_subtype").selectedIndex = "0";
  var monster_subtypes = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getMonsterSubtypesBy("Name ASC");
  var i_max = monster_subtypes.length;
  for (var i = 0 ; i < i_max ; i++) { $("monster_subtype").appendItem(monster_subtypes[i].name,monster_subtypes[i].id); }
  // Monstre : Effets
  $("monster_effect").appendItem($("i18n").getString("effect.all"),"");
  $("monster_effect").selectedIndex = "0";
  var monster_effects = Deckbuilder.ycd.getEnv(Prefs.getLanguage()).getMonsterEffectsBy("Name ASC");
  var i_max = monster_effects.length;
  for (var i = 0 ; i < i_max ; i++) { $("monster_effect").appendItem(monster_effects[i].name,monster_effects[i].id); }
  // Initialisation du filtre
  Deckbuilder.resetFilter();
}



/***************************************************************************************************************
 *  Function : resetFilter
 *
 *  Réinitialise le filtre d'après les préférences
 */
Deckbuilder.resetFilter = function () {
  // Textbox
  $("name").value = "";
  $("description").value = "";
  $("monster_atk").value = "";
  $("monster_def").value = "";
  // Radiobutton
  $("filter_type").selectedItem = $("filter_quick");
  Deckbuilder.setFilter("quick");
  $("type").selectedItem = $("type_0");
  Deckbuilder.setFilterType("all");
  // Menulist
  $("model").selectedIndex = "0";
  $("rarity").selectedIndex = "0";
  $("extension").selectedIndex = "0";
  $("subtype_1").selectedIndex = "0";
  $("subtype_2").selectedIndex = "0";
  $("subtype_3").selectedIndex = "0";
  $("monster_attribute").selectedIndex = "0";
  $("monster_type").selectedIndex = "0";
  $("monster_subtype").selectedIndex = "0";
  $("monster_effect").selectedIndex = "0";
  $("monster_level_op").selectedIndex = "1";
  $("monster_level").selectedIndex = "0";
  $("monster_atk_op").selectedIndex = "1";
  $("monster_def_op").selectedIndex = "1";
  // Menulist avec valeurs par défaut (préférences)
  var filter_format = Prefs.getChar("filter.format");
  var i_max = $("format").itemCount;
  for (var i = 0 ; i < i_max ; i++) { if ($("format").getItemAtIndex(i).value == filter_format) { $("format").selectedIndex = i; } }
  var filter_country = Prefs.getChar("filter.country");
  var i_max = $("country").itemCount;
  for (var i = 0 ; i < i_max ; i++) { if ($("country").getItemAtIndex(i).value == filter_country) { $("country").selectedIndex = i; } }
  var filter_language = Prefs.getChar("filter.language");
  var i_max = $("language").itemCount;
  for (var i = 0 ; i < i_max ; i++) { if ($("language").getItemAtIndex(i).value == filter_language) { $("language").selectedIndex = i; } }
  // Checkbox avec valeurs par défaut (préférences)
  $("reprints_group").checked = Prefs.getBool("filter.reprints.group");
  // Filtre par défaut
  Deckbuilder.filterCards();
  $("name").focus();
}



/***************************************************************************************************************
 *  Function : setFilter
 *
 *  Change le type de filtre affiché (rapide ou avancé)
 * 
 *  Parameters :
 *    (String) type - quick/advanced
 */
Deckbuilder.setFilter = function (type) {
  $("vbox_advanced").collapsed = (type == "quick") ? true : false;
}



/***************************************************************************************************************
 *  Function : setFilterType
 *
 *  Change le filtre de carte affiché (monstre, magie ou piège)
 * 
 *  Parameters :
 *    (String) type_id - monster/spell/trap/all
 */
Deckbuilder.setFilterType = function (type_id) {
  $("vbox_monster").collapsed = (type_id != "1") ? true : false;
  $("vbox_spell").collapsed = (type_id != "2") ? true : false;
  $("vbox_trap").collapsed = (type_id != "3") ? true : false;
  Deckbuilder.filterCards();
}




/***************************************************************************************************************
 *  Function : setCardTab
 *
 *  Affiche le bon panel (carte/traduction/rulings/more) selon l'onglet sélectionné
 * 
 *  Parameters :
 *    (Integer) index - Index du panel à afficher
 */
Deckbuilder.setCardTab = function (index) {
  $("card_panels").setAttribute('selectedIndex',index);
  Deckbuilder.setCard(Deckbuilder.card.card_id);
}




/***************************************************************************************************************
 *  Function : loadLastDecks
 *
 *  Charge les 3 decks les plus récemment ouverts
 */
Deckbuilder.loadLastDecks = function () {
  if (Prefs.getChar("decks.lastdeck.1") != "") {
    var lastdeck = getFolder("ProfD");
    lastdeck.initWithPath(Prefs.getChar("decks.lastdeck.1"));
    $("deck_last_1").value = Prefs.getChar("decks.lastdeck.1");
    $("deck_last_1").label = lastdeck.leafName;
  }
  if (Prefs.getChar("decks.lastdeck.2") != "") {
    var lastdeck = getFolder("ProfD");
    lastdeck.initWithPath(Prefs.getChar("decks.lastdeck.2"));
    $("deck_last_2").value = Prefs.getChar("decks.lastdeck.2");
    $("deck_last_2").label = lastdeck.leafName;
  }
  if (Prefs.getChar("decks.lastdeck.3") != "") {
    var lastdeck = getFolder("ProfD");
    lastdeck.initWithPath(Prefs.getChar("decks.lastdeck.3"));
    $("deck_last_3").value = Prefs.getChar("decks.lastdeck.3");
    $("deck_last_3").label = lastdeck.leafName;
  }
}

/***************************************************************************************************************
 *  Function : updateLastDecks
 *
 *  Met à jour la liste des 3 derniers decks utilisés avec le deck courant (ouvert ou enregistré)
 */
Deckbuilder.updateLastDecks = function () {
  var current_deck_path = Deckbuilder.deck.file.path;
  // S'il est déjà en 1ère position, on ne fait rien, sinon...
  if (current_deck_path != $("deck_last_1").value) {
    // S'il est déjà en 2ème position, le 1er passe en 2, le 3ème ne bouge pas et le courant en 1er
    if (current_deck_path == $("deck_last_2").value) {
      Prefs.setChar("decks.lastdeck.2", $("deck_last_1").value);
      $("deck_last_2").value = $("deck_last_1").value;
      $("deck_last_2").label = $("deck_last_1").label;
      Prefs.setChar("decks.lastdeck.1", current_deck_path);
      $("deck_last_1").value = current_deck_path;
      $("deck_last_1").label = Deckbuilder.deck.file.leafName;
    }
    // Sinon, le 2 passe en 3, le 1 en 2 et le courant en 1er
    else {
      Prefs.setChar("decks.lastdeck.3", $("deck_last_2").value);
      $("deck_last_3").value = $("deck_last_2").value;
      $("deck_last_3").label = $("deck_last_2").label;
      Prefs.setChar("decks.lastdeck.2", $("deck_last_1").value);
      $("deck_last_2").value = $("deck_last_1").value;
      $("deck_last_2").label = $("deck_last_1").label;
      Prefs.setChar("decks.lastdeck.1", current_deck_path);
      $("deck_last_1").value = current_deck_path;
      $("deck_last_1").label = Deckbuilder.deck.file.leafName;
    }
  }
}


