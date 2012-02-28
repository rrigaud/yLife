/***************************************************************************************************************
 *  File : internetdeck.js
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
 *  Chargement de l'API pour les addons et la lecture de fichiers
 */
Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");



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
  var tpl_folder = getFolder("ProfD");
  tpl_folder.append("data");
  tpl_folder.append("templates");
  tpl_folder.append("deck");
  tpl_folder.append("internet");
  var tpl_templates = getFolderContent(tpl_folder,"files");
  for (var i = 0 ; i < tpl_templates.length ; i++) {
    $("template").appendItem(tpl_templates[i].leafName,tpl_templates[i].leafName);
  }
  refresh();
}
/***************************************************************************************************************
 *  Function : refresh
 * 
 *  Rafraichit l'aperçu avant impression
 */
function refresh () {
  AddonManager.getAddonByID("ylifecore@ylife.fr", function(addon) {
    var ylife_template = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
    ylife_template.append("chrome");
    ylife_template.append("skin");
    ylife_template.append("classic");
    ylife_template.append("templates");
    ylife_template.append("deck");
    ylife_template.append("internet");
    ylife_template.append($("template").selectedItem.value);
    if (ylife_template.exists()) { var template_src = ylife_template; }
    else {
      var user_template = getFolder("ProfD");
      user_template.append("data");
      user_template.append("templates");
      user_template.append("deck");
      user_template.append("internet");
      user_template.append($("template").selectedItem.value);
      var template_src = user_template;
    }
    // On charge le template du deck et de chaque carte
    NetUtil.asyncFetch(template_src, function(inputStream, status) {
      if (!Components.isSuccessCode(status)) {
        alert("Erreur de lecture du fichier template");
        return;
      }
      var data_xml = NetUtil.readInputStreamToString(inputStream, inputStream.available());
      var data = data_xml.replace(/\<\?xml version="1.0" encoding="UTF-8"\?\>/,"");
      var tpl_xml = new XML(data);
      $("template_deck").value = tpl_xml.deck.toString();
      $("template_card").value = tpl_xml.card.toString();
    });
  });
}
/***************************************************************************************************************
 *  Function : copy
 * 
 *  Copie le deck dans le presse-papier
 */
function copy () {
  var template_deck = $("template_deck").value;
  var template_card = $("template_card").value;
  
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
  
  // Main Deck
  var i_max = infos.Deckbuilder.deck.main.length;
  for (var i = 0 ; i < i_max ; i++) {
    var card_object = infos.Deckbuilder.ycd.getCard(infos.Deckbuilder.deck.main[i].card_id);
    var number = parseInt(infos.Deckbuilder.deck.main[i].number);
    card = template_card.replace("{number}",number);
    card = card.replace("{card_id}",card_object.card_id);
    card = card.replace("{reference}",card_object.reference);
    card = card.replace("{name}",card_object.name);
    card = card.replace("{description}",card_object.description);
    card = card.replace("{type}",card_object.getSubtype(Prefs.getLanguage()).name);
    card = card.replace("{monster_attribute}",card_object.getMonsterAttribute(Prefs.getLanguage()));
    card = card.replace("{monster_level}",card_object.level);
    card = card.replace("{monster_atk}",card_object.atk);
    card = card.replace("{monster_def}",card_object.def);
    card = card.replace("{monster_type}",card_object.getMonsterType(Prefs.getLanguage()));
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
    card = template_card.replace("{number}",number);
    card = card.replace("{reference}",card_object.reference);
    card = card.replace("{name}",card_object.name);
    card = card.replace("{description}",card_object.description);
    card = card.replace("{type}",card_object.getSubtype(Prefs.getLanguage()).name);
    card = card.replace("{monster_attribute}",card_object.getMonsterAttribute(Prefs.getLanguage()));
    card = card.replace("{monster_level}",card_object.level);
    card = card.replace("{monster_atk}",card_object.atk);
    card = card.replace("{monster_def}",card_object.def);
    card = card.replace("{monster_type}",card_object.getMonsterType(Prefs.getLanguage()));
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
    card = template_card.replace("{number}",number);
    card = card.replace("{reference}",card_object.reference);
    card = card.replace("{name}",card_object.name);
    card = card.replace("{description}",card_object.description);
    card = card.replace("{type}",card_object.getSubtype(Prefs.getLanguage()).name);
    card = card.replace("{monster_attribute}",card_object.getMonsterAttribute(Prefs.getLanguage()));
    card = card.replace("{monster_level}",card_object.level);
    card = card.replace("{monster_atk}",card_object.atk);
    card = card.replace("{monster_def}",card_object.def);
    card = card.replace("{monster_type}",card_object.getMonsterType(Prefs.getLanguage()));
    extra_monsters += card + "\n";
    extra_nb_monsters = extra_nb_monsters + number;
  }
  
  
  var deck = template_deck.replace("{maindeck_nb_cards}",main_nb_cards);
  deck = deck.replace("{maindeck_nb_monsters}",main_nb_monsters);
  deck = deck.replace("{maindeck_nb_spells}",main_nb_spells);
  deck = deck.replace("{maindeck_nb_traps}",main_nb_traps);
  deck = deck.replace("{maindeck_monsters}",main_monsters);
  deck = deck.replace("{maindeck_spells}",main_spells);
  deck = deck.replace("{maindeck_traps}",main_traps);
  deck = deck.replace("{sidedeck_nb_cards}",side_nb_cards);
  deck = deck.replace("{sidedeck_nb_monsters}",side_nb_monsters);
  deck = deck.replace("{sidedeck_nb_spells}",side_nb_spells);
  deck = deck.replace("{sidedeck_nb_traps}",side_nb_traps);
  deck = deck.replace("{sidedeck_monsters}",side_monsters);
  deck = deck.replace("{sidedeck_spells}",side_spells);
  deck = deck.replace("{sidedeck_traps}",side_traps);
  deck = deck.replace("{extradeck_nb_monsters}",extra_nb_monsters);
  deck = deck.replace("{extradeck_monsters}",extra_monsters);
  
  var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
  gClipboardHelper.copyString(deck);
  return true;
}

