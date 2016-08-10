
import {PrimitiveCircleObject} from './PrimitiveCircleObject';

var $U = (<any>window).$U;

export class CircleObject extends PrimitiveCircleObject {
	constructor(_construction:iConstruction, _name:string, _P1, _P2) {
		super(_construction, _name, _P1);
		//$U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		this.setDefaults("circle");
		this.P2 = _P2;
		this.setParent(this.P1, this.P2)
	}
	getCode() {
		return "circle";
	}
	getP2() {
		return this.P2;
	}
	redefine(_old, _new) {
		if (_old === this.P2) {
			this.addParent(_new);
			this.P2 = _new;
		} else if (_old === this.P1) {
			this.addParent(_new);
			this.P1 = _new;
		}
	}
	getValue() {
		return (this.getCn().coordsSystem.l(this.R));
	}
	fixIntersection(_x, _y, _P) {
		var isNear = this.P2.near(_x, _y);
		if (isNear)
			_P.setAway(this.P2);
		return isNear;
	}
	isMoveable() {
		// Si les extrémités sont des points libres :
		if ((this.P1.getParentLength() === 0) && (this.P2.getParentLength() === 0))
			return true;
		return false;
	}
	dragObject(_x, _y) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.P1.setXY(this.P1.getX() + vx, this.P1.getY() + vy);
		this.P2.setXY(this.P2.getX() + vx, this.P2.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.computeChilds();
	}
	paintObject(ctx) {
		ctx.beginPath();
		ctx.arc(this.P1.getX(), this.P1.getY(), this.R, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.stroke();
	}
	compute() {
		this.R = $U.computeRay(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY());
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Circle", this.P1.getVarName(), this.P2.getVarName());
	}
}
