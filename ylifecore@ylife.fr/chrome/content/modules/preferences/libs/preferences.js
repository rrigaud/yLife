/***************************************************************************************************************
 *  File : preferences.js
 * 
 *  Gère les préférences de l'utilisateur
 */




/***************************************************************************************************************
 *  Chargement des fonctions nécessaires pour yLife
 */
var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://ylifecore/content/libs/utils.js");
loader.loadSubScript("chrome://ylifecore/content/libs/sqlite.js");
loader.loadSubScript("chrome://ylifecore/content/modules/preferences/libs/prefs.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/ycd.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/env.js");



/***************************************************************************************************************
 *  Chargement de l'API pour les addons
 */
Components.utils.import("resource://gre/modules/AddonManager.jsm");



/***************************************************************************************************************
 *  Variables globales
 */
var ycd = {};



/***************************************************************************************************************
 *  Function : load
 *
 *  Charge les préférences dans l'interface
 */
Prefs.load = function () {
  // Informations personnelles
  $("language").selectedItem = $("language_" + Prefs.getChar("general.useragent.locale"));
  $("lastname").value = Prefs.getChar("lastname");
  $("firstname").value = Prefs.getChar("firstname");
  $("ude").value = Prefs.getChar("ude");
  $("jabber_jid").value = Prefs.getChar("jabber.jid");
  $("jabber_pwd").value = Prefs.getChar("jabber.pwd");
  $("jabber_status").value = Prefs.getChar("jabber.status");
  // Decks
  $("decks_format").appendItem("No Limit",0);
  $("decks_format").selectedIndex = "0";
  $("filter_format").appendItem($("i18n").getString("format.all"),"");
  $("filter_format").selectedIndex = "0";
  var deck_format = Prefs.getChar("decks.format");
  var filter_format = Prefs.getChar("filter.format");
  var formats = ycd.getEnv(Prefs.getLanguage()).getFormatsBy("Format_ID ASC");
  var i_max = formats.length;
  for (var i = 0 ; i < i_max ; i++) {
    $("decks_format").appendItem(formats[i].name,formats[i].id);
    if (formats[i].id == deck_format) { $("decks_format").selectedIndex = i+1; }
    $("filter_format").appendItem(formats[i].name,formats[i].id);
    if (formats[i].id == filter_format) { $("filter_format").selectedIndex = i+1; }
  }
  $("decks_folder").value = Prefs.getChar("decks.folder");
  // Filtre
  $("filter_reprints_group").checked = Prefs.getBool("filter.reprints.group");
  $("filter_country").appendItem($("i18n").getString("country.all"),"");
  $("filter_country").selectedIndex = "0";
  var filter_country = Prefs.getChar("filter.country");
  var countries = ycd.getCountriesBy("Name ASC");
  var i_max = countries.length;
  for (var i = 0 ; i < i_max ; i++) {
    $("filter_country").appendItem(countries[i].name,countries[i].id);
    if (countries[i].id == filter_country) { $("filter_country").selectedIndex = i+1; }
  }
  $("filter_language").appendItem($("i18n").getString("language.all"),"");
  $("filter_language").selectedIndex = "0";
  var filter_language = Prefs.getChar("filter.language");
  var languages = ycd.getLanguagesBy("Name ASC");
  var i_max = languages.length;
  for (var i = 0 ; i < i_max ; i++) {
    $("filter_language").appendItem(languages[i].name,languages[i].id);
    if (languages[i].id == filter_language) { $("filter_language").selectedIndex = i+1; }
  }
  // Paramètres d'affichage (ajout des templates persos)
  for (var i = 0 ; i < $("template_card").itemCount ; i++) {
    if ($("template_card").getItemAtIndex(i).value == Prefs.getChar("template.card")) { $("template_card").selectedIndex = i; }
  }
  for (var i = 0 ; i < $("resolution_card").itemCount ; i++) {
    if ($("resolution_card").getItemAtIndex(i).value == Prefs.getChar("resolution.card")) { $("resolution_card").selectedIndex = i; }
  }
  for (var i = 0 ; i < $("template_deck").itemCount ; i++) {
    if ($("template_deck").getItemAtIndex(i).value == Prefs.getChar("template.deck")) { $("template_deck").selectedIndex = i; }
  }
  var chat_folder = getFolder("ProfD");
  chat_folder.append("data");
  chat_folder.append("templates");
  chat_folder.append("chat");
  var chat_templates = getFolderContent(chat_folder,"files");
  for (var i = 0 ; i < chat_templates.length ; i++) {
    $("template_chat").appendItem(chat_templates[i].leafName,chat_templates[i].leafName);
  }
  for (var i = 0 ; i < $("template_chat").itemCount ; i++) {
    if ($("template_chat").getItemAtIndex(i).value == Prefs.getChar("template.chat")) { $("template_chat").selectedIndex = i; }
  }
  var muc_folder = getFolder("ProfD");
  muc_folder.append("data");
  muc_folder.append("templates");
  muc_folder.append("muc");
  var muc_templates = getFolderContent(muc_folder,"files");
  for (var i = 0 ; i < muc_templates.length ; i++) {
    $("template_muc").appendItem(muc_templates[i].leafName,muc_templates[i].leafName);
  }
  for (var i = 0 ; i < $("template_muc").itemCount ; i++) {
    if ($("template_muc").getItemAtIndex(i).value == Prefs.getChar("template.muc")) { $("template_muc").selectedIndex = i; }
  }
  var duel_folder = getFolder("ProfD");
  duel_folder.append("data");
  duel_folder.append("templates");
  duel_folder.append("duel");
  var duel_templates = getFolderContent(duel_folder,"files");
  for (var i = 0 ; i < duel_templates.length ; i++) {
    $("template_duel").appendItem(duel_templates[i].leafName,duel_templates[i].leafName);
  }
  for (var i = 0 ; i < $("template_duel").itemCount ; i++) {
    if ($("template_duel").getItemAtIndex(i).value == Prefs.getChar("template.duel")) { $("template_duel").selectedIndex = i; }
  }
  for (var i = 0 ; i < $("resolution_duel").itemCount ; i++) {
    if ($("resolution_duel").getItemAtIndex(i).value == Prefs.getChar("resolution.duel")) { $("resolution_duel").selectedIndex = i; }
  }
  // Paramètres de débuggage
  $("debug_javascript").checked = Prefs.getBool("debug.javascript");
  $("debug_jabber").checked = Prefs.getBool("debug.jabber");
  // Salons de discussion
  for (var i = 1 ; i < 13 ; i++) {
    $("room_" + i).value = Prefs.getChar("muc.room." + i);
  }
}
/***************************************************************************************************************
 *  Function : save
 *
 *  Enregistre les préférences
 */
Prefs.save = function () {
  // Informations personnelles
  Prefs.setChar("general.useragent.locale", $("language").selectedItem.value);
  Prefs.setChar("lastname", $("lastname").value);
  Prefs.setChar("firstname", $("firstname").value);
  Prefs.setChar("ude", $("ude").value);
  Prefs.setChar("jabber.jid", $("jabber_jid").value);
  Prefs.setChar("jabber.pwd", $("jabber_pwd").value);
  Prefs.setChar("jabber.status", $("jabber_status").value);
  // Decks
  Prefs.setChar("decks.format", $("decks_format").selectedItem.value);
  Prefs.setChar("decks.folder", $("decks_folder").value);
  // Filtre
  Prefs.setBool("filter.reprints.group",$("filter_reprints_group").checked);
  Prefs.setChar("filter.format", $("filter_format").selectedItem.value);
  Prefs.setChar("filter.country", $("filter_country").selectedItem.value);
  Prefs.setChar("filter.language", $("filter_language").selectedItem.value);
  // Paramètres d'affichage (ajout des templates persos)
  Prefs.setChar("template.card", $("template_card").selectedItem.value);
  Prefs.setChar("resolution.card", $("resolution_card").selectedItem.value);
  Prefs.setChar("template.deck", $("template_deck").selectedItem.value);
  Prefs.setChar("template.chat", $("template_chat").selectedItem.value);
  Prefs.setChar("template.muc", $("template_muc").selectedItem.value);
  Prefs.setChar("template.duel", $("template_duel").selectedItem.value);
  Prefs.setChar("resolution.duel", $("resolution_duel").selectedItem.value);
  // Paramètres de débuggage
  Prefs.setBool("debug.javascript",$("debug_javascript").checked);
  Prefs.setBool("debug.jabber",$("debug_jabber").checked);
  // Salons de discussion
  for (var i = 1 ; i < 13 ; i++) {
    Prefs.setChar("muc.room." + i,$("room_" + i).value);
  }
  
  // On le notifie
  window.top.Notifs.add({"type": "preferences_saved", "top": true, "timer": true, "time": 4000});
}
/***************************************************************************************************************
 *  Function : browseDecksFolder
 *
 *  Sélectionne le répertoire par défaut des Decks
 */
Prefs.browseDecksFolder = function () {
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"]
        .createInstance(nsIFilePicker);
  fp.init(window, $("i18n").getString("choose.decks.folder"), nsIFilePicker.modeGetFolder);
  // Ouverture du dossier de Decks par défaut
  var decks_folder = getFolder("ProfD");
  decks_folder.initWithPath(Prefs.getChar("decks.folder"));
  fp.displayDirectory = decks_folder;
  if (fp.show() == nsIFilePicker.returnOK) {
    $("decks_folder").value = fp.file.path;
  }
}
/***************************************************************************************************************
 *  Function : addTemplate
 *
 *  Importe un template utilisateur dans son profil
 * 
 *  Parameters :
 *    (String) type - chat/muc/duel
 */
Prefs.addTemplate = function (type) {
  // Sélection du Template
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, $("i18n").getString("addtemplate.title"), nsIFilePicker.modeOpen);
  fp.appendFilter($("i18n").getString("addtemplate.filter"), "*.xhtml");
  fp.displayDirectory = getFolder("Home");
  if (fp.show() == nsIFilePicker.returnOK) {
    var templates_folder = getFolder("ProfD");
    templates_folder.append("data");
    templates_folder.append("templates");
    templates_folder.append(type);
    var template_file = fp.file;
    template_file.copyTo(templates_folder,"");
    $("template_" + type).appendItem(template_file.leafName,template_file.leafName);
  }
}

/***************************************************************************************************************
 *  Function : window.onload
 * 
 *  Initialise les préférences à l'ouverture
 */
window.onload = function()
{
  AddonManager.getAddonByID("ycd@ylife.fr", function(addon) {
    var file = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
    file.append("chrome");
    file.append("content");
    file.append("database.ycd");
    ycd = new Ycd (file);
    Prefs.load();
  });
}


