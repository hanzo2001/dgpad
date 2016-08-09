/// <reference path="../typings/Constructors/iObjectConstructor.d.ts" />

import {Expression} from '../Expression';

export class ObjectConstructor implements iObjectConstructor {
	protected C: any[];
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
	isAcceptedInitial(o): boolean {
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
	setInitialObjects(_sel) {
		var len = _sel.length;
		this.C = [];
		for (var i = 0; i < len; i++) {
			if (this.isAcceptedInitial(_sel[i])) {
				this.C.push(_sel[i]);
			} else {
				return;
			}
		}
	}
	selectCreatePoint(zc, ev) {
		this.isSelectCreatePoint = true;
		var cn = zc.getConstruction();
		var newPt = cn.getFirstIndicatedPoint();
		this.isNewPoint = (newPt === null);
		if (this.isNewPoint) {
			var pc = zc.getPointConstructor();
			if (cn.getIndicated().length > 0) {
				pc.setInitialObjects(cn.getIndicated());
			}
			newPt = pc.createObj(zc, ev);
			pc.clearC();
		}
		this.C.push(newPt);
	}
	createCallBack(zc, o) {
	}
	createObj(zc, ev) {
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
