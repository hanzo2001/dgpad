
import {PointObject} from './PointObject';

export class SymcObject extends PointObject {
	private P1;
	private P2;
	constructor(_construction:iConstruction, _name:string, _P1, _P2) {
		super(_construction, _name, 0, 0);
		// $U.extend(this, new PointObject(_construction, _name, 0, 0)); // Héritage
		this.P1 = _P1;
		this.P2 = _P2;
		this.setParent(_P1, _P2)
		this.setFillStyle(2);
	}
	getCode(): string {
		return "symc";
	}
	isMoveable(): boolean {
		return false;
	}
	compute() {
		this.setXY(2 * this.P1.getX() - this.P2.getX(), 2 * this.P1.getY() - this.P2.getY());
	}
	getSource(src) {
		if (this.execMacroSource(src)) return;
		src.geomWrite(false, this.getName(), "Symmetry", this.P1.getVarName(), this.P2.getVarName());
	}
}
