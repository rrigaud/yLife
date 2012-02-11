/***************************************************************************************************************
 *  File : filter.js
 * 
 *  Filtre en temps réel des cartes
 */




/***************************************************************************************************************
 *  Variable globale : cards, reprints
 * 
 *  Stocke les cartes filtrées en mémoire
 */
var cards = [];
var reprints = [];
var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);



/***************************************************************************************************************
 *  Treeview : cardlistview
 * 
 *  Affiche les cartes filtrées dans un tree
 */
var cardlistview = {
  rowCount : 0,
  getCellText : function(row,col){
    if (col.id == "cardlist_reference") return cards[row].reference;
    if (col.id == "cardlist_name") return cards[row].name;
    else return null;
  },
  setTree: function(treebox){ this.treebox = treebox; },
  isContainer: function(row){ return false; },
  isSeparator: function(row){ return false; },
  isSorted: function(row){ return false; },
  getLevel: function(row){ return 0; },
  getParentIndex: function(row) { return -1; },
  getImageSrc: function(row,col){
    var ImageLocation = "chrome://ylifecore/skin/icons/cards/" + ylife_type[cards[row].subtype_id] + ".png";
    if (col.id == "cardlist_type") return ImageLocation;
    else return null;
  },
  getRowProperties: function(row,props){},
  getCellProperties: function(row,col,props){},
  getColumnProperties: function(colid,col,props){},
  canDrop: function(index,orientation,dataTransfer){
    var source = dataTransfer.getData("source");
    if (source != "current_card") {
      return false;
    }
    else { return true; }
  },
  drop: function(row, orientation,dataTransfer) {
    var source = dataTransfer.getData("source");
    if (source != "current_card") {
      var deck = dataTransfer.getData("deck");
      var index = dataTransfer.getData("index");
      // Avant de supprimer 1 exemplaire, on replace la carte à son index de départ
      // afin d'éviter le bug de déplacement à la toute fin en passant sur l'ascenseur des Deck
      Deckbuilder.indexCard(deck,index);
      Deckbuilder.delCard(deck);
    }
  }
};
/***************************************************************************************************************
 *  Treeview : reprintlistview
 * 
 *  Affiche les cartes filtrées dans un tree
 */
var reprintlistview = {
  rowCount : 0,
  getCellText : function(row,col){
    if (col.id == "reprintlist_reference") return reprints[row].reference;
    if (col.id == "reprintlist_name") return reprints[row].name;
    else return null;
  },
  setTree: function(treebox){ this.treebox = treebox; },
  isContainer: function(row){ return false; },
  isSeparator: function(row){ return false; },
  isSorted: function(row){ return false; },
  getLevel: function(row){ return 0; },
  getParentIndex: function(row) { return -1; },
  getImageSrc: function(row,col){
    var ImageLocation = "chrome://ylifecore/skin/icons/cards/" + ylife_type[reprints[row].subtype_id] + ".png";
    if (col.id == "reprintlist_type") return ImageLocation;
    else return null;
  },
  getRowProperties: function(row,props){},
  getCellProperties: function(row,col,props){},
  getColumnProperties: function(colid,col,props){},
  canDrop: function(index,orientation,dataTransfer){
    return false;
  },
  drop: function(row, orientation,dataTransfer) {}
};



/***************************************************************************************************************
 *  Function : filterCards
 *
 *  Filtre les cartes
 */
Deckbuilder.filterCards = function () {
  var jointures = [];
  var filtre = [];
  // Un petit coup de Regexp pour doubler les ' afin de ne pas bugguer la recherche pour les textes
  var reg = new RegExp("'", "g");
  // Nom
  var name = $("name").value;
  var name = name.replace(reg,"''");
  if (name != "") { filtre.push("cards.Name like '%"+name+"%'"); }
  // Description
  var description = $("description").value;
  var description = description.replace(reg,"''");
  if (description != "") { filtre.push("cards.Description like '%"+description+"%'"); }
  // Type de carte
  var type_id = $("type").selectedItem.value;
  // MONSTRE
  if (type_id == "1") {
    // Sous-type de carte
    var subtype_1_id = $("subtype_1").selectedItem.value;
    if (subtype_1_id == "") {
      filtre.push("cards.Type_ID != 5");
      filtre.push("cards.Type_ID != 6");
      filtre.push("cards.Type_ID != 7");
      filtre.push("cards.Type_ID != 8");
      filtre.push("cards.Type_ID != 9");
      filtre.push("cards.Type_ID != 10");
      filtre.push("cards.Type_ID != 11");
      filtre.push("cards.Type_ID != 12");
      filtre.push("cards.Type_ID != 13");
    }
    else { filtre.push("cards.Type_ID = "+subtype_1_id); }
    // Monstre > Attribut
    var monster_attribute_id = $("monster_attribute").selectedItem.value;
    if (monster_attribute_id != "") { filtre.push("cards.Monster_Attribute_ID = "+monster_attribute_id); }
    // Monstre > Type
    var monster_type_id = $("monster_type").selectedItem.value;
    if (monster_type_id != "") { filtre.push("cards.Monster_Type_ID = "+monster_type_id); }
    // Monstre > Sous-type
    var monster_subtype_id = $("monster_subtype").selectedItem.value;
    if (monster_subtype_id != "") { filtre.push("cards.Monster_Subtype_ID = "+monster_subtype_id); }
    // Monstre > Effet
    var monster_effect_id = $("monster_effect").selectedItem.value;
    if (monster_effect_id != "") {
      filtre.push("cards_x_monster_effects.Monster_Effect_ID = "+monster_effect_id);
      jointures.push("LEFT JOIN cards_x_monster_effects ON cards_x_monster_effects.ID_Card = cards.ID_Card");
    }
    // Monstre > Niveau
    var monster_level = $("monster_level").selectedItem.value;
    if (monster_level != "") {
      var monster_level_op = $("monster_level_op").selectedItem.value;
      if (monster_level_op == '0') { filtre.push("cards.Level <= "+monster_level); }
      if (monster_level_op == '1') { filtre.push("cards.Level = "+monster_level); }
      if (monster_level_op == '2') { filtre.push("cards.Level >= "+monster_level); }
    }
    // Monstre > Attaque
    var monster_atk = ($("monster_atk").value == "?") ? "-1" : $("monster_atk").value;
    if (monster_atk != "") {
      var monster_atk_op = $("monster_atk_op").selectedItem.value;
      if (monster_atk_op == '0') { filtre.push("cards.Atk <= "+monster_atk); }
      if (monster_atk_op == '1') { filtre.push("cards.Atk = "+monster_atk); }
      if (monster_atk_op == '2') { filtre.push("cards.Atk >= "+monster_atk); }
    }
    // Monstre > Défense
    var monster_def = ($("monster_def").value == "?") ? "-1" : $("monster_def").value;
    if (monster_def != "") {
      var monster_def_op = $("monster_def_op").selectedItem.value;
      if (monster_def_op == '0') { filtre.push("cards.Def <= "+monster_def); }
      if (monster_def_op == '1') { filtre.push("cards.Def = "+monster_def); }
      if (monster_def_op == '2') { filtre.push("cards.Def >= "+monster_def); }
    }
  }
  // MAGIE
  if (type_id == "2") {
    // Sous-type de carte
    var subtype_2_id = $("subtype_2").selectedItem.value;
    if (subtype_2_id == "") {
      filtre.push("cards.Type_ID != 1");
      filtre.push("cards.Type_ID != 2");
      filtre.push("cards.Type_ID != 3");
      filtre.push("cards.Type_ID != 4");
      filtre.push("cards.Type_ID != 14");
      filtre.push("cards.Type_ID != 11");
      filtre.push("cards.Type_ID != 12");
      filtre.push("cards.Type_ID != 13");
    }
    else { filtre.push("cards.Type_ID = "+subtype_2_id); }
  }
  // PIEGE
  if (type_id == "3") {
    // Sous-type de carte
    var subtype_3_id = $("subtype_3").selectedItem.value;
    if (subtype_3_id == "") {
      filtre.push("cards.Type_ID != 1");
      filtre.push("cards.Type_ID != 2");
      filtre.push("cards.Type_ID != 3");
      filtre.push("cards.Type_ID != 4");
      filtre.push("cards.Type_ID != 14");
      filtre.push("cards.Type_ID != 5");
      filtre.push("cards.Type_ID != 6");
      filtre.push("cards.Type_ID != 7");
      filtre.push("cards.Type_ID != 8");
      filtre.push("cards.Type_ID != 9");
      filtre.push("cards.Type_ID != 10");
    }
    else { filtre.push("cards.Type_ID = "+subtype_3_id); }
  }
  // FILTRE AVANCE
  // Grouper les rééditions
  var group_reprints = $("reprints_group").checked;
  // Format
  var format_id = $("format").selectedItem.value;
  if (format_id != ""){
    filtre.push("extensions_x_formats.Format_ID = "+format_id);
    jointures.push("LEFT JOIN extensions_x_formats ON extensions_x_formats.Extension_ID = cards.Extension_ID");
  }
  // Rareté
  var rarity_id = $("rarity").selectedItem.value;
  if (rarity_id != ""){
    filtre.push("cards_x_rarities.Rarity_ID = "+rarity_id);
    jointures.push("LEFT JOIN cards_x_rarities ON cards_x_rarities.Card_ID = cards.Card_ID");
  }
  // Pays
  var country_id = $("country").selectedItem.value;
  if (country_id != "") { filtre.push("extensions.Country_ID = "+country_id); }
  // Langue
  var language_id = $("language").selectedItem.value;
  if (language_id != "") { filtre.push("extensions.Language_ID = "+language_id); }
  // Type d'extension
  var model_id = $("model").selectedItem.value;
  if (model_id != "") { filtre.push("extensions.Model_ID = "+model_id); }
  // Extension
  var extension_id = $("extension").selectedItem.value;
  if (extension_id != "") { filtre.push("extensions.Extension_ID = "+extension_id); }
  // Jointures table extension si nécessaire
  if ((extension_id != "")||(country_id != "")||(language_id != "")||(model_id != "")) {
    jointures.push("LEFT JOIN extensions ON extensions.Extension_ID = cards.Extension_ID");
  }
  
  
  if (filtre.length > 0) { filtre = " WHERE " +  filtre.join(" AND "); }
  
  cards = new Array();
  var query = "SELECT cards.Card_ID, cards.Name, cards.Reference, cards.Type_ID FROM cards " + jointures.join(" ") + filtre + " ORDER BY cards.Name ASC, cards.Reference ASC";
  var data = Deckbuilder.ycd.db.query(query);
  
  if (group_reprints) {
    // Si ce n'est pas une réédition, on l'affiche (appel à tableau statique pour performances)
    while (data.executeStep()) {
      if (!Deckbuilder.ycd.isReprint[data.getInt32(0)]) {
        cards.push({"card_id": data.getInt32(0), "name": data.getString(1), "reference": data.getString(2), "subtype_id": data.getInt32(3)});
      }
    }
  }
  else {
    while (data.executeStep()) {
      cards.push({"card_id": data.getInt32(0), "name": data.getString(1), "reference": data.getString(2), "subtype_id": data.getInt32(3)});
    }
  }
  data.reset();
  cardlistview.rowCount= cards.length;
  $("nb_cards_filtered").value = cards.length;
  $("cardlist").view = cardlistview;
  $("cardlist").view.selection.select("0");
  if (cards.length > 0) { Deckbuilder.setCard(cards[0].card_id); }
}




