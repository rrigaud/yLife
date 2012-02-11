/***************************************************************************************************************
 *  File : dragdrop.js
 * 
 *  Gère les drag and drop du module Deckbuilder
 */



var previous_index = 0;
/***************************************************************************************************************
 *  Function : deckDragEnter
 * 
 *  Début d'un drag/drop dans un Deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 *    (Node Object) node - Noeud DOM du Deck
 */
function deckDragEnter (event,node) {
  return true;
}
/***************************************************************************************************************
 *  Function : deckDragOver
 * 
 *  Survol d'un Deck par une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 *    (Node Object) node - Noeud DOM du Deck
 */
function deckDragOver (event,node) {
  var source = event.dataTransfer.getData("source");
  var target_id = event.target.getAttribute('id');
  var target_class = event.target.getAttribute('class');
  if (source == "current_card") {
    
  }
  else {
    var element_id = event.dataTransfer.getData("id");
    // Si on est au-dessous des items
    if (target_class == "deck") {
      node.appendChild($(element_id).parentNode);
      previous_index = node.getIndexOfItem($(element_id).parentNode);
    }
    // Si on est sur un item
    else {
      var target_index = node.getIndexOfItem($(target_id).parentNode);
      // Si on vient du haut
      if (previous_index < target_index) {
        node.insertBefore($(element_id).parentNode, event.target.parentNode.nextSibling);
      }
      // Si on vient du bas
      else {
        event.target.parentNode.parentNode.insertBefore($(element_id).parentNode, event.target.parentNode);
      }
      previous_index = target_index;
    }
    Deckbuilder.deck_not_saved = true;
  }
  return false;
}
/***************************************************************************************************************
 *  Function : deckDrop
 * 
 *  Drop sur le Main Deck d'une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 *    (Node Object) node - Noeud DOM du Deck
 */
function deckDrop (event,node) {
  var source = event.dataTransfer.getData("source");
  var target_id = event.target.getAttribute('id');
  var target_class = event.target.getAttribute('class');
  if (source == "current_card") {
    if (target_class == "deck") { var index = null; }
    else { var index = event.target.parentNode.parentNode.getIndexOfItem($(target_id).parentNode); }
    var deck = node.getAttribute('id');
    Deckbuilder.addCard(deck,index);
    Deckbuilder.deck_not_saved = true;
  }
  return false;
}




/***************************************************************************************************************
 *  Function : deckcardDragStart
 * 
 *  Début d'un drag/drop d'une carte du Main Deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function deckcardDragStart (event) {
  event.dataTransfer.setData('source', "deck");
  event.dataTransfer.setData('deck', event.target.parentNode.parentNode.getAttribute('id'));
  event.dataTransfer.setData('card_id', event.target.getAttribute('card_id'));
  event.dataTransfer.setData('id', event.target.getAttribute('id'));
  previous_index = event.target.parentNode.parentNode.getIndexOfItem($(event.target.getAttribute('id')).parentNode);
  event.dataTransfer.setData('index', previous_index);
  event.dataTransfer.setDragImage(event.target,0,0);
  return true;
}
/***************************************************************************************************************
 *  Function : deckcardDragEnd
 * 
 *  Fin d'un drag/drop d'une carte du Main Deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function deckcardDragEnd (event) {
  return true;
}



/***************************************************************************************************************
 *  Function : radiodeckDragOver
 * 
 *  Survol d'un bouton de sélection de Deck avec une carte
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 *    (Node Object) node - Noeud DOM du radiobutton survolé
 */
function radiodeckDragOver (event,node) {
  var source = event.dataTransfer.getData("source");
  if (source == "current_card") {
    if (node.getAttribute('id') == "radio_maindeck") { node.setAttribute("class","button left dropdeck"); }
    if (node.getAttribute('id') == "radio_sidedeck") { node.setAttribute("class","button middle dropdeck"); }
    if (node.getAttribute('id') == "radio_extradeck") { node.setAttribute("class","button right dropdeck"); }
    return false;
  }
  else {
    var deck_source = event.dataTransfer.getData("deck");
    if ((node.getAttribute('id') == "radio_" + deck_source)||(node.getAttribute('id') == "radio_extradeck")||(deck_source == "extradeck")) {
      return true;
    }
    else {
      if (node.getAttribute('id') == "radio_maindeck") { node.setAttribute("class","button left dropdeck"); }
      if (node.getAttribute('id') == "radio_sidedeck") { node.setAttribute("class","button middle dropdeck"); }
      if (node.getAttribute('id') == "radio_extradeck") { node.setAttribute("class","button right dropdeck"); }
      return false;
    }
  }
}
/***************************************************************************************************************
 *  Function : radiodeckDragLeave
 * 
 *  Fin du survol d'un bouton de sélection de Deck avec une carte
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 *    (Node Object) node - Noeud DOM du radiobutton survolé
 */
function radiodeckDragLeave (event,node) {
  if (node.getAttribute('id') == "radio_maindeck") { node.setAttribute("class","button left"); }
  if (node.getAttribute('id') == "radio_sidedeck") { node.setAttribute("class","button middle"); }
  if (node.getAttribute('id') == "radio_extradeck") { node.setAttribute("class","button right"); }
  return false;
}
/***************************************************************************************************************
 *  Function : radiodeckDrop
 * 
 *  Drop d'une carte sur un bouton de sélection de Deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 *    (Node Object) node - Noeud DOM du radiobutton survolé
 */
function radiodeckDrop (event,node) {
  var source = event.dataTransfer.getData("source");
  var deck_source = event.dataTransfer.getData("deck");
  var deck_target = node.value;
  if (node.getAttribute('id') == "radio_maindeck") { node.setAttribute("class","button left"); }
  if (node.getAttribute('id') == "radio_sidedeck") { node.setAttribute("class","button middle"); }
  if (node.getAttribute('id') == "radio_extradeck") { node.setAttribute("class","button right"); }
  if (source == "current_card") {
    Deckbuilder.addCard(deck_target,null);
    return false;
  }
  else {
    // Avant de déplacer 1 exemplaire, on replace la carte à son index de départ
    // afin d'éviter le "bug" de déplacement tout en haut pour accéder au main/side
    var index = event.dataTransfer.getData("index");
    Deckbuilder.indexCard(deck_source,deck_target);
    Deckbuilder.moveCard(deck_source, deck_target);
    return false;
  }
}





/***************************************************************************************************************
 *  Function : cardDragStart
 * 
 *  Début d'un drag/drop de la carte courante
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardDragStart (event) {
  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData('source', "current_card");
  event.dataTransfer.setData('card_id', event.target.getAttribute('card_id'));
  event.dataTransfer.setDragImage(event.target,0,0);
  return true;
}
/***************************************************************************************************************
 *  Function : cardDragEnd
 * 
 *  Fin d'un drag/drop de la carte courante
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardDragEnd (event) {
  return true;
}





/***************************************************************************************************************
 *  Function : cardpanelDragOver
 * 
 *  Survol du panel "carte" d'une deckcard à supprimer du deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardpanelDragOver (event) {
  var source = event.dataTransfer.getData("source");
  if (source == "current_card") {
    return true;
  }
  else {
    return false;
  }
}
/***************************************************************************************************************
 *  Function : cardpanelDrop
 * 
 *  Drop sur le panel "carte" d'une deckcard à supprimer du deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardpanelDrop (event) {
  var source = event.dataTransfer.getData("source");
  if (source == "current_card") {
    return true;
  }
  else {
    var deck = event.dataTransfer.getData("deck");
    var index = event.dataTransfer.getData("index");
    // Avant de supprimer 1 exemplaire, on replace la carte à son index de départ
    // afin d'éviter le bug de déplacement à la toute fin en passant sur l'ascenseur des Deck
    Deckbuilder.indexCard(deck,index);
    Deckbuilder.delCard(deck);
    return false;
  }
}









/***************************************************************************************************************
 *  Function : cardlistDragEnter
 * 
 *  Début d'un drag/drop dans un Deck
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardlistDragEnter (event) {
  //alert("dragenter");
  return true;
}
/***************************************************************************************************************
 *  Function : deckDragOver
 * 
 *  Survol d'un Deck par une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardlistDragOver (event) {
  //alert("dragover");
  return false;
}
/***************************************************************************************************************
 *  Function : deckDrop
 * 
 *  Drop sur le Main Deck d'une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardlistDrop (event) {
  //alert("drop");
  return false;
}
/***************************************************************************************************************
 *  Function : deckDragOver
 * 
 *  Survol d'un Deck par une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardlistDragStart (event) {
  alert("dragstart");
  return false;
}
/***************************************************************************************************************
 *  Function : deckDragOver
 * 
 *  Survol d'un Deck par une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardlistDragEnd (event) {
  alert("dragend");
  return false;
}

/***************************************************************************************************************
 *  Function : deckDragOver
 * 
 *  Survol d'un Deck par une carte à insérer
 * 
 *  Parameters :
 *    (Event Object) event - Evènement de drag/drop
 */
function cardlistDragGesture (event) {
  //event.dataTransfer.setData('id', event.target.getAttribute('id'));
  //event.dataTransfer.setDragImage(event.target,0,0);
  //alert(event.target.getAttribute('id'));
  return false;
}
