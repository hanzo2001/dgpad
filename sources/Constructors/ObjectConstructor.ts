/// <reference path="../typings/Constructors/iObjectConstructor.d.ts" />

import {Expression} from '../Expression';

export class ObjectConstructor implements iObjectConstructor {
	protected C: iConstructionObject[];
	protected isNewPoint: boolean;
	protected isSelectCreatePoint: boolean;
	constructor() {
		this.C = [];
		// Only for preview purpose :
		this.isSelectCreatePoint = false;
		this.isNewPoint = false;
	}
	getCode(): string {
		return "";
	}
	// Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
	getType(): number {
		return 0;
	}
	getInitials(): any[] {
		return [];
	}
	preview(ev, zc) {
	}
	getC(i:number) {
		return i < this.C.length ? this.C[i] : null;
	}
	getCList(): any[] {
		return this.C;
	}
	clearC() {
		this.C = [];
	}
	addC(o) {
		this.C.push(o);
	}
	isAcceptedInitial(o:iConstructionObject): boolean {
		var bool = false;
		var inis = this.getInitials();
		if (this.C.length < inis.length) {
			var tab = inis[this.C.length].split(",");
			for (var i = 0; i < tab.length; i++) {
				bool = bool || (o.isInstanceType(tab[i]));
			}
		}
		return bool;
	}
	isLastObject(): boolean {
		return true;
	}
	isInstantTool(): boolean {
		return false;
	}
	selectInitialObjects(zc) {
		// if (this.C.length > 0)
		// zc.getConstruction().addSelected(this.C[0]);
		if (this.C.length > 0 && !this.C[0].isIndicated()) {
			zc.getConstruction().addSelected(this.C[0]);
		}
	}
	setInitialObjects(os:iConstructionObject[]) {
		//var len = os.length;
		this.C = [];
		let i=0, s=os.length;
		while (i<s) {
			if (this.isAcceptedInitial(os[i])) {
				this.C.push(os[i]);
			} else {
				return;
			}
			i++;
		}
	}
	selectCreatePoint(zc:iCanvas, event:Event) {
		this.isSelectCreatePoint = true;
		var Cn = zc.getConstruction();
		var point = Cn.getFirstIndicatedPoint();
		this.isNewPoint = !point;
		if (this.isNewPoint) {// there is nothing indicated
			var pc = zc.getPointConstructor();
			if (Cn.getIndicated().length) {
				pc.setInitialObjects(Cn.getIndicated());
			}
			point = pc.createObj(zc, event);
			pc.clearC();
		}
		this.C.push(point);
	}
	createCallBack(zc, o) {
	}
	createObj(zc:iCanvas, event:Event) {
		if (this.C.length > 0) {
			var s = this.newObj(zc, this.C);
			zc.addObject(s);
			s.compute();
			if (zc.getConstruction().is3D())
				zc.getConstruction().computeAll();
		}
		this.createCallBack(zc, s);
		Expression.fixAll();
	}
	newObj(_zc, _C) {
	}
}
