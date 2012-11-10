/***************************************************************************************************************
 *  File : sync.js
 * 
 *  Extension de la classe Duel : Gère la synchronisation du Duel après réception d'une action adverse
 */




/***************************************************************************************************************
 *  Function : sync
 * 
 *  A partir d'un message encodé reçue par Jabber, on synchronise l'état du Duel (MAJ des tableaux,...)
 * 
 *  Parameters:
 *    (String) duel_encoded - Duel encodé pour passer le serveur Jabber avec BOSH
 */
Duel.prototype.sync = function (duel_encoded) {
  alert("SYNC : " + duel_encoded);
}





Duel.prototype.synctest = function (text) {
  alert("SYNCTEST Yeah : " + text + " / DID : " + this.did);
}
