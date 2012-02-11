/***************************************************************************************************************
 *  File : notifications.js
 * 
 *  Gère les notifications de l'application (mineures dans la statusbar et majeures en haut)
 */




/***************************************************************************************************************
 *  Object : Notifs
 * 
 *  Cet objet gère les notifications à afficher
 */
var Notifs = {
  /***************************************************************************************************************
   *  Object : box
   *
   *    (String) top - ID de la Vbox où placer les notifications
   *    (String) bottom - ID de la Hbox où placer les notifications (statusbar)
   */
  box : {top:"notifications_top", bottom:"notifications"},
  /***************************************************************************************************************
   *  Array : logs
   *
   *    (Notif Object) Notification ( ex : {"type": "jabber_error", "top": true, "timer": true, "time": 4000} )
   */
  logs : [],
  /***************************************************************************************************************
   *  Function : add
   *
   *  Ajoute une notfication
   * 
   *  Parameters :
   *    (Notif Object) Notification ( ex : {"type": "jabber_error", "top": true, "timer": true, "time": 4000} )
   */
  add : function(notif) {
    var notif_id = Notifs.logs.length;
    Notifs.logs.push(notif);
    // Si c'est une notification importante, on l'affiche en haut (en plus de la statusbar)
    if (notif.top) {
      // Création de Notification_Top
      var Notification_Top = document.createElement('vbox');
      Notification_Top.setAttribute('id', "notif_top_" + notif_id);
      Notification_Top.setAttribute('class', notif.type + "_top");
      Notification_Top.setAttribute('contact', notif.contact);
      $(Notifs.box.top).appendChild(Notification_Top);
      // Si on a mis un Timer pour la supprimer automatiquement
      if (notif.timer) { setTimeout("Notifs.del('" + Notifs.box.top + "','notif_top_" + notif_id + "')",notif.time); }
    }
    // Création de Notification
    var Notification = document.createElement('vbox');
    Notification.setAttribute('id', "notif_" + notif_id);
    Notification.setAttribute('class', notif.type);
    Notification.setAttribute('contact', notif.contact);
    $(Notifs.box.bottom).appendChild(Notification);
    // Ici, on efface automatiquement après un délai
    setTimeout("Notifs.del('" + Notifs.box.bottom + "','notif_" + notif_id + "')",3000);
  },
  /***************************************************************************************************************
   *  Function : del
   *
   *  Supprime une notification (cache)
   * 
   *  Parameters :
   *    (Integer) notif_box_id - ID de la Box contenant la notification
   *    (Integer) notif_id - ID de la notification
   */
  del : function(notif_box_id,notif_id) {
    $(notif_box_id).removeChild($(notif_id));
  }
};

