/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {VectorObject} from '../Objects/VectorObject';

var $U = (<any>window).$U;

export class VectorConstructor extends VectorObject {
	getCode(): string {
		return "vector";
	}
	getInitials(): string[] {
		return ["point"];
	}
	newObj(_zc:iCanvas, _C): VectorObject {
		var a = new VectorObject(_zc.getConstruction(), "_V", _C[0], _C[1]);
		a.setOpacity(_zc.prefs.opacity.vector);
		return a;
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		var x1 = this.getC(0).getX();
		var y1 = this.getC(0).getY();
		var x2 = zc.mouseX(event);
		var y2 = zc.mouseY(event);
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.lineCap = 'butt';
		var headlen = zc.prefs.size.vectorhead;
		var angle = Math.atan2(y2 - y1, x2 - x1);
		var c1 = Math.cos(angle - Math.PI / 8);
		var s1 = Math.sin(angle - Math.PI / 8);
		ctx.beginPath();
		ctx.moveTo(x2, y2);
		ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
		ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 8), y2 - headlen * Math.sin(angle + Math.PI / 8));
		ctx.lineTo(x2, y2);
		ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
		ctx.fillStyle = ctx.strokeStyle;
		ctx.stroke();
		ctx.fill();
	}
}
