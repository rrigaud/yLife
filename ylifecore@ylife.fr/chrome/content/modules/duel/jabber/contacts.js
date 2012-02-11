/***************************************************************************************************************
 *  File : contacts.js
 * 
 *  Gère les contacts Jabber
 */




/***************************************************************************************************************
 *  Object : Contacts
 * 
 *  Cet objet gère les contacts Jabber
 */
var Contacts = {
  /***************************************************************************************************************
   *  String : contactlist_mode
   *
   *  Mode d'affichage de la liste de contacts (normal/compact)
   */
  contactlist_mode : "normal",
  /***************************************************************************************************************
   *  Array : contacts
   *
   *  (Contact Object) Un contact avec ses properties et ses functions (contacts[jid].subsciption,...)
   */
  contacts : [],
  /***************************************************************************************************************
   *  Function : add
   *
   *  Ajoute un contact dans la mémoire
   * 
   *  Parameters:
   *    (Boolean) is_rosteritem - Est-ce un contact du roster ? (ou bien un contact ajouté depuis un salon)
   *    (String) jid - Bare JID
   *    (String) subscription - Souscription (none/to/from/both)
   *    (String) name - Nom du contact (choisi par nous)
  */
  add : function (is_rosteritem,jid,subscription,name) {
    var new_name = (name != null) ? name : Strophe.getNodeFromJid(jid) ;
    var contact = new Contact (is_rosteritem,jid.toLowerCase(),subscription,new_name);
    Contacts.contacts[jid.toLowerCase()] = contact;
  },
  /***************************************************************************************************************
   *  Function : sort
   *
   *  Retourne un tableau de (Contact Object) triés alphabétiquement par leur nickname
   */
  sort : function () {
    // Tableau des Noms à Trier
    var array_to_sort = [];
    // Tableau associant le Jid à un nom (array_link[nickname]=jid) utile pour la suite
    var array_link = [];
    // On créé le tableau de Noms à trier
    for (jid in Contacts.contacts) {
      // On ajoute _i à la fin du nom, ce qui permettra de ne pas confondre 2 personnes avec le même nom
      array_to_sort.push(Contacts.contacts[jid].nickname.toLowerCase() + "_" + i);
      // Avec ça, on retrouve un Jid à partir du Nom dans le tableau qui sera trié
      array_link[Contacts.contacts[jid].nickname.toLowerCase() + "_" + i] = jid;
    }
    // On trie le tableau des noms
    array_to_sort.sort();
    var array_sorted = [];
    // On copie le résultat de ce tri dans "contacts_jid"
    for (var i = 0 ; i < array_to_sort.length ; i++) {
      array_sorted.push(Contacts.contacts[array_link[array_to_sort[i]]]);
    }
    return array_sorted;
  },
  /***************************************************************************************************************
   *  Function : buildContactlist
   *
   *  Construit et affiche la liste des contacts selon le mode d'affichage voulu
   */
  buildContactlist : function () {
    var contactlist_rows = $("contactlist").getRowCount();
    for (var i = 0 ; i < contactlist_rows ; i++) { $("contactlist").removeItemAt(0); }
    var contacts_sorted = Contacts.sort();
    for (var i = 0 ; i < contacts_sorted.length ; i++) {
      if (contacts_sorted[i].available) {
        var contact_item = contacts_sorted[i].createItem(Contacts.contactlist_mode);
        $("contactlist").appendChild(contact_item);
      }
    }
  },
  /***************************************************************************************************************
   *  Function : get
   *
   *  Retourne le Contact associé à un JID (en crée un si nécessaire)
   * 
   *  Parameters:
   *    (String) jid - Bare JID
  */
  get : function (jid) {
    var contact = null;
    for (jid_contact in Contacts.contacts) {
      if (jid_contact == jid.toLowerCase()) { contact = Contacts.contacts[jid_contact]; }
    }
    if (!contact) {
      Contacts.add(false,
                    jid,
                    "none",
                    Strophe.getNodeFromJid(jid));
      contact = Contacts.contacts[jid.toLowerCase()];
      contact.getVcard();
    }
    return contact;
  },
  /***************************************************************************************************************
   *  Function : addToContacts
   *
   *    Ajoute un contact dans le Roster du serveur et souscrit à sa présence
   * 
   *  Parameters:
   *    (String) jid - Bare JID
  */
  addToContacts : function (jid) {
    var contact = Contacts.get(jid);
    contact.addToRoster();
    contact.subscribeTo();
  },
  /***************************************************************************************************************
   *  Function : isContact
   *
   *  Retourne true si le jid correspond à un contact (false sinon, généralement un salon de discussion)
   * 
   *  Parameters:
   *    (String) jid - Bare JID
  */
  isContact : function (jid) {
    var result = false;
    for (jid_contact in Contacts.contacts) {
      if (jid_contact == jid.toLowerCase()) { result = true; }
    }
    return result;
  }
};

