/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {MidPointObject} from '../Objects/MidPointObject';

export class MidPointConstructor extends ObjectConstructor {
	getCode(): string {
		return "midpoint";
	}
	getInitials(): string[] {
		return ["point,segment"];
	}
	// Si le premier constituant est un segment, alors
	// il s'agit d'une construction instantannée
	isInstantTool(): boolean {
		return this.getC(0).isInstanceType("segment");
	}
	createCallBack(zc:iCanvas, o) {
		zc.namesManager.setName(o);
	}
	newObj(_zc:iCanvas, _C): MidPointObject {
		var first = this.getC(0);
		if (first.isInstanceType("segment")) {
			_C = [first.P1, first.P2];
		}
		return new MidPointObject(_zc.getConstruction(), "_M", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		if (this.isInstantTool()) return;
		var size = zc.prefs.size.point;
		if (Object.touchpad) {
			size *= zc.prefs.size.touchfactor;
		}
		var x = (this.getC(0).getX() + zc.mouseX(event)) / 2;
		var y = (this.getC(0).getY() + zc.mouseY(event)) / 2;
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
