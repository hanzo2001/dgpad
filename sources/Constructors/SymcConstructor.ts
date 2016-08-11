/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {SymcObject} from '../Objects/SymcObject';

var $U = (<any>window).$U;

export class SymcConstructor extends ObjectConstructor {
	getCode(): string {
		return "symc";
	}
	getInitials(): string[] {
		return ["point"];
	}
	createCallBack(zc:iCanvas, o) {
		zc.namesManager.setName(o);
	}
	newObj(_zc:iCanvas, _C): SymcObject {
		return new SymcObject(_zc.getConstruction(), "_Symc", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var size = zc.prefs.size.point;
		if (Object.touchpad) {
			size *= zc.prefs.size.touchfactor;
		}
		var x = 2 * this.getC(0).getX() - zc.mouseX(event);
		var y = 2 * this.getC(0).getY() - zc.mouseY(event);
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.pointborder;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();
	}
}
