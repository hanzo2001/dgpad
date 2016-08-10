/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

export class NoAnchorConstructor extends ObjectConstructor {
	getCode(): string {
		return "noanchor";
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
		this.getC(0).deleteAlpha();
	}
	selectCreatePoint(_, __) { }
	preview(_, __) { }
}
