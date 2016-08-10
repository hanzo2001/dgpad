/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {FixedAngleObject} from '../Objects/FixedAngleObject';
import {VirtualPointObject} from '../Objects/VirtualPointObject';

var $L = (<any>window).$L;
var $U = (<any>window).$U;

export class FixedAngleConstructor extends ObjectConstructor {
	private AOC: number;
	private AOC180: number;
	private trig: boolean;
	constructor() {
		super(); //Héritage
		// $U.extend(this, new ObjectConstructor()); //Héritage
    this.AOC = 0;
    this.AOC180 = 0;
    this.trig = true;
	}
	getCode(): string {
		return "fixedangle";
	}
	getInitials(): string[] {
		return ["point"];
	}
	isLastObject(): boolean {
		var c = this.getCList();
		return c.length === 3;
	}
	newObj(_zc:iCanvas, _C): FixedAngleObject {
		this.selectCreatePoint = super.selectCreatePoint;
		var angle = (_zc.getConstruction().isDEG()) ? Math.round(this.AOC180 * 180 / Math.PI) : this.AOC180;
		var obj = new FixedAngleObject(_zc.getConstruction(), "_A", _C[0], _C[1], this.trig);
		obj.setExp(angle);
		return (obj);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		var c = this.getCList();
		var len = c.length;
		var xM, yM;
		xM = yM = 0;
		var xA, yA;
		xA = yA = NaN;
		var fromA, toA = true;
		switch (len) {
			case 1:
				xM = zc.mouseX(event);
				yM = zc.mouseY(event);
				fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
				fromA = fromA - Math.PI / 6;
				toA = fromA + Math.PI / 3;
				this.trig = true;
				break;
			case 2:
				if (this.isSelectCreatePoint) {
					// console.log("yes");
					xM = c[1].getX();
					yM = c[1].getY();
					fromA = $U.angleH(c[0].getX() - xM, c[0].getY() - yM);
					fromA = fromA - Math.PI / 6;
					toA = fromA + Math.PI / 3;
					this.isSelectCreatePoint = false;
					this.selectCreatePoint = function () {
						this.getCList().push(new VirtualPointObject(0, 0))
					};
				} else {
					// console.log("no");
					xM = c[1].getX();
					yM = c[1].getY();
					xA = zc.mouseX(event);
					yA = zc.mouseY(event);
					var t = $U.computeAngleParams(c[0].getX(), c[0].getY(), c[1].getX(), c[1].getY(), zc.mouseX(event), zc.mouseY(event));
					fromA = t.startAngle;
					toA = t.endAngle;
					this.trig = t.Trigo;
					var coef = Math.PI / 180;
					this.AOC = Math.round(t.this.AOC / coef) * coef;
					this.AOC180 = Math.round(t.this.AOC180 / coef) * coef;
				}
				break;
		}
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.fixedangle;
		if (!isNaN(xA)) {
			var t = $U.computeBorderPoints(xM, yM, xA - xM, yA - yM, zc.getWidth(), zc.getHeight());
			ctx.beginPath();
			ctx.moveTo(xM, yM);
			ctx.lineTo(t[2], t[3]);
			ctx.stroke();
			ctx.closePath();
			ctx.save();
			var b = Math.sqrt((xM - xA) * (xM - xA) + (yM - yA) * (yM - yA));
			var a = Math.sqrt((xM - c[0].getX()) * (xM - c[0].getX()) + (yM - c[0].getY()) * (yM - c[0].getY()));
			var k = b / (a + b);
			var x = xA + k * (c[0].getX() - xA) - xM;
			var y = yA + k * (c[0].getY() - yA) - yM;
			var a = Math.atan2(y, x);
			var r = 30 + zc.prefs.fontmargin;
			ctx.textAlign = "left";
			var display = this.AOC180;
			display = display * 180 / Math.PI;
			display = Math.round(display);
			if (display > 180) { a += Math.PI; }
			if ((a < -$U.halfPI) || (a > $U.halfPI)) {
				a += Math.PI;
				r = -r;
				ctx.textAlign = "right";
			}
			ctx.strokeStyle = zc.prefs.color.fixedangle;
			ctx.fillStyle = ctx.strokeStyle;
			ctx.translate(xM, yM);
			ctx.rotate(a);
			ctx.fillText($L.number(display) + "°", r, 18 / 2);
			ctx.restore();
		}
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = ctx.lineWidth * 3;
		ctx.beginPath();
		ctx.arc(xM, yM, 30, -fromA, -toA, this.trig);
		ctx.stroke();
	}
}
