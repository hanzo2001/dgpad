


function CustomTextSelection(_ti) {
    $U.extend(this, new GUIElement(_ti, "div"));
    var me = this;
    var ti = _ti;
    var offsetX = 0;
    var clickpos = NaN,
        selStart = NaN,
        selEnd = NaN,
        selStartX = NaN,
        selEndX = NaN;
    var blinkvar = NaN;
    var ONECAR = NaN;
    var marginOffsetX = 0;

    me.setStyles("pointer-events:none;z-index:2;visibility:hidden;position:absolute;background-color:blue;left:0px;top:2px;width:3px");
    me.setOffset = function(_x) {
        offsetX = _x;
    };

    var setMarginOffset = function() {
        if (selStartX > ti.getInputDIV().getBounds().width) {
            marginOffsetX = ti.getInputDIV().getBounds().width - selStartX;
            ti.getContentSPAN().setStyles("margin-left:" + marginOffsetX + "px");
        } else {
            ti.getContentSPAN().setStyles("margin-left:0px");
            marginOffsetX = 0;
        }
    }

    var display = function(_withOffset) {
        if (_withOffset)
            setMarginOffset();
        if (isNaN(selStart)) {
            clearInterval(blinkvar);
            blinkvar = NaN;
            me.setStyles("visibility:hidden;left:" + (offsetX + marginOffsetX) + "px;width:0px");
        } else {
            if (selStart === selEnd) {
                if (isNaN(blinkvar)) {
                    me.setStyle("visibility", "visible");
                    blinkvar = setInterval(blink, 500);
                }
                me.setStyles("background-color:rgba(0,0,255,1);left:" + (selStartX + offsetX + marginOffsetX) + "px;width:3px");
            } else {
                clearInterval(blinkvar);
                blinkvar = NaN;
                me.setStyles("visibility:visible;background-color:rgba(0,0,255,0.2);left:" + (selStartX + offsetX + marginOffsetX) + "px;width:" + (selEndX - selStartX) + "px");
            }
        }
        //        console.log("display:" + selStartX); 
    };
    var blink = function() {
        if (me.getStyle("visibility") === "hidden")
            me.setStyle("visibility", "visible");
        else
            me.setStyle("visibility", "hidden");
    };

    me.setHide = function(_h) {
        if (_h)
            me.setStyle("display", "none");
        else {
            me.setStyle("display", "inline");
            me.setStyle("visibility", "visible");
            //            console.log("show !!!");
        }

    }

    me.nextCar = function() {
        if (selStart < ti.getText().length) {
            selStart++;
            selStartX = ONECAR * selStart;
            selEnd = selStart;
            selEndX = selStartX;
            clickpos = selStart;
            display(true);
        }
    };
    me.getSelStart = function() {
        return selStart;
    };
    me.getSelEnd = function() {
        return selEnd;
    };
    me.setSelectionRange = function(_start, _end) {
        selStart = _start;
        selStartX = ONECAR * selStart;
        selEnd = _end;
        selEndX = ONECAR * selEnd;
        clickpos = selStart;
        display(true);
    };
    me.setCarLength = function(x) {
        ONECAR = x;
    };
    me.getCarLength = function() {
        return ONECAR;
    }
    me.mousedown = function(x) {
        if (!ti.isActive())
            return;
        x = x - marginOffsetX;
        selStart = Math.round(x / ONECAR);
        if (selStart > ti.getText().length)
            selStart = ti.getText().length;
        selStartX = ONECAR * selStart;
        selEnd = selStart;
        selEndX = selStartX;
        clickpos = selStart;
        display(false);
    };
    me.mousemove = function(x) {
        if (!ti.isActive())
            return;
        x = x - marginOffsetX;
        var xpos = Math.round(x / ONECAR);
        if (xpos < 0)
            xpos = 0;
        selStart = Math.min(xpos, clickpos);
        selEnd = Math.max(xpos, clickpos);
        if (selEnd > ti.getText().length)
            selEnd = ti.getText().length;
        selStartX = ONECAR * selStart;
        selEndX = ONECAR * selEnd;
        display(false);
    };

    me.setActive = function() {
        if (!ti.isActive()) {
            selStart = NaN, selEnd = NaN, selStartX = NaN, selEndX = NaN;
            display(true);
        }
    };

    me.getText = function() {
        return (ti.getText().substring(selStart, selEnd));
    };

    me.executeCommand = function(_st) {
        switch (_st) {
            case "DEL":
                if (selStart > 0) {
                    var s = ti.getText();
                    if (selStart === selEnd) {
                        var before = s.slice(0, selStart - 1);
                        var after = s.slice(selEnd);
                    } else {
                        var before = s.slice(0, selStart);
                        var after = s.slice(selEnd);

                    }
                    ti.setText(before + after);
                    selStart = before.length;
                    //                    selStart--;
                }
                break;
            case "CLR":
                ti.setText("");
                selStart = 0;
                break;
            case "LEFT":
                if (selStart > 0)
                    selStart--;
                break;
            case "RIGHT":
                if (selStart < ti.getText().length)
                    selStart++;
                break;
        }
        selStartX = ONECAR * selStart;
        selEnd = selStart;
        selEndX = selStartX;
        clickpos = selStart;
        me.setStyle("visibility", "visible");
        display(true);
    }

    var command = function(_st) {
        if (_st.indexOf("cmd_") !== 0)
            return false;
        _st = _st.replace("cmd_", "");
        switch (_st) {
            case "DEL":
                me.executeCommand("DEL");
                break;
            case "CLR":
                me.executeCommand("CLR");
                break;
            case "◀":
                me.executeCommand("LEFT");
                break;
            case "▶":
                me.executeCommand("RIGHT");
                break;
        }
        return true;
    };

    var particularCases = function(_st) {
        var s = ti.getText();
        var before = s.slice(0, selStart);
        var middle = s.substring(selStart, selEnd);
        var after = s.slice(selEnd);
        switch (_st) {
            case "( )":
                ti.setText(before + "(" + middle + ")" + after);
                selStart += (middle.length === 0) ? 1 : middle.length + 2;
                return true;
                break;
            case "[ ]":
                ti.setText(before + "[" + middle + "]" + after);
                selStart += (middle.length === 0) ? 1 : middle.length + 2;
                return true;
                break;
        }
        return false;
    };

    me.insertText = function(_st) {
        if (!command(_st)) {
            if (!particularCases(_st)) {
                var s = ti.getText();
                var before = s.slice(0, selStart);
                var middle = s.substring(selStart, selEnd);
                var after = s.slice(selEnd);
                if (_st.indexOf("@") === -1) {
                    middle = _st;
                    selStart += _st.length;
                } else {
                    var empty = (middle === "");
                    middle = _st.replace("@", middle);
                    selStart += empty ? middle.length - (_st.length - _st.indexOf("@") - 1) : middle.length;
                }
                ti.setText(before + middle + after);
            }
        }
        selStartX = ONECAR * selStart;
        selEnd = selStart;
        selEndX = selStartX;
        clickpos = selStart;
        me.setStyle("visibility", "visible");
        display(true);
    };


}
