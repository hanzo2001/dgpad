
import {PrimitiveLineObject} from './PrimitiveLineObject';

export class ParallelLineObject extends PrimitiveLineObject {
	L;
	constructor(_construction:iConstruction, _name:string, _L, _P1) {
		super(_construction, _name, _P1);
		// var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P1)); // Héritage
		this.L = _L;
		this.setParent(this.P1, this.L);
	}
	getCode(): string {
		return "parallel";
	}
	isMoveable(): boolean {
		// Si P1 est un point libre :
		return this.P1.getParentLength() === 0;
	}
	compute() {
		// this.setDX(this.L.getDX());
		// this.setDY(this.L.getDY());
		this.setDXDY(0, 0, this.L.getDX(), this.L.getDY());
		super.compute();
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Parallel", this.L.getVarName(), this.P1.getVarName());
	}
}
