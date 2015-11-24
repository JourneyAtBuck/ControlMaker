 /*
            Control Maker
            Created by Moses Journey (ControlMaker@mrjourney.net)
            Free to alter to your heart's content, but please don't sell it unless it's significantly (at least 75%) different.
            Much of this script was cobbled together using other people's work. For that reason, I'm making it available for donations only. Use it well!
            
            Copyright (c) 2015 Moses Journey
 */

function MJ_ControlMaker(thisObj)
{
    var ctrlMakerData = {};
    ctrlMakerData.scriptName = "ControlMaker";
    ctrlMakerData.version = "1.01";
    
     ctrlMakerData.strSettingsTip = "Controller folder location";
     ctrlMakerData.strHelpTip = "About this script";
     ctrlMakerData.settingsTitle = ctrlMakerData.scriptName + " Settings";
    ctrlMakerData.settingsControls = "Illustrator files:";
    ctrlMakerData.strSelAIFolder = "Select the controller folder to use";
    ctrlMakerData.strAboutTitle = "About " + ctrlMakerData.scriptName;
    ctrlMakerData.strAbout = ctrlMakerData.scriptName + " " + ctrlMakerData.version + "\n"+
          "Created by Moses Journey. Questions or comments? email me at ControlMaker@mrjourney.net." +
        "\n" +
        "A controller icon browser. Based on the LaunchPad.jsx script by Jeff of the After Effects crew.\n" +
        "\n" +
        "Notes:\n" +
        "This browser creates buttons for all .ai files located in the selected folder, which you can change by clicking the '...' button; subfolders are not scanned. If you place a 15x15 or smaller PNG file in the same folder and with the same base name as the Illustrator file (with a .png extension, e.g., hand.png for the hand.ai file), the PNG file will be used as an icon button instead.\n" +
        "\n" +
        "Hold SHIFT while clicking for extended features: if you have puppet pins selected, create expressions on each pin linking their position to their respective controls; if you have multiple layers selected, create one control in the center."+
        "\n" +
        "You can use this browser as a dockable panel by placing it in a ScriptUI Panels subfolder of the controls folder, and then choosing the ControlMaker.jsx script from the Window menu.";
        
    ctrlMakerData.strFillTip = "Controller fill color";
    ctrlMakerData.strStrokeTip = "Controller stroke color";
    ctrlMakerData.strHasClrTip = "Make selected stroke/fill invisible";
    ctrlMakerData.strSwapTip = "Swap stroke and fill";

    ctrlMakerData.strErrMinAE90 = "This script requires Adobe After Effects CS4 or later.";
    
    ctrlMakerData.defaultFolder = new Folder(File($.fileName).parent.fsName + "/ctrlShapes/"); //sets default folder for AI files
    ctrlMakerData.defaultFillClr= [.5,.5,.5,1]; //fills default to visible
    ctrlMakerData.defaultStrokeClr= [0,0,0,0]; //strokes default to invisible
    
    if (! app.settings.haveSetting(ctrlMakerData.scriptName, "fillClr")){
         app.settings.saveSetting(ctrlMakerData.scriptName,"fillClr",ctrlMakerData.defaultFillClr.toString());
         ctrlMakerData.fillClr = ctrlMakerData.defaultFillClr;
     } else {
         var fillString = app.settings.getSetting(ctrlMakerData.scriptName,"fillClr").split(",");
         ctrlMakerData.fillClr = [parseFloat(fillString[0]),parseFloat(fillString[1]),parseFloat(fillString[2]),parseFloat(fillString[3])];
     }
     if (! app.settings.haveSetting(ctrlMakerData.scriptName, "strokeClr")){
         app.settings.saveSetting(ctrlMakerData.scriptName,"strokeClr",ctrlMakerData.defaultStrokeClr.toString());
         ctrlMakerData.strokeClr = ctrlMakerData.defaultStrokeClr;
     } else {
         var strokeString = app.settings.getSetting(ctrlMakerData.scriptName,"strokeClr").split(",");
         ctrlMakerData.strokeClr = [parseFloat(strokeString[0]),parseFloat(strokeString[1]),parseFloat(strokeString[2]),parseFloat(strokeString[3])];
     }
    
    ctrlMakerData.btnSize = 20;
     
     var fillSwatchImg = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x0E\x00\x00\x00\x0E\b\x02\x00\x00\x00\u0090*\u00BA\u0086\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\u0080iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156797, 2014/08/20-09:53:02        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmpMM:OriginalDocumentID=\"xmp.did:7578684EFA6E11E48A92980C414F5C67\" xmpMM:DocumentID=\"xmp.did:CAFDDC3616E611E59C99F18A8542D8AF\" xmpMM:InstanceID=\"xmp.iid:CAFDDC3516E611E59C99F18A8542D8AF\" xmp:CreatorTool=\"Adobe Photoshop CC 2014 (Windows)\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:3d7bfca7-6810-8046-84c7-2afd88cc8e79\" stRef:documentID=\"adobe:docid:photoshop:5d9a52a2-13c2-11e5-906b-a06e00e6cdf7\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u008A?/\u0099\x00\x00\x00TIDATx\u00DA\u008C\u00D2A\n\x00 \b\x04\u00C0\u0094\u00FE\x15\u00F4\u00F3\x1E&%\x14Df\u009B\x0Bz\x1A\x16\x0F\x123\u00A7X\u00B2\u008E\u0088\x00\u00D1\u0088t\u00D7o\u00E5t3\x1Cq\u00A5wD\u008D{\u00D2\u00DB\u00F9\u00D4u\x0E}9K\u0081;(v\u009B~\u00DD\u00A2\x11w\x1C\u0080\u009D\u0086\u00E2\u00EF2\x04\x18\x00\x18c\")\x0E\u00DE\u0085G\x00\x00\x00\x00IEND\u00AEB`\u0082"];
     var hasClrSwatchImg = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x06\x00\x00\x00\x06\b\x02\x00\x00\x00o\u00AEx\x1F\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03viTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c067 79.157747, 2015/03/30-23:40:42        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmpMM:OriginalDocumentID=\"xmp.did:6b4e0a6c-9c46-a540-be79-157d7a26e8d3\" xmpMM:DocumentID=\"xmp.did:5F34F9FE6D2011E5B990CD94D0AEFB6C\" xmpMM:InstanceID=\"xmp.iid:5F34F9FD6D2011E5B990CD94D0AEFB6C\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:017b24e2-631c-5d48-98a5-dc592fb1e103\" stRef:documentID=\"xmp.did:6b4e0a6c-9c46-a540-be79-157d7a26e8d3\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00DA \x02(\x00\x00\x003IDATx\u00DAb\u00FC\u00FF\u00FF?\x03\f\x1Cdd\x04\u0092\u008Cp!\b\x1F!\x04\u00E7\u00DB\u00FF\u00FF\x0F\x12B\u00E6\u0083T\x1D\u0080\x19d\x0F3\x01*d\u008Fd\t@\u0080\x01\x002\u009D\x19{Z\u00C2\u008A\u00BC\x00\x00\x00\x00IEND\u00AEB`\u0082"];
     var strokeSwatchImg = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x0E\x00\x00\x00\x0E\b\x02\x00\x00\x00\u0090*\u00BA\u0086\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\u0080iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156797, 2014/08/20-09:53:02        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmpMM:OriginalDocumentID=\"xmp.did:7578684EFA6E11E48A92980C414F5C67\" xmpMM:DocumentID=\"xmp.did:FE947EA616E611E58E85DB4C10818896\" xmpMM:InstanceID=\"xmp.iid:FE947EA516E611E58E85DB4C10818896\" xmp:CreatorTool=\"Adobe Photoshop CC 2014 (Windows)\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:32723b24-8420-4f42-8657-e2d4908bd8e6\" stRef:documentID=\"adobe:docid:photoshop:f1b004ca-16e6-11e5-bce6-d43b201e80bc\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>H\u008E2\u00B5\x00\x00\x00oIDATx\u00DA\u0094\u0090\u0081\n\u00C0 \bDS\u00F7_\u0083}y\u00FB0qB\x19\u00B6\\\u00B5\u0083B\u00EA\u00CAwB\u008A\u0084\u0088\u00E3\u00E1\u00A1KD\u00D2\u00B7n\x00\u00DD\u00AF\u00F0\u00F5\u00E8\u00AB\u00ADv|gk+&\u00CFZ\u0094\u00EDVk\u00F0\u00AC`\u00DF40f.\x05\x11-X\u00BB\t\u00F8d\u00F3\u0094?~\u00C5p.\u00A1@\u009B*{0\u0097^5\u00D6\u00D2\u00F7\x06\u0098\u00FB*\u00C0f\u00ACG\u0080\x01\x00\u00CF\u00DA)\u00D1\u00EDN\u00F8x\x00\x00\x00\x00IEND\u00AEB`\u0082"];
     var helpImg = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\n\b\x02\x00\x00\x00;7\u00E9\u00B1\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156797, 2014/08/20-09:53:02        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2014 (Windows)\" xmpMM:InstanceID=\"xmp.iid:AD6F1BA2A9E111E4B156D17BF948BF01\" xmpMM:DocumentID=\"xmp.did:AD6F1BA3A9E111E4B156D17BF948BF01\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:AD6F1BA0A9E111E4B156D17BF948BF01\" stRef:documentID=\"xmp.did:AD6F1BA1A9E111E4B156D17BF948BF01\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>\u00D9\u0092/\x0E\x00\x00\x00WIDATx\u00DAb444d \x17\u00B0\x00\u00B1\u00AC\u00AC,\x19:\x1F?~\u00CC\u0082K\u00AE\u00AE\u00AE\x0E\u00C2hjj\u00C2g3V\u009Dp=\u00C8l4\u00C0\u0084U\x14Y\u00F5\u00EF\u00DF\u00BFI\u00B3\x19\u00D9\u00E5---\u00B8\x140\x02C\u009B\u00EC\x00c\"h3\x1E@\u0091\u00CD,\x10\u008A\u00BCD\x02\x10`\x00d\x13\x1Fu\x13\n\u00D3\x0B\x00\x00\x00\x00IEND\u00AEB`\u0082"];
     var settingsImg = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\n\b\x02\x00\x00\x00;7\u00E9\u00B1\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03&iTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156797, 2014/08/20-09:53:02        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmp:CreatorTool=\"Adobe Photoshop CC 2014 (Windows)\" xmpMM:InstanceID=\"xmp.iid:A4C0D7E8A9E111E4A8F890873BB072B9\" xmpMM:DocumentID=\"xmp.did:A4C0D7E9A9E111E4A8F890873BB072B9\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:A4C0D7E6A9E111E4A8F890873BB072B9\" stRef:documentID=\"xmp.did:A4C0D7E7A9E111E4A8F890873BB072B9\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>7\u00B7\u00AC\u00CE\x00\x00\x006IDATx\u00DAb444d \x17\u00B0\x00\u00B1\u00AC\u00AC,\x19:\x1F?~\u00CC\u00C4@\x01\x18T\u009A\u00EB\u00EA\u00EAp1\u00D0\x00#0\u00B4\u0087`\u0080\u00B1@\x1C@\u009Ef\u0080\x00\x03\x00pA\x0ET\u00E5\u00EC\x19\u008A\x00\x00\x00\x00IEND\u00AEB`\u0082"];
     var swapImg = ["\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x06\x00\x00\x00\x06\b\x06\x00\x00\x00\u00E0\u00CC\u00EFH\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03viTXtXML:com.adobe.xmp\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?> <x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c067 79.157747, 2015/03/30-23:40:42        \"> <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"> <rdf:Description rdf:about=\"\" xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\" xmlns:stRef=\"http://ns.adobe.com/xap/1.0/sType/ResourceRef#\" xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\" xmpMM:OriginalDocumentID=\"xmp.did:6b4e0a6c-9c46-a540-be79-157d7a26e8d3\" xmpMM:DocumentID=\"xmp.did:6E8061BE6D2011E59D4DF1C28D9CF7C3\" xmpMM:InstanceID=\"xmp.iid:6E8061BD6D2011E59D4DF1C28D9CF7C3\" xmp:CreatorTool=\"Adobe Photoshop CC 2015 (Windows)\"> <xmpMM:DerivedFrom stRef:instanceID=\"xmp.iid:6b4e0a6c-9c46-a540-be79-157d7a26e8d3\" stRef:documentID=\"xmp.did:6b4e0a6c-9c46-a540-be79-157d7a26e8d3\"/> </rdf:Description> </rdf:RDF> </x:xmpmeta> <?xpacket end=\"r\"?>Kl3\u0090\x00\x00\x004IDATx\u00DAb\u00FC\u00FF\u00FF?\x03\x10\u0080\bF\x06$\u00C0\x04\x15\u0084I\u00FEG\u0096\u0080\u00A9d\u0084\u00E2\u00FF0\t\x06tc\u0090%\x18\u0090\u008C\x03\u00D3\u00E8\x12pc\x01\x02\f\x00/\f\n\t\x0F\x17\u00C1\x18\x00\x00\x00\x00IEND\u00AEB`\u0082"];
     
    //create temporary image files before displaying them.
    
    fillSwatchBinary = new File(new Folder(Folder.temp).fsName+"/tempFillSwatchImage.png"); //temporary file for binary image
    fillSwatchBinary.encoding = "BINARY";
    fillSwatchBinary.open( "w" );
    fillSwatchBinary.write( fillSwatchImg );
    fillSwatchBinary.close();
    
    hasClrSwatchBinary = new File(new Folder(Folder.temp).fsName+"/tempHasClrSwatchImage.png"); //temporary file for binary image
    hasClrSwatchBinary.encoding = "BINARY";
    hasClrSwatchBinary.open( "w" );
    hasClrSwatchBinary.write( hasClrSwatchImg );
    hasClrSwatchBinary.close();
    
    strokeSwatchBinary = new File(new Folder(Folder.temp).fsName+"/tempStrokeSwatchImage.png"); //temporary file for binary image
    strokeSwatchBinary.encoding = "BINARY";
    strokeSwatchBinary.open( "w" );
    strokeSwatchBinary.write( strokeSwatchImg );
    strokeSwatchBinary.close();
    
    helpImgBinary = new File(new Folder(Folder.temp).fsName+"/tempHelpImage.png");
    helpImgBinary.encoding = "BINARY";
    helpImgBinary.open( "w" );
    helpImgBinary.write( helpImg );
    helpImgBinary.close();
    
    settingsImgBinary = new File(new Folder(Folder.temp).fsName+"/tempSettingsImage.png");
    settingsImgBinary.encoding = "BINARY";
    settingsImgBinary.open( "w" );
    settingsImgBinary.write( settingsImg );
    settingsImgBinary.close();
    
    swapBinary = new File(new Folder(Folder.temp).fsName+"/tempSwapImage.png");
    swapBinary.encoding = "BINARY";
    swapBinary.open( "w" );
    swapBinary.write( swapImg );
    swapBinary.close();
    
    //accessToRGBA()
    //function to convert to 0-1 float space colors returned by microsoft color chooser. will return an array [r,g,b,a] in 0-1 float numbers.
    function accessToRGBA(a) {
        var bigint = parseInt(a.toString(16), 16);
        var r = ((bigint >> 16) & 255)/255;
        var g = ((bigint >> 8) & 255)/255;
        var b = (bigint & 255)/255;
        var rgbaArray = [r,g,b,1];
        return rgbaArray;
    }
    
    //colorPicker()
    //function to create a modal window for the color picker. will return an array [r,g,b,a] in 0-1 float numbers. uses function accessToRGBA() 
    function colorPicker() {
        var picker = $.colorPicker();
        if (picker>=0) { 
        var color = accessToRGBA(picker);  
        return color;  
        }else { return null;}
    }  
    
    // ctrlMaker_buildUI()
    // Function for creating the user interface
    function ctrlMaker_buildUI(thisObj)
    {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", ctrlMakerData.scriptName, [200, 200, 600, 500], {resizeable: true});
        
        if (pal !== null)
        {
            pal.bounds.width = (ctrlMakerData.btnSize+2)*10 + 2;
            pal.bounds.height = (ctrlMakerData.btnSize+2)*1 + 2;
            
            pal.AIBtns = null;
            ctrlMaker_rebuildButtons(pal);
            
            pal.onResize = ctrlMaker_doResizePanel;
            pal.onResizing = ctrlMaker_doResizePanel;
        }

        return pal;
    }
    
    //listProperties()
    //function returns array of properties of layer OR sub-properties of property "a"
    function listProperties(a) {
        var propList = [];
        function propRecurse(a) { //argument is a layer or property

            var propLength = a.numProperties;
            for (var l=1; l<=propLength; l++) {
                propList.push(a.property(l));
                if (a.property(l).numProperties > 0) {
                    propRecurse(a.property(l));
                }
            }
            return;

        }
        propRecurse(a);
        return propList;
    }
    
    // ctrlMaker_filterAIFiles()
    // Function for filtering .ai files. Used with the Folder.getFiles() function.
    function ctrlMaker_filterAIFiles(file)
    {
        return ((file.name.match(/.ai?$/) !== null) && (file.name != (new File($.fileName)).name));
    }
    
    //importAIasShape()
    //function for importing .ai files and converting to a shape layer, returns shape layer's layer object
    //requires two inputs: the illustrator file to import, and the comp into which it should import, the third input, newCtrlName, will override the automatic name with a custom name
    //note: "comp" variable must be set externally, or you can uncomment the lines in the function that set the variable within the function
    function importAIasShape(newFile,comp,newCtrlName)  {
        if (!newFile) return alert("No file selected.");
        
        var importedImg = app.project.importFile(new ImportOptions(File(newFile)));                
        var imgLayer = comp.layers.add(importedImg);                
        var layerName = importedImg.name.substr(0,importedImg.name.lastIndexOf("."));
        
        app.executeCommand(3973); // converts selected illustrator layer to shape layer
        var shapeLayer = comp.selectedLayers[0];
        shapeLayer.guideLayer = true;
        
        if (newCtrlName) layerName = newCtrlName;

        //adds a number to the end of the name of the layer to keep layer names unique
        var ctrlCnt = 0;
        var ctrlNumber = 0;
        for (var l = 1; l <= comp.layers.length; l++) { //checks highest numbered existing ctrl
            var cLayerName = comp.layers[l].name;
            if (cLayerName.match(layerName+" CTRL")) {
                ctrlCnt++;
            }
        }//end controller counter
       

        var ctrlName = shapeLayer.name = layerName+" CTRL "+(ctrlCnt+1).toString();
        var ctrlLayer = comp.layer(ctrlName);                
        
        var propList = listProperties(ctrlLayer); // gets all properties for control

        for (p = 0; p<propList.length; p++) { // checks shape groups for strokes and fills, adds missing property if not found
            var stroke;
            try{
                
                if (!propList[p].property("ADBE Vectors Group").property("ADBE Vector Graphic - Stroke")) {
                    stroke = propList[p].property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
                }
                if (propList[p].property("ADBE Vectors Group").property("ADBE Vector Graphic - Fill")){
                    stroke.moveTo(propList[p].property("ADBE Vectors Group").property("ADBE Vector Graphic - Fill").propertyIndex);
                }else {
                    propList[p].property("ADBE Vectors Group").addProperty("ADBE Vector Graphic - Fill");
                }
            } catch(e) {
                
            }
            
        }
        propList = listProperties(ctrlLayer);
        for (p = 0; p<propList.length; p++) { // sets color of  fills/strokes to chosen swatch color, otherwise if fill/strokes swatch has an alpha of 0, disables property
            try {
                    if (!ctrlMakerData.strokeClr[3] && propList[p].matchName == "ADBE Vector Stroke Color") {
                        propList[p].propertyGroup(1).enabled = false;
                    } else if (propList[p].matchName == "ADBE Vector Stroke Color") {
                        propList[p].setValue(ctrlMakerData.strokeClr);
                        propList[p].enabled = true;
                    }
                } catch(e) { // keep looking if no stroke color property
                    continue;
               }
                try {
                    if (!ctrlMakerData.fillClr[3] && propList[p].matchName == "ADBE Vector Fill Color") {
                        propList[p].propertyGroup(1).enabled = false;
                    } else if (propList[p].matchName == "ADBE Vector Fill Color") {
                        propList[p].setValue(ctrlMakerData.fillClr);
                        propList[p].enabled = true;
                    }
                } catch(e) { // keep looking if no fill color property
                    continue;
               }
           }
        
            importedImg.remove();
            return comp.layer(ctrlName);
    }
    //findPos()
    // function returns position values for controller buttons. unfortunately, I have to pass the leftEdge and topEdge to this function or the position within the rebuild functions gets lost. woop!
    function findPos(b,leftEdge,topEdge) {
        if (b=="Has Color?") {
            return [leftEdge-1, topEdge+14, leftEdge+6, topEdge+20]; //hasClrBtn position
        } else if (b=="Stroke") {
            return [leftEdge+6, topEdge+6, leftEdge+20, topEdge+20]; //strokeBtn position
        } else if (b=="Fill") {
            return [leftEdge, topEdge, leftEdge+14, topEdge+14]; //fillBtn position
        } else if (b=="Swap Colors") {
            return [leftEdge+13, topEdge, leftEdge+20, topEdge+6]; //swapBtn position
        } else {
            return;
        }
    }
    //importControl()
    //function to check if multiple layers/puppet pins are selected, imports controls for each one, otherwise imports one control to the center of the comp
    function importControl(newFile) {
            var shiftPressed = ScriptUI.environment.keyboardState.shiftKey;
            var comp = app.project.activeItem;
            if (comp !== null && comp instanceof CompItem) {
                comp.openInViewer();
                app.activeViewer.setActive();
                //check for selected pins, if so, fill array "pinsArray"
                var selProps = [];
                var pinsArray = [];
                if (comp.selectedProperties.length) selProps = comp.selectedProperties;
                for (var j in selProps) {
                    if (selProps[j].matchName == "ADBE FreePin3 PosPin Atom") pinsArray.push(selProps[j]); //are selected elements puppet pins?
                }
                
                if (pinsArray.length) {
                    app.beginUndoGroup("Import "+newFile.name+" as controller layers");

                    for (var p in pinsArray){ // imports a control for each selected pin
                        var pinnedLyr = pinsArray[p].propertyGroup(pinsArray[p].propertyDepth);
                        var isShape;
                        var positionOffset;
                        var pinPos = pinsArray[p].property("ADBE FreePin3 PosPin Position");
                        var ctrl = importAIasShape (newFile,comp,pinsArray[p].name);              
                        
                        ctrl.moveBefore(pinnedLyr);
                        if(pinnedLyr.property("ADBE Root Vectors Group")) isShape = true;
                        if (isShape) {
                            positionOffset = pinPos.value;
                        }else{
                            if(pinnedLyr.threeDLayer) ctrl.threeDLayer = true;
                            ctrl.property("ADBE Transform Group").property("ADBE Position").expression = "L = thisComp.layer(\""+pinnedLyr.name+"\")\rL.toWorld([0,0,0])"; //cheat to get toWorld position of selected layer
                            positionOffset = pinPos.value+ctrl.property("ADBE Transform Group").property("ADBE Position").value;
                        }
                        ctrl.property("ADBE Transform Group").property("ADBE Position").setValue(positionOffset);
                        ctrl.property("ADBE Transform Group").property("ADBE Position").expression = "";
                        if(shiftPressed) {pinPos.expression = "L = thisComp.layer(thisProperty.propertyGroup(1).name+\" CTRL 1\");\rL.toWorld(L(\"ADBE Transform Group\")(\"ADBE Anchor Point\"))";} // links pin position to control layer, if shift is pressed on keyboard
                    }
                    app.endUndoGroup();
                } else if (!shiftPressed && comp.selectedLayers.length && !pinsArray.length) { // if any layers are selected, import one controller per layer, move to that layer
                    app.beginUndoGroup("Import "+newFile.name+" as controller layers");
                    var selLyrs = comp.selectedLayers;
                    for (var i in selLyrs){
                        var ctrl = importAIasShape (newFile,comp,selLyrs[i].name); //use name of selected layers as controller name
                        ctrl.moveBefore(selLyrs[i]);
                        var posProp, isNotFtg;
                        if (selLyrs[i] instanceof CameraLayer || selLyrs[i] instanceof LightLayer ){
                            posProp = "[0,0,0]";// check if layer has an anchor point or not (i.e. if it's a camera or light)
                            isNotFtg = true;
                        } else {
                            posProp = "L('ADBE Transform Group')('ADBE Anchor Point')";
                        }
                        if(selLyrs[i].threeDLayer || isNotFtg) ctrl.threeDLayer = true;
                        ctrl.property("ADBE Transform Group").property("ADBE Position").expression = "L = thisComp.layer('"+selLyrs[i].name+"')\rL.toWorld("+posProp+")"; //cheat to get toWorld position of selected layer
                        ctrl.property("ADBE Transform Group").property("ADBE Position").setValue(ctrl.property("ADBE Transform Group").property("ADBE Position").value);
                        ctrl.property("ADBE Transform Group").property("ADBE Position").expression = "";
                    }
                    app.endUndoGroup();
                    
                } else if (shiftPressed && comp.selectedLayers.length && !pinsArray.length) { // otherwise if shift is pressed, import one and put it in the center of the selected objects
                    app.beginUndoGroup("Import "+newFile.name+" as controller layer");
                    var selLyrs = comp.selectedLayers;
                    var ctrl = importAIasShape (newFile,comp); //use name of selected layers as controller name
                    var expTmp = "(";
                    var isThreeD = false;
                    for (var i in selLyrs){
                        var posProp, isNotFtg;
                        if (selLyrs[i] instanceof CameraLayer || selLyrs[i] instanceof LightLayer  ){
                            posProp = "[0,0,0]";// check if layer has an anchor point or not (i.e. if it's a camera or light)
                            isNotFtg = true;
                            
                        } else {
                            posProp = "thisComp.layer('"+selLyrs[i].name+"')('ADBE Transform Group')('ADBE Anchor Point')";
                        }
                        expTmp = expTmp+"thisComp.layer('"+selLyrs[i].name+"').toWorld("+posProp+")"; //cheat to find midpoint of selected layers
                        if (i<selLyrs.length-1)expTmp = expTmp+"+";
                        if (selLyrs[i].threeDLayer === true || isNotFtg) isThreeD = true;
                    }
                    ctrl.threeDLayer = isThreeD;
                    ctrl.property("ADBE Transform Group").property("ADBE Position").expression = expTmp+")/"+selLyrs.length.toString();
                    ctrl.property("ADBE Transform Group").property("ADBE Position").setValue(ctrl.property("ADBE Transform Group").property("ADBE Position").value);
                    ctrl.property("ADBE Transform Group").property("ADBE Position").expression = "";
                    app.endUndoGroup();
                } else { // otherwise just import one
                    app.beginUndoGroup("Import "+newFile.name+" as controller layer");
                    importAIasShape (newFile,comp);
                    app.endUndoGroup();
                }
            } else {return alert("Activate a comp timeline before importing controls.");}
    }

    // ctrlMaker_rebuildButtons()
    // Function for creating/recreating the button layout
    function ctrlMaker_rebuildButtons(palObj)
    {
        var topEdge = 2;
        var leftEdge = 2;
        var btnSize = ctrlMakerData.btnSize;
        var btnIconFile, defBtnIconFile;
        
        // Remove the existing buttons (all of them)
        if (palObj.btnGroup !== undefined)
        {
                while (palObj.btnGroup.children.length > 0)
                    palObj.btnGroup.remove(0);
                    palObj.remove(0);
        }
        
        // Add buttons for .ai files
        defBtnIconFile = new File(ctrlMakerData.thisScriptFolder.fsName + "/Launch Pad_jsx-icon.png");
        if (!defBtnIconFile.exists)
            defBtnIconFile = null;
        
        palObj.AIBtns = undefined;
        palObj.AIBtns = [];
        
        // Place controls in a group container to get the panel background love
        palObj.btnGroup = palObj.add("group", [0, 0, palObj.bounds.width, palObj.bounds.height]);

        for (var i=0; i<ctrlMakerData.files.length; i++)
        {
              btnIconFile = new File(File(ctrlMakerData.files[i]).fsName.replace(/.ai?$/, ".png"));
            if (btnIconFile.exists) {
                palObj.AIBtns[i] = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize], btnIconFile, {style:"toolbutton"});
            }else if (defBtnIconFile !== null){
                palObj.AIBtns[i] = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize], defBtnIconFile, {style:"toolbutton"});
            }else{
                palObj.AIBtns[i] = palObj.btnGroup.add("button", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize], ctrlMakerData.scripts[i].name.replace(/.ai/, "").replace(/%20/g, " "));
             }           
        

            palObj.AIBtns[i].AIFile = ctrlMakerData.files[i];		// Store file name with button (sneaky that JavaScript is)
            palObj.AIBtns[i].helpTip = File(ctrlMakerData.files[i]).name.replace(/.ai?$/, "").replace(/%20/g, " ");
            palObj.AIBtns[i].onClick = function(){importControl(this.AIFile);};
            
            leftEdge += (btnSize + 2);
        }
    
        palObj.hasClrBtn = palObj.btnGroup.add("iconbutton",findPos("Has Color?",leftEdge,topEdge),hasClrSwatchBinary);
        palObj.strokeImg = palObj.btnGroup.add("image", findPos("Stroke",leftEdge,topEdge), strokeSwatchBinary); // adds swatch image to strokeBtn
        palObj.strokeBtn = palObj.btnGroup.add("custombutton", findPos("Stroke",leftEdge,topEdge));
        palObj.fillImg = palObj.btnGroup.add("image",findPos("Fill",leftEdge,topEdge), fillSwatchBinary); // adds swatch image to fillBtn
        palObj.fillBtn = palObj.btnGroup.add("custombutton",findPos("Fill",leftEdge,topEdge));
        palObj.swapBtn = palObj.btnGroup.add("iconbutton", findPos("Swap Colors",leftEdge,topEdge), swapBinary); // adds swatch image to swapBtn
        
        // remove temp images used for color swatch buttons
        fillSwatchBinary.remove(); 
        hasClrSwatchBinary.remove();
        strokeSwatchBinary.remove();
        swapBinary.remove();

        //shorten paths with variables
        var strokeClrB = palObj.strokeBtn; 
        var hasClrB = palObj.hasClrBtn;
        var fillClrB = palObj.fillBtn; 
        var swapB = palObj.swapBtn;
        
        //help tips
        strokeClrB.helpTip = ctrlMakerData.strStrokeTip;
        fillClrB.helpTip = ctrlMakerData.strFillTip;
        hasClrB.helpTip = ctrlMakerData.strHasClrTip;
        swapB.helpTip = ctrlMakerData.strSwapTip;

        // init pens and fills
        strokeClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, ctrlMakerData.strokeClr, 3.5);
        strokeClrB.strokeOutlineClr = [0,0,0,1];
        strokeClrB.strokeOutlinePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, strokeClrB.strokeOutlineClr, 1);
        
        fillClrB.fillBrush = fillClrB.graphics.newBrush(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.fillClr);
        fillClrB.strokeClr = [0,0,0,1];
        fillClrB.strokePen = fillClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, fillClrB.strokeClr, 1);
        
        //init vars for "selection"
        strokeClrB.oneClick = false;
        fillClrB.oneClick = false;
        
        strokeClrB.onDraw = strokeBDraw;
        function strokeBDraw(h){
            with(this) {
                graphics.drawOSControl();  
                graphics.rectPath(2.5,2.5,9,9);  
                graphics.strokePath(strokePen);
                graphics.newPath();
                graphics.rectPath(0,0,14,14);
                graphics.strokePath(strokeOutlinePen);
            }
        }

        fillClrB.onDraw = fillBDraw;
        function fillBDraw(h){
            with(this) {
                this.graphics.drawOSControl();  
                this.graphics.rectPath(0,0,14,14);  
                this.graphics.fillPath(fillBrush);
                this.graphics.strokePath(strokePen);
            }
        }

        fillClrB.onClick = function () {// outlines fill color in white to mean it's "selected" after one click, on second click sets color of fill
            if (fillClrB.oneClick) {
                var clr = colorPicker();
                if (clr) {
                    //alert(clr);
                    ctrlMakerData.fillClr = clr;
                    app.settings.saveSetting(ctrlMakerData.scriptName,"fillClr",ctrlMakerData.fillClr.toString());
                    fillClrB.fillBrush = fillClrB.graphics.newBrush(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.fillClr);
                    fillClrB.strokeClr = [0,0,0,1];
                    fillClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, fillClrB.strokeClr, 1);
                    fillClrB.oneClick = false;
                }
            } else {
                fillClrB.strokeClr = [1,1,1,1];
                fillClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, fillClrB.strokeClr, 1);
                fillClrB.oneClick = true;
                
                strokeClrB.strokeOutlineClr = [0,0,0,1]; // sets outline of stroke to black, signifying it's not selected
                strokeClrB.strokeOutlinePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, strokeClrB.strokeOutlineClr, 1);
                strokeClrB.oneClick = false;
                strokeClrB.notify("onDraw");
            }
        };
    
        strokeClrB.onClick = function () { // outlines stroke color in white to mean it's "selected" after one click, on second click sets color of stroke
            if (strokeClrB.oneClick) {
                var clr = colorPicker();
                if (clr) {
                    //alert(clr);
                    ctrlMakerData.strokeClr = clr;
                    app.settings.saveSetting(ctrlMakerData.scriptName,"strokeClr",ctrlMakerData.strokeClr.toString());
                    strokeClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.strokeClr,3.5);
                    strokeClrB.strokeOutlineClr = [0,0,0,1];
                    strokeClrB.strokeOutlinePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, strokeClrB.strokeOutlineClr, 1);
                    strokeClrB.oneClick = false;
                }
            } else {
                strokeClrB.strokeOutlineClr = [1,1,1,1];
                strokeClrB.strokeOutlinePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, strokeClrB.strokeOutlineClr, 1);
                strokeClrB.oneClick = true;
                
                fillClrB.strokeClr = [0,0,0,1]; // sets outline of fill to black, signifying it's not selected
                fillClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.PenType.SOLID_COLOR, fillClrB.strokeClr, 1);
                fillClrB.oneClick = false;
                fillClrB.notify("onDraw");
            }
        };
        
        hasClrB.onClick = function() { //makes selected element (stroke or fill) invisible
            if (fillClrB.oneClick) {
                ctrlMakerData.fillClr[3] = 0;
                fillClrB.fillBrush = fillClrB.graphics.newBrush(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.fillClr);
                app.settings.saveSetting(ctrlMakerData.scriptName,"fillClr",ctrlMakerData.fillClr.toString());
                fillClrB.notify("onDraw");
            }
            if (strokeClrB.oneClick) {
                ctrlMakerData.strokeClr[3] = 0;
                app.settings.saveSetting(ctrlMakerData.scriptName,"strokeClr",ctrlMakerData.strokeClr.toString());
                strokeClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.strokeClr,3.5);
                strokeClrB.notify("onDraw");
            }
        };
    
       swapB.onClick = function() { //swaps the fill and stroke colors, then redraws the related swatches
            var fillClr = ctrlMakerData.fillClr;
            ctrlMakerData.fillClr = ctrlMakerData.strokeClr;
            ctrlMakerData.strokeClr = fillClr;
            app.settings.saveSetting(ctrlMakerData.scriptName,"strokeClr",ctrlMakerData.strokeClr.toString());
            app.settings.saveSetting(ctrlMakerData.scriptName,"fillClr",ctrlMakerData.fillClr.toString());
            fillClrB.fillBrush = fillClrB.graphics.newBrush(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.fillClr);
            strokeClrB.strokePen = strokeClrB.graphics.newPen(palObj.graphics.BrushType.SOLID_COLOR, ctrlMakerData.strokeClr,3.5);
            strokeClrB.notify("onDraw");
            fillClrB.notify("onDraw");
        };
    
        leftEdge += (btnSize + 2);
            
        // Add the settings and help buttons
        palObj.settingsBtn = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize/2], settingsImgBinary);
        settingsImgBinary.remove();
        palObj.settingsBtn.helpTip = ctrlMakerData.strSettingsTip;
        palObj.settingsBtn.onClick = function ()
        {
            // Get the controls in the selected controls folder
            var AIFolder = Folder.selectDialog(ctrlMakerData.strSelAIFolder, Folder(ctrlMakerData.filesFolder));
            if ((AIFolder !== null) && AIFolder.exists)
            {
                ctrlMakerData.filesFolder = AIFolder;
                // Get all controls in the selected folder, but not this one, cuz that would be weird :-)
                ctrlMakerData.files = AIFolder.getFiles(ctrlMaker_filterAIFiles);
                
                // Remember the controls folder for the next session
                app.settings.saveSetting(ctrlMakerData.scriptName, "ControlMaker_folder", ctrlMakerData.filesFolder.fsName);
                
                // Refresh the palette
                ctrlMaker_rebuildButtons(this);
                
                ctrlMaker_doResizePanel();
                
            }
        };
    
        palObj.helpBtn = palObj.btnGroup.add("iconbutton", [leftEdge, topEdge+btnSize/2, leftEdge+btnSize, topEdge+btnSize], helpImgBinary);
        helpImgBinary.remove();
        palObj.helpBtn.onClick = function () {alert(ctrlMakerData.strAbout, ctrlMakerData.strAboutTitle);};
        palObj.helpBtn.helpTip = ctrlMakerData.strHelpTip;
        
    }
    
    
    // ctrlMaker_doResizePanel()
    // Callback function for laying out the buttons in the panel
    function ctrlMaker_doResizePanel()
    {
        var btnSize = ctrlMakerData.btnSize;
        var btnOffset = btnSize + 2;
        var maxRightEdge = ctrlMakerPal.size.width - btnOffset;
        var leftEdge = 2;
        var topEdge = 2;
        
        // Reset the background group container's bounds
        ctrlMakerPal.btnGroup.bounds = [0, 0, ctrlMakerPal.size.width, ctrlMakerPal.size.height];
        
        // Reset each button's layer bounds
        for (var i=0; i<ctrlMakerData.files.length; i++)
        {
            ctrlMakerPal.AIBtns[i].bounds = [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize];
            
            leftEdge += btnOffset;
            
            // Create a new row if no more columns available in the current row of buttons
            if (leftEdge > maxRightEdge)
            {
                leftEdge = 2;
                topEdge += btnOffset;
            }
        }
    
        
            // The color buttons go into the next "slot"
            ctrlMakerPal.fillBtn.bounds = ctrlMakerPal.fillImg.bounds = findPos("Fill",leftEdge,topEdge);
            ctrlMakerPal.strokeBtn.bounds = ctrlMakerPal.strokeImg.bounds = findPos("Stroke",leftEdge,topEdge);
            ctrlMakerPal.hasClrBtn.bounds = findPos("Has Color?",leftEdge,topEdge);
            ctrlMakerPal.swapBtn.bounds = findPos("Swap Colors",leftEdge,topEdge);

            leftEdge += (btnOffset);
            
            // The settings and help buttons go into the next "slot"
             if (leftEdge > maxRightEdge)
            {
                leftEdge = 2;
                topEdge += btnOffset;
            }

            ctrlMakerPal.settingsBtn.bounds = [leftEdge, topEdge, leftEdge+btnSize, topEdge+btnSize/2];
            ctrlMakerPal.helpBtn.bounds = [leftEdge, topEdge+btnSize/2, leftEdge+btnSize, topEdge+btnSize];

    }
    
    
    // main:
    // 
    
    if (parseFloat(app.version) < 9)
    {
        alert(ctrlMakerData.strErrMinAE90, ctrlMakerData.scriptName);
        return;
    }
    else
    {
        // Keep track of this ai's folder so we know where to find the icons used by the ai
        ctrlMakerData.thisScriptFolder = new Folder((new File($.fileName)).path);

        //  Use the last defined script folder, or ask the user for one (if not previously defined)
        ctrlMakerData.files = [];

        if (app.settings.haveSetting(ctrlMakerData.scriptName, "ControlMaker_folder"))
        {
            ctrlMakerData.filesFolder = new Folder(app.settings.getSetting(ctrlMakerData.scriptName, "ControlMaker_folder").toString());
            if (ctrlMakerData.filesFolder !== null && ctrlMakerData.filesFolder.exists)
                ctrlMakerData.files = ctrlMakerData.filesFolder.getFiles(ctrlMaker_filterAIFiles);
        }
        else if (ctrlMakerData.defaultFolder.exists) 
         {
                ctrlMakerData.filesFolder = ctrlMakerData.defaultFolder;
                app.settings.saveSetting(ctrlMakerData.scriptName, "ControlMaker_folder", ctrlMakerData.filesFolder.fsName);
                ctrlMakerData.files = ctrlMakerData.filesFolder.getFiles(ctrlMaker_filterAIFiles);
         }
         else
        {
            ctrlMakerData.filesFolder = Folder.selectDialog(ctrlMakerData.strSelAIFolder, ctrlMakerData.defaultFolder);
            if ((ctrlMakerData.filesFolder !== null) && ctrlMakerData.filesFolder.exists)
            {
                ctrlMakerData.files = ctrlMakerData.filesFolder.getFiles(ctrlMaker_filterAIFiles);
                
                // Remember the controls folder for the next session
                app.settings.saveSetting(ctrlMakerData.scriptName, "ControlMaker_folder", ctrlMakerData.filesFolder.fsName);
            } else {alert("Please select a folder with Illustrator files within.");}
        }
        
        // Build and show the UI
        var ctrlMakerPal = ctrlMaker_buildUI(thisObj);
        if (ctrlMakerPal !== null) {
            if (ctrlMakerPal instanceof Window){
                // Center the palette
                ctrlMakerPal.center();
                
                // Show the UI
                ctrlMakerPal.show();
            } else ctrlMaker_doResizePanel();}
        }

}
MJ_ControlMaker(this);

