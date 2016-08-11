/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {SymaObject} from '../Objects/SymaObject';

var $U = (<any>window).$U;

export class SymaConstructor extends ObjectConstructor {
	getCode(): string {
		return "syma";
	}
	getInitials(): string[] {
		return ["line"];
	}
	createCallBack(zc:iCanvas, o) {
		zc.namesManager.setName(o);
	}
	newObj(_zc:iCanvas, _C): SymaObject {
		return new SymaObject(_zc.getConstruction(), "_Syma", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var size = zc.prefs.size.point;
		if (Object.touchpad) {
			size *= zc.prefs.size.touchfactor;
		}
		var coords = this.getC(0).reflectXY(zc.mouseX(event), zc.mouseY(event));
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.pointborder;
		ctx.beginPath();
		ctx.arc(coords[0], coords[1], size, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.closePath();
		ctx.stroke();
	}
}

