/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {AngleObject} from '../Objects/AngleObject';

var $U = (<any>window).$U;

export class AngleConstructor extends ObjectConstructor {
	private img: HTMLImageElement;
	constructor() {
		super();
    // $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "angle";
	}
	getInitials(): string[] {
		return ["point"];
	}
	isLastObject(): boolean {
		var c = this.getCList();
		return c.length === 3;
	}
	newObj(_zc, _C): AngleObject {
		return new AngleObject(_zc.getConstruction(), "_A", _C[0], _C[1], _C[2]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		var c = this.getCList();
		var len = c.length;
		var xM = 0;
		var yM = 0;
		var fromA, toA, trig = true;
		switch (len) {
			case 1:
				xM = zc.mouseX(event);
				yM = zc.mouseY(event);
				fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
				fromA = fromA - Math.PI / 6;
				toA = fromA + Math.PI / 3;
				break;
			case 2:
				if (this.isSelectCreatePoint) {
					xM = c[1].getX();
					yM = c[1].getY();
					fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
					fromA = fromA - Math.PI / 6;
					toA = fromA + Math.PI / 3;
					this.isSelectCreatePoint = false;
				} else {
					xM = c[1].getX();
					yM = c[1].getY();
					var t = $U.computeAngleParams(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(event), zc.mouseY(event));
					fromA = t.startAngle;
					toA = t.endAngle;
					trig = t.Trigo;
				}
				break;
		}
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.angle;
		ctx.beginPath();
		ctx.arc(xM, yM, 30, -fromA, -toA, trig);
		ctx.stroke();
	}
}
