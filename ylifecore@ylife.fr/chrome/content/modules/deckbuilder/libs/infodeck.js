/***************************************************************************************************************
 *  File : infodeck.js
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
  $("name").value = infos.name;
  $("created").value = infos.created;
  $("updated").value = infos.updated;
  $("notes").value = infos.notes;
  $("format").appendItem("No Limit",0);
  $("format").selectedIndex = "0";
  var i_max = infos.formats.length;
  for (var i = 0 ; i < i_max ; i++) {
    $("format").appendItem(infos.formats[i].name,infos.formats[i].id);
    if (infos.formats[i].id == infos.format_id) { $("format").selectedIndex = i + 1; }
  }
  $("notes").focus();
}
/***************************************************************************************************************
 *  Function : save
 * 
 *  Enregistre les informations (format, notes)
 */
function save () {
  infos.update = true;
  infos.format_id = $("format").selectedItem.getAttribute('value');
  infos.notes = $("notes").value;
  return true;
}

