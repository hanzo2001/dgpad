/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {Circle1Object} from '../Objects/Circle1Object';

var $U = (<any>window).$U;

export class Circle1Constructor extends ObjectConstructor {
	private R;
	constructor() {
		super(); //Héritage
    this.R = 0;
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "circle1";
	}
	getInitials(): string[] {
		return ["point"];
	}
	selectCreatePoint(zc, ev) {}
	newObj(_zc, _C): Circle1Object {
		return new Circle1Object(_zc.getConstruction(), "_C", _C[0], this.R);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		this.R = $U.computeRay(this.getC(0).getX(), this.getC(0).getY(), zc.mouseX(event), zc.mouseY(event));
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.arc(this.getC(0).getX(), this.getC(0).getY(), this.R, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.stroke();
	}
}


