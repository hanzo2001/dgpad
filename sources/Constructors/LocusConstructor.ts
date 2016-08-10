/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {LocusObject} from '../Objects/LocusObject';

export class LocusConstructor extends ObjectConstructor {
	getCode(): string {
		return "locus";
	}
	getInitials(): string[] {
		return ["point,line,circle"];
	}
	isInstantTool(): boolean {
		return true;
	}
	newObj(_zc:iCanvas, _C): LocusObject {
		var first = this.getC(0);
		_C.push(_zc.getConstruction().findPtOn(first));
		return new LocusObject(_zc.getConstruction(), "_Locus", _C[0], _C[1]);
	}
	preview(_, __) {}
}
