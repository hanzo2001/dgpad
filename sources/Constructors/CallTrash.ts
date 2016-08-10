/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

export class CallTrash extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "calltrash";
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
	createObj(zc:iCanvas, _) {
		zc.undoManager.deleteObjs(zc.getConstruction().safelyDelete(this.getC(0)));
	}
	selectCreatePoint(_, __) { }
	preview(_, __) { }
}
