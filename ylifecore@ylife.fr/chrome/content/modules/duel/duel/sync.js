/***************************************************************************************************************
 *  File : sync.js
 * 
 *  Extension de la classe Duel : Gère la synchronisation du Duel après réception d'une action adverse
 */




/***************************************************************************************************************
 *  Function : sync
 * 
 *  A partir d'une action adverse reçue par Jabber, on synchronise l'état du Duel (MAJ des tableaux,...)
 * 
 *  Parameters:
 *    (DOM Tree Object) msg - Message sous forme de tree DOM
 */
Duel.prototype.sync = function (msg) {
  var result = {"x": 0, "y": 0};
  // Field Zone
  if (Zone == "F") { result = {"x": parseInt(this.dimensions.zone_F.x), "y": parseInt(this.dimensions.zone_F.y)}; }
  // Monster Zone 1
  if (Zone == "M1") { result = {"x": parseInt(this.dimensions.zone_M1.x), "y": parseInt(this.dimensions.zone_M1.y)}; }
  // Monster Zone 2
  if (Zone == "M2") { result = {"x": parseInt(this.dimensions.zone_M2.x), "y": parseInt(this.dimensions.zone_M2.y)}; }
  // Monster Zone 3
  if (Zone == "M3") { result = {"x": parseInt(this.dimensions.zone_M3.x), "y": parseInt(this.dimensions.zone_M3.y)}; }
  // Monster Zone 4
  if (Zone == "M4") { result = {"x": parseInt(this.dimensions.zone_M4.x), "y": parseInt(this.dimensions.zone_M4.y)}; }
  // Monster Zone 5
  if (Zone == "M5") { result = {"x": parseInt(this.dimensions.zone_M5.x), "y": parseInt(this.dimensions.zone_M5.y)}; }
  // Graveyard Zone
  if (Zone == "G") { result = {"x": parseInt(this.dimensions.zone_G.x), "y": parseInt(this.dimensions.zone_G.y)}; }
  // Extra Zone
  if (Zone == "E") { result = {"x": parseInt(this.dimensions.zone_E.x), "y": parseInt(this.dimensions.zone_E.y)}; }
  // Spell/Trap Zone 1
  if (Zone == "ST1") { result = {"x": parseInt(this.dimensions.zone_ST1.x), "y": parseInt(this.dimensions.zone_ST1.y)}; }
  // Spell/Trap Zone 2
  if (Zone == "ST2") { result = {"x": parseInt(this.dimensions.zone_ST2.x), "y": parseInt(this.dimensions.zone_ST2.y)}; }
  // Spell/Trap Zone 3
  if (Zone == "ST3") { result = {"x": parseInt(this.dimensions.zone_ST3.x), "y": parseInt(this.dimensions.zone_ST3.y)}; }
  // Spell/Trap Zone 4
  if (Zone == "ST4") { result = {"x": parseInt(this.dimensions.zone_ST4.x), "y": parseInt(this.dimensions.zone_ST4.y)}; }
  // Spell/Trap Zone 5
  if (Zone == "ST5") { result = {"x": parseInt(this.dimensions.zone_ST5.x), "y": parseInt(this.dimensions.zone_ST5.y)}; }
  // Deck Zone
  if (Zone == "D") { result = {"x": parseInt(this.dimensions.zone_D.x), "y": parseInt(this.dimensions.zone_D.y)}; }
  
  return result;
}


