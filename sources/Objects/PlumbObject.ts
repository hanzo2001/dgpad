
import {PrimitiveLineObject} from './PrimitiveLineObject';
import {VirtualPointObject} from './VirtualPointObject';

export class PlumbObject extends PrimitiveLineObject {
	L;
	constructor(_construction: iConstruction, _name: string, _L, _P1) {
		super(_construction, _name, _P1);
		// var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P1)); // Héritage
		this.L = _L;
		this.setParent(this.P1, this.L);
	}
	getCode(): string {
		return "plumb";
	}
	isMoveable(): boolean {
		// Si P1 est un point libre :
		return this.P1.getParentLength() === 0;
	}
	compute() {
		this.setDXDY(0, 0, this.L.getDY(), -this.L.getDX());
		super.compute();
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Perpendicular", this.L.getVarName(), this.P1.getVarName());
	}
}
