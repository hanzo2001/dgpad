/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

export class FloatingObjectConstructor extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "pushpin";
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
	unfree(): boolean {
		return false;
	}
	createObj(zc:iCanvas, _) {
		var pt = this.getC(0);
		pt.setFloat(!pt.getFloat());
		if (pt.getFloat()) {
			pt.free = () => false;
		} else {
			pt.free = () => pt.getParentLength() === 0;
		}
		// zc.selectPropBtn(true);
		// zc.propertiesManager.edit(this.getC(0));
	}
	selectCreatePoint(_, __) {}
	preview(_, __) {}
}
