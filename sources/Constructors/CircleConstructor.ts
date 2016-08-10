/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {CircleObject} from '../Objects/CircleObject';

var $U = (<any>window).$U;

export class CircleConstructor extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "circle";
	}
	getInitials(): string[] {
		return ["point"];
	}
	newObj(_zc:iCanvas, _C): CircleObject {
		return new CircleObject(_zc.getConstruction(), "_C", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		var r = $U.computeRay(this.getC(0).getX(), this.getC(0).getY(), zc.mouseX(event), zc.mouseY(event));
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.arc(this.getC(0).getX(), this.getC(0).getY(), r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke();
	}
}
