
import {PrimitiveCircleObject} from './PrimitiveCircleObject';
import {VirtualPointObject} from './VirtualPointObject';
import {CenterObject} from './CenterObject';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

/**
 * Large Problem!!!!!
 * 
 * the super constructor depends on an object that depends on this class
 * 
 * I have to create the CenterObject that requires <this> BEFORE calling super()
 * 
 * Solution: split construction into instantiation and initialization
 */
export class Arc3ptsObject extends PrimitiveCircleObject {
	protected M: CenterObject;
	protected A;
	protected B;
	protected C;
	protected AOC: number;
	protected fromAngle: number;
	protected toAngle: number;
	protected trigo: boolean;
	constructor(_construction: iConstruction, _name:string, _P1, _P2, _P3) {
    //var M = new VirtualPointObject(0, 0);
    var M = new CenterObject(_construction, "_Center", this);
    _construction.add(M);
    //$U.extend(this, new PrimitiveCircleObject(_construction, _name, M)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		super(_construction, _name, M);
		_construction.add(this.M);

		this.M.setParent(this);
		this.M.forceFillStyle(this.prefs.color.point_inter);
		this.M.setHidden(true);

		this.A = _P1;
		this.B = _P2;
		this.C = _P3;
		this.AOC = 0; // mesure de l'angle this.AOC (dans [0;2π]) :
		this.fromAngle = 0; // Début de l'arc (xOA sens this.trigo dans [0;2π])
		this.toAngle = 0; // Fin de l'arc (xOC sens this.trigo dans [0;2π])
		this.trigo = true; // sens de dessin de l'arc ( comment va-t-on de this.A à this.C)
		this.setParent(this.A, this.B, this.C);
		this.setDefaults("circle");
	}
	redefine(_old, _new) {
		if (_old === this.A) {
			this.addParent(_new);
			this.A = _new;
		} else if (_old === this.B) {
			this.addParent(_new);
			this.B = _new;
		} else if (_old === this.C) {
			this.addParent(_new);
			this.C = _new;
		}
	}
	getCode(): string {
		return "arc3pts";
	}
	getM(): CenterObject {
		return this.M;
	}
	getA() {
		return this.A;
	}
	getB() {
		return this.B;
	}
	getC() {
		return this.C;
	}
	fixIntersection(_x:number, _y:number, _P): boolean {
		if (this.A.near(_x, _y)) {
			_P.setAway(this.A);
			return true;
		}
		if (this.B.near(_x, _y)) {
			_P.setAway(this.B);
			return true;
		}
		if (this.C.near(_x, _y)) {
			_P.setAway(this.C);
			return true;
		}
		return false;
	}
	// Seulement pour les macros :
	setMacroAutoObject() {
		var vn = this.getVarName();
		this.A.setMacroMode(1);
		this.A.setMacroSource(function (src) {
			src.geomWrite(false, this.A.getVarName(), "DefinitionPoint", vn, 0);
		});
		this.B.setMacroMode(1);
		this.B.setMacroSource(function (src) {
			src.geomWrite(false, this.B.getVarName(), "DefinitionPoint", vn, 1);
		});
		this.C.setMacroMode(1);
		this.C.setMacroSource(function (src) {
			src.geomWrite(false, this.C.getVarName(), "DefinitionPoint", vn, 2);
		});
	}
	// Seulement pour les macros :
	isAutoObjectFlags(): boolean {
		return this.A.Flag || this.B.Flag || this.C.Flag;
	}
	// Seulement pour les macros :
	getPt(_i) {
		if (_i === 0) {return this.A;}
		if (_i === 1) {return this.B;}
		return this.C;
	}
	isMoveable(): boolean {
		// Si les extrémités sont des points libres :
		return this.A.getParentLength() === 0 && this.B.getParentLength() === 0 && this.C.getParentLength() === 0;
	}
	// see if point inside 2 border points
	checkIfValid(_P) {
		var a = $U.angleH(_P.getX() - this.P1.getX(), _P.getY() - this.P1.getY());
		// Calcul de l'angle AOM (si sens this.trigo) ou COM si sens des aiguilles (dans [0;2π]):
		var GOM = this.trigo ? a - this.fromAngle : $U.doublePI - this.toAngle + a;
		GOM += (~~(GOM < 0) - ~~(GOM > $U.doublePI)) * $U.doublePI;
		if (GOM > this.AOC) {_P.setXY(NaN, NaN);}
	}
	projectAlpha(p) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var a = p.getAlpha();
		// Calcul de l'angle AOM (si sens this.trigo) ou COM si sens des aiguilles (dans [0;2π]):
		var GOM = (this.trigo) ? a - this.fromAngle : ($U.doublePI - this.toAngle + a);
		GOM += (~~(GOM < 0) - ~~(GOM > $U.doublePI)) * $U.doublePI;
		if (GOM > this.AOC) {
			var m1 = ($U.doublePI - this.AOC) / 2;
			var m2 = (GOM - this.AOC);
			if (m2 < m1) {
				a = ~~this.trigo * this.toAngle + ~~!this.trigo * this.fromAngle;
			} else {
				a = ~~this.trigo * this.fromAngle + ~~!this.trigo * this.toAngle;
			}
		}
		p.setXY(xA + this.R * Math.cos(a), yA - this.R * Math.sin(a));
	}
	setAlpha(p) {
		// Calcul de l'angle AOM (si sens this.trigo) ou COM si sens des aiguilles (dans [0;2π]):
		var m = $U.angleH(p.getX() - this.P1.getX(), p.getY() - this.P1.getY());
		var GOM = (this.trigo) ? m - this.fromAngle : ($U.doublePI - this.toAngle + m);
		GOM += (~~(GOM < 0) - ~~(GOM > $U.doublePI)) * $U.doublePI;
		if (GOM > this.AOC) {
			var m1 = ($U.doublePI - this.AOC) / 2;
			var m2 = (GOM - this.AOC);
			if (m2 < m1) {
				p.setAlpha(~~this.trigo * this.toAngle + ~~!this.trigo * this.fromAngle);
			} else {
				p.setAlpha(~~this.trigo * this.fromAngle + ~~!this.trigo * this.toAngle);
			}
		} else {
			p.setAlpha(m);
		}
	}
	dragObject(_x, _y) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.M.setXY(this.M.getX() + vx, this.M.getY() + vy);
		this.A.setXY(this.A.getX() + vx, this.A.getY() + vy);
		this.B.setXY(this.B.getX() + vx, this.B.getY() + vy);
		this.C.setXY(this.C.getX() + vx, this.C.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.computeChilds();
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.M.getX(), this.M.getY(), this.R, -this.fromAngle, -this.toAngle, this.trigo);
		ctx.fill();
		ctx.stroke();
	}
	compute() {
		var t = $U.computeArcParams(this.A.getX(), this.A.getY(), this.B.getX(), this.B.getY(), this.C.getX(), this.C.getY());
		this.M.setXY(t.centerX, t.centerY);
		this.fromAngle = t.startAngle;
		this.toAngle = t.endAngle;
		this.trigo = t.Trigo;
		this.AOC = t.AOC;
		this.R = $U.computeRay(this.M.getX(), this.M.getY(), this.A.getX(), this.A.getY());
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Arc3pts", this.A.getVarName(), this.B.getVarName(), this.C.getVarName());
	}
	mouseInside(event:MouseEvent) {
		return $U.isNearToArc(this.M.getX(), this.M.getY(), this.AOC, this.fromAngle, this.toAngle, this.trigo, this.R, this.mouseX(event), this.mouseY(event), this.getOversize());
		// return $U.isNearToArc(this.M.getX(), this.M.getY(), this.A.getX(), this.A.getY(), this.B.getX(), this.B.getY(), this.C.getX(), this.C.getY(), this.R, this.mouseX(ev), this.mouseY(ev), this.getOversize());
	}
}
