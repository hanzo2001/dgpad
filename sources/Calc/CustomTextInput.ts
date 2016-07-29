
function CustomTextInput(_man, _ownerdiv, _lbl) {
    //    $U.extend(this, new GUIElement(_ownerdiv, "div"));
    $U.extend(this, new Panel(_ownerdiv.getDocObject()));
    this.setStyles("opacity:0");
    this.transition("opacity", 0.4);
    var me = this;
    var man = _man;
    var LabelWidth = 70;
    var bounds = {};
    var active = false;
    var click_on = false;
    var sel = new CustomTextSelection(me);
    var preferredKB = 0; // Clavier préféré : 0 pour custom, et 1 pour standard


    //-linear-gradient(top, #eeeef0, #d3d3d9)
    me.setStyles("position:absolute;border-radius:5px;border: 1px solid #b4b4b4;background-color:#FAFAFA");
    //    me.setStyles("background: " + $U.browserCode() + "-linear-gradient(top, #E1E3CD, #EFF2DA);text-shadow: 0 1px 0 #fff;display: inline-block");

    var isHidden = function() {
        return (parseInt(me.getStyle("opacity")) === 0);
    };
    this.show = function() {
        if (isHidden()) {
            me.applyTransitionIN();
            inp.addDownEvent(mousedown);
            inp.addUpEvent(mouseup, window);
            inp.addMoveEvent(mousemove);
        }
    };
    this.hide = function() {
        me.applyTransitionOUT();
        inp.removeDownEvent(mousedown);
        inp.removeUpEvent(mouseup, window);
        inp.removeMoveEvent(mousemove);
    };

    var mouseX = function(ev) {
        return (ev.pageX - bounds.left - lb.getDocObject().offsetWidth - 20);
    };

    var mousedown = function(ev) {
        man.activate(me);
        sel.mousedown(mouseX(ev));
        click_on = true;
    };

    var mouseup = function() {
        click_on = false;
    };

    var mousemove = function(ev) {
        if (click_on) {
            sel.mousemove(mouseX(ev));
        }
    };

    me.setPreferredKB = function(_kb) {
        preferredKB = _kb
    };

    me.setSelectionRange = function(_s, _e) {
        sel.setSelectionRange(_s, _e);
    };

    me.setActive = function(_b) {
        active = _b;
        sel.setActive();
        if ((!active) && (standard))
            standard.quit();
        if ((active) && (preferredKB === 1)) {
            me.showKB();
            if (standard)
                standard.getDocObject().setSelectionRange(0, 1000);
        }
        if ((active) && (preferredKB === 0))
            man.setKeyEvents(false);
    };

    me.isActive = function() {
        return active;
    };

    // Appelée à chaque fois que le texte change, quel
    // que soit le clavier choisi. A surcharger par setChangedFilter :
    var changedFilter = function(txt) {};
    me.setChangedFilter = function(_proc) {
        changedFilter = _proc;
    };


    var lb = new GUIElement(me, "div");
    var inp = new GUIElement(me, "div");
    var content = new GUIElement(me, "span");
    me.getInputDIV = function() {
        return inp;
    };
    me.getContentSPAN = function() {
        return content;
    };
    lb.setAttr("textContent", _lbl);
    lb.setStyles("position:absolute;left:20px;top:0px;width:" + LabelWidth + "px;background-color:rgba(0,0,0,0);padding-left:0px;font-family:Helvetica,Arial,sans-serif;font-size:18px;color:#666;outline-width:0px;border:0px;border-radius:0px");
    inp.setStyles("position:absolute;left:" + (LabelWidth + 20) + "px;z-index:1;overflow:hidden;background-color:rgba(0,0,0,0);border:0px;font-family:Courier New, Courier, monospace;font-size:20px;text-align:left;vertical-align:middle;outline-width:0px;border-radius:0px;padding:0px");
    content.setStyles("background-color:rgba(0,0,0,0);white-space:nowrap;font-family:Courier New, Courier, monospace;font-size:20px;text-align:left");
    var doc = inp.getDocObject();

    me.addContent(lb);
    me.addContent(sel);
    me.addContent(inp);

    var standard = null;
    setTimeout(function() {
        var doc = ($APPLICATION) ? window.parent.document.body : window.document.body;
        standard = new GUIElement(me, "input");
        var kb = standard.getDocObject();
        standard.hide();
        standard.setAttr("type", "text");
        var pos = $U.getElementOffset(lb.getDocObject());
        var stls = "left:" + (pos.left + lb.getDocObject().offsetWidth) + "px;";
        stls += "top:" + (pos.top + 1) + "px;";
        stls += "width:" + (bounds.width - 40 - lb.getDocObject().offsetWidth) + "px;";
        stls += "height:" + bounds.height + "px;";
        standard.setStyles(stls += "background-color:#FAFAFA;z-index:3;position:absolute;overflow:hidden;border:0px;font-family:Courier New, Courier, monospace;font-size:20px;text-align:left;vertical-align:middle;outline-width:0px;border-radius:0px;padding:0px");
        kb.onblur = function() {
            man.filterKB(false);
            man.setKeyEvents(false);
            me.setText(kb.value);
            if (active)
                sel.setSelectionRange(kb.selectionStart, kb.selectionEnd);
            standard.hide();
            setTimeout($STANDARD_KBD.setbtn, 5000);
        };
        kb.onkeydown = function(ev) {};
        kb.onkeyup = function(ev) {
            changedFilter(kb.value);
        };
        standard.quit = function() {
            kb.blur();
        };
        doc.appendChild(kb);
    }, 1);

    me.getInput = function() {
        return standard.getDocObject();
    };
    me.getSel = function() {
        return sel;
    };


    me.showKB = function() {};


    me.isStandardKB = function() {
        return (standard !== null);
    }

    me.setBounds = function(l, t, w, h) {
        bounds = {
            left: l,
            top: t,
            width: w,
            height: h
        };
        me.setStyles("left:" + l + "px;top:" + t + "px;width:" + w + "px;height:" + h + "px");
        lb.setStyles("height:" + h + "px;line-height:" + h + "px");
        inp.setBounds(LabelWidth + 20, 0, w - LabelWidth - 40, h);
        inp.setStyles("line-height:" + h + "px");
        sel.setStyles("height:" + (h - 4) + "px");

        // Tout ceci pour mesurer la largeur d'un caractère :


        content.setAttr("textContent", "abcdefghijklmnopqrstuvwxyz");
        content.setStyles("margin-left:0px")
        me.addContent(content);
        setTimeout(function() {
            sel.setCarLength(content.getDocObject().offsetWidth / 26);
            sel.setOffset(lb.getDocObject().offsetWidth + 20);
            content.setAttr("textContent", "");
            me.removeContent(content);
            inp.addContent(content);
        }, 1);
    };

    me.setLabel = function(_l) {
        lb.setAttr("textContent", _l);

        //        me.setBounds(bounds.left, bounds.top, bounds.width, bounds.height);
        //        setTimeout(function() {
        //            sel.setSelectionRange(0, 0);
        //        }, 1);

    };

    me.setText = function(txt) {
        content.setAttr("textContent", txt);
        changedFilter(txt);
    };
    me.getText = function() {
        return content.getAttr("textContent");
    };
    me.insertText = function(_st) {
        if (!active)
            return;
        sel.insertText(_st);
    };
    me.nextCar = function() {
        sel.nextCar();
    };
    me.executeCommand = function(_st) {
        sel.executeCommand(_st);
    }
}

