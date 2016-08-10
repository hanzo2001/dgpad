
import {ConstructionObject} from './ConstructionObject';
import {CenterObject} from './CenterObject';

var $U = (<any>window).$U;

/**
 * Initialization problem
 */

export class Circle3ptsObject_3D extends ConstructionObject {
	protected M: CenterObject;
	protected A;
	protected B;
	protected C;
	protected R: number;
	protected NB: number;
	protected Ptab;
	protected phi;
	protected theta;
	constructor(_construction, _name, _P1, _P2, _P3) {
		var _M = new CenterObject(_construction, "_Center", this);
		_construction.add(_M);
		super(_construction, _name);
		// $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		this.M = _M;
		this.A = _P1;
		this.B = _P2;
		this.C = _P3;
		this.R = 0;
		this.NB = 500;
		this.Ptab = [];
		this.phi = this.Cn.getInterpreter().getEX().EX_phi;
		this.theta = this.Cn.getInterpreter().getEX().EX_theta;
		this.setParent(this.A, this.B, this.C);
		this.M.setParent(this);
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
		return "circle3pts3D";
	}
	getFamilyCode(): string {
		return "circle3pts3D";
	}
	isInstanceType(_c): boolean {
		return _c === "circle3pts3D";
	}
	getAssociatedTools(): string {
		return "point,@callproperty,@calltrash";
	}
	getValue(): number {
		return this.getCn().coordsSystem.l(this.R);
	}
	getP1() {
		return this.M;
	}
	mouseInside(ev) {
		var mx = this.mouseX(ev);
		var my = this.mouseY(ev);
		for (var i = 0, len = this.Ptab.length; i < len; i++) {
			if ($U.isNearToPoint(this.Ptab[i][0][0], this.Ptab[i][0][1], mx, my, this.getOversize()))
				return true;
		}
		return false;
	}
	// ****************************************
	// **** Uniquement pour les animations ****
	// ****************************************
	getAlphaBounds(anim) {
		var inc = 5 * Math.round(anim.direction * (anim.speed * anim.delay / 1000));
		return [0, this.Ptab.length - 1, inc]
	}
	getAnimationSpeedTab(): number[] {
		return [0, 20, 25, 50, 100, 200, 400, 500, 750, 1000];
	}
	getAnimationParams(x0:number, y0:number, x1:number, y1:number) {
		var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var fce = this.getAnimationSpeedTab();
		var f = Math.floor(d / (300 / fce.length));
		if (f >= fce.length) f = fce.length - 1;
		var xAB = (this.Ptab[0][0][0] - x0);
		var yAB = (this.Ptab[0][0][1] - y0);
		var d2 = xAB * xAB + yAB * yAB;
		var d1 = 0;
		var k = 0;
		for (var i = 1; i < this.Ptab.length; i++) {
			xAB = (this.Ptab[i][0][0] - x0);
			yAB = (this.Ptab[i][0][1] - y0);
			d1 = xAB * xAB + yAB * yAB;
			if ((d1 < d2) || isNaN(d2)) {
				k = i;
				d2 = d1;
			}
		}
		var xp = this.Ptab[k - 1][0][0];
		var yp = this.Ptab[k - 1][0][1];
		var ps = (xp - x0) * (x1 - x0) + (yp - y0) * (y1 - y0);
		var dir = (ps > 0) ? 1 : -1;
		// var dop = Math.sqrt((xp - x0) * (xp - x0) + (yp - y0) * (yp - y0));
		// var dom = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		// var cs = ps / (dop * dom);
		// var aller_retour = (Math.abs(cs) < 0.707);
		var pcent = Math.round(100 * fce[f] / fce[fce.length - 1]) + "%";
		return {
			message: pcent + "",
			speed: fce[f],
			direction: dir,
			ar: false
		}
	}
	// ****************************************
	// ****************************************
	projectXY(_x:number, _y:number): number {
		var xAB = (this.Ptab[0][0][0] - _x);
		var yAB = (this.Ptab[0][0][1] - _y);
		var d2 = xAB * xAB + yAB * yAB;
		var d1 = 0;
		var k = 0;
		for (var i = 1, len = this.Ptab.length; i < len; i++) {
			xAB = (this.Ptab[i][0][0] - _x);
			yAB = (this.Ptab[i][0][1] - _y);
			d1 = xAB * xAB + yAB * yAB;
			if (d1 < d2) {
				k = i;
				d2 = d1;
			}
		}
		return k;
	}
	project(p) {
		var k = this.projectXY(p.getX(), p.getY());
		p.setXYZ(this.Ptab[k][1]);
	}
	projectAlpha(p) {
		if (this.Ptab.length > 0) {
			if (p.getAlpha() < this.Ptab.length)
				p.setXYZ(this.Ptab[p.getAlpha()][1]);
			else {
				p.setXYZ(this.Ptab[this.Ptab.length - 1][1]);
			}
		}

	}
	setAlpha(p) {
		p.setAlpha(this.projectXY(p.getX(), p.getY()));
	}
	// Seulement pour les macros :
	setMacroAutoObject() {
		var vn = this.getVarName();
		this.A.setMacroMode(1);
		this.A.setMacroSource((src) => src.geomWrite(false, this.A.getVarName(), "DefinitionPoint", vn, 0));
		this.B.setMacroMode(1);
		this.B.setMacroSource((src) => src.geomWrite(false, this.B.getVarName(), "DefinitionPoint", vn, 1));
		this.C.setMacroMode(1);
		this.C.setMacroSource((src) => src.geomWrite(false, this.C.getVarName(), "DefinitionPoint", vn, 2));
	}
	// Seulement pour les macros :
	isAutoObjectFlags(): boolean {
		return this.A.Flag || this.B.Flag || this.C.Flag;
	}
	// Seulement pour les macros :
	getPt(_i:number) {
		if (_i === 0) {return this.A;}
		if (_i === 1) {return this.B;}
		return this.C;
	}
	isMoveable(): boolean {
		return false;
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.Ptab[0][0][0], this.Ptab[0][0][1]);
		for (var i = 1, len = this.Ptab.length; i < len; i++) {
			ctx.lineTo(this.Ptab[i][0][0], this.Ptab[i][0][1]);
		}
		ctx.lineTo(this.Ptab[0][0][0], this.Ptab[0][0][1]);
		ctx.stroke();
		ctx.fill();
	}
	compute() {
		var org = this.Cn.get3DOrigin(this);
		var orgX = this.Cn.coordsSystem.x(org.getX());
		var orgY = this.Cn.coordsSystem.y(org.getY());
		var fi = this.phi();
		var th = this.theta();
		var cfi = this.Cn.cos(fi);
		var sfi = this.Cn.sin(fi);
		var cth = this.Cn.cos(th);
		var sth = this.Cn.sin(th);
		var pt = function (_v) {
			return [orgX + _v[0] * (sfi) + _v[1] * (cfi), orgY + _v[0] * (-cfi * sth) + _v[1] * (sfi * sth) + _v[2] * (cth)];
		};
		var px = this.Cn.coordsSystem.px;
		var py = this.Cn.coordsSystem.py;
		var a = this.A.coords3D();
		var b = this.B.coords3D();
		var c = this.C.coords3D();
		var a2 = (c[0] - b[0]) * (c[0] - b[0]) + (c[1] - b[1]) * (c[1] - b[1]) + (c[2] - b[2]) * (c[2] - b[2]);
		var b2 = (c[0] - a[0]) * (c[0] - a[0]) + (c[1] - a[1]) * (c[1] - a[1]) + (c[2] - a[2]) * (c[2] - a[2]);
		var c2 = (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]);
		// Determination du centre :
		var alpha = a2 * (-a2 + b2 + c2);
		var beta = b2 * (a2 - b2 + c2);
		var gamma = c2 * (a2 + b2 - c2);
		var sum = alpha + beta + gamma;
		var t = [];
		t[0] = a[0] + (beta / sum) * (b[0] - a[0]) + (gamma / sum) * (c[0] - a[0]);
		t[1] = a[1] + (beta / sum) * (b[1] - a[1]) + (gamma / sum) * (c[1] - a[1]);
		t[2] = a[2] + (beta / sum) * (b[2] - a[2]) + (gamma / sum) * (c[2] - a[2]);
		this.M.setXYZ(t);
		// Determination des points du cercle par l'équation barycentrique
		// de ce cercle :
		var tab = [];
		var tbc = [];
		var tca = [];
		var step = 1 / this.NB;
		var k;
		var x;
		var y;
		var z;
		var inter;
		var coef;
		var c2d;// this was probably missing ??
		for (var i = 0; i < this.NB; i++) {
			// Tracé de l'arc AB :
			k = i * step;
			inter = b2 * (1 - k) + a2 * k;
			coef = inter / (inter - c2 * k * (1 - k));
			x = c[0] + coef * (a[0] - c[0] + k * (b[0] - a[0]));
			y = c[1] + coef * (a[1] - c[1] + k * (b[1] - a[1]));
			z = c[2] + coef * (a[2] - c[2] + k * (b[2] - a[2]));
			c2d = pt([x, y, z]);
			tab.push([
				[px(c2d[0]), py(c2d[1])],
				[x, y, z]
			]);
			// Tracé de l'arc BC :
			inter = c2 * (1 - k) + b2 * k;
			coef = inter / (inter - a2 * k * (1 - k));
			x = a[0] + coef * (b[0] - a[0] + k * (c[0] - b[0]));
			y = a[1] + coef * (b[1] - a[1] + k * (c[1] - b[1]));
			z = a[2] + coef * (b[2] - a[2] + k * (c[2] - b[2]));
			c2d = pt([x, y, z]);
			tbc.push([
				[px(c2d[0]), py(c2d[1])],
				[x, y, z]
			]);
			// Tracé de l'arc CA :
			inter = a2 * (1 - k) + c2 * k;
			coef = inter / (inter - b2 * k * (1 - k));
			x = b[0] + coef * (c[0] - b[0] + k * (a[0] - c[0]));
			y = b[1] + coef * (c[1] - b[1] + k * (a[1] - c[1]));
			z = b[2] + coef * (c[2] - b[2] + k * (a[2] - c[2]));
			c2d = pt([x, y, z]);
			tca.push([
				[px(c2d[0]), py(c2d[1])],
				[x, y, z]
			]);

		}
		// Concaténation des trois arcs en un seul tableau.
		// Chaque élément de ce tableau est un tableau regroupant
		// les coordonnées 2d et 3d du point : [[x,y],[x3d,y3d,z3d]]
		this.Ptab = tab;
		this.Ptab = this.Ptab.concat(tbc);
		this.Ptab = this.Ptab.concat(tca);
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Circle3pts3D", this.A.getVarName(), this.B.getVarName(), this.C.getVarName());
	}
}
