/// <reference path="../typings/iBlockly.d.ts" />

import {BlocklyObject} from './BlocklyObject';

type Source = {
	xml: string,
	sync: string,
	childs: any[],
	parents: any[]
};

export class BlocklyObjects implements iBlocklyObjects {
	private Cn: iConstruction;
	private OBJ: iConstructionObject;
	private MODE: string[];
	private current: string;
	private obj: {[id:string]: BlocklyObject};
	constructor(_object:iConstructionObject, _construction:iConstruction) {
		this.Cn = _construction;
		this.OBJ = _object;
		this.MODE = [];
		this.current;
		this.obj = {};
	}
	setMode(_tab:string[], _cur:string) {
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
	getCn(): iConstruction {
		return this.Cn
	}
	getObj(): iConstructionObject {
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
	getCurrent(): string {
		return this.current;
	}
	getCurrentObj(): BlocklyObject {
		return this.obj[this.current];
	}
	getCurrentXML(): string {
		return this.obj[this.current].getXML();
	}
	get(_m:string): BlocklyObject {
		return this.obj[_m]
	}
	getXML(_m:string): string {
		return this.obj[_m].getXML();
	}
	getSNC(_m:string) {
		return this.obj[_m].getSNC();
	}
	setChilds(_m:string, _childs) {
		this.obj[_m].setChilds(_childs);
	}
	setParents(_m:string, _childs) {
		this.obj[_m].setParents(_childs);
	}
	evaluate(eventType:string) {
		if (this.obj[eventType]) {this.obj[eventType].evaluate();}
	}
	// Called on each workspace change (and load time) :
	setBehavior(_m:string, _xml, _sync, _async) {
		this.obj[_m].setBehavior(_m, _xml, _sync, _async)
	}
	getSource(): string {
		var srcs = {};
		let i=0, s=this.MODE.length;
		while (i<s) {
			var m = this.MODE[i++];
			if (this.obj[m].getXML()) {
				let src = <Source>{};
				src.xml = this.obj[m].getXML();
				src.sync = this.obj[m].getSNC();
				var tab = this.obj[m].getChilds();
				if (tab.length > 0) {src.childs = tab;}
				tab = this.obj[m].getParents();
				if (tab.length > 0) {src.parents = tab;}
				srcs[m] = src;
			}
		}
		srcs['current'] = this.current;
		return JSON.stringify(srcs);
	}
	setSource(_srcs:any) {
		let i=0, s=this.MODE.length;
		while (i<s) {
			let m = this.MODE[i++];
			if (_srcs.hasOwnProperty(m)) {
				let src = <Source>_srcs[m];
				this.obj[m].setBehavior(m, src.xml, src.sync, null);
				if (src.childs)  {this.obj[m].setChilds(src.childs);}
				if (src.parents) {this.obj[m].setParents(src.parents);}
			}
		}
		this.current = _srcs["current"];
	}
}
