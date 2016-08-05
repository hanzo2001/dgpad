
import {BlocklyObject} from './BlocklyObject';

function BlocklyObjects(_object, _construction) {
    var Cn = _construction;
    var OBJ = _object;
    var MODE = [];
    var current;
    var obj = {};
    this.setMode = function(_tab, _cur) {
        MODE = _tab;
        obj = {};
        for (var i = 0; i < MODE.length; i++) {
            obj[MODE[i]] = new BlocklyObject(this, Cn);
        };
        current = _cur;
    };
    this.getMode = function() {
        return MODE;
    };
    this.isEmpty = function() {
        for (var i = 0; i < MODE.length; i++) {
            if (obj[MODE[i]].getXML()) return false;
        };
        return true;
    };
    this.getCn = function() {
        return Cn
    };
    this.getObj = function() {
        return OBJ;
    };
    this.clear = function() {
        for (myobj in obj) {
            myobj.setSource(null, null, null);
        }
    };
    this.setCurrent = function(_c) {
        current = _c;
    };
    this.getCurrent = function() {
        return current;
    };
    this.getCurrentObj = function() {
        return obj[current];
    };
    this.getCurrentXML = function() {
        return obj[current].getXML();
    };
    this.get = function(_m) {
        return obj[_m]
    };
    this.getXML = function(_m) {
        return obj[_m].getXML();
    };
    this.getSNC = function(_m) {
        return obj[_m].getSNC();
    };
    this.setChilds = function(_m, _childs) {
        obj[_m].setChilds(_childs);
    };
    this.setParents = function(_m, _childs) {
        obj[_m].setParents(_childs);
    };
    this.evaluate = function(_m) {
        if (obj[_m]) obj[_m].evaluate()
    };
    // Called on each workspace change (and load time) :
    this.setBehavior = function(_m, _xml, _sync, _async) {
        obj[_m].setBehavior(_m, _xml, _sync, _async)
    };
    this.getSource = function() {
        var src = {};
        for (var i = 0; i < MODE.length; i++) {
            var m = MODE[i];
            if (obj[m].getXML()) {
                src[m] = {};
                src[m]["xml"] = obj[m].getXML();
                src[m]["sync"] = obj[m].getSNC();
                var tab = obj[m].getChilds();
                if (tab.length > 0) src[m]["childs"] = tab;
                tab = obj[m].getParents();
                if (tab.length > 0) src[m]["parents"] = tab;
            }
        };
        src["current"] = current;
        return JSON.stringify(src);
    };
    this.setSource = function(_src) {
        for (var i = 0; i < MODE.length; i++) {
            if (_src.hasOwnProperty(MODE[i])) {
                var m = MODE[i];
                obj[m].setBehavior(m, _src[m]["xml"], _src[m]["sync"], null);
                if (_src[m].hasOwnProperty("childs")) obj[m].setChilds(_src[m]["childs"]);
                if (_src[m].hasOwnProperty("parents")) obj[m].setParents(_src[m]["parents"]);
            }
        };
        current = _src["current"];
    };
}
