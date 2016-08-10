
import {PrimitiveLineObject} from './PrimitiveLineObject';

var $U = (<any>window).$U;

export class TwoPointsLineObject extends PrimitiveLineObject {
	constructor(_construction:iConstruction, _name:string, _P1, _P2, _isExtended?:boolean) {
		super(_construction, _name, _P1);
		// var super = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P1)); // Héritage
		this.P2 = _P2;
		if (!_isExtended) {this.setParent(this.P1, this.P2);}
	}
	getCode(): string {
		return "line";
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
	isMoveable() {
		// Si les extrémités sont des points libres :
		return this.P1.getParentLength() === 0 && this.P2.getParentLength() === 0;
	}
	dragObject(_x:number, _y:number) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.P1.setXY(this.P1.getX() + vx, this.P1.getY() + vy);
		this.P2.setXY(this.P2.getX() + vx, this.P2.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.compute();
		this.P1.computeChilds();
		this.P2.computeChilds();
	}
	getAlphaBounds(anim): number[] {
		var t = super.getAlphaBounds(anim);
		var d = $U.d(this.P1, this.P2);
		t[0] = t[0] / d;
		t[1] = t[1] / d;
		t[2] = t[2] / d;
		return t;
	}
	projectAlpha(p) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var xB = this.P2.getX();
		var yB = this.P2.getY();
		var a = p.getAlpha();
		p.setXY(xA + a * (xB - xA), yA + a * (yB - yA));
	}
	setAlpha(p) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var xB = this.P2.getX();
		var yB = this.P2.getY();
		var xp = p.getX();
		var yp = p.getY();
		if (Math.abs(xA - xB) > 1e-12) {
			p.setAlpha((xp - xA) / (xB - xA));
		} else if (Math.abs(yA - yB) > 1e-12) {
			p.setAlpha((yp - yA) / (yB - yA));
		} else {
			p.setAlpha(0);
		}
	}
	// Seulement pour les macros :
	setMacroAutoObject() {
		var vn = this.getVarName();
		var p1 = this.getP1();
		var p2 = this.getP2();
		p1.setMacroMode(1);
		p1.setMacroSource((src) => src.geomWrite(false, p1.getVarName(), "DefinitionPoint", vn, 0));
		p2.setMacroMode(1);
		p2.setMacroSource((src) => src.geomWrite(false, p2.getVarName(), "DefinitionPoint", vn, 1));
	}
	// Seulement pour les macros :
	isAutoObjectFlags(): boolean {
		return this.getP1().Flag || this.getP2().Flag;
	}
	// Seulement pour les macros :
	getPt(index:number) {
		return !index ? this.getP1() : this.getP2();
	}
	compute() {
		this.setDXDY(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY());
		super.compute();
	}
	// Alpha, dans le repère coordsSystem de l'objet Construction :
	// (for CaRMetal .zir translation)
	transformAlpha(alpha) {
		return alpha;
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Line", this.P1.getVarName(), this.P2.getVarName());
	}
}
