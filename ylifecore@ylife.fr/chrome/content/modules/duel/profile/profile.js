/***************************************************************************************************************
 *  File : profile.js
 * 
 *  Charge les fichiers nécessaires au module
 */




/***************************************************************************************************************
 *  Chargement des fonctions nécessaires pour yLife
 */
var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
loader.loadSubScript("chrome://ylifecore/content/libs/utils.js");

/***************************************************************************************************************
 *  Informations transmises à la fenêtre
 */
var infos = window.arguments[0];



/***************************************************************************************************************
 *  Function : onload
 * 
 *  Initialise la fenêtre de Profil
 */
window.onload = function()
{
  if (infos.isOccupant) {
    $("occupant").collapsed = false;
    $("occupant_oid").value = infos.Occupant.oid;
    $("occupant_status").value = infos.Occupant.status;
    $("occupant_affiliation").value = $("i18n").getString("affiliation." + infos.Occupant.affiliation);
    $("occupant_role").value = $("i18n").getString("role." + infos.Occupant.role);
    $("avatar").setAttribute('avatar_img', infos.Occupant.avatar);
    $("avatar").setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + infos.Occupant.show + ".png");
  }
  if (infos.isContact) {
    $("contact").collapsed = false;
    $("contact_jid").value = infos.Contact.jid;
    $("contact_resource").value = infos.Contact.resource;
    $("contact_subscription").value = $("i18n").getString("subscription." + infos.Contact.subscription);
    $("contact_status").value = infos.Contact.status;
    $("avatar").setAttribute('avatar_img', infos.Contact.avatar);
    $("avatar").setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + infos.Contact.show + ".png");
  }
}


