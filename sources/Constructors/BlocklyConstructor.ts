/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

export class BlocklyConstructor extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	selectCreatePoint(zc, ev) { }
	preview(ev, zc) { }
	getCode(): string {
		return "blockly";
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
	createObj(zc:iCanvas, _) {
		zc.blocklyManager.edit(this.getC(0));
		// zc.propertiesManager.edit(this.getC(0));
	}
}
