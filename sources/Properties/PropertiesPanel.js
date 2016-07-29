
function PropertiesPanel(_canvas) {
    var me = this;
    var canvas = _canvas;
    var Cn = canvas.getConstruction();
    $U.extend(this, new VerticalBorderPanel(canvas, 240, false));
    me.setBounds(me.getBounds().left + 15, -5, 0, 0); // Le fond n'est pas affiché

    me.show();

    me.getCS = function() {
        return Cn.coordsSystem;
    };

    me.setMagnifierMode = function(_val) {
        canvas.magnifyManager.setMagnifierMode(_val);
    };
    me.getMagnifierMode = function() {
        return canvas.magnifyManager.getMagnifierMode();
    };
    me.setDragOnlyMoveable = function(_val) {
        Cn.setDragOnlyMoveable(_val);
    };
    me.isDragOnlyMoveable=function(){
        return Cn.isDragOnlyMoveable();
    };
    me.setDegree = function(_val) {
        Cn.setDEG(_val);
        Cn.computeAll();
        canvas.paint();
    };
    me.getDegree = function(_val) {
        return Cn.isDEG();
    };
    me.setDemoMode = function(_val) {
        canvas.demoModeManager.setDemoMode(_val);
    };
    me.getDemoMode = function() {
        return canvas.demoModeManager.getDemoMode();
    };
    me.getBackgroundColor = function() {
        return canvas.getBackground();
    };
    me.setBackgroundColor = function(val) {
        return canvas.setBackground(val);
    };

    var props_name = new props_namePanel(me);
    var props_color = new props_colorPanel(me);
    var props_grid = new props_gridPanel(me);
    var props_message = new props_messagePanel(me);
    // Une ineptie necessaire parce que sinon le clavier virtuel
    // de l'ipad change la position du panneau de propriété :
    if (Object.touchpad) {
        window.scrollTo(0, 0);
    }

    props_message.show();

    me.showProperties = function(_obj) {
        if ($U.isMobile.mobilePhone()) {
            props_color.clearContent();
            props_message.clearContent();
        }

        props_message.close();
        if (_obj.getCode().startsWith("axis")) {
            if ($U.isMobile.mobilePhone())
                props_color.clearContent();
            props_color.close();
            props_name.close();
            props_grid.show();
            props_grid.set();
        } else {
            props_grid.close();
            if (_obj.getCode() === "expression_cursor")
                props_name.close();
            else
                props_name.set(_obj);

            props_color.set(_obj);
            // Une ineptie necessaire parce que sinon le clavier virtuel
            // de l'ipad change la position du panneau de propriété :
            if (Object.touchpad) {
                window.scrollTo(0, 0);
            }
        }
    };
    //
    me.compute = function() {
        Cn.computeAll();
    };
    me.repaint = function() {
        canvas.paint();
    };
    me.getAnimationSpeed = function(_o) {
        return Cn.getAnimationSpeed(_o)
    };

    me.setAnimationSpeed = function(_o, _v) {
        Cn.setAnimationSpeed(_o, _v);
    };


    me.setAllSize = function(_type, _sze) {
        Cn.setAllSize(_type, _sze);
    };
    me.setAllSegSize = function(_type, _sze) {
        Cn.setAllSegSize(_type, _sze);
    };
    me.setAllColor = function(_type, _sze) {
        Cn.setAllColor(_type, _sze);
    };
    me.setAllOpacity = function(_type, _sze) {
        Cn.setAllOpacity(_type, _sze);
    };
    me.setAllLayer = function(_type, _sze) {
        Cn.setAllLayer(_type, _sze);
    };
    me.setAllPtShape = function(_shape) {
        Cn.setAllPtShape(_shape);
    };
    me.setAllFontSize = function(_type, _sze) {
        Cn.setAllFontSize(_type, _sze);
    };
    me.setAllPrecision = function(_type, _sze) {
        Cn.setAllPrecision(_type, _sze);
    };
    me.setAllIncrement = function(_type, _sze) {
        Cn.setAllIncrement(_type, _sze);
    };
    me.setAllDash = function(_type, _sze) {
        Cn.setAllDash(_type, _sze);
    };
    me.setAll360 = function(_type, _360) {
        Cn.setAll360(_type, _360);
    };
    me.setAllTrigo = function(_type, _t) {
        Cn.setAllTrigo(_type, _t);
    };
    me.setAllNoMouse = function(_type, _sze) {
        Cn.setAllNoMouse(_type, _sze);
    };
    me.setTrack = function(_o, _val) {
        if (_val)
            canvas.trackManager.add(_o);
        else
            canvas.trackManager.remove(_o);
    };
    me.setAllTrack = function(_type, _val) {
        canvas.trackManager.setAllTrack(_type, _val);
    };
    // me.setAnimation=function(_o,_val){

    // };

}
