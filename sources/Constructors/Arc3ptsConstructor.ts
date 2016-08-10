/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {Arc3ptsObject} from '../Objects/Arc3ptsObject';

var $U = (<any>window).$U;

export class Arc3ptsConstructor extends ObjectConstructor {
	constructor() {
		super();
    // $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "arc3pts";
	}
	getInitials(): string[] {
		return ["point"];
	}
	isLastObject(): boolean {
		var c = this.getCList();
		return c.length === 3;
	}
	newObj(_zc:iCanvas, _C) {
		var no = new Arc3ptsObject(_zc.getConstruction(), "_C", _C[0], _C[1], _C[2]);
		no.getM().setHidden(true);
		return no;
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		var c = this.getCList();
		var len = c.length;
		var xM = r = 0;
		var yM = 0;
		var fromA;
		var toA;
		var trig = true;
		switch (len) {
			case 1:
				xM = (c[0].getX() + zc.mouseX(event)) / 2;
				yM = (c[0].getY() + zc.mouseY(event)) / 2;
				r = $U.computeRay(xM, yM, c[0].getX(), c[0].getY());
				fromA = $U.angleH(zc.mouseX(event) - xM, zc.mouseY(event) - yM);
				toA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
				break;
			case 2:
				if (this.isSelectCreatePoint) {
					xM = (c[0].getX() + c[1].getX()) / 2;
					yM = (c[0].getY() + c[1].getY()) / 2;
					r = $U.computeRay(xM, yM, c[0].getX(), c[0].getY());
					fromA = $U.angleH(c[1].getX() - xM, c[1].getY() - yM);
					toA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
					this.isSelectCreatePoint = false;
				} else {
					var t = $U.computeArcParams(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(event), zc.mouseY(event));
					xM = t.centerX;
					yM = t.centerY;
					fromA = t.startAngle;
					toA = t.endAngle;
					trig = t.Trigo;
					var r = $U.computeRay(t.centerX, t.centerY, c[0].getX(), c[0].getY());
				}
				break;
		}
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.arc(xM, yM, r, -fromA, -toA, trig);
		ctx.stroke();
	}
}
