/***************************************************************************************************************
 *  File : actions.js
 * 
 *  Gère les actions (extension de l'objet Jabber)
 */




/***************************************************************************************************************
 *  Function : viewProfile
 *
 *  Ouvre le profil d'un JID
 * 
 *  Parameters :
 *    (String) jid - Bare JID d'un interlocuteur (contact ou pas)
 */
Jabber.viewProfile = function (jid) {
  var jid_profile = null;
  if (!jid) {
    // On demande le jid de l'interlocuteur si aucun n'est passé en paramètre
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var jid_to_profile = { value: "" };
    var check = { value: false };
    var result = prompts.prompt(window,
                                  $("i18n").getString("enter.jid.title"),
                                  $("i18n").getString("enter.jid.message"),
                                  jid_to_profile,null,check);
    // Si l'utilisateur clique sur OK et que le JID n'est pas vide
    if ((result)&&(jid_to_profile.value != "")) {
      jid_profile = jid_to_profile.value;
    }
  }
  else {
    jid_profile = jid;
  }
  if (jid_profile) {
    if (Contacts.isContact(jid_profile)) {
      var infos = {"isOccupant": false,
                    "Occupant" : null,
                    "isContact" : true,
                    "Contact" : Contacts.contacts[jid_profile] };
      window.openDialog('chrome://ylifecore/content/modules/duel/profile/profile.xul','profile','chrome,modal,centerscreen',infos);
    }
  }
}


/***************************************************************************************************************
 *  Function : chatWith
 *
 *  Lance une conversation avec quelqu'un
 * 
 *  Parameters :
 *    (String) jid - Bare JID d'un interlocuteur (contact ou pas)
 */
Jabber.chatWith = function (jid) {
  var contact = null;
  if (!jid) {
    // On demande le jid de l'interlocuteur si aucun n'est passé en paramètre
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var jid_to_add = { value: "" };
    var check = { value: false };
    var result = prompts.prompt(window,
                                  $("i18n").getString("enter.jid.title"),
                                  $("i18n").getString("enter.jid.message"),
                                  jid_to_add,null,check);
    // Si l'utilisateur clique sur OK et que le JID n'est pas vide
    if ((result)&&(jid_to_add.value != "")) {
      var contact = Contacts.get(jid_to_add.value);
    }
  }
  else {
    var contact = Contacts.get(jid);
  }
  if (contact) {
    var tab = Tabs.getChat(contact.jid);
    Tabs.tabs[tab.id].viewTab();
    Tabs.tabs[tab.id].viewPanel();
  }
}


/***************************************************************************************************************
 *  Function : duelWith
 *
 *  Lance un duel avec quelqu'un
 * 
 *  Parameters :
 *    (String) jid - Bare JID d'un interlocuteur (contact ou pas)
 *    (String) role - Role dans le duel (challenger/champion/guest_challenger/guest_champion)
 */
Jabber.duelWith = function (jid,role) {
  var contact = null;
  if (!jid) {
    // On demande le jid de l'interlocuteur si aucun n'est passé en paramètre
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var jid_to_add = { value: "" };
    var check = { value: false };
    var result = prompts.prompt(window,
                                  $("i18n").getString("enter.jid.title"),
                                  $("i18n").getString("enter.jid.message"),
                                  jid_to_add,null,check);
    // Si l'utilisateur clique sur OK et que le JID n'est pas vide
    if ((result)&&(jid_to_add.value != "")) {
      var contact = Contacts.get(jid_to_add.value);
    }
  }
  else {
    var contact = Contacts.get(jid);
  }
  if (contact) {
    var tab = Tabs.getDuel("");
    Tabs.tabs[tab.id].viewTab();
    Tabs.tabs[tab.id].viewPanel();
    // Initialisation du duel (Création du Duel ID, ajout des 2 joueurs, affectation des terrains pour cet utilisateur)
    Tabs.tabs[tab.id].content.init(Jabber.account.barejid,contact.jid);
    // Maintenant que les terrains sont définis, on actualise les Avatars/nicknames de l'onglet et des 2 terrains
    Tabs.tabs[tab.id].content.refreshPlayers();
    // Demande de duel au "champion"
    Tabs.tabs[tab.id].content.queryDuel();
  }
}


/***************************************************************************************************************
 *  Function : joinMuc
 *
 *  Lance un salon de conversation
 * 
 *  Parameters :
 *    (String) rid - Room ID du Salon Jabber
 */
Jabber.joinMuc = function (rid) {
  var room = null;
  if (!rid) {
    // On demande le rid du salon si aucun n'est passé en paramètre
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var rid_to_join = { value: "" };
    var check = { value: false };
    var result = prompts.prompt(window,
                                  $("i18n").getString("enter.rid.title"),
                                  $("i18n").getString("enter.rid.message"),
                                  rid_to_join,null,check);
    // Si l'utilisateur clique sur OK et que le RID n'est pas vide
    if ((result)&&(rid_to_join.value != "")) {
      var room = rid_to_join.value;
    }
  }
  else {
    var room = rid;
  }
  if (room) {
    var tab = Tabs.getMuc(room);
    Tabs.tabs[tab.id].viewTab();
    Tabs.tabs[tab.id].viewPanel();
    Tabs.tabs[tab.id].content.loadNickname();
    Tabs.tabs[tab.id].content.connect();
  }
}

