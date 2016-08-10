
import {PrimitiveLineObject} from './PrimitiveLineObject';
import {VirtualPointObject} from './VirtualPointObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class FixedAngleObject extends PrimitiveLineObject {
	protected A;
	protected O;
	protected C: VirtualPointObject;
	protected E1: Expression;
	protected VALUE: number;
	protected R: number;
	protected AOC: number;
	protected fromAngle: number;
	protected toAngle: number;
	protected trigo: boolean;
	protected sel_arc: boolean;
	protected sel_ray: boolean;
	protected setExp: (exy) => void;
	constructor(_construction:iConstruction, _name:string, _P1, _P2, _trigo) {
		super(_construction, _name, _P2);
		//var superObject = $U.extend(this, new PrimitiveLineObject(_construction, _name, _P2));
		// $U.extend(this, new MoveableObject(_construction)); // Héritage
		this.A = _P1;
		this.O = _P2;
		this.C = new VirtualPointObject(0, 0);
		this.E1 = null;
		this.VALUE = 0;
		this.R = 30;
		this.AOC = 0; // mesure de l'angle this.AOC orienté positif (dans [0;2π[) :
		this.fromAngle = 0; // Début de l'arc (xOA sens this.trigo dans [0;2π[)
		this.toAngle = 0; // Fin de l'arc (xOC sens this.trigo dans [0;2π[)
		this.trigo = _trigo; // Sens de l'angle
		this.sel_ray = true;
		this.setParent(this.A, this.O);
		this.blocks.setMode(["oncompute"], "oncompute");
		this.setDefaults("fixedangle");
		this.getRoot().setExpression = this.setExpression;
		this.setExp = this.setE1;
		this.getArcRay = this._getArcRay;
	}
	redefine(_old, _new) {
		if (_old === this.A) {
			this.addParent(_new);
			this.A = _new;
		} else if (_old === this.O) {
			this.addParent(_new);
			this.O = _new;
		}
	}
	isTrigo() {
		return this.trigo;
	}
	getValue() {
		return this.E1.value();
	}
	getCode(): string {
		return "fixedangle";
	}
	getFamilyCode(): string {
		return "fixedangle";
	}
	setTrigo(_t:boolean) {
		this.trigo = _t
	}
	getTrigo(): boolean {
		return this.trigo;
	}
	getAssociatedTools(): string {
		var at = super.getAssociatedTools();
		at += ",@callcalc,@blockly";
		return at;
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
		var xAP = _P.getX() - this.O.getX();
		var yAP = _P.getY() - this.O.getY();
		if ((xAP * dx < 0) || (yAP * dy < 0)) {
			_P.setXY(NaN, NaN);
		}
	}
	// Pour Blockly :
	setExpression(exy) {
		this.setExp(exy);
	}
	// setExp pour les widgets :
	setE1(_t) {
		Expression.delete(this.E1);
		this.E1 = new Expression(this, _t);
	}
	getExp() {
		return this.getE1().getSource();
	}
	getE1(): Expression {
		return this.E1;
	}
	isMoveable(): boolean {
		return true;
	}
	compute_dragPoints(_x:number, _y:number) {
		if (this.sel_arc) {
			var vx = _x - this.O.getX();
			var vy = _y - this.O.getY();
			this.R = Math.sqrt(vx * vx + vy * vy);
		}
	}
	computeDrag() {}
	setArcRay(r:number) {
		this.R = r;
	}
	paintLength(ctx:CanvasRenderingContext2D) {
		ctx.save();
		var r = this.R + this.prefs.fontmargin + this.getRealsize() / 2;
		ctx.textAlign = "left";
		var prec = this.getPrecision();
		var display = this.VALUE;
		display = Math.round(display * prec) / prec;
		var a = this.trigo ? -this.toAngle + this.AOC / 2 : Math.PI - this.toAngle + this.AOC / 2;
		a = a - Math.floor(a / $U.doublePI) * $U.doublePI; // retour dans [0;2π]
		if ((a > $U.halfPI) && (a < 3 * $U.halfPI)) {
			a += Math.PI;
			r = -r;
			ctx.textAlign = "right";
		}
		ctx.fillStyle = ctx.strokeStyle;
		ctx.translate(this.O.getX(), this.O.getY());
		ctx.rotate(a);
		ctx.fillText($L.number(display) + "°", r, this.getFontSize() / 2);
		ctx.restore();
	}

	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.O.getX(), this.O.getY());
		ctx.lineTo(this.getXmax(), this.getYmax());
		ctx.stroke();
		ctx.moveTo(this.O.getX(), this.O.getY());
		ctx.beginPath();
		ctx.lineTo(this.O.getX() + this.R * Math.cos(-this.fromAngle), this.O.getY() + this.R * Math.sin(-this.fromAngle));
		ctx.lineWidth = ctx.lineWidth * 3;
		ctx.arc(this.O.getX(), this.O.getY(), this.R, -this.fromAngle, -this.toAngle, this.trigo);
		ctx.stroke();
		ctx.lineTo(this.O.getX(), this.O.getY());
		ctx.fill();
	}

	compute() {
		this.E1.compute();
		this.VALUE = this.AOC = this.E1.value();
		if (this.Cn.isDEG()) {
			this.AOC = this.AOC * Math.PI / 180;
		} else {
			this.VALUE = this.VALUE * 180 / Math.PI;
		}
		if (!this.trigo) {
			this.AOC = -this.AOC;
		}
		this.AOC = this.AOC - Math.floor(this.AOC / $U.doublePI) * $U.doublePI; // this.AOC in [0,2π[
		var x = (this.A.getX() - this.O.getX()) * Math.cos(this.AOC) + (this.A.getY() - this.O.getY()) * Math.sin(this.AOC);
		var y = (this.O.getX() - this.A.getX()) * Math.sin(this.AOC) + (this.A.getY() - this.O.getY()) * Math.cos(this.AOC);
		this.setDXDY(0, 0, x, y);
		super.compute();
		this.C.setXY(this.O.getX() + x, this.O.getY() + y);
		this.fromAngle = $U.angleH(this.A.getX() - this.O.getX(), this.A.getY() - this.O.getY());
		this.toAngle = $U.angleH(this.C.getX() - this.O.getX(), this.C.getY() - this.O.getY());
	}
	getSource(src) {
		var _ex = "\"" + this.E1.getUnicodeSource().replace(/\n/g, "\\n") + '"';
		src.geomWrite(false, this.getName(), "FixedAngle", this.A.getVarName(), this.O.getVarName(), _ex, this.trigo);
	}
	mouseInside(event:MouseEvent) {
		this.sel_ray = $U.isNearToRay(this.O.getX(), this.O.getY(), this.C.getX(), this.C.getY(), this.mouseX(event), this.mouseY(event), this.getOversize());
		this.sel_arc = $U.isNearToArc(this.O.getX(), this.O.getY(), this.AOC, this.fromAngle, this.toAngle, this.trigo, this.R, this.mouseX(event), this.mouseY(event), this.getOversize());
		return this.sel_arc || this.sel_ray
	}
	private _getArcRay(): number {
		return this.R;
	}
}
