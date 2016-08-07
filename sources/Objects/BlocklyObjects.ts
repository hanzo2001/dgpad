/// <reference path="../typings/iBlockly.d.ts" />

import {BlocklyObject} from './BlocklyObject';

export class BlocklyObjects implements iBlocklyObjects {
	private Cn;
	private OBJ;
	private MODE: string[];
	private current;
	private obj: {[id:string]: BlocklyObject};
	constructor(_object, _construction) {
		this.Cn = _construction;
		this.OBJ = _object;
		this.MODE = [];
		this.current;
		this.obj = {};
	}
	setMode(_tab, _cur) {
		this.MODE = _tab;
		this.obj = {};
		let i=0, s=this.MODE.length;
		while (i<s) {
			this.obj[this.MODE[i++]] = new BlocklyObject(this, this.Cn);
		};
		this.current = _cur;
	}
	getMode() {
		return this.MODE;
	}
	isEmpty(): boolean {
		for (var i = 0; i < this.MODE.length; i++) {
			if (this.obj[this.MODE[i]].getXML()) {return false;}
		};
		return true;
	}
	getCn() {
		return this.Cn
	}
	getObj() {
		return this.OBJ;
	}
	clear() {
		for (myobj in this.obj) {
			myobj.setSource(null, null, null);
		}
	}
	setCurrent(_c) {
		this.current = _c;
	}
	getCurrent() {
		return this.current;
	}
	getCurrentObj() {
		return this.obj[this.current];
	}
	getCurrentXML() {
		return this.obj[this.current].getXML();
	}
	get(_m) {
		return this.obj[_m]
	}
	getXML(_m) {
		return this.obj[_m].getXML();
	}
	getSNC(_m) {
		return this.obj[_m].getSNC();
	}
	setChilds(_m, _childs) {
		this.obj[_m].setChilds(_childs);
	}
	setParents(_m, _childs) {
		this.obj[_m].setParents(_childs);
	}
	evaluate(_m) {
		if (this.obj[_m]) {this.obj[_m].evaluate();}
	}
	// Called on each workspace change (and load time) :
	setBehavior(_m, _xml, _sync, _async) {
		this.obj[_m].setBehavior(_m, _xml, _sync, _async)
	}
	getSource(): string {
		var src = {};
		let i=0, s=this.MODE.length;
		while (i<s) {
			var m = this.MODE[i];
			if (this.obj[m].getXML()) {
				src[m] = {};
				src[m]["xml"] = this.obj[m].getXML();
				src[m]["sync"] = this.obj[m].getSNC();
				var tab = this.obj[m].getChilds();
				if (tab.length > 0) {src[m]["childs"] = tab;}
				tab = this.obj[m].getParents();
				if (tab.length > 0) {src[m]["parents"] = tab;}
			}
			i++;
		}
		src["current"] = this.current;
		return JSON.stringify(src);
	}
	setSource(_src) {
		let i=0, s=this.MODE.length;
		while (i<s) {
			if (_src.hasOwnProperty(this.MODE[i])) {
				var m = this.MODE[i];
				this.obj[m].setBehavior(m, _src[m]["xml"], _src[m]["sync"], null);
				if (_src[m].hasOwnProperty("childs"))  {this.obj[m].setChilds(_src[m]["childs"]);}
				if (_src[m].hasOwnProperty("parents")) {this.obj[m].setParents(_src[m]["parents"]);}
			}
			i++;
		}
		this.current = _src["current"];
	}
}
