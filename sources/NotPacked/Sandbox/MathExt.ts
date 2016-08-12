/// <reference path="./MathExt.d.ts" />

var PI = Math.PI;
var PI2 = 2 * PI;
var deg2rad = PI / 180;
var isArray = Array.isArray;
var isStr = v => typeof v === 'string';

class MathExt implements iMathExt {
	private g: number;
	coef3D;
	doublePI;
	simplePI;
	constructor(deg?:boolean) {
		this.g = deg ? deg2rad : 1;
	}
	get deg(): boolean {
		return this.g !== 1;
	}
	set deg(v:boolean) {
		if (v) {
			this.g = deg2rad;
			this.simplePI = 180;
			this.doublePI = 360;
			this.coef3D = 0.859436693;
		}
	}
	get rad(): boolean {
		return this.g === 1;
	}
	set rad(v:boolean) {
		if (v) {
			this.g = 1;
			this.simplePI = PI;
			this.doublePI = PI2;
      this.coef3D = 0.015;
		}
	}

	Angle180(A:Point, O:Point, C:Point): Angle {
		let a = this.Angle360(A, O, C);
		return (a < this.simplePI ? a : this.doublePI - a) * this.g;
	}
	Angle360(A:Point, O:Point ,C:Point): Angle {
		var xOA = A[0] - O[0];
		var yOA = A[1] - O[1];
		var xOC = C[0] - O[0]
		var yOC = C[1] - O[1];
		var a = Math.atan2(yOA, xOA);
		var c = Math.atan2(yOC, xOC);
		return (c - a) * this.g;
	}
	test(test:boolean, tr:any, fl:any): any {
		return test ? tr : fl;
	}
	IF(test:boolean, tr:any, fl:any): any {
		return test ? tr : fl;
	}
	unitVector(a:Vector): num {
		if (isArray(a)) {
			let r=[], n=0, i=0, j=0, s=a.length;
			while (i<s) {n += a[i] * a[i++];}
			n = Math.sqrt(n);
			while (j<s) {r[j++] = a[j] / n;}
			return r;
		}
		return NaN;
	}
	crossProduct( A:Vector, B:Vector): Vector|number {
		if (!isArray(A) || A.length !== 3 || !isArray(B) || B.length !== 3) {return NaN;}
		let [a1, a2, a3] = A;
		let [b1, b2, b3] = B;
		return [ a2*b3-a3*b2, a3*b1-a1*b3, a1*b2-a2*b1 ];
	}
	distance(A:Point, B:Point): number {
		if (!isArray(A) || !isArray(B) || A.length !== B.length) {return NaN;}
		let d = 0;
		let i=0, s=A.length;
		while (i<s) {d += (A[i] - B[i]) * (A[i] - B[i]);}
		return Math.sqrt(d);
	}
	plus(a:any, b:any): num | string {
		let na = isNaN(a);
		let nb = isNaN(b);
		if (!na && !nb) {return a + b;}
		let A = na ? a : [a, 0];
		let B = nb ? b : [b, 0];
		if (isArray(A) && isArray(B) && A.length === B.length) {
			let t=[], i=0, s=a.length;
			while (i<s) {t[i++] = this.plus(A[i], B[i]);}
			return t;
		}
		if (isStr(a) && isStr(b)) {return a+b;}
		return NaN;
	}
	minus(a:num, b:num): num {
		let na = isNaN(<any>a);
		let nb = isNaN(<any>b);
		if (!na && !nb) {return <number>a - <number>b;}
		let A = na ? a : [a, 0];
		let B = nb ? b : [b, 0];
		if (isArray(A) && isArray(B) && A.length === B.length) {
			let t=[], i=0, s=(<number[]>a).length;
			while (i<s) {t[i++] = this.plus(A[i], B[i]);}
			return t;
		}
		return NaN;
	}
	times(b:num, a:num): num {
		let na = isNaN(<any>a);
		let nb = isNaN(<any>b);
		if (!na && !nb) {return <number>a * <number>b;}
		if (isArray(a) && isArray(b) && a.length === b.length && a.length === 2) {
			let [am, ai] = a;
			let [bm, bi] = b;
			return [am*bm - ai*bi, am*bi + ai*bm];
		}
		if (!na || !nb) {
			let [A, n] = na ? [a,b] : [b,a];
			var t=[], i=0, s=(<number[]>A).length;
			while (i<s) {t.push(this.times(n, A[i++]));}
			return t;
		}
		return NaN;
	}
	quotient(a:num, b:num): num {
		let na = isNaN(<any>a);
		let nb = isNaN(<any>b);
		if (!na && !nb) {return <number>a / <number>b;}
		if (isArray(a) && isArray(b) && a.length === b.length && a.length === 2) {
			let [am, ai] = a;
			let [bm, bi] = b;
			return [(am*bm + ai*bi) / (bm*bm + bi*bi), (ai*bm - am*bi) / (bm*bm + bi*bi)];
		}
		if (!na || !nb) {
			let [A, n] = na ? [a, b] : [b, a];
			var t=[], i=0, s=(<any>A).length;
			while (i<s) {t.push(this.quotient(n, A[i++]));}
			return t;
		}
		return NaN;
	}
	power(a:num, b:number): num|Complex[] {
		let na = isNaN(<number>a);
		let nb = isNaN(b);
		if (nb) {return NaN;}
		if (!na && !nb) {return Math.pow(<number>a, b);}
		if ((!isNaN(b)) && (isArray(a)) && (a.length === 2)) {
			let invb = (b === 0) ? 0 : (Math.round(1e12 / b) * 1e-12);
			let [n, i] = a;
			let arg = Math.atan2(i, n) * b;
			let mod = Math.pow(Math.sqrt(n*n+i*i), b);
			let res = [];
			if ((invb > 1) && (Math.round(invb) === invb)) {
				var inc = PI2 * b;
				for (var k = 0; k < invb; k++) {
					res.push([mod * Math.cos(arg + k * inc), mod * Math.sin(arg + k * inc)]);
				}
			} else {
				res = [mod * Math.cos(arg), mod * Math.sin(arg)];
			}
			return res;
		}
		return NaN;
	}
	csqrt(a: num): num|Complex[] {
		if (isArray(a)) {
			if (a.length === 2) {
				let [n, i] = a;
				let r = [];
				// argument générique :
				let arg = Math.atan2(i, n) / 2;
				// module générique :
				let mod = Math.pow(n*n + i*i, 1/4);
				r.push([mod * Math.cos(arg), mod * Math.sin(arg)]);
				r.push([mod * Math.cos(arg + PI), mod * Math.sin(arg + PI)]);
				return r;
			}
		} else {
			if (!isNaN(a)) {
				return a < 0 ? this.csqrt([a, 0]) : Math.sqrt(a);
			}
		}
		return NaN;
	}
	gcd(a:number, b:number): number {
		if (isNaN(a) || isNaN(b)) {return NaN;}
		return b ? this.gcd(b, a % b) : a;
	}
	mod(a:num): number {
		let A = <Complex>(isNaN(<any>a) ? a : [a, 0]);
		if (isArray(A) && A.length === 2) {
			return Math.sqrt(A[0]*A[0] + A[1]*A[1]);
		}
		return NaN;
	}
	arg(a:num): number {
		let A = isNaN(<any>a) ? a : [a, 0];
		if (!isArray(A) || A.length !== 2) {return NaN;}
		return Math.atan2(A[1], A[0]);
	}
	conj(a:num): num {
		let A = isNaN(<any>a) ? a : [a, 0];
		if (!isArray(A) || A.length !== 2) {return NaN;}
		return [A[0], -A[1]];
	}
	angleH(x:number, y:number): number {
		return (( y < 0 ? this.doublePI : 0 ) - Math.atan2(-y, x)) / this.g;
	}
	asin(x:number): number {
		return Math.asin(x) / this.g;
	}
	acos(x:number): number {
		return Math.acos(x) / this.g;
	}
	atan(x:number): number {
		return Math.atan(x) / this.g;
	}
	atan2(x:number, y:number): number {
		return Math.atan2(y, x) / this.g;
	}
	sin(x:number): number {
		return Math.sin(x*this.g);
	}
	cos(x:number): number {
		return Math.cos(x*this.g);
	}
	tan(x:number): number {
		return Math.tan(x*this.g);
	}
}
