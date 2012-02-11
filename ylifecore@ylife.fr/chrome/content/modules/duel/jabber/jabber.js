/***************************************************************************************************************
 *  File : jabber.js
 * 
 *  Gère le compte Jabber de l'utilisateur et la connexion au serveur
 */




/***************************************************************************************************************
 *  Object : Jabber
 * 
 *  Cet objet gère le compte et la connexion au réseau Jabber : Compte, Présence, vCard,...
 */
var Jabber = {
  connection : null,
  connected : false,
  bosh_service : "http://bosh.metajack.im:5280/xmpp-httpbind", // Adresse BOSH indispensable (en attendant une autre)
  /***************************************************************************************************************
   *  String : avatar_default
   *
   *  Avatar par défaut
   */
  avatar_default : "chrome://ylifecore/skin/avatars/default.jpg",
  /***************************************************************************************************************
   *  Object : account
   *
   *    (String) jid - Full JID : barejid/resource
   *    (String) pwd - Mot de passe du compte
   */
  account : {jid:"", pwd:""},
  /***************************************************************************************************************
   *  Object : presence
   *
   *    (String) resource - En général, le nom du logiciel qui maintient la connexion (ici, yLife)
   *    (String) show - Etat de la présence : available / dnd / away / xa
   *    (String) status - Phrase d'humeur : "Prêt pour un duel..."
   * 
   */
  presence : {resource:"yLife", show:"", status:""},
  /***************************************************************************************************************
   *  Object : vcard
   *
   *    (String) nickname - Pseudonyme
   *    (String) avatar - Adresse chrome vers l'avatar (image)
   *    (String) avatar_binval - Binval de l'image (Base64-encoded-avatar-file)
   *    (String) avatar_type - Type d'image (ex : image/jpeg)
   */
  vcard : {nickname:"", avatar:"", avatar_binval:"", avatar_type:""},
  /***************************************************************************************************************
   *  Array : nicknames_id
   *
   *    (String) ID des labels nickname créés un peu partout dans l'interface (home, chat, duel)
   * 
   *    Permet de les mettre tous à jour sur un changement de presence ou de vcard
   */
  nicknames_id : [],
  /***************************************************************************************************************
   *  Function : refreshMyNicknames
   *
   *  Met à jour l'affichage de tous mes nicknames (home,...)
   */
  refreshMyNicknames : function () {
    for (var i = 0 ; i < Jabber.nicknames_id.length ; i++) {
      $(Jabber.nicknames_id[i]).value = Jabber.vcard.nickname;
    }
  },
  /***************************************************************************************************************
   *  Array : avatars_id
   *
   *    (String) ID des box avatars créés un peu partout dans l'interface (home, chat, duel)
   * 
   *    Permet de les mettre tous à jour sur un changement de presence ou de vcard
   */
  avatars_id : [],
  /***************************************************************************************************************
   *  Function : refreshMyAvatars
   *
   *  Met à jour l'affichage de tous mes avatars (home, chat, duel)
   */
  refreshMyAvatars : function () {
    for (var i = 0 ; i < Jabber.avatars_id.length ; i++) {
      $(Jabber.avatars_id[i]).setAttribute('avatar_img', Jabber.vcard.avatar);
      $(Jabber.avatars_id[i]).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + Jabber.presence.show + ".png");
    }
  },
  /***************************************************************************************************************
   *  Function : addNamespaces
   *
   *    Ajoute des Namespaces à l'objet Strophe
   */
  addNamespaces : function () {
    Strophe.addNamespace("VCARD","vcard-temp");
    Strophe.addNamespace("VCARD_UPDATE","vcard-temp:x:update");
    Strophe.addNamespace("MUC_USER","http://jabber.org/protocol/muc#user");
    Strophe.addNamespace("YLIFE","http://ylife.sourceforge.net");
    Strophe.addNamespace("XHTML","http://www.w3.org/1999/xhtml");
  },
  /***************************************************************************************************************
   *  Function : addHandlers
   *
   *    Ajoute des Handlers pour scruter tous les évènements reçus
   */
  addHandlers : function () {
    Jabber.connection.addHandler(Jabber.onRoster, Strophe.NS.ROSTER, null, null, null,  null); 
    Jabber.connection.addHandler(Jabber.onVcard, Strophe.NS.VCARD, null, null, null,  null); 
    Jabber.connection.addHandler(Jabber.onPresence, null, "presence", null, null,  null);
    Jabber.connection.addHandler(Jabber.onPresenceUnavailable, null, "presence", "unavailable", null,  null);
    Jabber.connection.addHandler(Jabber.onSubscribe, null, "presence", "subscribe", null,  null);
    Jabber.connection.addHandler(Jabber.onSubscribed, null, "presence", "subscribed", null,  null);
    Jabber.connection.addHandler(Jabber.onUnsubscribed, null, "presence", "unsubscribed", null,  null);
    Jabber.connection.addHandler(Jabber.onUnsubscribe, null, "presence", "unsubscribe", null,  null);
    Jabber.connection.addHandler(Jabber.onMessage, null, "message", "chat", null,  null); 
    Jabber.connection.addHandler(Jabber.onDuel, Strophe.NS.YLIFE, "message", "duel", null,  null); 
    Jabber.connection.addHandler(Jabber.onMucMessage, null, "message", "groupchat", null,  null); 
    Jabber.connection.addHandler(Jabber.onMucPresence, Strophe.NS.MUC_USER, "presence", null, null,  null);
    Jabber.connection.addHandler(Jabber.onMucPresenceError, Strophe.NS.MUC, "presence", "error", null,  null);
    Jabber.connection.addHandler(Jabber.onMucPresenceUnavailable, Strophe.NS.MUC_USER, "presence", "unavailable", null,  null);
  },
  /***************************************************************************************************************
   *  Function : load
   *
   *  Charge le compte Jabber contenu dans les préférences
   */
  load : function () {
    Jabber.account.jid = Prefs.getChar("jabber.jid") + "/" + Jabber.presence.resource;
    Jabber.account.pwd = Prefs.getChar("jabber.pwd");
    Jabber.vcard.nickname = Strophe.getNodeFromJid(Jabber.account.jid);
    Jabber.nicknames_id = [];
    Jabber.nicknames_id.push("nickname_home");
    Jabber.vcard.avatar = Jabber.avatar_default;
    Jabber.avatars_id = [];
    Jabber.avatars_id.push("avatar_home");
    Jabber.presence.show = "unavailable";
    Jabber.presence.status = Prefs.getChar("jabber.status");
  },
  /***************************************************************************************************************
   *  Function : connect
   *
   *  Initialise Strophe.js et lance une connexion au réseau Jabber (Callback : Jabber.onConnectionUpdate)
   */
  connect : function () {
    Jabber.load();
    Jabber.connection = new Strophe.Connection(Jabber.bosh_service);
    if (Prefs.getBool("debug.jabber")) {
      Jabber.connection.rawInput = function (data) { $("debug_jabber").value += "\n -------------------------- \n" + " RECV : " + data; };
      Jabber.connection.rawOutput = function (data) { $("debug_jabber").value += "\n -------------------------- \n" + " SEND : " + data; };
    }
    Jabber.connection.connect(Jabber.account.jid,Jabber.account.pwd,Jabber.onConnectionUpdate);
    Jabber.refreshMyNicknames();
  },
  /***************************************************************************************************************
   *  Function : disconnect
   *
   *  Déconnexion du réseau Jabber
   */
  disconnect : function () {
    var presence = $pres({type: "unavailable"});
    var quit_message = $("i18n").getString("quit.message");
    presence.c("status").t(quit_message).up();
    Jabber.send(presence.tree());
    for (jid in Contacts.contacts) {
      Contacts.contacts[jid].available = false;
      Contacts.contacts[jid].show = "unavailable";
    }
    Contacts.buildContactlist();
    // Pour chaque salon, on envoie un message de déconnexion
    var occupants = Tabs.getOccupantsMucOf(Strophe.getBareJidFromJid(Jabber.account.jid));
    for (var i = 0 ; i < occupants.length ; i++) {
      var presence = $build("presence",{from: Jabber.account.jid, to: occupants[i].oid, type: "unavailable"});
      Jabber.send(presence.tree());
    }
    setTimeout("Jabber.connection.disconnect()",2000);
  },
  /***************************************************************************************************************
   *  Function : send
   *
   *  Envoie un message
   * 
   *  Parameters :
   *    (DOM Tree Object) msg - Message sous forme de tree DOM
   */
  send : function (msg) {
    Jabber.connection.send(msg);
  },
  /***************************************************************************************************************
   *  Function : getRoster
   *
   *  Récupère le Roster
   */
  getRoster : function () {
    var iq = $iq({from: Jabber.account.jid, type: "get"}).c("query", {xmlns: Strophe.NS.ROSTER});
    Jabber.send(iq.tree());
  },
  /***************************************************************************************************************
   *  Function : getVcard
   *
   *  Récupère ma vCard
   */
  getVcard : function () {
    var jid = Strophe.getBareJidFromJid(Jabber.account.jid);
    var iq = $iq({to: jid, type: "get"}).c("vCard", {xmlns: Strophe.NS.VCARD});
    Jabber.send(iq.tree());
  },
  /***************************************************************************************************************
   *  Function : onConnectionUpdate
   *
   *  Callback appelée lors d'un changement d'état dans la connexion au réseau
   * 
   *  Parameters :
   *    (Constant) status - Status.ERROR / Status.CONNECTING / ...
   */
  onConnectionUpdate : function (status) {
    if (status == Strophe.Status.ERROR) {
      Jabber.connected = false;
      Notifs.add({"type": "jabber_error", "top": true, "timer": true, "time": 4000});
      $("jabber_connect").collapsed = false;
      $("jabber_disconnect").collapsed = true;
    }
    else if (status == Strophe.Status.CONNECTING) {
      Notifs.add({"type": "jabber_connecting", "top": false, "timer": true, "time": 4000});
      $("jabber_connecting").collapsed = false;
      $("jabber_connect").collapsed = true;
      $("jabber_disconnect").collapsed = true;
    }
    else if (status == Strophe.Status.CONNFAIL) {
      Jabber.connected = false;
      Notifs.add({"type": "jabber_connfail", "top": true, "timer": true, "time": 4000});
      $("jabber_connecting").collapsed = true;
      $("jabber_connect").collapsed = false;
      $("jabber_disconnect").collapsed = true;
    }
    else if (status == Strophe.Status.AUTHENTICATING) {
      Notifs.add({"type": "jabber_authenticating", "top": false, "timer": true, "time": 4000});
    }
    else if (status == Strophe.Status.AUTHFAIL) {
      Jabber.connected = false;
      Notifs.add({"type": "jabber_authfail", "timer": true, "time": 4000});
      $("jabber_connecting").collapsed = true;
      $("jabber_connect").collapsed = false;
      $("jabber_disconnect").collapsed = true;
    }
    else if (status == Strophe.Status.DISCONNECTING) {
      Notifs.add({"type": "jabber_disconnecting", "top": false, "timer": true, "time": 4000});
      $("jabber_connecting").collapsed = false;
      $("jabber_connect").collapsed = true;
      $("jabber_disconnect").collapsed = true;
    }
    else if (status == Strophe.Status.DISCONNECTED) {
      Jabber.connected = false;
      Jabber.presence.show = "unavailable";
      Notifs.add({"type": "jabber_disconnected", "top": false, "timer": true, "time": 4000});
      Jabber.refreshMyAvatars();
      $("jabber_connecting").collapsed = true;
      $("jabber_connect").collapsed = false;
      $("jabber_disconnect").collapsed = true;
    }
    else if (status == Strophe.Status.CONNECTED) {
      Jabber.connected = true;
      $("jabber_status").textContent = Jabber.presence.status;
      Notifs.add({"type": "jabber_connected", "top": false, "timer": true, "time": 4000});
      Jabber.addHandlers();
      Jabber.getRoster();
      Jabber.updateShow("available");
      $("jabber_connecting").collapsed = true;
      $("jabber_connect").collapsed = true;
      $("jabber_disconnect").collapsed = false;
    }
    else if (status == Strophe.Status.ATTACHED) {
      alert("ATTACHED");
    }
  }
};

