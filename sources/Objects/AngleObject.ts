
import {ConstructionObject} from './ConstructionObject';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class AngleObject extends ConstructionObject {
	private A;
	private O;
	private C;
	private R: number;
	private AOC: number;
	private AOC180: number;
	private fromAngle: number;
	private toAngle: number;
	private trigo: boolean;
	private valid: boolean;
	private deg_coef: number;
	private mode360: boolean;
	constructor(_construction:iConstruction, _name:string, _P1, _P2, _P3) {
		super(_construction, _name);
		//$U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		this.A = _P1;
		this.O = _P2;
		this.C = _P3;
		this.R = 30;
		this.AOC = 0; // mesure de l'angle this.AOC orienté positif (dans [0;2π[) :
		this.AOC180 = 0; // mesure de l'angle this.AOC (dans [0;π[) :
		this.fromAngle = 0; // Début de l'arc (xOA sens this.trigo dans [0;2π[)
		this.toAngle = 0; // Fin de l'arc (xOC sens this.trigo dans [0;2π[)
		this.trigo = true; // sens de dessin de l'arc ( comment va-t-on de this.A à this.C)
		this.valid = true;
		this.deg_coef = 180 / Math.PI;
		this.mode360 = false;
		this.setParent(this.A, this.O, this.C);
		this.setDefaults("angle");
		this.is360 = this._is360;
		this.getArcRay = this.getArcRay;
	}
	redefine(_old, _new) {
		if (_old === this.A) {
			this.addParent(_new);
			this.A = _new;
		} else if (_old === this.O) {
			this.addParent(_new);
			this.O = _new;
		} else if (_old === this.C) {
			this.addParent(_new);
			this.C = _new;
		}
	}
	set360(is360:boolean) {
		this.mode360 = is360;
	}
	getAOC(): number {
		return this.AOC;
	}
	getValue(): number {
		var a = this.mode360 ? this.AOC : this.AOC180;
		return this.Cn.isDEG() ? a * this.deg_coef : a;
	}
	getCode(): string {
		return "angle";
	}
	getFamilyCode(): string {
		return "angle";
	}
	isMoveable(): boolean {
		return true;
	}
	//Obsolete :
	dragObject(_x:number, _y:number) {
		// console.log("dragObject");
		var vx = _x - this.O.getX();
		var vy = _y - this.O.getY();
		this.R = Math.sqrt(vx * vx + vy * vy);
	}
	compute_dragPoints(x:number, y:number) {
		// console.log("compute_dragPoints");
		var vx = x - this.O.getX();
		var vy = y - this.O.getY();
		this.R = Math.sqrt(vx * vx + vy * vy);
	}
	computeDrag() {
		// console.log("computeDrag");
	}
	setArcRay(r:number) {
		this.R = r;
	}
	paintLength(ctx:CanvasRenderingContext2D) {
		if (this.valid && (!$U.approximatelyEqual(this.AOC180, $U.halfPI))) {
			ctx.save();
			var r = this.R + this.prefs.fontmargin + this.getRealsize() / 2;
			ctx.textAlign = "left";
			var prec = this.getPrecision();
			var display = (this.mode360) ? this.AOC : this.AOC180;
			display = display * 180 / Math.PI;
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
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		if (this.valid) {
			ctx.beginPath();
			if ($U.approximatelyEqual(this.AOC180, $U.halfPI)) {
				var cto = this.R * Math.cos(-this.toAngle);
				var sto = this.R * Math.sin(-this.toAngle);
				var cfrom = this.R * Math.cos(-this.fromAngle);
				var sfrom = this.R * Math.sin(-this.fromAngle);
				ctx.moveTo(this.O.getX() + cto, this.O.getY() + sto);
				ctx.lineTo(this.O.getX() + cto + cfrom, this.O.getY() + sto + sfrom);
				ctx.lineTo(this.O.getX() + cfrom, this.O.getY() + sfrom);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(this.O.getX(), this.O.getY());
				ctx.lineTo(this.O.getX() + cto, this.O.getY() + sto);
				ctx.lineTo(this.O.getX() + cfrom, this.O.getY() + sfrom);
				ctx.fill();
			} else {
				ctx.arc(this.O.getX(), this.O.getY(), this.R, -this.fromAngle, -this.toAngle, this.trigo);
				ctx.fill();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(this.O.getX() + this.R * Math.cos(-this.toAngle), this.O.getY() + this.R * Math.sin(-this.toAngle));
				ctx.lineTo(this.O.getX(), this.O.getY());
				ctx.lineTo(this.O.getX() + this.R * Math.cos(-this.fromAngle), this.O.getY() + this.R * Math.sin(-this.fromAngle));
				ctx.fill();
			}
		}
	}
	compute() {
		var t = $U.computeAngleParams(this.A.getX(), this.A.getY(), this.O.getX(), this.O.getY(), this.C.getX(), this.C.getY());
		this.fromAngle = t.startAngle;
		this.toAngle = t.endAngle;
		this.trigo = this.mode360 ? true : t.Trigo;
		this.AOC = t.this.AOC;
		this.AOC180 = t.this.AOC180;
		this.valid = !isNaN(this.AOC);
		// this.valid = !isNaN(this.fromAngle);
		// console.log("fromA="+this.fromAngle+" toA="+this.toAngle+" trig="+this.trigo+" this.AOC="+this.AOC);
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Angle", this.A.getVarName(), this.O.getVarName(), this.C.getVarName());
	}
	mouseInside(event:MouseEvent) {
		return $U.isNearToArc(this.O.getX(), this.O.getY(), this.AOC, this.fromAngle, this.toAngle, this.trigo, this.R, this.mouseX(event), this.mouseY(event), this.getOversize());
	}
	private _is360(): boolean {
		return this.mode360;
	}
	private _getArcRay(): number {
		return this.R;
	}
}
