/***************************************************************************************************************
 *  File : ycd.js
 * 
 *  Gère la classe Ycd
 */




/***************************************************************************************************************
 *  Class : Ycd
 * 
 *  Cette classe gère une base de données YCD
 * 
 *  Parameters:
 *    (nsIFile) file - Fichier Sqlite3
 */
function Ycd (file) {
  this.db = new Sqlite (file);
  /***************************************************************************************************************
   *  Array : isReprint
   *
   *  (Boolean) Est-ce une réédition ? Ou bien la première édition ?
   * 
   *  Tableau statique (performances) de réédition (ycd.isReprint[card_id] = true/false)
   */
  this.isReprint = [];
  /***************************************************************************************************************
   *  Function : getCard
   *
   *  Retourne un objet Card
   * 
   *  Parameters :
   *    (Integer) card_id - ID d'une carte Yugioh
   */
  this.getCard = function (card_id) {
    var card = new Card (this,card_id);
    return card;
  };
  /***************************************************************************************************************
   *  Function : getEnv
   *
   *  Retourne un objet Env (Environnement des cartes, dans une certaine langue)
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getEnv = function (language_id) {
    var env = new Env (this,language_id);
    return env;
  };
  /***************************************************************************************************************
   *  Function : getCountriesBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getCountriesBy = function (order) {
    var results = new Array();
    var data = this.db.query("SELECT Country_ID, Name FROM country ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getCountry
   *
   *  Retourne le nom du pays
   * 
   *  Parameters :
   *    (Integer) country_id - ID d'un pays
   */
  this.getCountry = function (country_id) {
    var result = null;
    var data = this.db.query("SELECT Name FROM country WHERE Country_ID='"+country_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getLanguagesBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getLanguagesBy = function (order) {
    var results = new Array();
    var data = this.db.query("SELECT Language_ID, Name FROM language ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getLanguage
   *
   *  Retourne le nom de la langue
   * 
   *  Parameters :
   *    (Integer) language_id - ID d'une langue
   */
  this.getLanguage = function (language_id) {
    var result = null;
    var data = this.db.query("SELECT Name FROM language WHERE Language_ID='"+language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getExtensionsBy
   *
   *  Retourne un tableau de {id,country_id,language_id,model_id,name,reference,release_date} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getExtensionsBy = function (order) {
    var results = new Array();
    var data = this.db.query("SELECT Extension_ID, Country_ID, Language_ID, Model_ID, Name, Reference, Release_Date FROM extensions ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),
                    "country_id": data.getInt32(1),
                    "language_id": data.getInt32(2),
                    "model_id": data.getInt32(3),
                    "name" : data.getString(4),
                    "reference": data.getString(5),
                    "release_date": data.getString(6)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getExtension
   *
   *  Retourne une extension {country_id,language_id,model_id,name,reference,release_date}
   * 
   *  Parameters :
   *    (Integer) extension_id - ID d'une extension
   */
  this.getExtension = function (extension_id) {
    var result = null;
    var data = this.db.query("SELECT Country_ID, Language_ID, Model_ID, Name, Reference, Release_Date FROM extensions WHERE Extension_ID='"+extension_id+"'");
    while (data.executeStep()) {
      result = {"country_id": data.getInt32(0),
                "language_id": data.getInt32(1),
                "model_id": data.getInt32(2),
                "name" : data.getString(3),
                "reference": data.getString(4),
                "release_date": data.getString(5)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : imageExists
   *
   *  Retourne true si l'image /extension/reference.jpg de la carte existe
   * 
   *  Parameters :
   *    (Integer) extension_id - ID d'une extension
   */
  this.imageExists = function (extension,reference) {
    var image = Addons.getImagepack();
    image.append(extension);
    image.append(reference + ".jpg");
    //alert(Addons.getImagepack().path + "\n" + extension + "\n" + reference + ".jpg" + "\n" + image.path);
    return image.exists();
  };
  /***************************************************************************************************************
   *  Function : loadReprintInfos
   *
   *  Rempli le tableau statique isReprint[card_id] de boolean (true pour une réédition, false sinon)
   */
  this.loadReprintInfos = function () {
    this.isReprint = [];
    var query = "SELECT cards.Card_ID as Card_ID, cards.ID_Card as ID_Card FROM cards LEFT JOIN extensions USING(Extension_ID) ORDER BY cards.ID_Card ASC, extensions.Release_Date ASC";
    var ID_Card_previous = 0;
    var data = this.db.query(query);
    while (data.executeStep()) {
      // Si c'est une réédition (même ID_Card que la précédente, mais plus "jeune")
      if (data.getInt32(1) == ID_Card_previous) { this.isReprint[data.getInt32(0)] = true; }
      else { this.isReprint[data.getInt32(0)] = false; }
      ID_Card_previous = data.getInt32(1);
    }
    data.reset();
  };
  /***************************************************************************************************************
   *  Function : getInformations
   *
   *  Retourne un tableau de info[subject] contenant l'information
   */
  this.getInformations = function () {
    var results = new Array();
    var data = this.db.query("SELECT Subject, Content FROM information ORDER BY Info_ID");
    while (data.executeStep()) {
      results[data.getString(0)] = data.getString(1);
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getChangelogs
   *
   *  Retourne un tableau de changelogs
   */
  this.getChangelogs = function () {
    var results = new Array();
    var data = this.db.query("SELECT History_ID, Updated, Changelog, Name, Nick FROM history LEFT JOIN team USING(Team_ID) ORDER BY Updated DESC");
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),
                    "date": data.getString(1),
                    "changelog": data.getString(2),
                    "name": data.getString(3),
                    "nickname" : data.getString(4)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getCredits
   *
   *  Retourne un tableau de credits
   */
  this.getCredits = function () {
    var results = new Array();
    var data = this.db.query("SELECT Team_ID, Name, Nick, Country_ID, Statute, State, Email FROM team ORDER BY Team_ID ASC");
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),
                    "name": data.getString(1),
                    "nickname": data.getString(2),
                    "country_id": data.getInt32(3),
                    "statute": data.getString(4),
                    "state" : data.getString(5),
                    "email" : data.getString(6)});
    }
    data.reset();
    return results;
  };
}
