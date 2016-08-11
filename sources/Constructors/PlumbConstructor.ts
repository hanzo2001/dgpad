/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {PlumbObject} from '../Objects/PlumbObject';

var $U = (<any>window).$U;

export class PlumbConstructor extends ObjectConstructor {
	getCode(): string {
		return "plumb";
	}
	getInitials(): string[] {
		return ["line"];
	}
	newObj(_zc:iCanvas, _C): PlumbObject {
		return new PlumbObject(_zc.getConstruction(), "_Perp", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		var dx = this.getC(0).getDY();
		var dy = -this.getC(0).getDX();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		$U.drawPartialLine(ctx, zc.mouseX(event) - dx, zc.mouseY(event) - dy, zc.mouseX(event) + dx, zc.mouseY(event) + dy, true, true);
	}
}
