/***************************************************************************************************************
 *  File : sync.js
 * 
 *  Extension de la classe Duel : Gère la synchronisation du Duel après réception d'une action adverse
 */




/***************************************************************************************************************
 *  Function : sync
 * 
 *  A partir d'une action adverse reçue par Jabber, on synchronise l'état du Duel (MAJ des tableaux,...)
 *  Rem : Obligé d'avoir des String en paramètres, car pour éviter un Bug, on doit mettre un SetTimeOut sur sync() parfois...
 *        Si possible, voir si on peut juste passer le (DOM Object) msg reçu à cette fonction en modifiant "handlers.js"
 * 
 *  Parameters:
 *    (String) jid - JID de l'éxpéditeur
 *    (String) datastring - Données du duel sous forme d'une chaine de caractère codée/concaténée
 *    (String) msg - Message sous forme de tree DOM
 *    (String) msg_type - Type de message (in/neutral pour la mise en forme du texte)
 */
Duel.prototype.sync = function (jid,datastring,msg,msg_type) {
  alert("SYNC !");
  var contact = Contacts.get(jid);
  // On synchronise le Duel à l'aide des nouvelles données de "datastring"
  
  
  
  // S'il y a un message à afficher, on l'affiche
  if (msg != "") { this.addMessage(contact.nickname,msg,msg_type); }
}





Duel.prototype.synctest = function (text) {
  alert("SYNCTEST Yeah : " + text + " / DID : " + this.did);
}
