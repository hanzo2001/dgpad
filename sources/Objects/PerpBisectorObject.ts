
import {PrimitiveLineObject} from './PrimitiveLineObject';
import {VirtualPointObject} from './VirtualPointObject';

var $U = (<any>window).$U;

/**
 * Issues with undefined methods: startDragX, startDragY AGAIN!!??
 */

export class PerpBisectorObject extends PrimitiveLineObject {
	protected M;
	A1;
	A2;
	constructor(_construction:iConstruction, _name:string, _A1, _A2) {
		var _M = new VirtualPointObject(0, 0);
		super(_construction, _name, _M);
		// var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, M)); // Héritage
		this.M = _M;
		this.A1 = _A1;
		this.A2 = _A2;
		this.setParent(this.A1, this.A2)
	}
	getCode(): string {
		return "perpbis";
	}
	isMoveable(): boolean {
		// Si les extrémités sont des points libres :
		return this.A1.getParentLength() === 0 && this.A2.getParentLength() === 0;
	}
	dragObject(_x, _y) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.A1.setXY(this.A1.getX() + vx, this.A1.getY() + vy);
		this.A2.setXY(this.A2.getX() + vx, this.A2.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.compute();
		this.computeChilds();
	}
	compute() {
		var xA = this.A1.getX();
		var yA = this.A1.getY();
		var xB = this.A2.getX();
		var yB = this.A2.getY();
		this.M.setXY((xA + xB) / 2, (yA + yB) / 2);
		this.setDXDY(0, 0, yA - yB, xB - xA);
		super.compute();
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "PerpendicularBisector", this.A1.getVarName(), this.A2.getVarName());
	}
}
