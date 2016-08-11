/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {SegmentObject} from '../Objects/SegmentObject';

var $U = (<any>window).$U;

export class SegmentConstructor extends ObjectConstructor {
	getCode(): string {
		return "segment";
	}
	getInitials(): string[] {
		return ["point"];
	}
	newObj(_zc:iCanvas, _C): SegmentObject {
		return new SegmentObject(_zc.getConstruction(), "_S", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.strokeStyle = zc.prefs.color.hilite;
		ctx.lineWidth = zc.prefs.size.line;
		ctx.beginPath();
		ctx.moveTo(this.getC(0).getX(), this.getC(0).getY());
		ctx.lineTo(zc.mouseX(event), zc.mouseY(event));
		ctx.closePath();
		ctx.stroke();
	}
}


