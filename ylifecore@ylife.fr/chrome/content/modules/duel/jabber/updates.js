/***************************************************************************************************************
 *  File : updates.js
 * 
 *  Gère les mises à jour sur le réseau Jabber (Présence, vCard)
 */




/***************************************************************************************************************
 *  Function : updateShow
 *
 *  Met à jour le Show de l'utilisateur
 * 
 *  Parameters :
 *    (String) show - Etat de l'utilisateur : available / dnd / away / xa
 */
Jabber.updateShow = function (show) {
  // Si on est déconnecté (connexion non initialisé ou bien statut déconnecté)
  if ((Jabber.connection == null) || (!Jabber.connected)) {
    Jabber.connect();
  }
  // Sinon, on peut MAJ
  else {
    Jabber.presence.show = show;
    Jabber.refreshMyAvatars();
    Jabber.updatePresence();
  }
}


/***************************************************************************************************************
 *  Function : updateStatus
 *
 *  Met à jour le Status de l'utilisateur (phrase d'humeur)
 */
Jabber.updateStatus = function () {
  // Si on est déconnecté (connexion non initialisé ou bien statut déconnecté)
  if ((Jabber.connection == null) || (!Jabber.connected)) {
    Notifs.add({"type": "jabber_connect_first", "top": false, "timer": true, "time": 4000});
  }
  // Sinon, on peut MAJ
  else {
    // On demande le nouveau Status dans un Pop Up
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var status = { value: $("jabber_status").textContent };
    var check = {value: false};
    var update = prompts.prompt(window,
                                  $("i18n").getString("update.status.title"),
                                  $("i18n").getString("update.status.message"),
                                  status,null,check);
    // Si l'utilisateur clique sur OK, que le nouveau Status n'est pas vide et n'est pas l'ancien, alors on MAJ
    if ((update)&&(status.value != Jabber.presence.status))
    {
      $("jabber_status").textContent = status.value;
      Jabber.presence.status = status.value;
      Jabber.updatePresence();
    }
  }
}


/***************************************************************************************************************
 *  Function : updatePresence
 *
 *  Met à jour la présence de l'utilisateur (show et status)
 */
Jabber.updatePresence = function () {
  var presence = $pres();
  if (Jabber.presence.show != "available") { presence.c("show").t(Jabber.presence.show).up(); }
  if (Jabber.presence.status != "") { presence.c("status").t(Jabber.presence.status).up(); }
  Jabber.send(presence.tree());
  Notifs.add({"type": "jabber_update_presence", "top": false, "timer": true, "time": 4000});
  // Pour chaque salon de discussion, on envoie la MAJ
  var occupants = Tabs.getOccupantsMucOf(Strophe.getBareJidFromJid(Jabber.account.jid));
  for (var i = 0 ; i < occupants.length ; i++) {
    var presence_account = $build("presence",{from: Jabber.account.jid, to: occupants[i].oid});
    if (Jabber.presence.show != "available") { presence_account.c("show").t(Jabber.presence.show).up(); }
    if (Jabber.presence.status != "") { presence_account.c("status").t(Jabber.presence.status).up(); }
    Jabber.send(presence_account.tree());
  }
}






/***************************************************************************************************************
 *  Function : updateNickname
 *
 *  Met à jour le Nickname de l'utilisateur (vCard)
 */
Jabber.updateNickname = function () {
  // Si on est déconnecté (connexion non initialisé ou bien statut déconnecté)
  if ((Jabber.connection == null) || (!Jabber.connected)) {
    Notifs.add({"type": "jabber_connect_first", "top": false, "timer": true, "time": 4000});
  }
  // Sinon, on peut MAJ
  else {
    // On demande le nouveau Pseudo dans un Pop Up
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var nickname = { value: Jabber.vcard.nickname };
    var check = {value: false};
    var update = prompts.prompt(window,
                                  $("i18n").getString("update.nickname.title"),
                                  $("i18n").getString("update.nickname.message"),
                                  nickname,null,check);
    // Si l'utilisateur clique sur OK, que le nouveau Pseudo n'est pas vide et n'est pas l'ancien, alors on MAJ
    if ((update)&&(nickname.value != Jabber.vcard.nickname)) {
      Jabber.vcard.nickname = nickname.value;
      Jabber.refreshMyNicknames();
      Jabber.updateVcard();
    }
  }
}


/***************************************************************************************************************
 *  Function : updateAvatar
 *
 *  Met à jour l'avatar de l'utilisateur (vCard). Ne semble marcher que pour du PNG étrangement... ?
 */
Jabber.updateAvatar = function () {
  // Si on est déconnecté (connexion non initialisé ou bien statut déconnecté)
  if ((Jabber.connection == null) || (!Jabber.connected)) {
    Notifs.add({"type": "jabber_connect_first", "top": false, "timer": true, "time": 4000});
  }
  // Sinon, on peut MAJ
  else {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, $("i18n").getString("update.avatar.title"), nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterImages);
    if (fp.show() == nsIFilePicker.returnOK) {
      var contentType = Components.classes["@mozilla.org/mime;1"].getService(Components.interfaces.nsIMIMEService).getTypeFromFile(fp.file);
      var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
      inputStream.init(fp.file,-1,-1,false);
      var stream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
      stream.setInputStream(inputStream);
      var encoded = btoa(stream.readBytes(stream.available()));
      Jabber.vcard.avatar = "data:" + contentType + ";base64," + encoded;
      Jabber.vcard.avatar_type = contentType;
      Jabber.vcard.avatar_binval = encoded;
      Jabber.refreshMyAvatars();
      Jabber.updateVcard();
    }
  }
}


/***************************************************************************************************************
 *  Function : updateVcard
 *
 *  Met à jour la vCard de l'utilisateur (nickname et avatar)
 */
Jabber.updateVcard = function () {
  var jid = Strophe.getBareJidFromJid(Jabber.account.jid);
  var iq = $iq({to: jid, type: "set"}).c("vCard", {xmlns: Strophe.NS.VCARD})
                                        .c("NICKNAME").t(Jabber.vcard.nickname).up()
                                        .c("PHOTO")
                                          .c("TYPE").t(Jabber.vcard.avatar_type).up()
                                          .c("BINVAL").t(Jabber.vcard.avatar_binval);
  Jabber.send(iq.tree());
  Notifs.add({"type": "jabber_update_vcard", "top": false, "timer": true, "time": 4000});
}
