
import {PrimitiveCircleObject} from './PrimitiveCircleObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;

export class Circle3Object extends PrimitiveCircleObject {
	P3;
	constructor(_construction: iConstruction, _name: string, _P3, _P2, _P1) {
		super(_construction, _name, _P1);
		//$U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Héritage
		this.setDefaults("circle");
		this.P2 = _P2;
		this.P3 = _P3;
		this.setParent(this.P1, this.P2, this.P3)
	}
	getCode(): string {
		return "circle3";
	}
	redefine(_old, _new) {
		if (_old === this.P1) {
			this.addParent(_new);
			this.P1 = _new;
		} else if (_old === this.P2) {
			this.addParent(_new);
			this.P2 = _new;
		} else if (_old === this.P3) {
			this.addParent(_new);
			this.P3 = _new;
		}
	}
	getValue(): number {
		return this.getCn().coordsSystem.l(this.R);
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.P1.getX(), this.P1.getY(), this.R, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.stroke();
	}
	compute() {
		this.R = $U.computeRay(this.P2.getX(), this.P2.getY(), this.P3.getX(), this.P3.getY());
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Circle3", this.P3.getVarName(), this.P2.getVarName(), this.P1.getVarName());
	}
}
