/***************************************************************************************************************
 *  File : sqlite.js
 * 
 *  Gère la classe Sqlite (connexions à des Bases de données Sqlite3)
 */




/***************************************************************************************************************
 *  Class : Sqlite
 * 
 *  Gère la classe Sqlite (connexions à des Bases de données Sqlite3)
 * 
 *  Parameters:
 *    (nsIFile) file - Fichier Sqlite3
 */
function Sqlite (file) {
  this.file = file;
  /***************************************************************************************************************
   *  Function : getConnection
   *
   *  Retourne la connexion à la base de données
   */
  this.getConnection = function () {
    var storageService = Components.classes["@mozilla.org/storage/service;1"].getService(Components.interfaces.mozIStorageService);
    var connection = storageService.openDatabase(this.file);
    return connection;
  };
  /***************************************************************************************************************
   *  Function : query
   *
   *  Retourne le résultat d'une requête
   * 
   *  Parameters :
   *    (String) query - Requête SQL
   */
  this.query = function (query) {
    var statement = this.getConnection().createStatement(query);
    return statement;
  };
  /***************************************************************************************************************
   *  Function : update
   *
   *  Exécute une requête sans résultat attendu (To DO : Ajouter un historique des requêtes)
   * 
   *  Parameters :
   *    (String) query - Requête SQL
   */
  this.update = function (query) {
    try {
      var statement = this.getConnection().createStatement(query);
      statement.execute();
    }
    catch (e) { alert("Erreur SQL :\n \n" + e); }
  };
  /***************************************************************************************************************
   *  Function : getNextID
   *
   *  Retourne l'ID suivant d'un champ dans une table donnée
   * 
   *  Parameters :
   *    (String) row - Champ
   *    (String) table - Table
   */
  this.getNextID = function (row,table) {
    var ID = 0;
    var data = this.query("SELECT max("+row+") as max FROM "+table+"");
    while (data.executeStep()) {
      ID = data.getInt32(0);
    }
    data.reset();
    ID++;
    return ID;
  };
}


