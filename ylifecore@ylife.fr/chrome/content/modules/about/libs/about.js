/***************************************************************************************************************
 *  File : about.js
 * 
 *  Fichier "A propos" concernant yLife et YCD
 */




/***************************************************************************************************************
 *  Chargement des fonctions nécessaires pour yLife
 */
var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://ylifecore/content/libs/utils.js");
loader.loadSubScript("chrome://ylifecore/content/libs/sqlite.js");
loader.loadSubScript("chrome://ylifecore/content/modules/preferences/libs/prefs.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/ycd.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/utils.js");


/***************************************************************************************************************
 *  Chargement de l'API pour les addons
 */
Components.utils.import("resource://gre/modules/AddonManager.jsm");


/***************************************************************************************************************
 *  Variables globales
 */
var ycd = {};
var changelogs = [];
var credits = [];


/***************************************************************************************************************
 *  Treeview : changeloglistview
 * 
 *  Affiche les changelogs dans un tree
 */
var changeloglistview = {
  rowCount : 0,
  getCellText : function(row,col){
    if (col.id == "changeloglist_date") return changelogs[row].date;
    if (col.id == "changeloglist_member") return changelogs[row].name;
    if (col.id == "changeloglist_nickname") return changelogs[row].nickname;
    else return null;
  },
  setTree: function(treebox){ this.treebox = treebox; },
  isContainer: function(row){ return false; },
  isSeparator: function(row){ return false; },
  isSorted: function(row){ return false; },
  getLevel: function(row){ return 0; },
  getParentIndex: function(row) { return -1; },
  getImageSrc: function(row,col) { return null; },
  getRowProperties: function(row,props){},
  getCellProperties: function(row,col,props){},
  getColumnProperties: function(colid,col,props){},
  canDrop: function(index,orientation,dataTransfer){
    return false;
  },
  drop: function(row, orientation,dataTransfer) {}
};
/***************************************************************************************************************
 *  Treeview : creditlistview
 * 
 *  Affiche les changelogs dans un tree
 */
var creditlistview = {
  rowCount : 0,
  getCellText : function(row,col){
    if (col.id == "creditlist_member") return credits[row].name;
    if (col.id == "creditlist_nickname") return credits[row].nickname;
    if (col.id == "creditlist_email") return credits[row].email;
    if (col.id == "creditlist_statute") return credits[row].statute;
    else return null;
  },
  setTree: function(treebox){ this.treebox = treebox; },
  isContainer: function(row){ return false; },
  isSeparator: function(row){ return false; },
  isSorted: function(row){ return false; },
  getLevel: function(row){ return 0; },
  getParentIndex: function(row) { return -1; },
  getImageSrc: function(row,col){
    var ImageLocation = "chrome://ylifecore/skin/icons/flags/" + ylife_language[credits[row].country_id] + ".png";
    if (col.id == "creditlist_country") return ImageLocation;
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
 *  Initialise les préférences à l'ouverture
 */
window.onload = function()
{
  // Affichage de la version de yLife (asynchrone)
  AddonManager.getAddonByID("ylifecore@ylife.fr", function(addon) {
    $("ylife_version").value = addon.version;
  });
  AddonManager.getAddonByID("ycd@ylife.fr", function(addon) {
    var file = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
    file.append("chrome");
    file.append("content");
    file.append("database.ycd");
    ycd = new Ycd (file);
    // Informations principales
    var info = ycd.getInformations();
    $("ycd_project").value = info["Project"];
    $("ycd_website").value = info["WebSite"];
    $("ycd_license").value = info["License"];
    $("ycd_creation").value = info["Creation"];
    $("ycd_lastupdate").value = info["Last Update"];
    // Historique
    changelogs = ycd.getChangelogs();
    changeloglistview.rowCount= changelogs.length;
    $("changeloglist").view = changeloglistview;
    $("changeloglist").view.selection.select("0");
    // Crédits
    credits = ycd.getCredits();
    creditlistview.rowCount= credits.length;
    $("creditlist").view = creditlistview;
    $("creditlist").view.selection.select("0");
    // Sources
    $("ycd_sources").value = info["Sources"];
  });
}


/***************************************************************************************************************
 *  Function : setChangelog
 * 
 *  Affiche le détail d'un changelog
 * 
 *  Parameters :
 *    (Integer) changelog_index - Index d'un Changelog
 */
function setChangelog(changelog_index)
{
  $("changelog").value = changelogs[changelog_index].changelog;
}


/***************************************************************************************************************
 *  Function : setCredits
 * 
 *  Affiche le détail d'un crédit
 * 
 *  Parameters :
 *    (Integer) credit_index - Index d'un Crédit
 */
function setCredits(credit_index)
{
  $("credits").value = credits[credit_index].statute;
}

