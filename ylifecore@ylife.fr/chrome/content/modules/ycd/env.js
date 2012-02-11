/***************************************************************************************************************
 *  File : env.js
 * 
 *  Gère la classe Env
 */




/***************************************************************************************************************
 *  Class : Env
 * 
 *  Cette classe gère l'environnement des cartes dans une langue donnée
 * 
 *  Parameters:
 *    (Ycd Object) ycd - Base de données YCD avec ses functions et properties
 *    (Integer) language_id - ID d'une langue
 */
function Env (ycd,language_id) {
  this.ycd = ycd;
  this.language_id = language_id;
  /***************************************************************************************************************
   *  Function : getFormatsBy
   *
   *  Retourne un tableau de {id,name,description} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getFormatsBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Format_ID, Name, Description FROM formats WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1),"description" : data.getString(2)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getFormat
   *
   *  Retourne un format {id,name,description} dans la langue de l'environnement (par défaut {0,No Limit, No limitations})
   * 
   *  Parameters :
   *    (Integer) format_id - ID d'un format de jeu
   */
  this.getFormat = function (format_id) {
    var result = {"id" : 0,"name" : "No Limit","description" : "No limitations"};
    var data = this.ycd.db.query("SELECT Name, Description FROM formats WHERE Format_ID='"+format_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = {"id" : format_id,"name" : data.getString(0),"description" : data.getString(1)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getModelsBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getModelsBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Model_ID, Name FROM models WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getModel
   *
   *  Retourne un modèle dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) model_id - ID d'un modèle
   */
  this.getModel = function (model_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name FROM models WHERE Model_ID='"+model_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getTypesBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getTypesBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Card_Type_ID, Name FROM card_types WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getType
   *
   *  Retourne un type de carte dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) type_id - ID d'un type de carte
   */
  this.getType = function (type_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name FROM card_types WHERE Card_Type_ID='"+type_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getSubtypesBy
   *
   *  Retourne un tableau de {id,name,type_id} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getSubtypesBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Type_ID, Name, Card_Type_ID FROM types WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1),"type_id": data.getInt32(2)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getSubtype
   *
   *  Retourne un sous-type de carte {name,type_id} dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) type_id - ID d'un sous-type de carte
   */
  this.getSubtype = function (type_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name, Card_Type_ID FROM types WHERE Type_ID='"+type_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = {"name" : data.getString(0),"type_id": data.getInt32(1)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterAttributesBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getMonsterAttributesBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Monster_Attribute_ID, Name FROM monster_attributes WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getMonsterAttribute
   *
   *  Retourne un attribut de monstre dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) monster_attribute_id - ID d'un attribut de monstre
   */
  this.getMonsterAttribute = function (monster_attribute_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name FROM monster_attributes WHERE Monster_Attribute_ID='"+monster_attribute_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterTypesBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getMonsterTypesBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Monster_Type_ID, Name FROM monster_types WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getMonsterType
   *
   *  Retourne un type de monstre dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) monster_type_id - ID d'un type de monstre
   */
  this.getMonsterType = function (monster_type_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name FROM monster_types WHERE Monster_Type_ID='"+monster_type_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterSubtypesBy
   *
   *  Retourne un tableau de {id,name} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getMonsterSubtypesBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Monster_Subtype_ID, Name FROM monster_subtypes WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getMonsterSubtype
   *
   *  Retourne un sous-type de monstre dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) monster_subtype_id - ID d'un sous-type de monstre
   */
  this.getMonsterSubtype = function (monster_subtype_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name FROM monster_subtypes WHERE Monster_Subtype_ID='"+monster_subtype_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getMonsterEffectsBy
   *
   *  Retourne un tableau de {id,name,description} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getMonsterEffectsBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Monster_Effect_ID, Name, Description FROM monster_effects WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1),"description" : data.getString(2)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getMonsterEffect
   *
   *  Retourne un effet de monstre {id,name,description} dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) monster_effect_id - ID d'un effet de monstre
   */
  this.getMonsterEffect = function (monster_effect_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name, Description FROM monster_effects WHERE Monster_Effect_ID='"+monster_effect_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = {"id" : monster_effect_id,"name" : data.getString(0),"description" : data.getString(1)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getRaritiesBy
   *
   *  Retourne un tableau de {id,name,description} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getRaritiesBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Rarity_ID, Name, Description FROM rarities WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1),"description" : data.getString(2)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getRarity
   *
   *  Retourne une rareté {id,name,description} dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) rarity_id - ID d'une rareté
   */
  this.getRarity = function (rarity_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name, Description FROM rarities WHERE Rarity_ID='"+rarity_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = {"id" : rarity_id,"name" : data.getString(0),"description" : data.getString(1)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getTagsBy
   *
   *  Retourne un tableau de {id,name,description} trié selon la demande
   * 
   *  Parameters :
   *    (String) order - Morceau de requête SQL (ORDER BY)
   */
  this.getTagsBy = function (order) {
    var results = new Array();
    var data = this.ycd.db.query("SELECT DISTINCT Tag_ID, Name, Description FROM tags WHERE Language_ID='"+this.language_id+"' ORDER BY " + order);
    while (data.executeStep()) {
      results.push({"id": data.getInt32(0),"name" : data.getString(1),"description" : data.getString(2)});
    }
    data.reset();
    return results;
  };
  /***************************************************************************************************************
   *  Function : getTag
   *
   *  Retourne un tag {id,name,description} dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) tag_id - ID d'un tag
   */
  this.getTag = function (tag_id) {
    var result = null;
    var data = this.ycd.db.query("SELECT Name, Description FROM tags WHERE Tag_ID='"+tag_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = {"id" : tag_id,"name" : data.getString(0),"description" : data.getString(1)};
    }
    data.reset();
    return result;
  };
  /***************************************************************************************************************
   *  Function : getRuling
   *
   *  Retourne un ruling dans la langue de l'environnement
   * 
   *  Parameters :
   *    (Integer) ruling_id - ID d'un ruling
   */
  this.getRuling = function (ruling_id) {
    var result = "?";
    var data = this.ycd.db.query("SELECT Ruling FROM rulings WHERE Ruling_ID='"+ruling_id+"' AND Language_ID='"+this.language_id+"'");
    while (data.executeStep()) {
      result = data.getString(0);
    }
    data.reset();
    return result;
  };
}
