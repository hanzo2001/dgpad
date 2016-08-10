/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

var $L = (<any>window).$L;
var $U = (<any>window).$U;

export class DGScriptNameConstructor extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "dgscriptname";
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
		var obj = this.getC(0);
		$U.prompt($L.create_blockly_program_change_message, obj.getLabel(), "text", function (_old, _new) {
			if (_new === "") _new = _old;
			obj.setLabel(_new);
			zc.paint();
		}, 450, 165, 430);
	}
	selectCreatePoint(_, __) {}
	preview(_, __) {}
}
