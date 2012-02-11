/***************************************************************************************************************
 *  File : prefs.js
 * 
 *  Fonctions de chargement et d'enregistrement des préférences de l'utilisateur
 */




/***************************************************************************************************************
 *  Object : Prefs
 * 
 *  Cet objet gère les préférences :
 */
var Prefs = {
  service : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
  /***************************************************************************************************************
   *  Function : getBool
   *
   *  Retourne une préférence de type boolean
   * 
   *  Parameters :
   *    (String) preference - Préférence
   */
  getBool : function (preference) {
    return Prefs.service.getBoolPref(preference);
  },
  /***************************************************************************************************************
   *  Function : getChar
   *
   *  Retourne une préférence de type boolean
   * 
   *  Parameters :
   *    (String) preference - Préférence
   */
  getChar : function (preference) {
    return Prefs.service.getCharPref(preference);
  },
  /***************************************************************************************************************
   *  Function : setBool
   *
   *  Enregistre une préférence de type boolean
   * 
   *  Parameters :
   *    (String) preference - Préférence
   *    (Boolean) value - true/false
   */
  setBool : function (preference,value) {
    return Prefs.service.setBoolPref(preference,value);
  },
  /***************************************************************************************************************
   *  Function : setChar
   *
   *  Enregistre une préférence de type boolean
   * 
   *  Parameters :
   *    (String) preference - Préférence
   *    (Boolean) value - true/false
   */
  setChar : function (preference,value) {
    return Prefs.service.setCharPref(preference,value);
  },
  /***************************************************************************************************************
   *  Function : getLanguage
   *
   *  Retourne la langue de l'utilisateur sous la forme d'un Language_ID de YCD
   */
  getLanguage : function () {
    var language = Prefs.service.getCharPref("general.useragent.locale");
    var result = 1;
    if (language == "fr-FR") { result = 2; }
    return result;
  }
};
