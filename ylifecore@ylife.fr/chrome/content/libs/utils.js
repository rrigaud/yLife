/***************************************************************************************************************
 *  File : utils.js
 * 
 *  Fonctions utiles (principalement de substitutions)
 */




/***************************************************************************************************************
 *  Function : $
 * 
 *  Remplace "document.getElementById(element)" pour plus de clarté...
 */
function $() {
  var elements = new Array();

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);

    if (arguments.length == 1)
      return element;

    elements.push(element);
  }

  return elements;
}


/***************************************************************************************************************
 *  Function : getDate
 * 
 *  Retourne une date au format AAAA-MM-JJ
 */
function getDate () {
  var date = new Date();
  var date_month = parseInt(date.getMonth())+1;
  if (date_month < 10) { date_month = "0" + date_month; }
  var date_day = date.getDate();
  if (date_day < 10) { date_day = "0" + date_day; }
  return date.getFullYear() + "-" + date_month + "-" + date_day;
}



/***************************************************************************************************************
 *  Function : getFolder
 * 
 *  Retourne un Dossier sous la forme d'une nsILocalFile
 * 
 *  Parameters :
 *    (String) folder - Dossier spécial de XulRunner ou d'une extensions : ProfD,...
 */
function getFolder (folder) {
  return Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get(folder, Components.interfaces.nsILocalFile);
}



/***************************************************************************************************************
 *  Function : getFolderContent
 * 
 *  Retourne un tableau de nsILocalFile contenus dans un répertoire
 * 
 *  Parameters :
 *    (nsIFile) file - Répertoire à explorer
 *    (String) type - "folders" si on veut des dossiers
 */
function getFolderContent (file, type) {
  var entries = file.directoryEntries;
  var files = [];
  var folders = [];
  while(entries.hasMoreElements()) {
    var entry = entries.getNext();
    entry.QueryInterface(Components.interfaces.nsIFile);
    if (entry.isDirectory()) { folders.push(entry); }
    else { files.push(entry); }
  }
  if (type == "folders") { var result = folders; }
  else {  var result = files; }
  return result;
}


/***************************************************************************************************************
 *  Function : arrayRemove
 * 
 *  Retourne un tableau débarassé d'un élément dont on connait l'index (Integer ou String)
 * 
 *  Parameters :
 *    (Array) array - Tableau à modifier
 *    (String) index - Index à supprimer (integer/string)
 */
function arrayRemove (array,index) {
  var new_array=[];
  for (var i in array) {
    if (i!=index)
      new_array[i]=array[i];
  }
  return new_array;
}


/***************************************************************************************************************
 *  Function : arrayDel
 * 
 *  Retourne un tableau débarassé d'un élément connu (Integer ou String)
 * 
 *  Parameters :
 *    (Array) array - Tableau à modifier
 *    (String) element - Element à supprimer (integer/string)
 */
function arrayDel (array,element) {
  var new_array=[];
  for (var i in array) {
    if (array[i] != element)
      new_array[i]=array[i];
  }
  return new_array;
}


/***************************************************************************************************************
 *  Function : clearListbox
 * 
 *  Supprime tous les items d'un listbox/richlistbox donné
 * 
 *  Parameters :
 *    (String) element - Nom du listbox à vider
 */
function clearListbox (element) {
  var i_max = $(element).getRowCount();
  for (var i = 0 ; i < i_max ; i++) { $(element).removeItemAt(0); }
}


/***************************************************************************************************************
 *  Function : randomString
 * 
 *  Retourne une chaine aléatoire de caractères
 * 
 *  Parameters :
 *    (Integer) length - Longueur de la chaine aléatoire voulue
 */
function randomString (length) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var randomstring = '';
  for (var i = 0 ; i < length ; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}

