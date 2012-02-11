/***************************************************************************************************************
 *  File : module.js
 * 
 *  Gère le module Deckbuilder
 */




/***************************************************************************************************************
 *  Object : Deckbuilder
 * 
 *  Cet objet gère le module Deckbuilder
 */
var Deckbuilder = {
  ycd : {},
  deck : {},
  deck_template : Prefs.getChar("template.deck"),
  deck_not_saved : false,
  card : {},
  card_tab : "tab_card",
  /***************************************************************************************************************
   *  Function : load
   *
   *  Charge les Imagepacks et YCD, puis lance l'initialisation
   */
  load : function () {
    AddonManager.getAddonByID("imagepack-hd@ylife.fr", function(addon) {
      Addons.imagepack_hd = addon;
      AddonManager.getAddonByID("ycd@ylife.fr", function(addon) {
        Addons.ycd = addon;
        var file = addon.getResourceURI("").QueryInterface(Components.interfaces.nsIFileURL).file;
        file.append("chrome");
        file.append("content");
        file.append("database.ycd");
        Addons.ycd_file = file;
        Deckbuilder.ycd = new Ycd (Addons.ycd_file);
        Deckbuilder.ycd.loadReprintInfos();
        window.top.Notifs.add({"type": "deckbuilder_ycd_loaded", "top": false, "timer": true, "time": 4000});
        Deckbuilder.init();
        Deckbuilder.loadLastDecks();
        Deckbuilder.newDeck();
      });
    });
  }
};

