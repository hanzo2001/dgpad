/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

/**
 * what is zc??
 * find an object with `selectPropBtn` method
 */

export class CallProperty extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "callproperty";
	}
	// Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
	getType(): number {
		return 1;
	}
	isAcceptedInitial(_): boolean {
		return true;
	}
	isInstantTool(): boolean {
		return true;
	}
	createObj(zc, _) {
		zc.selectPropBtn(true);
		zc.propertiesManager.edit(this.getC(0));
	}
	selectCreatePoint(_, __) { }
	preview(_, __) { }
}
