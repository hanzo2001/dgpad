/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

var $U = (<any>window).$U;
var $APP_PATH = (<any>window).$APP_PATH;

export class SpringConstructor extends ObjectConstructor {
	private img: HTMLImageElement;
	private h: number;
	constructor() {
		super();
    this.img = new Image();
    this.img.src = $APP_PATH + "NotPacked/images/tools/spring_const.svg";
    this.h = 30;
    // var fce = $P.fce_seg;
    // var f = 0;
    // var ar = false;
    // var dir = 1;
    // var max = 500;
	}
	getCode(): string {
		return "spring";
	}
	getType(): number {
		return 1;
	}
	getInitials(): string[] {
		return ["point"];
	}
	isAcceptedInitial(_): boolean {
		return true;
	}
	createObj(zc:iCanvas, event:MouseEvent) {
		var Obj = this.getC(0);
		var p = Obj.getAnimationParams(zc.mouseX(event), zc.mouseY(event));
		zc.getConstruction().addAnimation(Obj, p.speed, p.direction, p.ar);
		zc.getConstruction().remove(this.getC(1));
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		var x0 = this.getC(0).getX();
		var y0 = this.getC(0).getY();
		var x1 = zc.mouseX(event);
		var y1 = zc.mouseY(event);
		var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var a = Math.atan2(y1 - y0, x1 - x0);
		ctx.save();
		ctx.translate(x0, y0);
		ctx.rotate(a);
		ctx.drawImage(this.img, 0, -this.h / 2, d, this.h);
		ctx.restore();
		ctx.save();
		if (a < -$U.halfPI || a > $U.halfPI) {a += Math.PI;}
		ctx.translate((x0 + x1) / 2, (y0 + y1) / 2);
		ctx.rotate(a);
		ctx.textAlign = "center";
		ctx.fillStyle = "rgba(100,100,100,1)";
		ctx.font = "24px Arial";
		var p = this.getC(0).getAnimationParams(x1, y1);
		ctx.fillText(p.message, 0, -this.h / 2);
		ctx.restore();
	}
}
