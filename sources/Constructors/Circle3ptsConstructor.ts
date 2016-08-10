/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {Circle3ptsObject} from '../Objects/Circle3ptsObject';
import {Circle3ptsObject_3D} from '../Objects/Circle3ptsObject_3D';

var $U = (<any>window).$U;

export class Circle3ptsConstructor extends ObjectConstructor {
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "circle3pts";
	}
	getInitials(): string[] {
		return ["point"];
	}
	isLastObject(): boolean {
		var c = this.getCList();
		return c.length === 3;
	}
	newObj(_zc:iCanvas, _C): Circle3ptsObject|Circle3ptsObject_3D {
		var no;
		if (_C[0].is3D()) {
			no = new Circle3ptsObject_3D(_zc.getConstruction(), "_C", _C[0], _C[1], _C[2]);
		} else {
			no = new Circle3ptsObject(_zc.getConstruction(), "_C", _C[0], _C[1], _C[2]);
			no.getM().setHidden(true);
		}
		return no;
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		var c = this.getCList();
		var len = c.length;
		var xM, yM, r;
		xM = yM = r = 0;
		switch (len) {
			case 1:
				xM = (c[0].getX() + zc.mouseX(event)) / 2;
				yM = (c[0].getY() + zc.mouseY(event)) / 2;
				r = $U.computeRay(xM, yM, c[0].getX(), c[0].getY());
				break;
			case 2:
				if (this.isSelectCreatePoint) {
					xM = (c[0].getX() + c[1].getX()) / 2;
					yM = (c[0].getY() + c[1].getY()) / 2;
					r = $U.computeRay(xM, yM, c[0].getX(), c[0].getY());
					this.isSelectCreatePoint = false;
				} else {
					var t = $U.computeCenter(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(event), zc.mouseY(event));
					xM = t[0];
					yM = t[1];
					var r = $U.computeRay(t[0], t[1], c[0].getX(), c[0].getY());
				}
				break;
		}
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.arc(xM, yM, r, 0, Math.PI * 2, true);
		ctx.stroke();
	}
}
