/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

/**
 * what is zc??
 * find an object with `selectCalcBtn` method
 */

export class CallCalc extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	selectCreatePoint(zc, ev) {}
	preview(ev, zc) {}
	getCode(): string {
		return "callcalc";
	}
	// Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
	getType(): number {
		return 1;
	}
	isAcceptedInitial(o): boolean {
		return true;
	}
	isInstantTool(): boolean {
		return true;
	}
	createObj(zc, _) {
		zc.selectCalcBtn(true);
		var obj = this.getC(0).getCode() === "list" ? this.getC(0).getEXP() : this.getC(0);
		setTimeout(() => zc.calcManager.edit(obj), 1);
	}
}