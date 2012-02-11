/***************************************************************************************************************
 *  File : occupant.js
 * 
 *  Gère la classe Occupant
 */




/***************************************************************************************************************
 *  Class : Occupant
 * 
 *  Cet classe gère les occupants d'un salon de discussion
 * 
 *  Parameters:
 *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
 *    (String) jid - Bare JID (uniquement si le salon est "non-anymous")
 *    (String) affiliation - owner/admin/member/none/outcast
 *    (String) role - moderator/participant/visitor/none
 */
function Occupant (oid,jid,affiliation,role) {
  this.oid = oid;
  this.jid = jid;
  this.rid = Strophe.getBareJidFromJid(oid);
  this.affiliation = affiliation;
  this.role = role;
  this.show = "available";
  this.status = "";
  this.nickname = Strophe.getResourceFromJid(oid);
  this.avatar = (this.jid == Strophe.getBareJidFromJid(Jabber.account.jid)) ? Jabber.vcard.avatar : Jabber.avatar_default;
  /***************************************************************************************************************
   *  Function : getAvatar
   *
   *  Retourne l'avatar de l'occupant
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
   *  Demande la vCard du contact à son serveur
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
   *  Met à jour l'affichage de l'avatar dans la liste des occupants
   */
  this.refreshAvatar = function () {
    $("occupant_vbox_" + this.oid).setAttribute('avatar_img', this.avatar);
    $("occupant_vbox_" + this.oid).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + this.show + ".png");
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

