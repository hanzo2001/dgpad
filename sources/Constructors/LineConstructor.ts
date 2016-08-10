/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {TwoPointsLineObject} from '../Objects/TwoPointsLineObject';

var $U = (<any>window).$U;

export class LineConstructor extends ObjectConstructor {
	getCode(): string {
		return "line";
	}
	getInitials(): string[] {
		return ["point"];
	}
	newObj(_zc:iCanvas, _C): TwoPointsLineObject {
		return new TwoPointsLineObject(_zc.getConstruction(), "_L", _C[0], _C[1]);
	}
	preview(event:MouseEvent, zc:iCanvas) {
		var ctx = zc.getContext();
		ctx.lineWidth = zc.prefs.size.line;
		ctx.strokeStyle = zc.prefs.color.hilite;
		$U.drawPartialLine(ctx, this.getC(0).getX(), this.getC(0).getY(), zc.mouseX(event), zc.mouseY(event), true, true);
	}
}
