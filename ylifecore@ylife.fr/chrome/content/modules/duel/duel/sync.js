/***************************************************************************************************************
 *  File : sync.js
 * 
 *  Extension de la classe Duel : Gère la synchronisation du Duel après réception d'une action adverse
 */




/***************************************************************************************************************
 *  Function : sync
 * 
 *  A partir d'une action adverse reçue par Jabber, on synchronise l'état du Duel (MAJ des tableaux,...)
 * 
 *  Parameters:
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Duel.prototype.sync = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  var contact = Contacts.get(jid);
  var elems = msg.getElementsByTagName('body');
  if (elems.length > 0) {
    var body = elems[0];
    var tab = Tabs.getChat(contact.jid);
    var nickname = contact.nickname;
    // Si l'onglet vient d'être créé, il faut un laps de temps pour que l'interface soit finie sinon bug...
    if (tab.isNew) { setTimeout("Tabs.tabs[" + tab.id + "].content.addMessage('" + nickname + "','" + Strophe.getText(body) + "','in')",1000); }
    // Sinon, on ajoute le message immédiatement
    else { Tabs.tabs[tab.id].content.addMessage(nickname,Strophe.getText(body),"in"); }
    Notifs.add({"type": "jabber_chat_message", "contact": nickname + " :", "top": false, "timer": true, "time": 2000});
    if ($("tabs").selectedItem != $("tab_" + tab.id)) { Tabs.tabs[tab.id].newMessage(true); }
  }
}


