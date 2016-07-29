

function props_colorPanel(_owner) {
    var me = this;
    $U.extend(this, new props_panel(_owner));
    var ch = 100; // Color picker height
    var cp = null; // Color picker
    var sOpacity = null;
    var sSize = null;
    var segSize = null;
    var sLayer = null;
    var sFont = null;
    var sPrec = null;
    var sInc = null;
    var pShape = null;
    var cbApplyAll = null;
    var cbDash = null;
    var cbNomouse = null;
    var cbTrack = null;
    var setall = false;
    var sAnim = null;




    me.setAttr("className", $U.isMobile.mobilePhone() ? "props_colorDIV_Mobile" : "props_colorDIV");
    me.transition("translate_x", 0.2, 200);

    var HEXcallback = function(_hex) {
        if (setall)
            _owner.setAllColor(me.obj.getFamilyCode(), _hex);
        else
            me.obj.setColor(_hex);
        me.repaint();
    };

    var BOcallback = function(_val) {
        if (setall)
            _owner.setAllOpacity(me.obj.getFamilyCode(), _val);
        else
            me.obj.setOpacity(_val);
        me.repaint();
    };

    var SZcallback = function(_val) {
        if (setall)
            _owner.setAllSize(me.obj.getFamilyCode(), _val);
        else {
            if ((me.obj.getCode() === "list") && (_val === 0) && (me.obj.getSegmentsSize() === 0)) {
                me.obj.setSegmentsSize(0.1);
                segSize.setValue(0.1);
            }
            me.obj.setSize(_val);
            me.obj.compute();
            me.obj.computeChilds();
        }
        me.repaint();
    };
    var SegSZcallback = function(_val) {
        if (setall) {
            _owner.setAllSegSize(me.obj.getFamilyCode(), _val);
        } else {
            if ((_val === 0) && (me.obj.getSize() === 0)) {
                me.obj.setSize(0.1);
                sSize.setValue(0.1);
            }
            me.obj.setSegmentsSize(_val);
            me.obj.compute();
            me.obj.computeChilds();
        }
        me.repaint();
    };
    var LAYcallback = function(_val) {
        if (setall)
            _owner.setAllLayer(me.obj.getFamilyCode(), _val);
        else
            me.obj.setLayer(_val);
        me.repaint();
    };

    var FONTcallback = function(_val) {
        if (setall)
            _owner.setAllFontSize(me.obj.getFamilyCode(), _val);
        else
            me.obj.setFontSize(_val);
        me.repaint();
    };


    var PRECcallback = function(_val) {
        if (setall)
            _owner.setAllPrecision(me.obj.getFamilyCode(), _val);
        else {
            me.obj.setPrecision(_val);
            if ((me.obj.getCode() === "locus") || (me.obj.getCode() === "quadric")) {
                me.obj.compute();
            }
        }
        me.repaint();
    };
    var INCCcallback = function(_val) {
        if (setall)
            _owner.setAllIncrement(me.obj.getFamilyCode(), _val);
        else
            me.obj.setIncrement(_val);
        me.compute();
        me.repaint();
    };
    var ANIMcallback = function(_val) {
        _owner.setAnimationSpeed(me.obj, _val)
    };

    var PSHAPEcallback = function(_val) {
        if (setall)
            _owner.setAllPtShape(_val);
        else
            me.obj.setShape(_val);
        me.repaint();
    };
    var APALLcallback = function(_val) {
        setall = _val;
    };
    var DSHcallback = function(_val) {
        if (setall)
            _owner.setAllDash(me.obj.getFamilyCode(), _val);
        else
            me.obj.setDash(_val);
        me.repaint();
    };
    var m360callback = function(_val) {
        if (setall)
            _owner.setAll360(me.obj.getFamilyCode(), _val);
        else
            me.obj.set360(_val);
        me.compute();
        me.repaint();
    };
    var trigocallback = function(_val) {
        if (setall)
            _owner.setAllTrigo(me.obj.getFamilyCode(), _val);
        else
            me.obj.setTrigo(_val);
        me.compute();
        me.repaint();
    };

    var NOMOUSEcallback = function(_val) {
        if (setall)
            _owner.setAllNoMouse(me.obj.getFamilyCode(), _val);
        else
            me.obj.setNoMouseInside(_val);
        me.repaint();
    };
    var TRKcallback = function(_val) {
        if (setall)
            _owner.setAllTrack(me.obj.getFamilyCode(), _val);
        else
            _owner.setTrack(me.obj, _val);
    };

    var precVal = function(val) {
        if (val === -1)
            return val;
        else
            return $U.log(val);
    };


    me.setPickerColor = function(_hex) {
        if (!$U.isMobile.mobilePhone())
            cp.setHEX(_hex);
        HEXcallback(_hex);
    };


    me.setObj = function() {
        me.clearContent();
        ch = 140;

        if (!$U.isMobile.mobilePhone()) {
            cp = new ColorPicker(me.getDocObject(), 10, 10, 200, ch);
            cp.setHEXcallback(HEXcallback);
            cp.setHEX(me.obj.getColor().getHEX());
            ch += 25;
        } else
            ch = 10;

        if ($U.isMobile.mobilePhone()) {
            new props_generic_color(me, "rgb(0,0,178)", 10, ch, 24);
            new props_generic_color(me, "rgb(0,124,124)", 51, ch, 24);
            new props_generic_color(me, "rgb(0,124,0)", 92, ch, 24);
            new props_generic_color(me, "rgb(150,100,0)", 133, ch, 24);
            new props_generic_color(me, "rgb(180,0,0)", 174, ch, 24);
            ch += 34;
        }

        if (!$U.isMobile.mobilePhone()) {
            pShape = new ImageGroup(me.getDocObject(), 10, ch, 200, 25, $APP_PATH + "NotPacked/images/pointshape/bgOff.svg", $APP_PATH + "NotPacked/images/pointshape/bgOn.svg", PSHAPEcallback);
            pShape.setImageSize(25);
            pShape.setMargin(15);
            pShape.setHspace(25);
            pShape.addImage($APP_PATH + "NotPacked/images/pointshape/circle.svg");
            pShape.addImage($APP_PATH + "NotPacked/images/pointshape/cross.svg");
            pShape.addImage($APP_PATH + "NotPacked/images/pointshape/diamond.svg");
            pShape.addImage($APP_PATH + "NotPacked/images/pointshape/square.svg");
            pShape.select(me.obj.getShape());
            ch += 30;
        }

        var sh = 35;
        sSize = new slider(me.getDocObject(), 10, ch, 200, sh, 0.5, 25, me.obj.getSize(), SZcallback);
        sSize.setValueWidth(40);
        sSize.setLabel($L.props_size, 80);
        sSize.setTextColor("#252525");
        sSize.setValuePrecision(0.5);
        sSize.setBackgroundColor("rgba(0,0,0,0)");
        sSize.setValue(me.obj.getSize());


        if (me.obj.getCode() === "list") {
            ch += sh;
            sSize.setMin(0);
            sSize.setMax(6);
            sSize.setValuePrecision(0.1);
            sSize.setValue(me.obj.getSize());
            segSize = new slider(me.getDocObject(), 10, ch, 200, sh, 0, 6, me.obj.getSegmentsSize(), SegSZcallback);
            segSize.setValueWidth(40);
            segSize.setLabel($L.props_segment_size, 80);
            segSize.setTextColor("#252525");
            segSize.setValuePrecision(0.1);
            segSize.setBackgroundColor("rgba(0,0,0,0)");
        }

        ch += sh;
        sOpacity = new slider(me.getDocObject(), 10, ch, 200, sh, 0, 1, me.obj.getOpacity(), BOcallback);
        sOpacity.setValueWidth(40);
        sOpacity.setLabel($L.props_opacity, 80);
        sOpacity.setTextColor("#252525");
        sOpacity.setValuePrecision(0.01);
        sOpacity.setBackgroundColor("rgba(0,0,0,0)");
        sOpacity.setValue(me.obj.getOpacity());

        ch += sh;
        sLayer = new slider(me.getDocObject(), 10, ch, 200, sh, -8, 8, me.obj.getLayer(), LAYcallback);
        sLayer.setValueWidth(40);
        sLayer.setLabel($L.props_layer, 80);
        sLayer.setTextColor("#252525");
        sLayer.setValuePrecision(1);
        sLayer.setBackgroundColor("rgba(0,0,0,0)");
        sLayer.setValue(me.obj.getLayer());

        ch += sh;
        sFont = new slider(me.getDocObject(), 10, ch, 200, sh, 6, 60, me.obj.getFontSize(), FONTcallback);
        sFont.setValueWidth(40);
        sFont.setLabel($L.props_font, 80);
        sFont.setTextColor("#252525");
        sFont.setValuePrecision(1);
        sFont.setBackgroundColor("rgba(0,0,0,0)");
        sFont.setValue(me.obj.getFontSize());

        ch += sh;

        sPrec = new slider(me.getDocObject(), 10, ch, 200, sh, -1, 13, 0, PRECcallback);
        sPrec.setValueWidth(40);
        sPrec.setTextColor("#252525");
        sPrec.setValuePrecision(1);
        sPrec.setBackgroundColor("rgba(0,0,0,0)");
        if ((me.obj.getCode() === "locus") || (me.obj.getCode() === "quadric")) {
            sPrec.setTabValues([
                [1, $L.Locus_density_min], 5, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000, [5000, $L.Locus_density_max]
            ]);
            sPrec.setValue(me.obj.getPrecision());
            sPrec.setLabel($L.Locus_density, 80);
        } else {
            sPrec.setTabValues([
                [-1, $L.props_length_none], 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
            ]);
            sPrec.setValue(precVal(me.obj.getPrecision()));
            sPrec.setLabel($L.props_length, 80);
        }

        ch += sh;
        var cbh = 30;
        if (me.obj.getCode() === "angle") {
            cbDash = new Checkbox(me.getDocObject(), 10, ch, 200, cbh, false, $L.props_360, m360callback);
            cbDash.setTextColor("#252525");
            cbDash.setValue(me.obj.is360());
            ch += cbh;
        } else if (me.obj.getCode() === "fixedangle") {
            cbDash = new Checkbox(me.getDocObject(), 10, ch, 200, cbh, false, $L.props_trigo, trigocallback);
            cbDash.setTextColor("#252525");
            cbDash.setValue(me.obj.isTrigo());
            ch += cbh;
        } else {
            sInc = new slider(me.getDocObject(), 10, ch, 200, sh, -4, 4, 0, INCCcallback);
            sInc.setTabValues([
                [0, $L.props_inc_free], 0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 100, 1000
            ]);
            sInc.setValue(me.obj.getIncrement());
            sInc.setValueWidth(40);
            sInc.setLabel($L.props_inc, 80);
            sInc.setTextColor("#252525");
            sInc.setValuePrecision(1);
            sInc.setBackgroundColor("rgba(0,0,0,0)");
            sInc.setValue(me.obj.getIncrement());
            ch += sh;
        }


        // Curseur animation :
        if (me.obj.isAnimationPossible()) {
            sAnim = new slider(me.getDocObject(), 10, ch, 200, sh, -4, 4, 0, ANIMcallback);
            var fce = me.obj.getAnimationSpeedTab();
            fce[0] = [fce[0], $L.animation_without];
            sAnim.setTabValues(fce);
            sAnim.setValueWidth(40);
            sAnim.setLabel($L.animation_label, 80);
            sAnim.setTextColor("#252525");
            sAnim.setValuePrecision(1);
            sAnim.setBackgroundColor("rgba(0,0,0,0)");
            sAnim.setValue(_owner.getAnimationSpeed(me.obj));
        } else {
            cbDash = new Checkbox(me.getDocObject(), 10, ch, 200, cbh, false, $L.props_dash, DSHcallback);
            cbDash.setTextColor("#252525");
            cbDash.setValue(me.obj.isDash());
        }

        if (!$U.isMobile.mobilePhone()) {
            ch += cbh;
            cbNomouse = new Checkbox(me.getDocObject(), 10, ch, 200, cbh, false, $L.props_nomouse, NOMOUSEcallback);
            cbNomouse.setTextColor("#252525");
            cbNomouse.setValue(me.obj.isNoMouseInside());
        }

        if (me.obj.getCode() !== "list") {
            ch += cbh;
            cbTrack = new Checkbox(me.getDocObject(), 10, ch, 200, cbh, false, $L.props_track, TRKcallback);
            cbTrack.setTextColor("#252525");
            cbTrack.setValue(me.obj.isTrack());
        }
        ch += cbh;
        cbApplyAll = new Checkbox(me.getDocObject(), 10, ch, 200, cbh, false, $L.props_applyall + $L.object.family[me.obj.getFamilyCode()], APALLcallback);
        cbApplyAll.setTextColor("#252525");
        cbApplyAll.setText($L.props_applyall + $L.object.family[me.obj.getFamilyCode()]);
        cbApplyAll.setValue(setall = false);


        me.show();
    };
}
