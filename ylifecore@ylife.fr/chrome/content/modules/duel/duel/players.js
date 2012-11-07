/***************************************************************************************************************
 *  File : players.js
 * 
 *  Extension de la classe Duel : Gère les joueurs (challenger,champion,guest_challenger,guest_champion,guest)
 */




/***************************************************************************************************************
 *  Function : setPlayers
 *
 *  Initialise le terrain du haut et du bas aux challenger/champion selon le choix de l'utilisateur
 * 
 *  Parameters :
 *    (Role String) me - challenger/champion
 *    (Role String) op - challenger/champion
 */
Duel.prototype.setPlayers = function (me,op) {
  this.field = [];
  var role = this.players[Jabber.account.barejid].role;
  // Si je suis un joueur, mon terrain est forcément "me" donc je force mon role sur le terrain "me"
  if ((role == "challenger")||(role == "champion")) {
    this.field["me"] = (role == "challenger") ? "challenger" : "champion";
    this.field["op"] = (role == "challenger") ? "champion" : "challenger";
  }
  // Sinon, je suis un spectateur donc je respecte le choix du terrain "me" et "op"
  else {
    this.field["me"] = me;
    this.field["op"] = op;
  }
}


/***************************************************************************************************************
 *  Function : getPlayerFromField
 * 
 *  Retourne les informations personnelles (Player Object) d'un joueur à partir de son terrain (me ou op)
 * 
 *  Parameters:
 *    (String) field - me (terrain du bas) ou op (terrain du haut)
 */
Duel.prototype.getPlayerFromField = function (field) {
  var player = {};
  // Pour chaque joueur/spectateur
  for (jid in this.players) {
    // Si on trouve le joueur à qui appartient le terrain, on le retourne
    if (this.players[jid].role == this.field[field]) { player = this.players[jid]; }
  }
  return player;
}


/***************************************************************************************************************
 *  Function : displayPlayers
 *
 *  Affiche les Avatars/nicknames de l'onglet de duel et des 2 terrains de jeu par rapport à l'appartenance des terrains
 *  (Aucun rapport avec le rafraichissement des avatars/nicknames des contacts dans l'interface)
 */
Duel.prototype.displayPlayers = function () {
  // "tab_" + tab_id . tooltiptext
  // "tab_avatar_" + tab_id . avatar_img
  // "tab_avatar_" + tab_id . show_img
  // "avatar_op_" + tab_id . avatar_img
  // "avatar_op_" + tab_id . show_img
  // "avatar_op_" + tab_id . tooltiptext
  // "nickname_op_" + tab_id . value
  // "nickname_op_" + tab_id . tooltiptext
  // "avatar_me_" + tab_id . avatar_img
  // "avatar_me_" + tab_id . show_img
  // "avatar_me_" + tab_id . tooltiptext
  // "nickname_me_" + tab_id . value
  // "nickname_me_" + tab_id . tooltiptext
  
  // Il faut gérer le tableau dynamique des contacts contenant les ID des avatars/nickname pour un rafraichissement des status, du genre :
  // Contacts.contacts[jid].avatars_id.push("avatar_op_" + tab_id);
  
  
  
  // Récupère les joueurs "me" et "op" sous forme d'objet Contact
  var me = this.getPlayerFromField("me");
  var op = this.getPlayerFromField("op");
  
  // Onglet de duel
  $("tab_" + this.tid).setAttribute('tooltiptext', op.nickname);
  $("tab_avatar_" + this.tid).setAttribute('avatar_img', op.avatar);
  $("tab_avatar_" + this.tid).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + op.show + ".png");
  // Sidebar : OP
  $("avatar_op_" + this.tid).setAttribute('avatar_img', op.avatar);
  $("avatar_op_" + this.tid).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + op.show + ".png");
  $("avatar_op_" + this.tid).setAttribute('tooltiptext', op.nickname);
  $("nickname_op_" + this.tid).setAttribute('value', op.nickname);
  $("nickname_op_" + this.tid).setAttribute('tooltiptext', op.nickname);
  
  // Sidebar : ME
  $("avatar_me_" + this.tid).setAttribute('avatar_img', me.avatar);
  $("avatar_me_" + this.tid).setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + me.show + ".png");
  $("avatar_me_" + this.tid).setAttribute('tooltiptext', me.nickname);
  $("nickname_me_" + this.tid).setAttribute('value', me.nickname);
  $("nickname_me_" + this.tid).setAttribute('tooltiptext', me.nickname);
  
  // Récupère la vCard des 2 joueurs
  me.getVcard();
  op.getVcard();
}






