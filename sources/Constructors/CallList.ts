/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

export class CallList extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "calllist";
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
	createObj(_, __) {
		this.getC(0).setSegmentsSize(1 * ~~(this.getC(0).getSegmentsSize() === 0));
		if (this.getC(0).getSegmentsSize() === 0 && this.getC(0).getSize() === 0) {
			this.getC(0).setSize(0.5)
		}
		this.getC(0).computeChilds();
	}
	selectCreatePoint(zc, ev) {}
	preview(ev, zc) {}
}
