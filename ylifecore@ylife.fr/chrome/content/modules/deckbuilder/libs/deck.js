/***************************************************************************************************************
 *  File : deck.js
 * 
 *  Gère la classe Deck
 */




/***************************************************************************************************************
 *  Class : Deck
 * 
 *  Cette classe gère un deck
 */
function Deck () {
  this.data = null;
  this.code = null;
  this.file = null;
  this.name = "";
  this.format_id = 0;
  this.format_name = "No Limit";
  this.notes = "";
  this.created = "";
  this.updated = "";
  this.main = [];
  this.side = [];
  this.extra = [];
  /***************************************************************************************************************
   *  Function : loadNew
   *
   *  Initialise un deck vierge
   */
  this.loadNew = function () {
    this.data = null;
    this.code = null;
    this.file = null;
    this.name = "";
    this.format_id = parseInt(Prefs.getChar("decks.format"));
    this.format_name = "No Limit";
    this.notes = "";
    this.created = "";
    this.updated = "";
    this.main = [];
    this.side = [];
    this.extra = [];
  };
  /***************************************************************************************************************
   *  Function : loadFromXyd
   *
   *  Charge un deck en mémoire à partir d'un fichier XML (.xyd)
   * 
   *  Parameters :
   *    (nsIFile) file - Fichier .xyd (XML Yugioh Deck)
   *    (String) data_xml - Contenu XML d'un fichier .xyd (XML Yugioh Deck)
   */
  this.loadFromXyd = function (file,data_xml) {
    var data = data_xml.replace(/\<\?xml version="1.0" encoding="UTF-8"\?\>/,"");
    var deck_xml = new XML(data);
    // Si le deck est au format XYD et que la source de données est YCD
    if(deck_xml.datasource.@id == "ycd") {
      // Variables de base
      this.data = data_xml;
      this.file = file;
      this.name = file.leafName;
      this.format_id = deck_xml.deck.format.@id;
      this.notes = deck_xml.deck.notes.toString();
      this.created = deck_xml.deck.created_at.toString();
      this.updated = deck_xml.deck.updated_at.toString();
      // On récupère les cartes et on les stocke dans les tableaux de cartes
      this.main = [];
      for (var i = 0 ; i < deck_xml.deck.maindeck.card.length() ; i++) {
        this.main.push({"number": deck_xml.deck.maindeck.card[i].@number,"card_id": deck_xml.deck.maindeck.card[i].@id});
      }
      this.side = [];
      for (var i = 0 ; i < deck_xml.deck.sidedeck.card.length() ; i++) {
        this.side.push({"number": deck_xml.deck.sidedeck.card[i].@number,"card_id": deck_xml.deck.sidedeck.card[i].@id});
      }
      this.extra = [];
      for (var i = 0 ; i < deck_xml.deck.extradeck.card.length() ; i++) {
        this.extra.push({"number": deck_xml.deck.extradeck.card[i].@number,"card_id": deck_xml.deck.extradeck.card[i].@id});
      }
    }
  };
  /***************************************************************************************************************
   *  Function : loadFromCode
   *
   *  Charge un deck en mémoire à partir d'un deck_code (format compressé pouvant être copié/collé)
   * 
   *  Parameters :
   *    (String) code - deck_code (au format maincard_id;maincard_id;maincard_id/sidecard_id/extracard_id)
   */
  this.loadFromCode = function (code) {
    
  };
  /***************************************************************************************************************
   *  Function : save
   *
   *  Sauvegarde le deck
   */
  this.save = function () {
    if (this.file) {
      this.created = (this.created == "") ? getDate() : this.created;
      this.updated = getDate();
      // Création de la structure via E4X
      var data = new XML();
      data = <ygodeck>
          <file type="xyd" version="1.0">XYD (XML Yu-Gi-Oh! Deck)</file>
          <datasource id="ycd" url="http://kingyugi.fr/ycd">Yu-Gi-Oh! Card Database</datasource>
          <deck>
            <format id={this.format_id}>{this.format_name}</format>
            <notes>{this.notes}</notes>
            <created_at>{this.created}</created_at>
            <updated_at>{this.updated}</updated_at>
            <maindeck/>
            <sidedeck/>
            <extradeck/>
          </deck>
          <generated_by>yLife</generated_by>
        </ygodeck>;
      var i_max = this.main.length;
      for (var i = 0 ; i < i_max ; i++) {
        data.deck.maindeck.card += <card id={this.main[i].card_id} ref={this.main[i].reference} number={this.main[i].number}>{this.main[i].name}</card>;
      }
      var i_max = this.side.length;
      for (var i = 0 ; i < i_max ; i++) {
        data.deck.sidedeck.card += <card id={this.side[i].card_id} ref={this.side[i].reference} number={this.side[i].number}>{this.side[i].name}</card>;
      }
      var i_max = this.extra.length;
      for (var i = 0 ; i < i_max ; i++) {
        data.deck.extradeck.card += <card id={this.extra[i].card_id} ref={this.extra[i].reference} number={this.extra[i].number}>{this.extra[i].name}</card>;
      }
      var dom = new DOMParser().parseFromString(data, "text/xml");
      var serializer = new XMLSerializer();
      var xyd = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xyd += serializer.serializeToString(dom);
      
      // Ecriture du fichier
      Components.utils.import("resource://gre/modules/NetUtil.jsm");
      Components.utils.import("resource://gre/modules/FileUtils.jsm");
      var ostream = FileUtils.openSafeFileOutputStream(this.file)
      var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
      converter.charset = "UTF-8";
      var istream = converter.convertToInputStream(xyd);
      NetUtil.asyncCopy(istream, ostream, function(status) {
        if (!Components.isSuccessCode(status)) {
          window.top.Notifs.add({"type": "deckbuilder_file_write_error", "top": false, "timer": true, "time": 4000});
          return;
        }
        window.top.Notifs.add({"type": "deckbuilder_file_write_success", "top": false, "timer": true, "time": 4000});
      });
    }
  };
  /***************************************************************************************************************
   *  Function : exportToYVD
   *
   *  Exporte le deck au format YVD
   * 
   *  Parameters :
   *    (nsIFile) file - Fichier .dek (YVD Deck)
   */
  this.exportToYVD = function (file) {
    if (this.file) {
      var file_content = '';
      var i_max = this.main.length;
      for (var i = 0 ; i < i_max ; i++) {
        var reference = this.main[i].reference;
        var number = this.main[i].number;
        var YVD_reference = reference.substring(0,reference.indexOf("-",0));
        var name = this.main[i].name;
        file_content += number + '|' + YVD_reference + '|' + name + '\r\n';
      }
      file_content += '-SIDE DECK-' + '\r\n';
      var i_max = this.side.length;
      for (var i = 0 ; i < i_max ; i++) {
        var reference = this.side[i].reference;
        var number = this.side[i].number;
        var YVD_reference = reference.substring(0,reference.indexOf("-",0));
        var name = this.side[i].name;
        file_content += number + '|' + YVD_reference + '|' + name + '\r\n';
      }
      // Ecriture du fichier
      Components.utils.import("resource://gre/modules/NetUtil.jsm");
      Components.utils.import("resource://gre/modules/FileUtils.jsm");
      var ostream = FileUtils.openSafeFileOutputStream(file)
      var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
      converter.charset = "UTF-8";
      var istream = converter.convertToInputStream(file_content);
      NetUtil.asyncCopy(istream, ostream, function(status) {
        if (!Components.isSuccessCode(status)) {
          window.top.Notifs.add({"type": "deckbuilder_file_write_error", "top": false, "timer": true, "time": 4000});
          return;
        }
        window.top.Notifs.add({"type": "deckbuilder_file_write_success", "top": false, "timer": true, "time": 4000});
      });
    }
  };
}
