/***************************************************************************************************************
 *  File : zones.js
 * 
 *  Extension de la classe Duel : Gère les zones du terrain
 */




/***************************************************************************************************************
 *  Function : getZone
 * 
 *  Retourne la zone correspondante aux coordonnées (F,M1,M2,M3,M4,M5,G,E,ST1,ST2,ST3,ST4,ST5,D,H)
 * 
 *  Parameters:
 *    (Integer) x - Abscisse de la carte
 *    (Integer) y - Ordonnée de la carte
 */
Duel.prototype.getZone = function (x,y) {
  var result = "";
  
  // Field Zone
  var x1 = parseInt(this.dimensions.zone_F.x);
  var x2 = parseInt(this.dimensions.zone_F.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_F.y);
  var y2 = parseInt(this.dimensions.zone_F.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "F"; }
  // Monster Zone 1
  var x1 = parseInt(this.dimensions.zone_M1.x);
  var x2 = parseInt(this.dimensions.zone_M1.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_M1.y);
  var y2 = parseInt(this.dimensions.zone_M1.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "M1"; }
  // Monster Zone 2
  var x1 = parseInt(this.dimensions.zone_M2.x);
  var x2 = parseInt(this.dimensions.zone_M2.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_M2.y);
  var y2 = parseInt(this.dimensions.zone_M2.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "M2"; }
  // Monster Zone 3
  var x1 = parseInt(this.dimensions.zone_M3.x);
  var x2 = parseInt(this.dimensions.zone_M3.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_M3.y);
  var y2 = parseInt(this.dimensions.zone_M3.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "M3"; }
  // Monster Zone 4
  var x1 = parseInt(this.dimensions.zone_M4.x);
  var x2 = parseInt(this.dimensions.zone_M4.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_M4.y);
  var y2 = parseInt(this.dimensions.zone_M4.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "M4"; }
  // Monster Zone 5
  var x1 = parseInt(this.dimensions.zone_M5.x);
  var x2 = parseInt(this.dimensions.zone_M5.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_M5.y);
  var y2 = parseInt(this.dimensions.zone_M5.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "M5"; }
  // Graveyard Zone
  var x1 = parseInt(this.dimensions.zone_G.x);
  var x2 = parseInt(this.dimensions.zone_G.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_G.y);
  var y2 = parseInt(this.dimensions.zone_G.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "G"; }
  // Extra Zone
  var x1 = parseInt(this.dimensions.zone_E.x);
  var x2 = parseInt(this.dimensions.zone_E.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_E.y);
  var y2 = parseInt(this.dimensions.zone_E.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "E"; }
  // Spell/Trap Zone 1
  var x1 = parseInt(this.dimensions.zone_ST1.x);
  var x2 = parseInt(this.dimensions.zone_ST1.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_ST1.y);
  var y2 = parseInt(this.dimensions.zone_ST1.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "ST1"; }
  // Spell/Trap Zone 2
  var x1 = parseInt(this.dimensions.zone_ST2.x);
  var x2 = parseInt(this.dimensions.zone_ST2.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_ST2.y);
  var y2 = parseInt(this.dimensions.zone_ST2.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "ST2"; }
  // Spell/Trap Zone 3
  var x1 = parseInt(this.dimensions.zone_ST3.x);
  var x2 = parseInt(this.dimensions.zone_ST3.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_ST3.y);
  var y2 = parseInt(this.dimensions.zone_ST3.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "ST3"; }
  // Spell/Trap Zone 4
  var x1 = parseInt(this.dimensions.zone_ST4.x);
  var x2 = parseInt(this.dimensions.zone_ST4.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_ST4.y);
  var y2 = parseInt(this.dimensions.zone_ST4.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "ST4"; }
  // Spell/Trap Zone 5
  var x1 = parseInt(this.dimensions.zone_ST5.x);
  var x2 = parseInt(this.dimensions.zone_ST5.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_ST5.y);
  var y2 = parseInt(this.dimensions.zone_ST5.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "ST5"; }
  // Deck Zone
  var x1 = parseInt(this.dimensions.zone_D.x);
  var x2 = parseInt(this.dimensions.zone_D.x) + parseInt(this.dimensions.card.width);
  var y1 = parseInt(this.dimensions.zone_D.y);
  var y2 = parseInt(this.dimensions.zone_D.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "D"; }
  // Hand
  var x1 = 0;
  var x2 = parseInt(this.dimensions.field.width);
  var y1 = parseInt(this.dimensions.zone_E.y) + parseInt(this.dimensions.card.height);
  var y2 = parseInt(this.dimensions.hand.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = "H"; }
  
  return result;
}



/***************************************************************************************************************
 *  Function : getFreeZone
 * 
 *  Retourne la première zone libre de mon terrain ou du terrain adverse
 * 
 *  Parameters:
 *    (String) player - terrain du joueur (me/op)
 *    (String) type - (facultatif) type de zone souhaité (monster/spelltrap)
 */
Duel.prototype.getFreeZone = function (player,type) {
  var result = "";
  var result_monster = "";
  var result_spelltrap = "";
  
  // On cherche à partir de la dernière zone monstre, comme ça, on écrase à chaque fois par une zone plus proche du début
  for (var i = 5 ; i > 0 ; i--) {
    var location = "M" + i;
    var free = true;
    // On cherche à quelle carte correspond cette abscisse
    var j_max = this.cards.length;
    for (var j = 0 ; j < j_max ; j++) {
      // Si une carte s'y trouve, la zone n'est pas libre
      if ((this.cards[j].array == "field_" + player)&&(this.cards[j].location == location)) { free = false; }
    }
    if (free) { result_monster = location; }
  }
  // On cherche à partir de la dernière zone spelltrap, comme ça, on écrase à chaque fois par une zone plus proche du début
  for (var i = 5 ; i > 0 ; i--) {
    var location = "ST" + i;
    var free = true;
    // On cherche à quelle carte correspond cette abscisse
    var j_max = this.cards.length;
    for (var j = 0 ; j < j_max ; j++) {
      // Si une carte s'y trouve, la zone n'est pas libre
      if ((this.cards[j].array == "field_" + player)&&(this.cards[j].location == location)) { free = false; }
    }
    if (free) { result_spelltrap = location; }
  }
  
  if (type == "spelltrap") { result = result_spelltrap; }
  else { result = result_monster; }
  
  return result;
}



/***************************************************************************************************************
 *  Function : isDroppedInField
 * 
 *  Retourne true si la carte est lâché quelque part sur le terrain de jeu (le mien ou l'adverse)
 *  (Du Main deck adverse à ma zone ST5 pour faire simple)
 * 
 *  Parameters:
 *    (Integer) x - Abscisse de la carte
 *    (Integer) y - Ordonnée de la carte
 */
Duel.prototype.isDroppedInField = function (x,y) {
  var result = false;
  
  var x1 = parseInt(this.dimensions.field_op.x);
  var x2 = parseInt(this.dimensions.zone_D.x);
  var y1 = parseInt(this.dimensions.field_op.y);
  var y2 = parseInt(this.dimensions.zone_E.y) + parseInt(this.dimensions.card.height);
  if ((x1 <= x)&&(x <= x2)&&(y1 <= y)&&(y <= y2)) { result = true; }
  
  return result;
}


