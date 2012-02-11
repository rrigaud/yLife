/***************************************************************************************************************
 *  File : yLife.js
 * 
 *  Gère le premier lancement de yLife et installe les addons pré-installés
 */




/***************************************************************************************************************
 *  Function : window.onload
 * 
 *  Initialise les addons à l'ouverture
 */
window.onload = function()
{
  // Si c'est le 1er lancement, il faut installer les Extensions par défaut
  if (isFirstLaunch())
    window.open('chrome://ylife/content/install_addons.xul','install_addons','chrome,centerscreen');
}


/***************************************************************************************************************
 *  Function : isFirstLaunch
 * 
 *  Retourne true si c'est le premier lancement de yLife
 */
function isFirstLaunch()
{
  var result = true;
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  if (prefs.getBoolPref("ylife.first.launch"))
  {
    prefs.setBoolPref("ylife.first.launch", false);
  }
  else result = false;
  return result;
}
