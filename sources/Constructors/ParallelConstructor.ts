/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {ParallelLineObject} from '../Objects/ParallelLineObject';

var $U = (<any>window).$U;

export class ParallelConstructor extends ObjectConstructor {
	getCode(): string {
		return "parallel";
	}
	getInitials(): string[] {
		return ["line"];
	}
	newObj(_zc:iCanvas, _C): ParallelLineObject {
		return new ParallelLineObject(_zc.getConstruction(), "_Par", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		var dx = this.getC(0).getDX();
		var dy = this.getC(0).getDY();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		$U.drawPartialLine(ctx, zc.mouseX(event) - dx, zc.mouseY(event) - dy, zc.mouseX(event) + dx, zc.mouseY(event) + dy, true, true);
	}
}
