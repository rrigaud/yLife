var gBrowser;

  function getBrowser()
  {
    if (!gBrowser)
         gBrowser = document.getElementById("preview");

    return gBrowser;
  }

  function onEnterPrintPreview()
  {
    // On peut modifier la fenêtre xul ici.
  }

  function onExitPrintPreview()
  {
    // On ferme la fenêtre ici si elle ne sert que pour la prévisualisation.
    window.close();
  }

  function onLoadContent()
  {
    // On lance la mode "preview"  dès le chargement du contenu
    PrintUtils.printPreview(onEnterPrintPreview, onExitPrintPreview);
  }

  function onUnloadContent()
  {
    //
  }

  function onLoad()
  {
  	var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("CurProcD", Components.interfaces.nsILocalFile);
	file.append("chrome");
	file.append("content");
	file.append("data");
	file.append("print");
	file.append("deck.html");
    var page = file.path;

    getBrowser().addEventListener("unload", onUnloadContent, true);
    getBrowser().addEventListener("load"  , onLoadContent, true);

    getBrowser().setAttribute("src","file://"+page);
  }