/***************************************************************************************************************
 *  File : actions.js
 * 
 *  Extension de la classe Duel : Gère les actions de jeu (tout ce qui apparaitra dans le duel_iframe)
 * 
 *  Chaque message envoyé contient toutes les variables du duel, en plus du message et d'éventuelles actions.
 *  Il est de la forme :
 * 
 *  Messageàenvoyeraudestinataire##separator_message##did##separator_message##type##separator_message##duel_encoded
 * 
 *  où type peut être :
 *    simplemessage : Message simple (envoyé par l'utilisateur)
 *    queryduel : Demande de duel (action spécifique)
 *    duelmessage : Message de duel (envoyé par le jeu)
 *    duelaction : Message de duel + Action possible pour tous (player et guest)
 *    duelactionplayer : Message de duel + Action possible pour player uniquement
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
  // Type de message envoyé
  var type = "queryduel";
  // Encodage de l'état du duel
  var duel_encoded = this.getCode();
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
  Jabber.send(msg.tree());
}

/***************************************************************************************************************
 *  Function : acceptDuel
 * 
 *  Accepte la demande de Duel d'un contact
 */
Duel.prototype.acceptDuel = function () {
  // Message à afficher sur mon écran
  var message_to_display = $("i18n").getString("duel.log.acceptduel");
  // Type de message envoyé
  var type = "duelmessage";
  // On envoie l'action
  this.sendAction(message_to_display,type,"");
}

/***************************************************************************************************************
 *  Function : rejectDuel
 * 
 *  Refuse la demande de Duel d'un contact
 */
Duel.prototype.rejectDuel = function () {
  // Message à afficher sur mon écran
  var message_to_display = $("i18n").getString("duel.log.rejectduel");
  // Type de message envoyé
  var type = "duelmessage";
  // On envoie l'action
  this.sendAction(message_to_display,type,"");
}








/***************************************************************************************************************
 *  Function : showHandMe // MODELE COMPLET à utiliser (msg + type + actions)
 * 
 *  Accepte la demande de Duel d'un contact
 * 
 *  Parameters:
 *    (JID String) jid_challenger - JID du jid_challenger (qui a sollicité le duel)
 */
Duel.prototype.showHandMe = function (jid_challenger) {
  // Message à afficher sur mon écran
  var message_to_display = $("i18n").getString("duel.log.acceptduel");
  // Type de message envoyé
  var type = "duelmessage";
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


