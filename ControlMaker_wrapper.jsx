{
    //Note: this file must be named "BuckTab.jsx" for the docked palette to have the correct name
    var libfile = File('C:/Users/Moses Journey/Documents/GitHub/ControlMaker/ControlMaker.jsx');

    try{
        $.evalFile(libfile);
        MJ_ControlMaker(this);
    } catch(err){alert("Script file missing.\rError:"+err)}
}