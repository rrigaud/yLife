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
  // Type de message envoyé (duelmessage : message simple / duelaction : action pour tous /duelactionplayer : Action pour le joueur adverse)
  var type = "duelactionplayer";
  var datastring = this.did + "#type#" + type;
  var message_to_display = $("i18n").getString("duel.log.queryduel");
  var actions = "<a onclick='javascript: window.parent.test(" + this.did + ",\"Accepter\");'> " + $("i18n").getString("duel.log.queryduel.accept") + "</a>"
                  + " - " + "<a onclick='javascript: window.parent.Tabs.tabs[Tabs.getDuel(" + this.did+ ").id].content.synctest(\"Refuser\");'> " + $("i18n").getString("duel.log.queryduel.reject") + "</a>";
  var message_to_send = datastring + "#msg#" + message_to_display + "<br />" + actions;
  // On l'envoie
  var msg = $msg({to: jid_champion, from: Jabber.account.jid, type: "duel"})
              .c("html",{xmlns: "http://jabber.org/protocol/xhtml-im"})
              .c("body",{xmlns: "http://www.w3.org/1999/xhtml"})
              .t(message_to_send);
  alert("Message :" + "\n" + message_to_display + "\n" + "\n" + "msg :" + "\n" + msg);
  // On l'affiche
  Jabber.send(msg.tree());
  this.addMessage(Jabber.vcard.nickname,message_to_display,"out");
}


