/// <reference path="../typings/iConstruction.d.ts" />

import {PointObject} from './PointObject';

export class MidPointObject extends PointObject {
	protected P1;
	protected P2;
	constructor(_construction:iConstruction, _name:string, _P1, _P2) {
		super(_construction, _name, 0, 0);
		// $U.extend(this, new (_construction, _name, 0, 0)); // Héritage
		this.P1 = _P1;
		this.P2 = _P2;
		this.setParent(this.P1, this.P2);
		this.setFillStyle(2);
	}
	isMoveable(): boolean {
		return false;
	}
	getCode(): string {
		return "midpoint";
	}
	compute() {
		this.setXY((this.P1.getX() + this.P2.getX()) / 2, (this.P1.getY() + this.P2.getY()) / 2);
	}
	getSource(src) {
		if (this.execMacroSource(src)) return;
		src.geomWrite(false, this.getName(), "MidPoint", this.P1.getVarName(), this.P2.getVarName());
	}
}
