
import {PrimitiveLineObject} from './PrimitiveLineObject';
import {VirtualPointObject} from './VirtualPointObject';

var $U = (<any>window).$U;

/**
 * Issues with undefined methods: startDragX, startDragY
 * not in the parent
 */

export class AngleBisectorObject extends PrimitiveLineObject {
	protected M: VirtualPointObject;
	protected P1;
	protected P2;
	protected P3;
	constructor(_construction:iConstruction, _name:string, _P1, _P2, _P3) {
		super(_construction, _name, _P2);
		//var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P2)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		this.M = new VirtualPointObject(0, 0);
		this.P1 = _P1;
		this.P2 = _P2;
		this.P3 = _P3;
		this.setParent(this.P1, this.P2, this.P3)
		this.setDefaults("ray");
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
	getCode(): string {
		return "anglebiss";
	}
	isMoveable(): boolean {
		// Si les extrémités sont des points libres :
		return this.P1.getParentLength() === 0 && this.P2.getParentLength() === 0 && this.P3.getParentLength() === 0;
	}
	getAlphaBounds(anim): number[] {
		var t = super.getAlphaBounds(anim);
		t[0] = 0;
		return t;
	}
	setAlpha(p) {
		super.setAlpha(p);
		var a = p.getAlpha();
		if (a < 0) {p.setAlpha(0);}
	}
	// see if point inside ray
	checkIfValid(_P) {
		var dx = this.getDX();
		var dy = this.getDY();
		var xAP = _P.getX() - this.P2.getX();
		var yAP = _P.getY() - this.P2.getY();
		if (xAP * dx < 0 || yAP * dy < 0) {_P.setXY(NaN, NaN);}
	}
	dragObject(_x:number, _y:number) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.M.setXY(this.M.getX() + vx, this.M.getY() + vy);
		this.P1.setXY(this.P1.getX() + vx, this.P1.getY() + vy);
		this.P2.setXY(this.P2.getX() + vx, this.P2.getY() + vy);
		this.P3.setXY(this.P3.getX() + vx, this.P3.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.compute();
		this.P1.computeChilds();
		this.P2.computeChilds();
		this.P3.computeChilds();
	}
	paintObject(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.P1.getX(), this.P1.getY());
		ctx.lineTo(this.getXmax(), this.getYmax());
		ctx.stroke();
	}
	compute() {
		var b = $U.d(this.P2, this.P1);
		var a = $U.d(this.P2, this.P3);
		var k = b / (a + b);
		var x = this.P1.getX() + k * (this.P3.getX() - this.P1.getX());
		var y = this.P1.getY() + k * (this.P3.getY() - this.P1.getY());
		if ($U.isNearToPoint(x, y, this.P2.getX(), this.P2.getY(), 1e-13)) {
			x = this.P2.getX() + (this.P1.getY() - this.P2.getY());
			y = this.P2.getY() + (this.P2.getX() - this.P1.getX());
		}
		this.M.setXY(x, y);
		this.setDXDY(this.P2.getX(), this.P2.getY(), x, y);
		super.compute();
	}
	mouseInside(event:MouseEvent) {
		return $U.isNearToRay(this.P2.getX(), this.P2.getY(), this.M.getX(), this.M.getY(), this.mouseX(event), this.mouseY(event), this.getOversize());
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "AngleBisector", this.P1.getVarName(), this.P2.getVarName(), this.P3.getVarName());
	}
}
