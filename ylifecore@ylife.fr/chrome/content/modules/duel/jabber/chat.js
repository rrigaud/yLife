/***************************************************************************************************************
 *  File : chat.js
 * 
 *  Gère la classe Chat
 */




/***************************************************************************************************************
 *  Class : Chat
 * 
 *  Cet classe gère les chats Jabber
 * 
 *  Parameters:
 *    (String) jid - Bare JID
 */
function Chat (jid) {
  this.jid = jid;
  this.template = null;
  /***************************************************************************************************************
   *  Function : loadTemplate
   *
   *  Charge le nom du template des préférences en mémoire
   */
  this.loadTemplate = function () {
    // Par défaut, on cherche si le template des préférences appartient à l'utilisateur, sinon c'est de yLife
    var user_template = getFolder("ProfD");
    user_template.append("data");
    user_template.append("templates");
    user_template.append("chat");
    user_template.append(Prefs.getChar("template.chat"));
    this.template = (user_template.exists()) ? "file://" + user_template.path : "chrome://ylifecore/skin/templates/chat/" + Prefs.getChar("template.chat") ;
  };
  /***************************************************************************************************************
   *  Function : addMessage
   *
   *  Ajoute un message à la conversation (entrant ou sortant)
   * 
   *  Parameters :
   *    (String) nickname - Pseudo à afficher
   *    (String) message - Texte à afficher
   *    (String) type - in/out
   */
  this.addMessage = function (nickname,msg,type) {
    // Récupération de la date
    var date =  new Date();
    var h = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var m = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var s = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    // Récupération du Message
    var message_node = $("chat_iframe_" + this.jid).contentWindow.document.getElementById("messagetoclone").cloneNode(true);
    message_node.removeAttribute("id"); 
    var serializer = new XMLSerializer();
    var message = serializer.serializeToString(message_node);
    message = message.replace("{type}",type);
    message = message.replace("{nickname}",nickname);
    message = message.replace("{message}",msg);
    message = message.replace("{h}",h);
    message = message.replace("{m}",m);
    message = message.replace("{s}",s);
    var parser = new DOMParser ();
    var message_dom = parser.parseFromString (message, "text/xml").documentElement;
    // Ajout du message
    $("chat_iframe_" + this.jid).contentWindow.document.getElementById("messages").appendChild(message_dom);
    $("chat_iframe_" + this.jid).contentWindow.location = this.template + "#bottom";
  };
  /***************************************************************************************************************
   *  Function : sendMessage
   *
   *  Envoie le message tapé au correspondant
   */
  this.sendMessage = function () {
    // On récupère le message dans le bon textbox
    var message = $("chat_message_out_" + this.jid).value;
    // On l'envoie
    var msg = $msg({to: this.jid, from: Jabber.account.jid, type: "chat"}).c("body").t(message);
    Jabber.send(msg.tree());
    this.addMessage(Jabber.vcard.nickname,message,"out");
    $("chat_message_out_" + jid).value = "";
    $("chat_message_out_" + jid).focus();
  };
  /***************************************************************************************************************
   *  Function : onKeydown
   *
   *  Si appui sur le touche "Entrée", alors on envoie le message
   */
  this.onKeydown = function (event) {
    if (event.keyCode == event.DOM_VK_RETURN) {
      this.sendMessage();
      event.stopPropagation();
    }
  };
}

