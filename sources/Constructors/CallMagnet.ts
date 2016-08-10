/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

export class CallMagnet extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "magnet";
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
		zc.magnetManager.edit(this.getC(0));
		// zc.propertiesManager.edit(this.getC(0));
	}
	selectCreatePoint(_, __) { }
	preview(_, __) { }
}
