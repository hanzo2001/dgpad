/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {AngleBisectorObject} from '../Objects/AngleBisectorObject';

var $U = (<any>window).$U;

export class AngleBisectorConstructor extends ObjectConstructor {
	private img: HTMLImageElement;
	constructor() {
		super(); //Héritage
    // $U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return "anglebiss";
	}
	getInitials(): string[] {
		return ["point"];
	}
	isLastObject(): boolean {
		var c = this.getCList();
		return c.length === 3;
	}
	newObj(_zc, _C): AngleBisectorObject {
		return new AngleBisectorObject(_zc.getConstruction(), "_R", _C[0], _C[1], _C[2]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		var c = this.getCList();
		var len = c.length;
		var xM, yM, xA, yA;
		xM = yM = xA = yA = 0;
		switch (len) {
			case 1:
				xA = zc.mouseX(event);
				yA = zc.mouseY(event);
				xM = c[0].getX();
				yM = c[0].getY();
				break;
			case 2:
				if (this.isSelectCreatePoint) {
					xA = c[1].getX();
					yA = c[1].getY();
					xM = c[0].getX();
					yM = c[0].getY();
					this.isSelectCreatePoint = false;
				} else {
					var b = $U.d(c[1], c[0]);
					var a = $U.d(c[1], zc.mouse(event));
					var k = b / (a + b);
					xA = c[1].getX();
					yA = c[1].getY();
					xM = c[0].getX() + k * (zc.mouseX(event) - c[0].getX());
					yM = c[0].getY() + k * (zc.mouseY(event) - c[0].getY());
				}
				break;
		}
		var t = $U.computeBorderPoints(xA, yA, xM - xA, yM - yA, zc.getWidth(), zc.getHeight());
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.moveTo(xA, yA);
		ctx.lineTo(t[2], t[3]);
		ctx.stroke();
		ctx.closePath();
	}
}
