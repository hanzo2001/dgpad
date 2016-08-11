/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {RayObject} from '../Objects/RayObject';

var $U = (<any>window).$U;

export class RayConstructor extends ObjectConstructor {
	getCode(): string {
		return "ray";
	}
	getInitials(): string[] {
		return ["point"];
	}
	newObj(_zc:iCanvas, _C): RayObject {
		return new RayObject(_zc.getConstruction(), "_R", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.lineWidth = zc.prefs.size.line;
		ctx.strokeStyle = zc.prefs.color.hilite;
		$U.drawPartialLine(ctx, this.getC(0).getX(), this.getC(0).getY(), zc.mouseX(event), zc.mouseY(event), false, true);
	}
}
