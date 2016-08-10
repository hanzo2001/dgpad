
import {PointObject} from './PointObject';

var $L = (<any>window).$L;

export class SymaObject extends PointObject {
	private L;
	private P;
	constructor(_construction:iConstruction, _name:string, _L, _P) {
		super(_construction, _name, 0, 0);
		// $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Héritage
		this.L = _L;
		this.P = _P;
		this.setParent(this.L, this.P);
		this.setFillStyle(2);
	}
	getCode(): string {
		return "syma";
	}
	isMoveable(): boolean {
		return false;
	}
	compute() {
		this.L.reflect(this.P, this);
	}
	getSource(src) {
		if (this.execMacroSource(src)) return;
		src.geomWrite(false, this.getName(), "Reflection", this.L.getVarName(), this.P.getVarName());
	}
}
