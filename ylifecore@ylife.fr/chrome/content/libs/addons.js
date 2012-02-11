/***************************************************************************************************************
 *  File : addons.js
 * 
 *  Gère les accès immédiat aux addons
 */




/***************************************************************************************************************
 *  Object : Addons
 * 
 *  Cet objet gère les accès immédiat aux addons
 */
var Addons = {
  ylifecore : null,
  ycd : null,
  ycd_file : null,
  imagepack_hd : null,
  imagepack_hd_folder : null,
  /***************************************************************************************************************
   *  Function : load
   *
   *  Charge l'accès aux addons de manière asynchrone
  */
  load : function () {
    AddonManager.getAddonByID("ylifecore@ylife.fr", function(addon) {
      Addons.ylifecore = addon;
    });
    AddonManager.getAddonByID("ycd@ylife.fr", function(addon) {
      Addons.ycd = addon;
      var file = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
      file.append("chrome");
      file.append("content");
      file.append("database.ycd");
      Addons.ycd_file = file;
    });
    AddonManager.getAddonByID("imagepack-hd@ylife.fr", function(addon) {
      Addons.imagepack_hd = addon;
      var folder = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
      folder.append("chrome");
      folder.append("content");
      Addons.imagepack_hd_folder = folder;
    });
  },
  /***************************************************************************************************************
   *  Function : getImagepack
   *
   *  Retourne le nsIFile du dossier des images
  */
  getImagepack : function () {
    var folder = Addons.imagepack_hd.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
    folder.append("chrome");
    folder.append("content");
    return folder;
  }
};

