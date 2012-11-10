/***************************************************************************************************************
 *  File : duel.js
 * 
 *  Gère la classe Duel
 */




/***************************************************************************************************************
 *  Class : Duel
 * 
 *  Cet classe gère les duels via Jabber
 * 
 *  Parameters :
 *    (DID String) did - Duel ID si le Duel existe déjà (créé par le challenger)
 */
function Duel (did) {
  /***************************************************************************************************************
   *  String : did
   *
   *  Duel ID créée par le challenger de la forme : yyyymmddhhmmss
   */
  this.did = did;
  /***************************************************************************************************************
   *  String : tid
   *
   *  TAB ID de l'onglet contenant ce duel (Mise en mémoire permettant un accès simplifié depuis l'instance du duel
   */
  this.tid = null;
  /***************************************************************************************************************
   *  String : resolution
   *
   *  Résolution de l'écran (O,1,...) : A NE PAS SYNCHRONISER (Propre à l'affichage de chacun)
   */
  this.resolution = null;
  this.dimensions = null;
  this.template = null;
  /***************************************************************************************************************
   *  Array : logs
   *
   *  (log Object) - Tableau de logs (contenant l'historique de chaque action)
   * 
   *  Exemple : logs[0].role = "challenger";
   */
  this.logs = [];
  /***************************************************************************************************************
   *  Array : players
   *
   *  (JID String) - Tableau d'objets "player" (contenant leur role dans le duel, leur avatar,...)
   * 
   *  Exemple : players["challenger@jabber.com"].role = "challenger";
   */
  this.players = [];
  /***************************************************************************************************************
   *  Array : field
   *
   *  (String) - me/op : Tableau contenant le joueur (son role en réalité) à afficher en "me" (en bas) et en "op" (en haut)
   *                     A NE PAS SYNCHRONISER (Propre à l'affichage de chacun)
   * 
   *  Exemple : field["me"] = "challenger";
   */
  this.field = [];
  /***************************************************************************************************************
   *  Object : ycd
   *
   *  Objet YCD, permettant d'accéder à toutes les informations sur Yugioh
   */
  this.ycd = {};
  /***************************************************************************************************************
   *  Object : deck
   *
   *  (deck Object) - Mon deck pour le duel
   */
  this.deck = {};
  /***************************************************************************************************************
   *  Array : cards
   *
   *  (card Object) - Tableau de toutes les cartes du duel (les miennes, et celles de mon adversaire) au format gamecard
   */
  this.cards = [];
  /***************************************************************************************************************
   *  Array : gamecards
   *
   *  (cards Array) - Tableau de tableaux de cartes (contenant leur card_index) : gamecards["main_me/hand_op"][i] = card_index
   */
  this.gamecards = [];
  /***************************************************************************************************************
   *  Function : storeTID
   *
   *  Charge l'ID de l'onglet du duel dans la mémoire du duel (permet un accès plus rapide et plus simple)
   * 
   *  Parameters :
   *    (TAB ID Integer) tab_id - ID de l'onglet contenant ce duel
   */
  this.storeTID = function (tab_id) {
    this.tid = tab_id;
  };
  /***************************************************************************************************************
   *  Function : init
   *
   *  Initialise le duel (crée un Duel ID, ajoute les joueurs,...)
   * 
   *  Parameters :
   *    (JID String) jid_challenger - JID du challenger (qui demande le duel)
   *    (JID String) jid_champion - JID du champion (qui est sollicité pour le duel)
   */
  this.init = function (jid_challenger,jid_champion) {
    // Récupération de la date
    var date =  new Date();
    var date_year = date.getFullYear() + "";
    var date_month = parseInt(date.getMonth())+1;
    if (date_month < 10) { date_month = "0" + date_month; }
    date_month +=  "";
    var date_day = date.getDate();
    if (date_day < 10) { date_day = "0" + date_day; }
    date_day +=  "";
    var date_hour = date.getHours();
    if (date_hour < 10) { date_hour = "0" + date_hour; }
    date_hour +=  "";
    var date_minute = date.getMinutes();
    if (date_minute < 10) { date_minute = "0" + date_minute; }
    date_minute +=  "";
    var date_second = date.getSeconds();
    if (date_second < 10) { date_second = "0" + date_second; }
    date_second +=  "";
    // Génération du Duel ID
    //this.did = date_year + date_month + date_day + "-" + date_hour + date_minute + date_second + "-" + jid_challenger + "-" + jid_champion;
    this.did = date_year + date_month + date_day + date_hour + date_minute + date_second;
    // Ajout des joueurs au duel
    this.players = [];
    var challenger = new Player(this.did,jid_challenger,"challenger");
    var champion = new Player(this.did,jid_champion,"champion");
    this.players[jid_challenger] = challenger;
    this.players[jid_champion] = champion;
    // Terrain du bas (me) pour le challenger puisque c'est moi qui lance le duel, celui du haut pour le champion
    this.field = [];
    this.field["me"] = "challenger";
    this.field["op"] = "champion";
  };
  /***************************************************************************************************************
   *  Function : loadYCD
   *
   *  Charge YCD en mémoire
   */
  this.loadYCD = function () {
    this.ycd = new Ycd (Addons.ycd_file);
  };
  /***************************************************************************************************************
   *  Function : loadDimensions
   *
   *  Charge les dimensions d'un "duel" des préférences en mémoire
   */
  this.loadDimensions = function () {
    this.resolution = Prefs.getChar("resolution.duel");
    this.dimensions = Dimension[this.resolution];
  };
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
    user_template.append("duel");
    user_template.append(Prefs.getChar("template.duel"));
    this.template = (user_template.exists()) ? "file://" + user_template.path : "chrome://ylifecore/skin/templates/duel/" + Prefs.getChar("template.duel") ;
  };
  /***************************************************************************************************************
   *  Function : addMessage
   *
   *  Ajoute un message à la conversation (entrant ou sortant)
   * 
   *  Parameters :
   *    (String) nickname - Pseudo à afficher
   *    (String) message - Texte à afficher
   *    (String) type - in/out
   */
  this.addMessage = function (nickname,msg,type) {
    // Récupération de la date
    var date =  new Date();
    var h = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var m = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var s = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
    // Récupération du Message
    var message_node = $("duel_iframe_" + this.tid).contentWindow.document.getElementById("messagetoclone").cloneNode(true);
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
    $("duel_iframe_" + this.tid).contentWindow.document.getElementById("messages").appendChild(message_dom);
    $("duel_iframe_" + this.tid).contentWindow.location = this.template + "#bottom";
  };
  /***************************************************************************************************************
   *  Function : sendMessage
   *
   *  Envoie le message tapé au correspondant
   */
  this.sendMessage = function () {
    // On récupère le message dans le bon textbox
    var message_to_display = $("duel_message_out_" + this.tid).value;
    // Message à envoyer
    var message_to_send = message_to_display  + "##separator_message##"
                          + this.did + "##separator_message##"
                          + "simplemessage";
    var msg = "";
    for (jid in this.players) {
      if (jid != Jabber.account.barejid) {
        // On envoie un message à tous les joueurs (sauf moi, évidemment)
        msg = $msg({to: jid, from: Jabber.account.jid, type: "duel"})
                .c("html",{xmlns: "http://jabber.org/protocol/xhtml-im"})
                .c("body",{xmlns: "http://www.w3.org/1999/xhtml"})
                .t(message_to_send);
        Jabber.send(msg.tree());
      }
    }
    // On affiche le message sortant dans notre interface
    this.addMessage(Jabber.vcard.nickname,message_to_display,"out");
    $("duel_message_out_" + this.tid).value = "";
    $("duel_message_out_" + this.tid).focus();
  };
  /***************************************************************************************************************
   *  Function : sendAction
   *
   *  Envoie l'action exécutée à l'adversaire
   * 
   *  Parameters :
   *    (String) message_to_display - Message à afficher
   *    (String) type - Type d'action
   *    (String) actions - Actions possibles (facultatives)
   */
  this.sendAction = function (message_to_display,type,actions) {
    // Encodage de l'état du duel
    var duel_encoded = this.getCode();
    // Message à envoyer
    var message_to_send = message_to_display  + "##separator_message##"
                          + this.did + "##separator_message##"
                          + type + "##separator_message##"
                          + duel_encoded + "##separator_message##"
                          + actions;
    var msg = "";
    for (jid in this.players) {
      if (jid != Jabber.account.barejid) {
        // On envoie un message à tous les joueurs (sauf moi, évidemment)
        msg = $msg({to: jid, from: Jabber.account.jid, type: "duel"})
                .c("html",{xmlns: "http://jabber.org/protocol/xhtml-im"})
                .c("body",{xmlns: "http://www.w3.org/1999/xhtml"})
                .t(message_to_send);
        Jabber.send(msg.tree());
      }
    }
    // On affiche le message sortant dans notre interface
    this.addMessage(Jabber.vcard.nickname,message_to_display,"out");
  };
  /***************************************************************************************************************
   *  Function : getCode
   *
   *  Retourne toutes les variables du duel à synchroniser sous la forme d'un code (chaine de caractère)
   */
  this.getCode = function () {
    return "duelencoded";
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
}

