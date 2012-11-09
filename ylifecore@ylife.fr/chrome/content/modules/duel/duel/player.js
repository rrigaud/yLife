/***************************************************************************************************************
 *  File : player.js
 * 
 *  Gère la classe Player
 */




/***************************************************************************************************************
 *  Class : Player
 * 
 *  Cet classe gère les joueurs d'un duel (duelliste ou spectateur)
 * 
 *  Parameters:
 *    (DID String) did - Duel ID
 *    (JID String) jid - Bare JID (uniquement si le salon est "non-anonymous")
 *    (String) role - challenger/champion/guest_challenger/guest_champion/guest
 */
function Player (did,jid,role) {
  this.did = did;
  this.jid = jid;
  /***************************************************************************************************************
   *  String : role
   *
   *  Role dans le duel :
   *    challenger > Je propose le duel
   *    champion > J'accepte le duel
   *    guest_challenger > Je suis un spectateur et voit l'écran du challenger
   *    guest_champion > Je suis un spectateur et voit l'écran du champion
   *    guest > Je suis un spectateur et ne voit que le terrain de jeu
   */
  this.role = role;
  this.nickname = (this.jid == Jabber.account.barejid) ? Jabber.vcard.nickname : Strophe.getNodeFromJid(this.jid);
  this.avatar = (this.jid == Jabber.account.barejid) ? Jabber.vcard.avatar : Jabber.avatar_default;
  this.show = "available";
  /***************************************************************************************************************
   *  Function : getAvatar
   *
   *  Retourne l'avatar du joueur/spectateur
   */
  this.getAvatar = function () {
    var result = Jabber.avatar_default;
    if (Contacts.isContact(this.jid)) {
      result = Contacts.contacts[jid].avatar;
    }
    if (this.jid == Strophe.getBareJidFromJid(Jabber.account.jid)) {
      result = Jabber.vcard.avatar;
    }
    return result;
  };
  /***************************************************************************************************************
   *  Function : getVcard
   *
   *  Demande la vCard du joueur à son serveur
   */
  this.getVcard = function () {
    var iq = $iq({to: this.jid, type: "get"}).c("vCard", {xmlns: Strophe.NS.VCARD});
    Jabber.send(iq.tree());
  };
  /***************************************************************************************************************
   *  Function : createItem
   *
   *  Retourne un richlistitem de l'occupant
   * 
   *  Parameters :
   *    (String) mode - Mode d'affichage de l'item de la liste des occupants (normal/compact)
   */
  this.createItem = function (mode) {
    var occupant_item = document.createElement('richlistitem');
    occupant_item.setAttribute('id', "occupant_richlistitem_" + this.oid);
    occupant_item.setAttribute('oid', this.oid);
      var occupant_vbox = document.createElement('vbox');
      occupant_vbox.setAttribute('id', "occupant_vbox_" + this.oid);
      occupant_vbox.setAttribute('class', "occupant_" + mode);
      occupant_vbox.setAttribute('avatar_img', this.avatar);
      occupant_vbox.setAttribute('nickname', this.nickname);
      occupant_vbox.setAttribute('show', this.show);
      occupant_vbox.setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + this.show + ".png");
      occupant_vbox.setAttribute('status', this.status);
      var occupant_icon = "";
      if (this.role == "moderator") { occupant_icon = "chrome://ylifecore/skin/icons/various/moderator.png"; }
      if ((this.affiliation == "owner")||(this.affiliation == "admin")) { occupant_icon = "chrome://ylifecore/skin/icons/various/admin.png"; }
      occupant_vbox.setAttribute('occupant_icon', occupant_icon);
      occupant_vbox.setAttribute('ttt_occupant', this.jid + " (" + $("i18n").getString("affiliation." + this.affiliation) + " / " + $("i18n").getString("role." + this.role) + ")");
      occupant_vbox.setAttribute('flex', "1");
      occupant_vbox.setAttribute('ondblclick', "alert('" + this.jid + "');");
    occupant_item.appendChild(occupant_vbox);
    return occupant_item;
  };
  /***************************************************************************************************************
   *  Function : refreshAvatar
   *
   *  Met à jour l'affichage de l'avatar du joueur/spectateur
   */
  this.refreshAvatar = function () {
    //$("occupant_vbox_" + this.oid).setAttribute('avatar_img', this.avatar);
    //$("occupant_vbox_" + this.oid).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + this.show + ".png");
  };
  /***************************************************************************************************************
   *  Function : viewProfile
   *
   *  Affiche le profil d'un occupant
   */
  this.viewProfile = function () {
    var isContact = false;
    var contact = null;
    if (Contacts.isContact(this.jid)) {
      isContact = true;
      contact = Contacts.contacts[this.jid];
    }
    var infos = {"isOccupant": true,
                  "Occupant" : this,
                  "isContact" : isContact,
                  "Contact" : contact };
    window.openDialog('chrome://ylifecore/content/modules/duel/profile/profile.xul','profile','chrome,modal,centerscreen',infos);
  };
  /***************************************************************************************************************
   *  Function : chatWith
   *
   *  Ouvre une conversation privée si le jid est connu
   */
  this.chatWith = function () {
    if (this.jid != "") { Jabber.chatWith(this.jid); }
    else { Notifs.add({"type": "jabber_muc_no_jid", "top": true, "timer": true, "time": 4000}); }
  };
  /***************************************************************************************************************
   *  Function : duelWith
   *
   *  Ouvre un duel si le jid est connu
   */
  this.duelWith = function () {
    if (this.jid != "") { Jabber.duelWith(this.jid); }
    else { Notifs.add({"type": "jabber_muc_no_jid", "top": true, "timer": true, "time": 4000}); }
  };
  /***************************************************************************************************************
   *  Function : addToRoster
   *
   *  Ajoute le contact au Roster du serveur
   */
  this.addToRoster = function () {
    
  };
  /***************************************************************************************************************
   *  Function : subscribeTo
   *
   *  Souscrit à la présence du contact (envoie une demande)
   */
  this.subscribeTo = function () {
    
  };
}

