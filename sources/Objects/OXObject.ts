/// <reference path="../typings/iCoordsSystem.d.ts" />

import {TwoPointsLineObject} from './TwoPointsLineObject';
import {VirtualPointObject} from './VirtualPointObject';

var $U = (<any>window).$U;

export class OXObject extends TwoPointsLineObject {
	protected O: VirtualPointObject;
	protected I: VirtualPointObject;
	protected CS: iCoordsSystem;
	constructor(_construction:iConstruction, _name:string) {
		var _O = new VirtualPointObject(0, 0);
		var _I = new VirtualPointObject(1, 0);
		super(_construction, _name, _O, _I, true);
		// var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, O, I, true));
		this.O = _O;
		this.I = _I;
		this.CS = this.getCoordsSystem();
		this.setParent();
		super.setColor("rgba(0,0,0,0)");
	}
	getCode(): string {
		return "axis-x";
	}
	setColor() {}// method has been emptied
	setSize() {}
	getStyle(src) {}
	isMoveable(): boolean {
		return false;
	}
	compute() {
		this.O.setXY(this.CS.getX0(), this.CS.getY0());
		this.I.setXY(this.O.getX() + this.CS.getUnit(), this.O.getY());
		super.compute();
	}
	mouseInside(event:MouseEvent): boolean {
		if (this.CS.isCS())
			return $U.isNearToLine(this.P1.getX(), this.P1.getY(), this.getDX(), this.getDY(), this.mouseX(event), this.mouseY(event), this.getOversize());
		return false;
	}
	getSource(src) {
		if (this.getCn().isAxisUsed()) {src.geomWrite(false, this.getName(), "X_axis");}
	}
}
