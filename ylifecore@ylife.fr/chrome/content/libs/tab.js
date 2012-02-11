/***************************************************************************************************************
 *  File : tab.js
 * 
 *  Gère la classe Tab
 */




/***************************************************************************************************************
 *  Class : Tab
 * 
 *  Cette classe gère les onglets de yLife
 * 
 *  Parameters:
 *    (Integer) id - Tab_ID de l'onglet (pour avoir accès à tab_0 et iframe_0,...)
 *    (String) type - Type d'onglet (cardexplorer/deckbuilder/reports/ycdmanager/chat/duel/muc)
 *    (Object) content - Objet de type Chat/Duel/Room
 */
function Tab (id,type,content) {
  this.id = id;
  this.type = type;
  /***************************************************************************************************************
   *  Class : content
   *
   *  Accès au contenu de l'onglet (chat/duel/muc) : functions et properties
   */
  this.content = content;
  /***************************************************************************************************************
   *  Function : viewTab
   *
   *  Sélectionne un onglet
   */
  this.viewTab = function () {
    $("tabs").selectedItem = $("tab_" + this.id);
  };
  /***************************************************************************************************************
   *  Function : viewPanel
   *
   *  Affiche le Panel d'un onglet
   */
  this.viewPanel = function () {
    $("deck").selectedPanel = $("iframe_" + this.id);
    if ((this.type == "chat")||(this.type == "duel")) { this.newMessage(false); }
    if (this.type == "muc") { this.newMessage(false); }
  };
  /***************************************************************************************************************
   *  Function : del
   *
   *  Supprime un onglet
   */
  this.del = function () {
    if ((this.type == "chat")||(this.type == "duel")) {
      // Supprime les avatars_id et nicknames_id
      Contacts.contacts[this.content.jid].avatars_id = arrayDel(Contacts.contacts[this.content.jid].avatars_id,"tab_avatar_" + this.id);
    }
    if (this.type == "muc") {
      // Supprime les avatars_id et nicknames_id
      
      // Envoie une présence de type unavailable au salon (sinon, si on revient, le salon ne nous envoie pas les présences)
      var presence = $build("presence",{from: Jabber.account.jid, to: this.content.oid, type: "unavailable"});
      Jabber.send(presence.tree());
    }
    
    $("tabs").removeChild($("tab_" + this.id));
    $("deck").removeChild($("iframe_" + this.id));
    Tabs.tabs = arrayRemove(Tabs.tabs,this.id);
    // Affiche l'onglet Accueil
    Tabs.tabs[0].viewTab();
    Tabs.tabs[0].viewPanel();
  };
  /***************************************************************************************************************
   *  Function : newMessage
   *
   *  Sélectionne un onglet
   * 
   *  Parameters :
   *    (Boolean) message - true si un nouveau message est arrivé (valable pour les onglets utilisant Jabber)
   */
  this.newMessage = function (message) {
    if (message) {
      if ((this.type == "chat")||(this.type == "duel")) {
        $("tab_avatar_" + this.id).setAttribute('class_newmessage', "newmessage");
      }
      if (this.type == "muc") {
         $("tab_avatar_" + this.id).setAttribute('class', "newmessage");
      }
    }
    else {
      if ((this.type == "chat")||(this.type == "duel")) {
        $("tab_avatar_" + this.id).setAttribute('class_newmessage', "");
      }
      if (this.type == "muc") {
         $("tab_avatar_" + this.id).setAttribute('class', "");
      }
    }
  };
}

