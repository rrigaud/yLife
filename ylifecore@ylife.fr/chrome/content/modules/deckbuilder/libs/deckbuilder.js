/***************************************************************************************************************
 *  File : deckbuilder.js
 * 
 *  Charge les fichiers nécessaires au module
 */




/***************************************************************************************************************
 *  Chargement des fonctions nécessaires pour yLife
 */
var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://ylifecore/content/libs/utils.js");
loader.loadSubScript("chrome://ylifecore/content/libs/addons.js");
loader.loadSubScript("chrome://ylifecore/content/libs/sqlite.js");
loader.loadSubScript("chrome://ylifecore/content/modules/preferences/libs/prefs.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/ycd.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/env.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/card.js");
loader.loadSubScript("chrome://ylifecore/content/modules/ycd/utils.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/deck.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/module.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/interface.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/actions.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/filter.js");
loader.loadSubScript("chrome://ylifecore/content/modules/deckbuilder/libs/dragdrop.js");



/***************************************************************************************************************
 *  Chargement de l'API pour les addons
 */
Components.utils.import("resource://gre/modules/AddonManager.jsm");




/***************************************************************************************************************
 *  Function : onload
 * 
 *  Initialise la fenêtre de Decks
 */
window.onload = function () {
  Deckbuilder.load();
}






