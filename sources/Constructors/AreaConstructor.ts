/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {AreaObject} from '../Objects/AreaObject';
import {Color} from '../Utils/Color';

var $U = (<any>window).$U;

export class AreaConstructor extends ObjectConstructor {
	private col: Color;
	constructor() {
		super();
    // $U.extend(this, new ObjectConstructor()); //Héritage
		this.col = new Color();
	}
	getCode(): string {
		return "area";
	}
	getInitials(): string[] {
		return ["point"];
	}
	isLastObject(): boolean {
		var c = this.getCList();
		var len = c.length;
		return len > 1 && c[0] === c[len - 1];
	}
	newObj(_zc:iCanvas, _C): AreaObject {
		var a = new AreaObject(_zc.getConstruction(), "_Poly", _C);
		a.setOpacity(_zc.prefs.opacity.area);
		return a;
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		this.col.set(zc.prefs.color.area);
		this.col.setOpacity(zc.prefs.opacity.area);
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.fillStyle = this.col.getRGBA();
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		var c = this.getCList();
		var len = c.length;
		ctx.moveTo(this.getC(0).getX(), this.getC(0).getY());
		for (var i = 1; i < len; i++) {
			ctx.lineTo(this.getC(i).getX(), this.getC(i).getY());
		}
		ctx.lineTo(zc.mouseX(event), zc.mouseY(event));
		ctx.stroke();
		ctx.fill();
	}
}
