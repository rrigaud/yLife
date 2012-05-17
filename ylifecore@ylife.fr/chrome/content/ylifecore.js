/***************************************************************************************************************
 *  File : ylifecore.js
 * 
 *  Charge l'interface principale (Home), vérifie le profil et les MAJ
 */




/***************************************************************************************************************
 *  Chargement des fonctions nécessaires pour yLife
 */
var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://ylifecore/content/libs/utils.js");
loader.loadSubScript("chrome://ylifecore/content/libs/addons.js");
loader.loadSubScript("chrome://ylifecore/content/libs/notifications.js");
loader.loadSubScript("chrome://ylifecore/content/libs/tabs.js");
loader.loadSubScript("chrome://ylifecore/content/libs/tab.js");
loader.loadSubScript("chrome://ylifecore/content/libs/sqlite.js");
loader.loadSubScript("chrome://ylifecore/content/modules/preferences/libs/prefs.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/ycd.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/env.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/card.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/utils.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/deck.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/jabber.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/actions.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/handlers.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/updates.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/contacts.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/contact.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/jabber/chat.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/muc/muc.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/muc/occupant.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/dimensions.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/duel.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/coordinates.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/zones.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/players.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/player.js");
loader.loadSubScript("chrome://ylifecore/content/modules/duel/duel/sync.js");


/***************************************************************************************************************
 *  Chargement de l'API pour les addons
 */
Components.utils.import("resource://gre/modules/AddonManager.jsm");


/***************************************************************************************************************
 *  Object : listener_addons
 * 
 *  Listener : Ecoute les MAJ d'addons (asynchrone)
 */
var listener_addons = {
  // Si une MAJ est disponible (On peut connaitre son ID avec "addon.id" mais c'est inutile)
  onUpdateAvailable: function(addon) {
    Notifs.add({"type": "addons_update_available", "top": true, "timer": false});
  }
};


/***************************************************************************************************************
 *  Event Listener : load / unload
 */
window.addEventListener('load', initYlifecore, false);
window.addEventListener('unload', closeYlifecore, false);


/***************************************************************************************************************
 *  Function : initYlifecore
 * 
 *  Initialise yLife
 */
function initYlifecore()
{
  if (Prefs.getBool("debug.javascript")) { window.open("chrome://global/content/console.xul", "_blank", "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar"); }
  if (Prefs.getBool("debug.jabber")) { $("debug_jabber").collapsed = false; }
  Addons.load();
  checkUpdates();
  checkProfile();
  setAppVersion();
  initHome();
}


/***************************************************************************************************************
 *  Function : closeYlifecore
 * 
 *  A la fermeture de yLife, on coupe la connexion
 */
function closeYlifecore()
{
  if (Jabber.connected) {
    Jabber.connection.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
    Jabber.connection.flush();
    Jabber.disconnect();
  }
}


/***************************************************************************************************************
 *  Function : checkUpdates
 * 
 *  Vérification des MAJ disponibles
 */
function checkUpdates()
{
  AddonManager.addAddonListener(listener_addons);
}


/***************************************************************************************************************
 *  Function : checkProfile
 * 
 *  Si c'est le 1er lancement, on copie le profil (BDD, templates) de [APP/data] vers [PROFIL/data]
 */
function checkProfile()
{
  var profile_datafolder = getFolder("ProfD");
  profile_datafolder.append("data");
  // Si le dossier [PROFIL/data] n'existe pas
  if (!profile_datafolder.exists()) {
    // Récupération du chemin vers l'addon "ylifecore@ylife.fr"
    AddonManager.getAddonByID("ylifecore@ylife.fr", function(addon) {
      var data_folder = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
      data_folder.append("data");
      var profile_folder = getFolder("ProfD");
      // On copie [APP/data] vers [PROFIL/data]
      data_folder.copyTo(profile_folder,"");
      // Si, de plus, aucun Dossier par défaut pour les Decks n'est précisé dans les préférences, on en spécifie un : [PROFIL/data/decks]
      if (Prefs.getChar("decks.folder") == "") {
        var Decks_Folder = getFolder("ProfD");
        Decks_Folder.append("data");
        Decks_Folder.append("decks");
        var Decks_Path = Decks_Folder.path;
        Prefs.setChar("decks.folder",Decks_Path)
        // On le notifie
        Notifs.add({"type": "profile_initialized", "top": true, "timer": true, "time": 4000});
      }
    });
  }
}


/***************************************************************************************************************
 *  Function : setAppVersion
 * 
 *  Affichage de la version des extensions
 */
function setAppVersion()
{
  // Affichage de la version de yLife (asynchrone)
  AddonManager.getAddonByID("ylifecore@ylife.fr", function(addon) {
    $("ylife_version").value = "yLife " + addon.version;
  });
  // Affichage de la version de YCD (asynchrone)
  AddonManager.getAddonByID("ycd@ylife.fr", function(addon) {
    $("ycd_version").value = "YCD " + addon.version;
  });
}


/***************************************************************************************************************
 *  Function : initHome
 * 
 *  Initialise l'onglet Home
 */
function initHome()
{
  var home_tab = new Tab (0,"home");
  Tabs.tabs[0] = home_tab;
  Jabber.addNamespaces();
  Jabber.load();
  Jabber.refreshMyNicknames();
  $("jabber_status").textContent = Jabber.presence.status;
  // Salons de discussion
  for (var i = 1 ; i < 13 ; i++) {
    var room = Prefs.getChar("muc.room." + i);
    if (room != "") {
      var menuitem = document.createElement('menuitem');
      menuitem.setAttribute('class', "menuitem-iconic bt_muc");
      menuitem.setAttribute('label', room);
      menuitem.setAttribute('oncommand', "Jabber.joinMuc('" + room + "');");
      $("jabber_muc").appendChild(menuitem);
    }
  }
}



