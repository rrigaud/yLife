/***************************************************************************************************************
 *  File : dimensions.js
 * 
 *  Gère les dimensions du terrain de jeu selons les résolutions d'écran
 */




var Dimension = [];

// Dimension[0] pour une résolution d'environ "1024 x 768"
Dimension.push({"name": "1024 x 768",
                // Taille d'un terrain
                "field": { "width": 640, "height": 200 },
                // Coordonnées du Terrain adverse
                "field_op": { "x": 0, "y": 40 },
                // Taille de la barre centrale et coordonnées
                "field_centralbar": { "width": 640, "height": 40, "x": 0, "y": 241 },
                // Coordonnées de mon terrain
                "field_me": { "x": 0, "y": 280 },
                // Taille d'une carte
                "card": { "width": 64, "height": 94 },
                // Coordonnées des différentes zones (haut gauche car le bas droite est calculé grâce aux tailles de cartes)
                // field_me.x + 10px de marge gauche // field_me.y + 4px de marge haut
                "zone_F": { "x": 10, "y": 284 },
                // zone_F.x + 64px de carte + 29px d'écart entre chaque zone
                "zone_M1": { "x": 103, "y": 284 },
                "zone_M2": { "x": 196, "y": 284 },
                "zone_M3": { "x": 289, "y": 284 },
                "zone_M4": { "x": 382, "y": 284 },
                "zone_M5": { "x": 475, "y": 284 },
                "zone_G": { "x": 568, "y": 284 },
                // field_me.y + 98px de marge haut (card.height + Marge)
                "zone_E": { "x": 10, "y": 378 },
                "zone_ST1": { "x": 103, "y": 378 },
                "zone_ST2": { "x": 196, "y": 378 },
                "zone_ST3": { "x": 289, "y": 378 },
                "zone_ST4": { "x": 382, "y": 378 },
                "zone_ST5": { "x": 475, "y": 378 },
                "zone_D": { "x": 568, "y": 378 },
                // Coordonnées : Main
                // Valeur Y à retrancher pour obtenir les coordonnées de la main adverse (car le terrain n'est pas parfaitement symétrique, la main adverse est tronquée)
                // 94 (hauteur carte entier) + 14 (écart main-field utilisé en bas) = 108
                // Mais comme le field commence à 40, le début commence à 40 - 108 = - 68... (mais apparemment c'est pas exact)
                "hand_op_offset_y": 68,
                "hand": { "x": 10, "y": 486 },
                "hand_spacing_x": 20});

// Dimension[1] pour une résolution d'environ "1680 x 1050"
Dimension.push({"name": "1680 x 1050",
                // Taille d'un terrain
                "field": { "width": 800, "height": 250 },
                // Coordonnées du Terrain adverse
                "field_op": { "x": 0, "y": 50 },
                // Taille de la barre centrale et coordonnées
                "field_centralbar": { "width": 800, "height": 64, "x": 0, "y": 302 },
                // Coordonnées de mon terrain
                "field_me": { "x": 0, "y": 370 },
                // Taille d'une carte
                "card": { "width": 79, "height": 116 },
                // Coordonnées des différentes zones (haut gauche car le bas droite est calculé grâce aux tailles de cartes)
                // field_me.x + 12px de marge gauche // field_me.y + 5px de marge haut
                "zone_F": { "x": 12, "y": 375 },
                // zone_F.x + 79px de carte + 37px d'écart entre chaque zone
                "zone_M1": { "x": 127, "y": 375 },
                "zone_M2": { "x": 243, "y": 375 },
                "zone_M3": { "x": 360, "y": 375 },
                "zone_M4": { "x": 477, "y": 375 },
                "zone_M5": { "x": 593, "y": 375 },
                "zone_G": { "x": 710, "y": 375 },
                // field_me.y + 128px de marge haut (card.height + Marge)
                "zone_E": { "x": 12, "y": 498 },
                "zone_ST1": { "x": 127, "y": 498 },
                "zone_ST2": { "x": 243, "y": 498 },
                "zone_ST3": { "x": 360, "y": 498 },
                "zone_ST4": { "x": 477, "y": 498 },
                "zone_ST5": { "x": 593, "y": 498 },
                "zone_D": { "x": 710, "y": 498 },
                // Coordonnées : Main
                // Valeur Y à retrancher pour obtenir les coordonnées de la main adverse (car le terrain n'est pas parfaitement symétrique, la main adverse est tronquée)
                // 116 (hauteur carte entier) + 16 (écart main-field utilisé en bas) = 132
                // Mais comme le field commence à 50, le début commence à 50 - 132 = - 82... (mais apparemment c'est pas exact)
                "hand_op_offset_y": 76,
                "hand": { "x": 12, "y": 630 },
                "hand_spacing_x": 20});


// Tailles d'un Popup de cartes (Summon/set) selon la résolution (mêmes indices que le tableau Dimension)
var Dimension_Popup = [];

// Dimension_Popup[0] pour une résolution d'environ "1024 x 768"
Dimension_Popup.push({"width": 271, "height": 140});
// Dimension_Popup[1] pour une résolution d'environ "1680 x 1050"
Dimension_Popup.push({"width": 271, "height": 140});

