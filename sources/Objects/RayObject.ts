
import {TwoPointsLineObject} from './TwoPointsLineObject';
import {VirtualPointObject} from './VirtualPointObject';

var $U = (<any>window).$U;

export class RayObject extends TwoPointsLineObject {
	constructor(_construction:iConstruction, _name:string, _P1, _P2) {
		super(_construction, _name, _P1, _P2, true);
		//var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, _P1, _P2, true)); // Héritage
		this.setParent(this.P1, this.P2);
		this.setDefaults("ray");
	}
	getCode():string {
		return "ray";
	}
	setAlpha(p) {
		super.setAlpha(p);
		var a = p.getAlpha();
		if (a < 0) {p.setAlpha(0);}
	}
	isInstanceType(_c): boolean {
		return _c === "line" || _c === "ray";
	}
	// see if point inside ray
	checkIfValid(_P) {
		var dx = this.getDX();
		var dy = this.getDY();
		var xAP = _P.getX() - this.P1.getX();
		var yAP = _P.getY() - this.P1.getY();
		if ((xAP * dx < 0) || (yAP * dy < 0)) {_P.setXY(NaN, NaN);}
	}
	mouseInside(event:MouseEvent) {
		return $U.isNearToRay(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), this.mouseX(event), this.mouseY(event), this.getOversize());
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(this.P1.getX(), this.P1.getY());
		ctx.lineTo(this.getXmax(), this.getYmax());
		ctx.stroke();
		ctx.lineCap = 'butt';
	}
	getAlphaBounds(anim): number[] {
		var t = super.getAlphaBounds(anim);
		t[0] = 0;
		return t;
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Ray", this.P1.getVarName(), this.P2.getVarName());
	}
}
