/***************************************************************************************************************
 *  File : tabs.js
 * 
 *  Gère les onglets de l'interface principale (Module, conversation, duel)
 */




/***************************************************************************************************************
 *  Object : Tabs
 * 
 *  Cet objet gère les différents onglets de l'interface
 */
var Tabs = {
  id : 0,
  /***************************************************************************************************************
   *  Array : tabs
   *
   *  Le premier onglet est l'accueil (home) et ne peut pas être détruit)
   * 
   *    (Tab Object) Un onglet avec ses properties et ses functions (tabs[id].type, tabs[id].jid,...)
   */
  tabs : [],
  /***************************************************************************************************************
   *  Function : newModule
   *
   *  Ouvre un onglet en y chargeant un module
   * 
   *  Parameters :
   *    (String) module - Module à lancer : cardexplorer, deckbuilder, reports, ycdmanager
   */
  newModule : function (module) {
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,module);
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', $("i18n").getString("tab." + module));
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création Image de l'onglet
      var img_tab = document.createElement('image');
      img_tab.setAttribute('src', "chrome://ylifecore/skin/tabs/" + module + ".png");
      img_tab.setAttribute('width', "64");
      img_tab.setAttribute('height', "64");
      // Ajout Image à l'onglet
      radiotab.appendChild(img_tab);
    $("tabs").appendChild(radiotab);
    // Création Iframe
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', "iframe_" + tab_id);
    iframe.setAttribute('src', "chrome://ylifecore/content/modules/" + module + "/" + module + ".xul");
    $("deck").appendChild(iframe);
    // Sélection de l'onglet et affichage de l'iframe
    tab.viewTab();
    tab.viewPanel();
  },
  /***************************************************************************************************************
   *  Function : newAddons
   *
   *  Ouvre un onglet en y chargeant le gestionnaire d'addons
   */
  newAddons : function () {
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,"addons");
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', $("i18n").getString("tab.addons"));
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création Image de l'onglet
      var img_tab = document.createElement('image');
      img_tab.setAttribute('src', "chrome://ylifecore/skin/tabs/addons.png");
      img_tab.setAttribute('width', "64");
      img_tab.setAttribute('height', "64");
      // Ajout Image à l'onglet
      radiotab.appendChild(img_tab);
    $("tabs").appendChild(radiotab);
    // Création Iframe
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', "iframe_" + tab_id);
    iframe.setAttribute('src', "chrome://mozapps/content/extensions/extensions.xul?type=extensions");
    $("deck").appendChild(iframe);
    // Sélection de l'onglet et affichage de l'iframe
    tab.viewTab();
    tab.viewPanel();
  },
  /***************************************************************************************************************
   *  Function : newPreferences
   *
   *  Ouvre un onglet en y chargeant le gestionnaire de préférences
   */
  newPreferences : function () {
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,"preferences");
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', $("i18n").getString("tab.preferences"));
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création Image de l'onglet
      var img_tab = document.createElement('image');
      img_tab.setAttribute('src', "chrome://ylifecore/skin/tabs/preferences.png");
      img_tab.setAttribute('width', "64");
      img_tab.setAttribute('height', "64");
      // Ajout Image à l'onglet
      radiotab.appendChild(img_tab);
    $("tabs").appendChild(radiotab);
    // Création Iframe
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', "iframe_" + tab_id);
    iframe.setAttribute('src', "chrome://ylifecore/content/modules/preferences/preferences.xul");
    $("deck").appendChild(iframe);
    // Sélection de l'onglet et affichage de l'iframe
    tab.viewTab();
    tab.viewPanel();
  },
  /***************************************************************************************************************
   *  Function : newAbout
   *
   *  Ouvre un onglet en y chargeant les informations à propos de yLife et YCD
   */
  newAbout : function () {
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,"about");
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', $("i18n").getString("tab.about"));
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création Image de l'onglet
      var img_tab = document.createElement('image');
      img_tab.setAttribute('src', "chrome://ylifecore/skin/tabs/about.png");
      img_tab.setAttribute('width', "64");
      img_tab.setAttribute('height', "64");
      // Ajout Image à l'onglet
      radiotab.appendChild(img_tab);
    $("tabs").appendChild(radiotab);
    // Création Iframe
    var iframe = document.createElement('iframe');
    iframe.setAttribute('id', "iframe_" + tab_id);
    iframe.setAttribute('src', "chrome://ylifecore/content/modules/about/about.xul");
    $("deck").appendChild(iframe);
    // Sélection de l'onglet et affichage de l'iframe
    tab.viewTab();
    tab.viewPanel();
  },
  /***************************************************************************************************************
   *  Function : newChat
   *
   *  Ouvre un onglet en y chargeant une conversation privée
   * 
   *  Parameters :
   *    (String) jid - JID du contact
   */
  newChat : function (jid) {
    var chat = new Chat (jid.toLowerCase());
    chat.loadTemplate();
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,"chat",chat);
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', Contacts.contacts[jid].nickname);
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création vbox_avatar
      var vbox_avatar = document.createElement('vbox');
      vbox_avatar.setAttribute('id', "tab_avatar_" + tab_id);
      vbox_avatar.setAttribute('class', "avatar_contact");
      vbox_avatar.setAttribute('class_newmessage', "");
      vbox_avatar.setAttribute('avatar_img', Contacts.contacts[jid].avatar);
      vbox_avatar.setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + Contacts.contacts[jid].show + ".png");
      Contacts.contacts[jid].avatars_id.push("tab_avatar_" + tab_id);
      // Ajout vbox_avatar à l'onglet
      radiotab.appendChild(vbox_avatar);
    $("tabs").appendChild(radiotab);
    // Création de chat_vbox
    var chat_vbox = document.createElement('vbox');
    chat_vbox.setAttribute('id', "iframe_" + tab_id);
    chat_vbox.setAttribute('flex', "1");
      // Création de chat_iframe
      var chat_iframe = document.createElement('iframe');
      chat_iframe.setAttribute('id', "chat_iframe_" + jid);
      chat_iframe.setAttribute('class', "chatlog");
      chat_iframe.setAttribute('src', chat.template);
      chat_iframe.setAttribute('flex', "1");
      // Ajout chat_iframe à chat_vbox
      chat_vbox.appendChild(chat_iframe);
      // Création de hbox1
      var hbox1 = document.createElement('hbox');
      hbox1.setAttribute('align', "center");
        // Création de textbox
        var textbox = document.createElement('textbox');
        textbox.setAttribute('id', "chat_message_out_" + jid);
        textbox.setAttribute('flex', "1");
        textbox.setAttribute('onkeydown', "Tabs.tabs[" + tab_id + "].content.onKeydown(event);");
        // Ajout textbox à hbox1
        hbox1.appendChild(textbox);
        // Création de toolbarbutton_actions 
        var toolbarbutton_actions = document.createElement('toolbarbutton');
        toolbarbutton_actions.setAttribute('class', "bt_utils");
        toolbarbutton_actions.setAttribute('popup', "_child");
          // Création de menupopup_actions
          var menupopup_actions = document.createElement('menupopup');
          menupopup_actions.setAttribute('position', "before_start");
            // Création de menuitem_addtocontacts
            var menuitem_addtocontacts = document.createElement('menuitem');
            menuitem_addtocontacts.setAttribute('class', "menuitem-iconic bt_add");
            menuitem_addtocontacts.setAttribute('label', $("i18n").getString("chat.actions.add.to.contacts"));
            menuitem_addtocontacts.setAttribute('oncommand', "Contacts.addToContacts('" + jid + "');");
          // Ajout menuitem_addtocontacts à menupopup_actions
          menupopup_actions.appendChild(menuitem_addtocontacts);
          // Ajout menupopup_actions à toolbarbutton_actions
          toolbarbutton_actions.appendChild(menupopup_actions);
        // Ajout toolbarbutton_actions à hbox1
        hbox1.appendChild(toolbarbutton_actions);
        // Création de button2
        var button2 = document.createElement('button');
        button2.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.sendMessage();");
        var button2_image2 = document.createElement('image');
        button2_image2.setAttribute('class', "bt_chat");
        // Ajout button2_image2 à button2
        button2.appendChild(button2_image2);
        var spacer2 = document.createElement('spacer');
        spacer2.setAttribute('flex', "1");
        // Ajout spacer2 à button2
        button2.appendChild(spacer2);
        var button2_label2 = document.createElement('label');
        button2_label2.setAttribute('value', $("i18n").getString("send"));
        // Ajout button2_label2 à button2
        button2.appendChild(button2_label2);
        // Ajout button2 à hbox1
        hbox1.appendChild(button2);
      // Ajout hbox1 à chat_vbox
      chat_vbox.appendChild(hbox1);
    // Ajout chat_vbox au deck
    $("deck").appendChild(chat_vbox);
    return tab;
  },
  /***************************************************************************************************************
   *  Function : newDuel
   *
   *  Ouvre un onglet en y chargeant un duel
   * 
   *  Parameters :
   *    (String) jid - JID du contact
   */
  newDuel : function (jid) {
    var duel = new Duel (jid.toLowerCase());
    duel.loadDimensions();
    duel.loadTemplate();
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,"duel",duel);
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', Contacts.contacts[jid].nickname);
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création vbox_avatar
      var vbox_avatar = document.createElement('vbox');
      vbox_avatar.setAttribute('id', "tab_avatar_" + tab_id);
      vbox_avatar.setAttribute('class', "avatar_contact");
      vbox_avatar.setAttribute('class_newmessage', "");
      vbox_avatar.setAttribute('avatar_img', Contacts.contacts[jid].avatar);
      vbox_avatar.setAttribute('show_img', "chrome://ylifecore/skin/icons/show_borders/" + Contacts.contacts[jid].show + ".png");
      Contacts.contacts[jid].avatars_id.push("tab_avatar_" + tab_id);
      // Ajout vbox_avatar à l'onglet
      radiotab.appendChild(vbox_avatar);
    $("tabs").appendChild(radiotab);
    // Création de duel_hbox
    var duel_hbox = document.createElement('hbox');
    duel_hbox.setAttribute('id', "iframe_" + tab_id);
    duel_hbox.setAttribute('flex', "1");
      // Création Stack (terrain de jeu)
      var stack = document.createElement('stack');
      //stack.setAttribute('style', "border:1px solid red;");
      stack.setAttribute('id', "stack_" + tab_id);
      stack.setAttribute('ondragenter', "return stackDragEnter(event,this)");
      stack.setAttribute('ondragover', "return stackDragOver(event,this)");
      stack.setAttribute('ondrop', "return stackDrop(event,this)");
        // Création field_op
        var field_op = document.createElement('image');
        field_op.setAttribute('id', "field_op_" + tab_id);
        field_op.setAttribute('src',"chrome://ylifecore/skin/duels/" + duel.resolution + "/field_op.png");
        field_op.setAttribute('width', duel.dimensions.field.width);
        field_op.setAttribute('height', duel.dimensions.field.height);
        field_op.setAttribute('top', duel.dimensions.field_op.y);
        field_op.setAttribute('left', duel.dimensions.field_op.x);
        // Ajout field_op au Stack
        stack.appendChild(field_op);
        // Création field_me
        var field_me = document.createElement('image');
        field_me.setAttribute('id', "field_op_" + tab_id);
        field_me.setAttribute('src',"chrome://ylifecore/skin/duels/" + duel.resolution + "/field_me.png");
        field_me.setAttribute('width', duel.dimensions.field.width);
        field_me.setAttribute('height', duel.dimensions.field.height);
        field_me.setAttribute('top', duel.dimensions.field_me.y);
        field_me.setAttribute('left', duel.dimensions.field_me.x);
        // Ajout field_me au Stack
        stack.appendChild(field_me);
        // Création field_centralbar
        var field_centralbar = document.createElement('hbox');
        field_centralbar.setAttribute('id', "field_centralbar_" + tab_id);
        field_centralbar.setAttribute('src',"chrome://ylifecore/skin/duels/" + duel.resolution + "/field_me.png");
        field_centralbar.setAttribute('width', duel.dimensions.field_centralbar.width);
        field_centralbar.setAttribute('height', duel.dimensions.field_centralbar.height);
        field_centralbar.setAttribute('top', duel.dimensions.field_centralbar.y);
        field_centralbar.setAttribute('left', duel.dimensions.field_centralbar.x);
          // Création button_game
          var button_game = document.createElement('button');
          button_game.setAttribute('class', "button");
          button_game.setAttribute('popup',"_child");
            // Création button_game_spacer1
            var button_game_spacer1 = document.createElement('spacer');
            button_game_spacer1.setAttribute('flex', "1");
            // Ajout button_game_spacer1 à button_game
            button_game.appendChild(button_game_spacer1);
            // Création button_game_image
            var button_game_image = document.createElement('image');
            button_game_image.setAttribute('src', "chrome://ylifecore/skin/icons/buttons/duel.png");
            // Ajout button_game_image à button_game
            button_game.appendChild(button_game_image);
            // Création button_game_label
            var button_game_label = document.createElement('label');
            button_game_label.setAttribute('value', $("i18n").getString("duel.game"));
            // Ajout button_game_label à button_game
            button_game.appendChild(button_game_label);
            // Création button_game_spacer2
            var button_game_spacer2 = document.createElement('spacer');
            button_game_spacer2.setAttribute('flex', "1");
            // Ajout button_game_spacer2 à button_game
            button_game.appendChild(button_game_spacer2);
            // Création button_game_popup
            var button_game_popup = document.createElement('menupopup');
            button_game_popup.setAttribute('position', "before_start");
              // Création button_game_menuitem_newduel
              var button_game_menuitem_newduel = document.createElement('menuitem');
              button_game_menuitem_newduel.setAttribute('class', "menuitem-iconic newduel");
              button_game_menuitem_newduel.setAttribute('label', $("i18n").getString("duel.newduel"));
              button_game_menuitem_newduel.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.newDuel();");
              // Ajout button_game_menuitem_newduel à button_game_popup
              button_game_popup.appendChild(button_game_menuitem_newduel);
              // Création button_game_menuitem_invite
              var button_game_menuitem_invite = document.createElement('menuitem');
              button_game_menuitem_invite.setAttribute('class', "menuitem-iconic invite");
              button_game_menuitem_invite.setAttribute('label', $("i18n").getString("duel.invite"));
              button_game_menuitem_invite.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.invite();");
              // Ajout button_game_menuitem_invite à button_game_popup
              button_game_popup.appendChild(button_game_menuitem_invite);
            // Ajout button_game_popup à button_game
            button_game.appendChild(button_game_popup);
          
          
          // Ajout button_game au field_centralbar
          field_centralbar.appendChild(button_game);
          // Création field_centralbar_spacer1
          var field_centralbar_spacer1 = document.createElement('spacer');
          field_centralbar_spacer1.setAttribute('flex', "1");
          // Ajout field_centralbar_spacer1 à field_centralbar
          field_centralbar.appendChild(field_centralbar_spacer1);
          
          // Création phases
          var phases = document.createElement('radiogroup');
          phases.setAttribute('id', "phase_" + tab_id);
          phases.setAttribute('orient', "horizontal");
          phases.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.setPhaseTo(this.selectedIndex);");
            // Création de phase_draw
            var phase_draw = document.createElement('radio');
            phase_draw.setAttribute('id', "phase_draw_" + tab_id);
            phase_draw.setAttribute('class', "button left");
            phase_draw.setAttribute('label', $("i18n").getString("duel.phase.draw"));
            // Ajout phase_draw à phases
            phases.appendChild(phase_draw);
            // Création de phase_standby
            var phase_standby = document.createElement('radio');
            phase_standby.setAttribute('id', "phase_standby_" + tab_id);
            phase_standby.setAttribute('class', "button middle");
            phase_standby.setAttribute('label', $("i18n").getString("duel.phase.standby"));
            // Ajout phase_standby à phases
            phases.appendChild(phase_standby);
            // Création de phase_main1
            var phase_main1 = document.createElement('radio');
            phase_main1.setAttribute('id', "phase_main1_" + tab_id);
            phase_main1.setAttribute('class', "button middle");
            phase_main1.setAttribute('label', $("i18n").getString("duel.phase.main1"));
            // Ajout phase_main1 à phases
            phases.appendChild(phase_main1);
            // Création de phase_battle
            var phase_battle = document.createElement('radio');
            phase_battle.setAttribute('id', "phase_battle_" + tab_id);
            phase_battle.setAttribute('class', "button middle");
            phase_battle.setAttribute('label', $("i18n").getString("duel.phase.battle"));
            // Ajout phase_battle à phases
            phases.appendChild(phase_battle);
            // Création de phase_main2
            var phase_main2 = document.createElement('radio');
            phase_main2.setAttribute('id', "phase_main2_" + tab_id);
            phase_main2.setAttribute('class', "button middle");
            phase_main2.setAttribute('label', $("i18n").getString("duel.phase.main2"));
            // Ajout phase_main2 à phases
            phases.appendChild(phase_main2);
            // Création de phase_end
            var phase_end = document.createElement('radio');
            phase_end.setAttribute('id', "phase_end_" + tab_id);
            phase_end.setAttribute('class', "button right");
            phase_end.setAttribute('label', $("i18n").getString("duel.phase.end"));
            // Ajout phase_end à phases
            phases.appendChild(phase_end);
          // Ajout phases à field_centralbar
          field_centralbar.appendChild(phases);
          // Création field_centralbar_spacer2
          var field_centralbar_spacer2 = document.createElement('spacer');
          field_centralbar_spacer2.setAttribute('flex', "1");
          // Ajout field_centralbar_spacer2 à field_centralbar
          field_centralbar.appendChild(field_centralbar_spacer2);
          
          
          // Création hbox_buttons
          var hbox_buttons = document.createElement('hbox');
          hbox_buttons.setAttribute('id', "hbox_buttons_" + tab_id);
          // Ajout hbox_buttons au field_centralbar
          field_centralbar.appendChild(hbox_buttons);
          
          
          
          
        // Ajout field_centralbar au Stack
        stack.appendChild(field_centralbar);
      
      
      
      
      
      
      // Ajout stack au duel_hbox
      duel_hbox.appendChild(stack);
      // Création vbox_sidebar
      var vbox_sidebar = document.createElement('vbox');
      vbox_sidebar.setAttribute('flex', "1");
      
      
      
      // Ajout vbox_sidebar au duel_hbox
      duel_hbox.appendChild(vbox_sidebar);
    // Ajout duel_hbox au deck
    $("deck").appendChild(duel_hbox);
    
    
    
    
    
    
    
    
    
    
    
    return tab;
  },
  /***************************************************************************************************************
   *  Function : newMuc
   *
   *  Ouvre un onglet en y chargeant un salon de discussion
   * 
   *  Parameters :
   *    (String) rid - Room ID du Salon Jabber
   */
  newMuc : function (rid) {
    var muc = new Muc (rid.toLowerCase());
    muc.loadTemplate();
    Tabs.id++;
    var tab_id = Tabs.id;
    var tab = new Tab (tab_id,"muc",muc);
    Tabs.tabs[tab_id] = tab;
    // Création Onglet
    var radiotab = document.createElement('radio');
    radiotab.setAttribute('id', "tab_" + tab_id);
    radiotab.setAttribute('tooltiptext', rid);
    radiotab.setAttribute('onclick', "Tabs.tabs[" + tab_id + "].viewPanel();");
    radiotab.setAttribute('ondblclick', "Tabs.tabs[" + tab_id + "].del();");
      // Création Image de l'onglet
      var img_tab = document.createElement('image');
      img_tab.setAttribute('id', "tab_avatar_" + tab_id);
      img_tab.setAttribute('src', "chrome://ylifecore/skin/tabs/muc.png");
      img_tab.setAttribute('width', "64");
      img_tab.setAttribute('height', "64");
      // Ajout Image à l'onglet
      radiotab.appendChild(img_tab);
    $("tabs").appendChild(radiotab);
    // Création de muc_vbox
    var muc_vbox = document.createElement('vbox');
    muc_vbox.setAttribute('id', "iframe_" + tab_id);
    muc_vbox.setAttribute('flex', "1");
      // Création de hbox_iframe
      var hbox_iframe = document.createElement('hbox');
      hbox_iframe.setAttribute('flex', "1");
        // Création de muc_iframe
        var muc_iframe = document.createElement('iframe');
        muc_iframe.setAttribute('id', "muc_iframe_" + rid.toLowerCase());
        muc_iframe.setAttribute('class', "muclog");
        muc_iframe.setAttribute('src', muc.template);
        muc_iframe.setAttribute('flex', "1");
        // Ajout muc_iframe à hbox_iframe
        hbox_iframe.appendChild(muc_iframe);
        // Création de muc_richlistbox
        var muc_richlistbox = document.createElement('richlistbox');
        muc_richlistbox.setAttribute('id', "muc_richlistbox_" + rid.toLowerCase());
        muc_richlistbox.setAttribute('class', "muc_occupants");
        muc_richlistbox.setAttribute('width', "250");
        muc_richlistbox.setAttribute('context', "_child");
          // Création de popup_actions
          var popup_actions = document.createElement('menupopup');
          popup_actions.setAttribute('class', "popup_occupants");
            // Création de menuitem_viewprofile
            var menuitem_viewprofile = document.createElement('menuitem');
            menuitem_viewprofile.setAttribute('class', "menuitem-iconic bt_profile");
            menuitem_viewprofile.setAttribute('label', $("i18n").getString("muc.occupants.view.profile"));
            menuitem_viewprofile.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.viewProfile(document.getElementById('muc_richlistbox_" + rid.toLowerCase() + "').getSelectedItem(0).getAttribute('oid'));");
            // Ajout menuitem_viewprofile à popup_actions
            popup_actions.appendChild(menuitem_viewprofile);
            // Création menuseparator1
            var menuseparator1 = document.createElement('menuseparator');
            // Ajout menuseparator1 à popup_actions
            popup_actions.appendChild(menuseparator1);
            // Création de menuitem_chatwith
            var menuitem_chatwith = document.createElement('menuitem');
            menuitem_chatwith.setAttribute('class', "menuitem-iconic bt_chat");
            menuitem_chatwith.setAttribute('label', $("i18n").getString("muc.occupants.chat.with"));
            menuitem_chatwith.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.chatWith(document.getElementById('muc_richlistbox_" + rid.toLowerCase() + "').getSelectedItem(0).getAttribute('oid'));");
            // Ajout menuitem_chatwith à popup_actions
            popup_actions.appendChild(menuitem_chatwith);
            // Création de menuitem_duelwith
            var menuitem_duelwith = document.createElement('menuitem');
            menuitem_duelwith.setAttribute('class', "menuitem-iconic bt_duel");
            menuitem_duelwith.setAttribute('label', $("i18n").getString("muc.occupants.duel.with"));
            menuitem_duelwith.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.duelWith(document.getElementById('muc_richlistbox_" + rid.toLowerCase() + "').getSelectedItem(0).getAttribute('oid'));");
            // Ajout menuitem_duelwith à popup_actions
            popup_actions.appendChild(menuitem_duelwith);
          // Ajout popup_actions à muc_richlistbox
          muc_richlistbox.appendChild(popup_actions);
        // Ajout muc_richlistbox à hbox_iframe
        hbox_iframe.appendChild(muc_richlistbox);
      // Ajout hbox_iframe à muc_vbox
      muc_vbox.appendChild(hbox_iframe);
      // Création de hbox1
      var hbox1 = document.createElement('hbox');
      hbox1.setAttribute('align', "center");
        // Création de textbox
        var textbox = document.createElement('textbox');
        textbox.setAttribute('id', "muc_message_out_" + rid.toLowerCase());
        textbox.setAttribute('flex', "1");
        textbox.setAttribute('onkeydown', "Tabs.tabs[" + tab_id + "].content.onKeydown(event);");
        // Ajout textbox à hbox1
        hbox1.appendChild(textbox);
        // Création de toolbarbutton_actions 
        var toolbarbutton_actions = document.createElement('toolbarbutton');
        toolbarbutton_actions.setAttribute('class', "bt_utils");
        toolbarbutton_actions.setAttribute('popup', "_child");
          // Création de menupopup_actions
          var menupopup_actions = document.createElement('menupopup');
          menupopup_actions.setAttribute('position', "before_start");
            // Création de menuitem_askforduel
            var menuitem_askforduel = document.createElement('menuitem');
            menuitem_askforduel.setAttribute('class', "menuitem-iconic bt_duel");
            menuitem_askforduel.setAttribute('label', $("i18n").getString("muc.actions.ask.for.duel"));
            menuitem_askforduel.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.askForDuel();");
          // Ajout menuitem_askforduel à menupopup_actions
          menupopup_actions.appendChild(menuitem_askforduel);
          // Ajout menupopup_actions à toolbarbutton_actions
          toolbarbutton_actions.appendChild(menupopup_actions);
        // Ajout toolbarbutton_actions à hbox1
        hbox1.appendChild(toolbarbutton_actions);
        // Création de button2
        var button2 = document.createElement('button');
        button2.setAttribute('oncommand', "Tabs.tabs[" + tab_id + "].content.sendMessage();");
        var button2_image2 = document.createElement('image');
        button2_image2.setAttribute('class', "bt_chat");
        // Ajout button2_image2 à button2
        button2.appendChild(button2_image2);
        var spacer2 = document.createElement('spacer');
        spacer2.setAttribute('flex', "1");
        // Ajout spacer2 à button2
        button2.appendChild(spacer2);
        var button2_label2 = document.createElement('label');
        button2_label2.setAttribute('value', $("i18n").getString("send"));
        // Ajout button2_label2 à button2
        button2.appendChild(button2_label2);
        // Ajout button2 à hbox1
        hbox1.appendChild(button2);
      // Ajout hbox1 à muc_vbox
      muc_vbox.appendChild(hbox1);
    // Ajout muc_vbox au deck
    $("deck").appendChild(muc_vbox);
    return tab;
  },
  /***************************************************************************************************************
   *  Function : getChat
   *
   *    Retourne le Tab d'une conversation privée (en crée un si nécessaire et retourne true)
   * 
   *  Parameters:
   *    (String) jid - Bare JID
  */
  getChat : function (jid) {
    var tab = null;
    for (id in Tabs.tabs) {
      if (Tabs.tabs[id].type == "chat") {
        if (Tabs.tabs[id].content.jid == jid.toLowerCase()) { tab = { id : id, isNew : false }; }
      }
    }
    if (!tab) { 
      var a_tab = Tabs.newChat(jid.toLowerCase());
      tab = { id : a_tab.id, isNew : true };
    }
    return tab;
  },
  /***************************************************************************************************************
   *  Function : getDuel
   *
   *    Retourne le Tab d'un duel (en crée un si nécessaire et retourne true)
   * 
   *  Parameters:
   *    (String) jid - Bare JID
  */
  getDuel : function (jid) {
    var tab = null;
    for (id in Tabs.tabs) {
      if (Tabs.tabs[id].type == "duel") {
        if (Tabs.tabs[id].content.jid == jid.toLowerCase()) { tab = { id : id, isNew : false }; }
      }
    }
    if (!tab) { 
      var a_tab = Tabs.newDuel(jid.toLowerCase());
      tab = { id : a_tab.id, isNew : true };
    }
    return tab;
  },
  /***************************************************************************************************************
   *  Function : isMuc
   *
   *    Retourne le tab.id d'un salon (en crée un si nécessaire et retourne true)
   * 
   *  Parameters:
   *    (String) rid - Room ID du Salon Jabber
  */
  isMuc : function (rid) {
    var tab = { id : 0, exist : false };
    for (id in Tabs.tabs) {
      if (Tabs.tabs[id].type == "muc") {
        if (Tabs.tabs[id].content.rid == rid.toLowerCase()) { tab = { id : id, exist : true }; }
      }
    }
    return tab;
  },
  /***************************************************************************************************************
   *  Function : getMuc
   *
   *    Retourne le tab.id d'un salon (en crée un si nécessaire et retourne true)
   * 
   *  Parameters:
   *    (String) rid - Room ID du Salon Jabber
  */
  getMuc : function (rid) {
    var a_muc = Tabs.isMuc(rid);
    if (a_muc.exist) { 
      var tab = { id : a_muc.id, isNew : false };
    }
    else {
      var a_tab = Tabs.newMuc(rid.toLowerCase());
      var tab = { id : a_tab.id, isNew : true };
    }
    return tab;
  },
  /***************************************************************************************************************
   *  Function : getOccupantsMucOf
   *
   *    Retourne un tableau de (Occupant Object) repérés dans des salons ouverts grâce à leur JID
   * 
   *  Parameters:
   *    (String) jid - Bare JID d'un occupant
  */
  getOccupantsMucOf : function (jid) {
    var result = [];
    for (id in Tabs.tabs) {
      if (Tabs.tabs[id].type == "muc") {
        for (oid in Tabs.tabs[id].content.occupants) {
          if (Tabs.tabs[id].content.occupants[oid].jid == jid) { result.push(Tabs.tabs[id].content.occupants[oid]); }
        }
      }
    }
    return result;
  }
};
