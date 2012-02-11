/***************************************************************************************************************
 *  File : install_addons.js
 * 
 *  Installe les extensions de /data/extensions dans le profil
 */




// Chargement du Gestionnaire d'Extension
Components.utils.import("resource://gre/modules/AddonManager.jsm");

var nb_installed = 0;
var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);


/***************************************************************************************************************
 *  Object : listener_addons
 * 
 *  Listener : Ecoute les MAJ d'addons (asynchrone)
 */
var listener_addons = {
  onNewInstall: function (aInstall) {
    consoleService.logStringMessage("Nouvelle Installation de : " + aInstall.name);
  },
  onInstallStarted: function (aInstall) {
    consoleService.logStringMessage("Commencent de l'Installation de : " + aInstall.name);
  },
  onInstallEnded: function (aInstall,addon) {
    consoleService.logStringMessage("Installation terminée de : " + aInstall.name);
    nb_installed++;
    if (nb_installed == addons.length) {
      document.getElementById("image").setAttribute("src","chrome://ylife/skin/addons_installed.png");
      var i_max = addons.length;
      for (var i = 0 ; i < i_max ; i++) { addons[i].status = "installed"; }
      addonlistview.rowCount= addons.length;
      document.getElementById("addonlist").view = addonlistview;
      document.getElementById("reboot").collapsed = false;
      document.getElementById("installing").collapsed = true;
      document.getElementById("installed").collapsed = false;
    }
  },
  onInstallFailed: function(addon) {
    consoleService.logStringMessage("Erreur d'installation de : " + aInstall.name);
  }
};


/***************************************************************************************************************
 *  Variable globale : addons
 * 
 *  Stocke les addons en mémoire
 */
var addons = [];


/***************************************************************************************************************
 *  Treeview : addonlistview
 * 
 *  Affiche les addons
 */
var addonlistview = {
  rowCount : 0,
  getCellText : function(row,col){
    if (col.id == "addonlist_name") return addons[row].name;
    else return null;
  },
  setTree: function(treebox){ this.treebox = treebox; },
  isContainer: function(row){ return false; },
  isSeparator: function(row){ return false; },
  isSorted: function(row){ return false; },
  getLevel: function(row){ return 0; },
  getParentIndex: function(row) { return -1; },
  getImageSrc: function(row,col){
    var ImageLocation = "chrome://ylife/skin/addon_" + addons[row].status + ".png";
    if (col.id == "addonlist_status") return ImageLocation;
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
 *  Function : window.onload
 * 
 *  Initialise les addons à l'ouverture
 */
 window.onload = function()
{
  displayAddons();
  setTimeout("installAddons()",3000);
}


/***************************************************************************************************************
 *  Function : displayAddons
 * 
 *  Affiche tous les addons
 */
function displayAddons()
{
  var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("CurProcD", Components.interfaces.nsILocalFile);
  file.append("data");
  file.append("extensions");
  var entries = file.directoryEntries;
  // Installation de tous les .xpi présents dans [APP/data/extensions/]
  while(entries.hasMoreElements())
  {
    var entry = entries.getNext();
    entry.QueryInterface(Components.interfaces.nsIFile);

    AddonManager.getInstallForFile(entry, function(aInstall) {
      addons.push({"id": aInstall.addon.id, "name": aInstall.name, "status": "installing", "addonInstall": aInstall});
      // MAJ de l'interface
      addonlistview.rowCount= addons.length;
      document.getElementById("addonlist").view = addonlistview;
    }, "application/x-xpinstall");
  }
}


/***************************************************************************************************************
 *  Function : installAddons
 * 
 *  Installe tous les addons
 */
function installAddons()
{
  // Ecoute de l'état d'installation
  AddonManager.addInstallListener(listener_addons);
  
  var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("CurProcD", Components.interfaces.nsILocalFile);
  file.append("data");
  file.append("extensions");
  var entries = file.directoryEntries;
  // Installation de tous les .xpi présents dans [APP/data/extensions/]
  while(entries.hasMoreElements())
  {
    var entry = entries.getNext();
    entry.QueryInterface(Components.interfaces.nsIFile);

    AddonManager.getInstallForFile(entry, function(aInstall) {
      // aInstall is an instance of {{AMInterface("AddonInstall")}}
      aInstall.install();
    }, "application/x-xpinstall");
  }
}


/***************************************************************************************************************
 *  Function : reboot
 * 
 *  Redémarre l'application
 */
function reboot()
{
  var appStartup = Components.interfaces.nsIAppStartup;
  Components.classes["@mozilla.org/toolkit/app-startup;1"]
           .getService(appStartup)
           .quit(appStartup.eRestart | appStartup.eAttemptQuit);
}
