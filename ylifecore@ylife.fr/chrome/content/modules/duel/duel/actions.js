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
  // Message à afficher sur mon écran
  var message_to_display = $("i18n").getString("duel.log.queryduel");
  // Type de message envoyé (duelmessage : message simple / duelaction : action pour tous /duelactionplayer : Action pour le joueur adverse)
  var type = "queryduel";
  // Encodage de l'état du duel
  var duel_encoded = "duelencoded";
  // Message à envoyer
  var message_to_send = message_to_display  + "##separator_message##"
                        + this.did + "##separator_message##"
                        + type + "##separator_message##"
                        + duel_encoded;
  // On l'envoie
  var msg = $msg({to: jid_champion, from: Jabber.account.jid, type: "duel"})
              .c("html",{xmlns: "http://jabber.org/protocol/xhtml-im"})
              .c("body",{xmlns: "http://www.w3.org/1999/xhtml"})
              .t(message_to_send);
  alert("Message :" + "\n" + message_to_display + "\n" + "\n" + "msg :" + "\n" + msg);
  // On l'affiche
  Jabber.send(msg.tree());
  this.addMessage(Jabber.vcard.nickname,message_to_display,"out");
  alert("Attente pour envoi testDuel()");
  this.testDuel(jid_champion);
}

/***************************************************************************************************************
 *  Function : testDuel
 * 
 *  Envoie une demande de Duel à un contact
 * 
 *  Parameters:
 *    (JID String) jid_champion - JID du champion (qui est sollicité pour le duel)
 */
Duel.prototype.testDuel = function (jid_champion) {
  // Message à afficher sur mon écran
  var message_to_display = "Action de test de duel";
  // Type de message envoyé (duelmessage : message simple / duelaction : action pour tous /duelactionplayer : Action pour le joueur adverse)
  var type = "duelactionplayer";
  // Encodage de l'état du duel
  var duel_encoded = "duelencoded";
  // Actions "semi-automatiques" proposées à l'adversaire
  var temp1 = 1;
  var temp2 = "Refuser";
  
  var actions = "<a onclick=\"javascript: window.parent.test('" + this.did + "','" + temp1 + "');\"> " + $("i18n").getString("duel.log.queryduel.accept") + "</a>"
                  + " - " + "<a onclick=\"javascript: window.parent.test('" + this.did + "','" + temp2 + "');\"> " + $("i18n").getString("duel.log.queryduel.reject") + "</a>";
  // Message à envoyer
  var message_to_send = message_to_display  + "##separator_message##"
                        + this.did + "##separator_message##"
                        + type + "##separator_message##"
                        + duel_encoded + "##separator_message##"
                        + actions;
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


