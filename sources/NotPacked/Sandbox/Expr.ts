/// <reference path="../../typings/iConstruction.d.ts" />

import {MathExt as Math} from './MathExtension';

var isArray = Array.isArray;

export class Expr {
	EXPS: any[]; // Tableau de stockage des objets impliqués dans les expressions élémentaires
	//this.setDegreeMode(this.C.isDEG());// MathExtension initialized to true
	C: iConstruction;
	CS: iCoordsSystem;
	COORDS_X0: () => number;
	COORDS_Y0: () => number;
	constructor(Constr:iConstruction, CoordSys:iCoordsSystem, Exps:any[]) {
		this.C = Constr;
		this.CS = CoordSys;
		this.EXPS = Exps;
		this.COORDS_X0 = this.CS.getX0;
		this.COORDS_Y0 = this.CS.getY0;
	}
	EX_d(a:number[], b:number[]): number {
		if (isArray(a) && isArray(b) && a.length === b.length) {
			let x = b[0] - a[0];
			let y = b[1] - a[1];
			let z = b[2] - a[2];
			if (a.length === 2) {return Math.sqrt(x*x + y*y);}
			if (a.length === 3) {return Math.sqrt(x*x + y*y + z*z);}
		}
		return NaN;
	}
	// Abscisse d'un point :
	EX_x(a:number[]): number {
		return isArray(a) && a.length > 0 ? a[0] : NaN;
	}
	// Ordonnée d'un point
	EX_y(a:number[]): number {
		return isArray(a) && a.length > 1 ? a[1] : NaN;
	}
	EX_windoww(): number {
		return this.CS.l(this.C.getWidth());
	}
	EX_windowh(): number {
		return this.CS.l(this.C.getHeight());
	}
	EX_windowcx(): number {
		return this.CS.x(this.C.getWidth() / 2);
	}
	EX_windowcy(): number {
		return this.CS.y(this.C.getHeight() / 2);
	}
	EX_pixel(): number {
		return this.CS.getUnit();
	}
	EX_phi(): number {
		return this.COORDS_X0() * Math.coef3D;
	}
	EX_theta(): number {
		return this.COORDS_Y0() * Math.coef3D;
	}
	EX_restrictPhi(_t: number[]): number[] {
		if (_t.length === 2)
			this.CS.restrictPhi([_t[0] / 0.015 + 0.000001, _t[1] / 0.015 - 0.000001]);
		else
			this.CS.restrictPhi([]);
		return _t;
	}
	EX_restrictTheta(_t: number[]): number[] {
		if (_t.length === 2)
				this.CS.restrictTheta([_t[0] / 0.015 + 0.000001, _t[1] / 0.015 - 0.000001]);
		else
				this.CS.restrictTheta([]);
		return _t;
	}
	EX_point3D(_o:number[], _v:number[]): number[] {
		var fi = this.EX_phi();
		var th = this.EX_theta();
		var cfi = Math.cos(fi);
		var sfi = Math.sin(fi);
		var cth = Math.cos(th);
		var sth = Math.sin(th);
		return [
			_o[0] + _v[0] * (sfi) + _v[1] * (cfi),
			_o[1] + _v[0] * (-cfi * sth) + _v[1] * (sfi * sth) + _v[2] * (cth)
		];
	}
	//    EX.EX_windoww=9;
	// Uniquement à usage interne. L'utilisateur écrit f3(2), et
	// l'interpréteur transforme en EX_funcValue(f3)(2) :
	EX_funcValue(key:string) {
		return this.EXPS[key].getValue;
	}
	EX_getObj(key:string) {
		return this.EXPS[key];
	}
}