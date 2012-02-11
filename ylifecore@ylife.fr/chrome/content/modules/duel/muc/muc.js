/***************************************************************************************************************
 *  File : muc.js
 * 
 *  Gère la classe Muc
 */




/***************************************************************************************************************
 *  Class : Muc
 * 
 *  Cet classe gère les salons de discussion Jabber
 * 
 *  Parameters:
 *    (String) rid - Room ID du Salon Jabber
 */
function Muc (rid) {
  this.rid = rid;
  this.occupantlist_mode = "normal";
  this.nickname = Jabber.vcard.nickname;
  /***************************************************************************************************************
   *  Function : loadNickname
   *
   *  Charge le nom du template des préférences en mémoire
   */
  this.loadNickname = function () {
    // On demande le nouveau Pseudo dans un Pop Up
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
    var nickname = { value: this.nickname };
    var check = {value: false};
    var update = prompts.prompt(window,
                                  $("i18n").getString("muc.nickname.title"),
                                  $("i18n").getString("muc.nickname.message"),
                                  nickname,null,check);
    // Si l'utilisateur clique sur OK, que le nouveau Pseudo n'est pas vide et n'est pas l'ancien, alors on MAJ
    if ((update)&&(nickname.value != this.nickname)) {
      this.nickname = nickname.value;
      this.oid = this.rid + "/" + this.nickname;
    }
  };
  this.oid = this.rid + "/" + this.nickname;
  /***************************************************************************************************************
   *  Array : occupants
   *
   *  (Occupant Object) - Tableau d'occupants (occupants[ylife@chat.jabberfr.org/nickname].affiliation)
   */
  this.occupants = [];
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
    user_template.append("muc");
    user_template.append(Prefs.getChar("template.muc"));
    this.template = (user_template.exists()) ? "file://" + user_template.path : "chrome://ylifecore/skin/templates/muc/" + Prefs.getChar("template.muc") ;
  };
  /***************************************************************************************************************
   *  Function : connect
   *
   *  Se connecte au salon
   */
  this.connect = function () {
    var presence = $build("presence",{from: Jabber.account.jid, to: this.oid}).c("x",{xmlns: Strophe.NS.MUC}).c("history",{seconds: "300"});
    Jabber.send(presence.tree());
    var presence_account = $build("presence",{from: Jabber.account.jid, to: this.oid});
    if (Jabber.presence.show != "available") { presence_account.c("show").t(Jabber.presence.show).up(); }
    if (Jabber.presence.status != "") { presence_account.c("status").t(Jabber.presence.status).up(); }
    Jabber.send(presence_account.tree());
  };
  /***************************************************************************************************************
   *  Function : getSortedOccupants
   *
   *  Retourne un tableau de (Occupant Object) triés par affiliation/role/nickname alphabétiquement
   */
  this.getSortedOccupants = function () {
    var array_sorted = [];
    // Tableaux des Noms à Trier
    var admin_to_sort = [];
    var moderator_to_sort = [];
    var occupant_to_sort = [];
    // Tableau associant le Oid à un nom (array_link[nickname]=oid) utile pour la suite
    var admin_link = [];
    var moderator_link = [];
    var occupant_link = [];
    // On créé les tableau de Noms à trier
    for (oid in this.occupants) {
      if ((this.occupants[oid].affiliation == "owner")||(this.occupants[oid].affiliation == "admin")) {
        // On ajoute _i à la fin du nom, ce qui permettra de ne pas confondre 2 personnes avec le même nom
        admin_to_sort.push(this.occupants[oid].nickname.toLowerCase() + "_" + i);
        // Avec ça, on retrouve un Oid à partir du Nom dans le tableau qui sera trié
        admin_link[this.occupants[oid].nickname.toLowerCase() + "_" + i] = oid;
      }
      else if (this.occupants[oid].role == "moderator") {
        // On ajoute _i à la fin du nom, ce qui permettra de ne pas confondre 2 personnes avec le même nom
        moderator_to_sort.push(this.occupants[oid].nickname.toLowerCase() + "_" + i);
        // Avec ça, on retrouve un Oid à partir du Nom dans le tableau qui sera trié
        moderator_link[this.occupants[oid].nickname.toLowerCase() + "_" + i] = oid;
      }
      else {
        // On ajoute _i à la fin du nom, ce qui permettra de ne pas confondre 2 personnes avec le même nom
        occupant_to_sort.push(this.occupants[oid].nickname.toLowerCase() + "_" + i);
        // Avec ça, on retrouve un Oid à partir du Nom dans le tableau qui sera trié
        occupant_link[this.occupants[oid].nickname.toLowerCase() + "_" + i] = oid;
      }
    }
    // On trie les tableaux
    admin_to_sort.sort();
    moderator_to_sort.sort();
    occupant_to_sort.sort();
    // On copie le résultat de ces tris dans le tableau à retourner
    for (var i = 0 ; i < admin_to_sort.length ; i++) {
      array_sorted.push(this.occupants[admin_link[admin_to_sort[i]]]);
    }
    for (var i = 0 ; i < moderator_to_sort.length ; i++) {
      array_sorted.push(this.occupants[moderator_link[moderator_to_sort[i]]]);
    }
    for (var i = 0 ; i < occupant_to_sort.length ; i++) {
      array_sorted.push(this.occupants[occupant_link[occupant_to_sort[i]]]);
    }
    return array_sorted;
  };
  /***************************************************************************************************************
   *  Function : buildOccupantlist
   *
   *  Construit et affiche la liste des occupants selon le mode d'affichage voulu
   */
  this.buildOccupantlist = function () {
    var occupantlist_rows = $("muc_richlistbox_" + this.rid.toLowerCase()).getRowCount();
    for (var i = 0 ; i < occupantlist_rows ; i++) { $("muc_richlistbox_" + this.rid.toLowerCase()).removeItemAt(0); }
    var occupants_sorted = this.getSortedOccupants();
    for (var i = 0 ; i < occupants_sorted.length ; i++) {
      var occupant_item = occupants_sorted[i].createItem(this.occupantlist_mode);
      $("muc_richlistbox_" + this.rid.toLowerCase()).appendChild(occupant_item);
    }
  };
  /***************************************************************************************************************
   *  Function : addMessage
   *
   *  Ajoute un message à la conversation (entrant ou sortant)
   * 
   *  Parameters :
   *    (String) nickname - Pseudonyme à afficher (ou Salon)
   *    (String) message - Texte à afficher
   *    (String) type - out/neutral
   */
  this.addMessage = function (nickname,msg,type) {
    // Récupération de la date
    var date =  new Date();
    var h = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var m = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var s = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    // Récupération du Message
    var message_node = $("muc_iframe_" + this.rid).contentWindow.document.getElementById("messagetoclone").cloneNode(true);
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
    $("muc_iframe_" + this.rid).contentWindow.document.getElementById("messages").appendChild(message_dom);
    $("muc_iframe_" + this.rid).contentWindow.location = this.template + "#bottom";
  };
  /***************************************************************************************************************
   *  Function : sendMessage
   *
   *  Envoie le message tapé au salon
   */
  this.sendMessage = function () {
    // On récupère le message dans le bon textbox
    var message = $("muc_message_out_" + this.rid).value;
    // On l'envoie
    var msg = $msg({to: this.rid, from: Jabber.account.jid, type: "groupchat"}).c("body").t(message);
    Jabber.send(msg.tree());
    $("muc_message_out_" + this.rid).value = "";
    $("muc_message_out_" + this.rid).focus();
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
  /***************************************************************************************************************
   *  Function : isOccupant
   *
   *  Retourne true si c'est un occupant (false s'il n'est pas encore en mémoire du salon)
   * 
   *  Parameters :
   *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
   */
  this.isOccupant = function (oid) {
    var result = false;
    for (oid_occupant in this.occupants) {
      if (oid_occupant == oid) { result = true; }
    }
    return result;
  };
  /***************************************************************************************************************
   *  Function : addOccupant
   *
   *  Ajoute un occupant dans la mémoire du salon
   * 
   *  Parameters :
   *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
   *    (String) jid - Bare JID (uniquement si le salon est "non-anymous")
   *    (String) affiliation - owner/admin/member/none/outcast
   *    (String) role - moderator/participant/visitor/none
   */
  this.addOccupant = function (oid,jid,affiliation,role) {
    var occupant = new Occupant (oid,jid,affiliation,role);
    this.occupants[oid] = occupant;
  };
  /***************************************************************************************************************
   *  Function : delOccupant
   *
   *  Supprime un occupant de la mémoire du salon
   * 
   *  Parameters :
   *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
   */
  this.delOccupant = function (oid) {
    this.occupants = arrayRemove(this.occupants,oid);
  };
  /***************************************************************************************************************
   *  Function : viewProfile
   *
   *  Affiche le profil d'un occupant
   * 
   *  Parameters :
   *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
   */
  this.viewProfile = function (oid) {
    if (this.isOccupant(oid)) { this.occupants[oid].viewProfile(); }
  };
  /***************************************************************************************************************
   *  Function : chatWith
   *
   *  Ouvre une conversation privée avec un occupant
   * 
   *  Parameters :
   *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
   */
  this.chatWith = function (oid) {
    if (this.isOccupant(oid)) { this.occupants[oid].chatWith(); }
  };
  /***************************************************************************************************************
   *  Function : duelWith
   *
   *  Ouvre un duel avec un occupant
   * 
   *  Parameters :
   *    (String) oid - Occupant ID (ylife@chat.jabberfr.org/nickname)
   */
  this.duelWith = function (oid) {
    if (this.isOccupant(oid)) { this.occupants[oid].duelWith(); }
  };
}

