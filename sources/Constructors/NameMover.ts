/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

var $U = (<any>window).$U;

export class NameMover extends ObjectConstructor {
	getCode(): string {
		return "namemover";
	}
	// Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
	getType(): number {
		return 1;
	}
	isAcceptedInitial(_): boolean {
		return true;
	}
	createObj(_, __) {
		// console.log("createObj");
	}
	selectCreatePoint(_, __) {}
	preview(event: MouseEvent, zc: iCanvas) {
		var o = this.getC(0);
		var a = $U.angleH(o.getX() - zc.mouseX(event), o.getY() - zc.mouseY(event));
		o.setNamePosition(a);
		o.setShowName(true);
	}
}
