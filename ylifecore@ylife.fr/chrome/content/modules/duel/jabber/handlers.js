/***************************************************************************************************************
 *  File : handlers.js
 * 
 *  Gère les évènements reçus sur le réseau Jabber (extension de l'objet Jabber)
 */




/***************************************************************************************************************
 *  Function : onRoster
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onRoster = function (msg) {
  var roster_items = msg.firstChild.getElementsByTagName('item');
  for (var i = 0; i < roster_items.length; i++) {
    Contacts.add(true,
                  roster_items[i].getAttribute('jid'),
                  roster_items[i].getAttribute('subscription'),
                  roster_items[i].getAttribute('name'));
  }
  Jabber.getVcard();
  return true;
}


/***************************************************************************************************************
 *  Function : onVcard
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onVcard = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  // Ma vCard
  if (jid == Strophe.getBareJidFromJid(Jabber.account.jid)) {
    var nickname_elements = msg.getElementsByTagName('NICKNAME');
    if (nickname_elements.length > 0) {
      Jabber.vcard.nickname = Strophe.getText(nickname_elements[0]);
      Jabber.refreshMyNicknames();
    }
    var avatar_binval_elements = msg.getElementsByTagName('BINVAL');
    if (avatar_binval_elements.length > 0) {
      Jabber.vcard.avatar_binval = Strophe.getText(avatar_binval_elements[0]);
      var avatar_type_elements = msg.getElementsByTagName('TYPE');
      Jabber.vcard.avatar_type = Strophe.getText(avatar_type_elements[0]);
      Jabber.vcard.avatar = 'data:' + Jabber.vcard.avatar_type + ';base64,' + Jabber.vcard.avatar_binval;
      Jabber.refreshMyAvatars();
    }
    Notifs.add({"type": "jabber_contact_vcard", "contact": Jabber.vcard.nickname + " :", "top": false, "timer": true, "time": 4000});
  }
  // Si c'est un contact
  if (Contacts.isContact(jid)) {
    var nickname_elements = msg.getElementsByTagName('NICKNAME');
    if (nickname_elements.length > 0) {
      Contacts.contacts[jid].nickname = Strophe.getText(nickname_elements[0]);
      //Contacts.contacts[jid].refreshNicknames();
      Contacts.buildContactlist();
    }
    var avatar_binval_elements = msg.getElementsByTagName('BINVAL');
    if (avatar_binval_elements.length > 0) {
      var avatar_type_elements = msg.getElementsByTagName('TYPE');
      Contacts.contacts[jid].avatar = 'data:' + Strophe.getText(avatar_type_elements[0]) + ';base64,' + Strophe.getText(avatar_binval_elements[0]);
      Contacts.contacts[jid].refreshAvatars();
    }
    Notifs.add({"type": "jabber_contact_vcard", "contact": Contacts.contacts[jid].nickname + " :", "top": false, "timer": true, "time": 4000});
  }
  // Si c'est un occupant d'un salon au moins
  var occupants = Tabs.getOccupantsMucOf(jid);
  if (occupants.length > 0) {
    var avatar_binval_elements = msg.getElementsByTagName('BINVAL');
    if (avatar_binval_elements.length > 0) {
      var avatar_type_elements = msg.getElementsByTagName('TYPE');
      var avatar = 'data:' + Strophe.getText(avatar_type_elements[0]) + ';base64,' + Strophe.getText(avatar_binval_elements[0]);
      for (var i = 0 ; i < occupants.length ; i++) {
        occupants[i].avatar = avatar;
        occupants[i].refreshAvatar();
        Notifs.add({"type": "jabber_contact_vcard", "contact": occupants[i].nickname + " :", "top": false, "timer": true, "time": 4000});
      }
    }
  }
  // Si c'est un joueur/spectateur d'un duel au moins
  var players = Tabs.getPlayers(jid);
  if (players.length > 0) {
    var nickname_elements = msg.getElementsByTagName('NICKNAME');
    if (nickname_elements.length > 0) {
      for (var i = 0 ; i < players.length ; i++) {
        players[i].nickname = Strophe.getText(nickname_elements[0]);
        //players[i].refreshNickname();
      }
    }
    var avatar_binval_elements = msg.getElementsByTagName('BINVAL');
    if (avatar_binval_elements.length > 0) {
      var avatar_type_elements = msg.getElementsByTagName('TYPE');
      var avatar = 'data:' + Strophe.getText(avatar_type_elements[0]) + ';base64,' + Strophe.getText(avatar_binval_elements[0]);
      for (var i = 0 ; i < players.length ; i++) {
        players[i].avatar = avatar;
        players[i].refreshAvatar();
        Notifs.add({"type": "jabber_contact_vcard", "contact": players[i].nickname + " :", "top": false, "timer": true, "time": 4000});
      }
    }
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onPresence
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onPresence = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  if ((jid != Strophe.getBareJidFromJid(Jabber.account.jid))&&(msg.getAttribute('type') == null)&&(Contacts.isContact(jid))) {
    Contacts.contacts[jid].available = true;
    Contacts.contacts[jid].show = msg.getElementsByTagName('show').length ? Strophe.getText(msg.getElementsByTagName('show')[0]) : "available";
    Contacts.contacts[jid].status = msg.getElementsByTagName('status').length ? Strophe.getText(msg.getElementsByTagName('status')[0]) : "";
    Contacts.buildContactlist();
    Contacts.contacts[jid].refreshAvatars();
    Notifs.add({"type": "jabber_contact_presence", "contact": Contacts.contacts[jid].nickname + " :", "top": false, "timer": true, "time": 4000});
    Contacts.contacts[jid].getVcard();
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onPresenceUnavailable
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onPresenceUnavailable = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  if ((jid != Strophe.getBareJidFromJid(Jabber.account.jid))&&(Contacts.isContact(jid))) {
    Contacts.contacts[jid].available = false;
    Contacts.contacts[jid].show = "unavailable";
    Contacts.contacts[jid].status = "";
    Contacts.buildContactlist();
    Notifs.add({"type": "jabber_contact_presence", "contact": Contacts.contacts[jid].nickname + " : ", "top": false, "timer": true, "time": 4000});
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onSubscribe
 *
 *  Demande de souscription d'un contact pour voir votre présence
 * 
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onSubscribe = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  if (jid != Strophe.getBareJidFromJid(Jabber.account.jid)) {
    
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onSubscribed
 *
 *  Souscription à un contact acceptée (on peut le voir à présent)
 * 
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onSubscribed = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  if (jid != Strophe.getBareJidFromJid(Jabber.account.jid)) {
    
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onUnsubscribed
 *
 *  Souscription à un contact refusée (on ne peut pas le voir mais il est toujours dans le Roster)
 * 
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onUnsubscribed = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  if (jid != Strophe.getBareJidFromJid(Jabber.account.jid)) {
    
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onUnsubscribe
 *
 *  Suppression de la souscription à un contact (on ne veut plus le voir mais il est toujours dans le Roster)
 * 
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onUnsubscribe = function (msg) {
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  if (jid != Strophe.getBareJidFromJid(Jabber.account.jid)) {
    
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onMessage
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onMessage = function (msg) {
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
  return true;
}


/***************************************************************************************************************
 *  Function : onDuel
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onDuel = function (msg) {
  alert("Jabber.onDuel : OK !");
  var jid = Strophe.getBareJidFromJid(msg.getAttribute('from'));
  
  
  // Ne passe pas par Bosh... Je dois parser le message pour y avoir accès
  //var did = msg.getAttribute('did');
  //var datastring = msg.getAttribute('data');
  //var msg_type = (msg.getAttribute('class') == "action") ? "neutral" : "in" ;
  
  
  
  
  var contact = Contacts.get(jid);
  var nickname = contact.nickname;
  // Par défaut, il n'y pas de datastring
  var datastring = "";
  var elems = msg.getElementsByTagName('body');
  if (elems.length > 0) {
    var body = elems[0];
    datastring = Strophe.getText(body);
  }
  alert(datastring);
  var temp = datastring.split('#msg#');
  var message = "";
  // Si il y a bien des données (pas un simple message)
  if (temp.length == 2) {
    message = temp[1];
    var temp1 = temp[0].split('#type#');
    var did = temp1[0];
    alert("DID : " + did);
  }
  else { message = datastring; }
  
  var msg_type = "neutral";
  
  var tab = Tabs.getDuel(did);
  alert(Tabs.tabs[tab.id].content.did);
  Tabs.tabs[tab.id].content.sync(jid,datastring,message,msg_type);
  // Si l'onglet vient d'être créé, il faut un laps de temps pour que l'interface soit finie sinon bug...
  //if (tab.isNew) { setTimeout("Tabs.tabs[" + tab.id + "].content.sync(" + jid + ", " + datastring + ", coucou, " + msg_type + ")",1000); }
  // Sinon, on synchronise immédiatement
  //else { Tabs.tabs[tab.id].content.sync(jid,datastring,message,msg_type); }
  Notifs.add({"type": "jabber_duel_message", "contact": nickname + " :", "top": false, "timer": true, "time": 2000});
  if ($("tabs").selectedItem != $("tab_" + tab.id)) { Tabs.tabs[tab.id].newMessage(true); }
  return true;
}


/***************************************************************************************************************
 *  Function : onMucMessage
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onMucMessage = function (msg) {
  var oid = msg.getAttribute('from');
  var rid = Strophe.getBareJidFromJid(oid);
  var elems = msg.getElementsByTagName('body');
  if (elems.length > 0) {
    var body = elems[0];
    var tab = Tabs.getMuc(rid);
    var nickname = $("i18n").getString("muc.room");
    var type = "neutral";
    if (oid != rid) {
      nickname = Strophe.getResourceFromJid(oid);
      type = "in";
      var my_oid = Tabs.tabs[tab.id].content.rid + "/" + Tabs.tabs[tab.id].content.nickname;
      if (oid == my_oid) { type = "out"; }
    }
    // Si l'onglet vient d'être créé, il faut un laps de temps pour que l'interface soit finie sinon bug...
    if (tab.isNew) { setTimeout("Tabs.tabs[" + tab.id + "].content.addMessage('" + nickname + "','" + Strophe.getText(body) + "','" + type + "')",1000); }
    // Sinon, on ajoute le message immédiatement
    else { Tabs.tabs[tab.id].content.addMessage(nickname,Strophe.getText(body),type); }
    Notifs.add({"type": "jabber_muc_message", "contact": nickname + " :", "top": false, "timer": true, "time": 2000});
    if ($("tabs").selectedItem != $("tab_" + tab.id)) { Tabs.tabs[tab.id].newMessage(true); }
  }
  return true;
}


/***************************************************************************************************************
 *  Function : onMucPresence
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onMucPresence = function (msg) {
  var oid = msg.getAttribute('from');
  if ((oid != Strophe.getBareJidFromJid(Jabber.account.jid))&&(!Contacts.isContact(oid))&&(msg.getAttribute('type') == null)) {
    var rid = Strophe.getBareJidFromJid(oid);
    var tab = Tabs.getMuc(rid);
    if (!Tabs.tabs[tab.id].content.isOccupant(oid)) {
      var affiliation = msg.getElementsByTagName('item')[0].getAttribute('affiliation');
      var role = msg.getElementsByTagName('item')[0].getAttribute('role');
      var jid = (msg.getElementsByTagName('item')[0].getAttribute('jid')) ? Strophe.getBareJidFromJid(msg.getElementsByTagName('item')[0].getAttribute('jid')) : "";
      Tabs.tabs[tab.id].content.addOccupant(oid,jid,affiliation,role);
      if (jid != "") { Tabs.tabs[tab.id].content.occupants[oid].getVcard(); }
    }
    Tabs.tabs[tab.id].content.occupants[oid].show = msg.getElementsByTagName('show').length ? Strophe.getText(msg.getElementsByTagName('show')[0]) : "available";
    Tabs.tabs[tab.id].content.occupants[oid].status = msg.getElementsByTagName('status').length ? Strophe.getText(msg.getElementsByTagName('status')[0]) : "";
    Tabs.tabs[tab.id].content.buildOccupantlist();
    Tabs.tabs[tab.id].content.occupants[oid].getVcard();
    Notifs.add({"type": "jabber_muc_presence", "contact": oid + " :", "top": false, "timer": true, "time": 2000});
  }
  /*if ((oid == Strophe.getBareJidFromJid(Jabber.account.jid))&&(!Contacts.isContact(oid))&&(msg.getAttribute('type') == null)) {
    Tabs.tabs[tab.id].content.occupants[oid].show = msg.getElementsByTagName('show').length ? Strophe.getText(msg.getElementsByTagName('show')[0]) : "available";
    Tabs.tabs[tab.id].content.occupants[oid].status = msg.getElementsByTagName('status').length ? Strophe.getText(msg.getElementsByTagName('status')[0]) : "";
    Tabs.tabs[tab.id].content.buildOccupantlist();
  }*/
  return true;
}



/***************************************************************************************************************
 *  Function : onMucPresenceError
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onMucPresenceError = function (msg) {
  var oid = msg.getAttribute('from');
  var rid = Strophe.getBareJidFromJid(oid);
  var error_code = msg.getElementsByTagName('error')[0].getAttribute('code');
  if (error_code == "409") {
    var tab = Tabs.getMuc(rid);
    Tabs.tabs[tab.id].del();
    Notifs.add({"type": "jabber_muc_presence_error", "contact": oid + " :", "top": true, "timer": true, "time": 4000});
  }
  return true;
}



/***************************************************************************************************************
 *  Function : onMucPresenceUnavailable
 *
 *  Parameters :
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Jabber.onMucPresenceUnavailable = function (msg) {
  var oid = msg.getAttribute('from');
  var rid = Strophe.getBareJidFromJid(oid);
  var muc = Tabs.isMuc(rid);
  if ((muc.exist)&&(oid != Strophe.getBareJidFromJid(Jabber.account.jid))&&(!Contacts.isContact(oid))) {
    var tab = Tabs.getMuc(rid);
    Tabs.tabs[tab.id].content.delOccupant(oid);
    Tabs.tabs[tab.id].content.buildOccupantlist();
  }
  return true;
}

