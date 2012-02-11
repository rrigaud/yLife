/***************************************************************************************************************
 *  File : contact.js
 * 
 *  Gère la classe Contact
 */




/***************************************************************************************************************
 *  Class : Contact
 * 
 *  Cette classe gère les contacts Jabber
 * 
 *  Parameters:
 *    (Boolean) is_rosteritem - Est-ce un contact du roster ? (ou bien un contact ajouté depuis un salon)
 *    (String) jid - Bare JID
 *    (String) subscription - Souscription (none/to/from/both)
 *    (String) name - Nom du contact (choisi par nous)
 */
function Contact (is_rosteritem,jid,subscription,name) {
  this.is_rosteritem = is_rosteritem;
  this.jid = jid;
  this.resource = "yLife";
  this.fulljid = jid + "/" + this.resource;
  this.subscription = subscription;
  this.available = false;
  this.show = "unavailable";
  this.status = "";
  this.name = name;
  this.nickname = name;
  /***************************************************************************************************************
   *  Array : nicknames_id
   *
   *    (String) ID des labels nickname créés un peu partout dans l'interface (home, chat, duel)
   * 
   *    Permet de les mettre tous à jour sur un changement de presence ou de vcard
   */
  this.nicknames_id = [];
  this.avatar = Jabber.avatar_default;
  /***************************************************************************************************************
   *  Array : avatars_id
   *
   *    (String) ID des box avatars créés un peu partout dans l'interface (home, chat, duel)
   * 
   *    Permet de les mettre tous à jour sur un changement de presence ou de vcard
   */
  this.avatars_id = [];
  /***************************************************************************************************************
   *  Function : refreshAvatars
   *
   *  Met à jour l'affichage de tous les avatars  du contact (home, chat, duel)
   */
  this.refreshAvatars = function () {
    if (this.available) {
      $("contact_vbox_" + this.jid).setAttribute('avatar_img', this.avatar);
      $("contact_vbox_" + this.jid).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + this.show + ".png");
    }
    for (var i = 0 ; i < this.avatars_id.length ; i++) {
      $(this.avatars_id[i]).setAttribute('avatar_img', this.avatar);
      $(this.avatars_id[i]).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + this.show + ".png");
    }
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
   *  Retourne un richlistitem du contact
   * 
   *  Parameters :
   *    (String) mode - Mode d'affichage de l'item de la liste de contacts (normal/compact)
   */
  this.createItem = function (mode) {
    var contact_item = document.createElement('richlistitem');
    contact_item.setAttribute('id', "contact_richlistitem_" + this.jid);
    contact_item.setAttribute('jid', this.jid);
      var contact_vbox = document.createElement('vbox');
      contact_vbox.setAttribute('id', "contact_vbox_" + this.jid);
      contact_vbox.setAttribute('class', "contact_" + mode);
      contact_vbox.setAttribute('avatar_img', this.avatar);
      contact_vbox.setAttribute('name', this.name);
      contact_vbox.setAttribute('nickname', this.nickname);
      contact_vbox.setAttribute('show', this.show);
      contact_vbox.setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + this.show + ".png");
      contact_vbox.setAttribute('status', this.status);
      var ylife_deconnected = (this.resource == "yLife") ? false : true;
      contact_vbox.setAttribute('ylife_deconnected', ylife_deconnected);
      contact_vbox.setAttribute('ttt_contact', this.jid + " (" + this.status + ") " + " [" + $("i18n").getString("subscription." + this.subscription) + "]");
      contact_vbox.setAttribute('flex', "1");
      contact_vbox.setAttribute('ondblclick', "Jabber.chatWith('" + this.jid + "');");
    contact_item.appendChild(contact_vbox);
    return contact_item;
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

