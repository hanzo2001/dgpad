/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {PerpBisectorObject} from '../Objects/PerpBisectorObject';

var $U = (<any>window).$U;

export class PerpBisectorConstructor extends ObjectConstructor {
	getCode(): string {
		return "perpbis";
	}
	getInitials(): string[] {
		return ["point,segment"];
	}
	// Si le premier constituant est un segment, alors
	// il s'agit d'une construction instantannée
	isInstantTool(): boolean {
		return this.getC(0).isInstanceType("segment");
	}
	newObj(_zc:iCanvas, _C): PerpBisectorObject {
		var first = this.getC(0);
		if (first.isInstanceType("segment")) {_C = [first.P1, first.P2];}
		return new PerpBisectorObject(_zc.getConstruction(), "_L", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		if (this.isInstantTool()) return;
		var ctx = zc.getContext();
		var xA = this.getC(0).getX();
		var yA = this.getC(0).getY();
		var xB = zc.mouseX(event);
		var yB = zc.mouseY(event);
		var xM = (xA + xB) / 2;
		var yM = (yA + yB) / 2;
		var d = this.normalize(0, 0, yA - yB, xB - xA);
		var t = $U.computeBorderPoints(xM, yM, d.x, d.y, zc.getWidth(), zc.getHeight());
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.moveTo(t[0], t[1]);
		ctx.lineTo(t[2], t[3]);
		ctx.closePath();
		ctx.stroke();
	}
	private normalize(xA:number, yA:number, xB:number, yB:number): {x:number, y:number} {
		var l = Math.sqrt((xB - xA) * (xB - xA) + (yB - yA) * (yB - yA));
		return {
			x: (xB - xA) / l,
			y: (yB - yA) / l
		};
	}
}
