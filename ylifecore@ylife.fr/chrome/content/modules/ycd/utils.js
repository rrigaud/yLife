/***************************************************************************************************************
 *  File : utils.js
 * 
 *  Fonctions/tableaux pratiques pour convertir des informations rapidement, sans utiliser les objets ycd,env,card
 */




/***************************************************************************************************************
 *  Array : ylife_type
 * 
 *  Tableau contenant les ylife_type pour afficher les couleurs/backgrounds en fonction du subtype_id
 */
var ylife_type = [];
ylife_type[1] = "monster_normal";
ylife_type[2] = "monster_effect";
ylife_type[3] = "monster_fusion";
ylife_type[4] = "monster_ritual";
ylife_type[14] = "monster_synchro";
ylife_type[5] = "spell";
ylife_type[6] = "spell";
ylife_type[7] = "spell";
ylife_type[8] = "spell";
ylife_type[9] = "spell";
ylife_type[10] = "spell";
ylife_type[11] = "trap";
ylife_type[12] = "trap";
ylife_type[13] = "trap";
/***************************************************************************************************************
 *  Array : ylife_attribute
 * 
 *  Tableau contenant les ylife_attribute en fonction du type_id et du monster_attribute_id
 */
var ylife_attribute = [];
ylife_attribute[1] = [];
ylife_attribute[1][1] = "monster_dark";
ylife_attribute[1][2] = "monster_earth";
ylife_attribute[1][3] = "monster_fire";
ylife_attribute[1][4] = "monster_light";
ylife_attribute[1][5] = "monster_water";
ylife_attribute[1][6] = "monster_wind";
ylife_attribute[2] = "spell";
ylife_attribute[3] = "trap";
/***************************************************************************************************************
 *  Array : ylife_subtype
 * 
 *  Tableau contenant les ylife_subtype pour afficher les icônes en fonction du subtype_id
 */
var ylife_subtype = [];
ylife_subtype[6] = "continuous";
ylife_subtype[7] = "equip";
ylife_subtype[8] = "field";
ylife_subtype[9] = "quick-play";
ylife_subtype[10] = "ritual";
ylife_subtype[12] = "continuous";
ylife_subtype[13] = "counter";
/***************************************************************************************************************
 *  Array : ylife_language
 * 
 *  Tableau contenant les ylife_language pour afficher les drapeaux en fonction du language_id
 */
var ylife_language = [];
ylife_language[1] = "en-US";
ylife_language[2] = "fr-FR";


