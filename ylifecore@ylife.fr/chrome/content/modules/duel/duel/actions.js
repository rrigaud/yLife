/***************************************************************************************************************
 *  File : actions.js
 * 
 *  Extension de la classe Duel : Gère les actions de jeu (tout ce qui apparaitra dans le duel_iframe)
 */




/***************************************************************************************************************
 *  Function : queryDuel
 * 
 *  Envoie une demande de Duel à un contact
 * 
 *  Parameters:
 *    (JID String) jid_champion - JID du champion (qui est sollicité pour le duel)
 */
Duel.prototype.queryDuel = function (jid_champion) {
  // On récupère le message dans la bonne langue
  var message = "<p>" + $("i18n").getString("duel.log.queryduel")
                  + "<br />" + "<a onclick='javascript: 'alert('Accepter');'> " + $("i18n").getString("duel.log.queryduel.accept") + "</a>"
                  + " - " + "<a onclick='javascript: 'alert('Refuser');'> " + $("i18n").getString("duel.log.queryduel.reject") + "</a></p>";
  // On l'envoie
  var msg = $msg({to: jid_champion, from: Jabber.account.jid, type: "duel"})
              .c("html",{xmlns: "http://jabber.org/protocol/xhtml-im"})
              .c("body",{xmlns: "http://www.w3.org/1999/xhtml"})
              .t(message);
  Jabber.send(msg.tree());
  this.addMessage(message,"out");
}


