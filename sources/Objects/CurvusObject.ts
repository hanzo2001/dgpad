
import {ConstructionObject} from './ConstructionObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;

type Point = {
	x: number,
	y: number,
	d: boolean
};

/**
 * Some strange assignments: dx, dy, dz, dt??
 */

export class CurvusObject extends ConstructionObject {
	private MIN: number;
	private MAX: number;
	private STEP: number;
	private E1: Expression;
	private min: Expression;
	private max: Expression;
	private CX: number;
	private CZ: number;
	private NB: number;
	private Ptab: Point[];
	constructor(_construction, _name, _a, _b, _f1) {
		super(_construction, _name);
		//$U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		this.MIN = 0;
		this.MAX = 0;
		this.STEP = 0;
		this.E1 = null;
		this.min = null;
		this.max = null;
		this.CX = 0; // représente l'abscisse (pixel) de l'origine du repère
		this.CZ = 1; // représente la valeur du zoom
		this.NB = 1000; // nombre de côtés du polygone (modifié à chaque compute pour les cartésiennes)
		this.Ptab = [];
		// Tableau d'objets de 3 propriétés : x pour abscisse
		// y pour ordonnée, d pour discontinuité repérée
		this.compute = null;
		if (_f1 !== ''){this.setE1(_f1);}
		if (_a !== '') {this.setMin(_a);}
		if (_b !== '') {this.setMax(_b);}
		for (var i = 0; i < 10000; i++) {
			this.Ptab.push({
				x: 0,
				y: 0,
				d: false
			});
		}
		this.setDefaults('function');
	}
	isInstanceType(_c:string): boolean {
		return _c === 'function';
	}
	getCode(): string {
		return 'function';
	}
	getFamilyCode(): string {
		return 'function';
	}
	getAssociatedTools(): string {
		return 'point,@callproperty,@calltrash,@callcalc';
	}
	mouseInside(event:MouseEvent): boolean {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		let i=0, s=this.NB;
		while (i<s) {
			if ($U.isNearToPoint(this.Ptab[i].x, this.Ptab[i].y, mx, my, this.getOversize())) {return true;}
		}
		return false;
	}
	//  // ****************************************
	// // **** Uniquement pour les animations ****
	// // ****************************************
	// getAlphaBounds(anim) {
	//     var inc = 5 * Math.round(anim.direction * (anim.speed * anim.delay / 1000));
	//     return [0, this.Ptab.length - 1, inc]
	// };
	// getAnimationSpeedTab() {
	//     return [0, 20, 25, 50, 100, 200, 400, 500, 750, 1000];
	// };
	// getAnimationParams(x0, y0, x1, y1) {
	//     var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
	//     var fce = this.getAnimationSpeedTab();
	//     var f = Math.floor(d / (300 / fce.length));
	//     if (f >= fce.length) f = fce.length - 1;
	//     var xAB = (this.Ptab[0].x - x0),
	//         yAB = (this.Ptab[0].y - y0);
	//     var d2 = xAB * xAB + yAB * yAB,
	//         d1 = 0;
	//     var k = 0;
	//     for (var i = 1; i < this.NB; i++) {
	//         xAB = (this.Ptab[i].x - x0);
	//         yAB = (this.Ptab[i].y - y0);
	//         d1 = xAB * xAB + yAB * yAB;
	//         if ((d1 < d2) || isNaN(d2)) {
	//             k = i;
	//             d2 = d1;
	//         }
	//     }
	//     var xp = this.Ptab[k - 1].x;
	//     var yp = this.Ptab[k - 1].y;
	//     var ps = (xp - x0) * (x1 - x0) + (yp - y0) * (y1 - y0);
	//     var dir = (ps > 0) ? 1 : -1;
	//     var dop = Math.sqrt((xp - x0) * (xp - x0) + (yp - y0) * (yp - y0));
	//     var dom = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
	//     var cs = ps / (dop * dom);
	//     var aller_retour = (Math.abs(cs) < 0.707);
	//     var pcent = Math.round(100 * fce[f] / fce[fce.length - 1])+'%';
	//     return {
	//         message: aller_retour ? pcent + ' \u21C4' : pcent + '',
	//         speed: fce[f],
	//         direction: dir,
	//         ar: aller_retour
	//     }
	// }
	// // ****************************************
	// // ****************************************
	projectXY(_x:number, _y:number): number[] {
		var xAB = (this.Ptab[0].x - _x);
		var yAB = (this.Ptab[0].y - _y);
		var d2 = xAB * xAB + yAB * yAB;
		var d1 = 0;
		var k = 0;
		for (var i = 1; i < this.NB; i++) {
			xAB = (this.Ptab[i].x - _x);
			yAB = (this.Ptab[i].y - _y);
			d1 = xAB * xAB + yAB * yAB;
			if ((isNaN(d2)) || (d1 < d2)) {
				k = i;
				d2 = d1;
			}
		}
		return [this.Ptab[k].x, this.Ptab[k].y];
	}
	project(p) {
		// console.log('this.project');
		var coords = this.projectXY(p.getX(), p.getY());
		p.setXY(coords[0], coords[1]);
	}
	projectAlpha(p) {
		var k = (this.compute === this.computeCartesian) ? Math.round(this.Cn.coordsSystem.px(p.getAlpha())) : p.getAlpha();
		k >= 0 && k < this.NB
			? p.setXY(this.Ptab[k].x, this.Ptab[k].y)
			: p.setXY(k, this.Cn.coordsSystem.py(this.E1.value(p.getAlpha())));
	}
	setAlpha(p) {
		var xAB = 0;
		var yAB = 0;
		for (var i = 0; i < this.NB; i++) {
			xAB = (this.Ptab[i].x - p.getX()), yAB = (this.Ptab[i].y - p.getY());
			if ((xAB === 0) && (yAB === 0)) {
				this.compute === this.computeCartesian
					? p.setAlpha(this.Cn.coordsSystem.x(i))
					: p.setAlpha(i);
				break;
			}
		}
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.Ptab[0].x, this.Ptab[0].y);
		for (var i = 1; i < this.NB; i++) {
			ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y);
			// if (this.Ptab[i].d) ctx.moveTo(this.Ptab[i].x, this.Ptab[i].y);
			// else ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y);
		}
		ctx.stroke();
		if (this.compute === this.computeCartesian && this.max && this.min) {
			ctx.lineTo(this.Cn.coordsSystem.px(this.max.value()), this.Cn.coordsSystem.py(0));
			ctx.lineTo(this.Cn.coordsSystem.px(this.min.value()), this.Cn.coordsSystem.py(0));
		}
		ctx.fill();
	}
	getSource(src) {
		var e1 = this.E1  === null ? '' : this.E1.getSource();
		var mn = this.min === null ? '' : this.min.getSource();
		var mx = this.max === null ? '' : this.max.getSource();
		src.geomWrite(true, this.getName(), 'Curvus', mn, mx, e1);
	}
	setE1(_f) {
		Expression.delete(this.E1);
		this.E1 = new Expression(this, _f);
		this.dx = this.E1.dx;
		this.dy = this.E1.dy;
		this.dz = this.E1.dz;
		this.dt = this.E1.dt;
		if (this.E1.isArray()) {
			this.compute = this.computeParametric;
		} else {
			this.compute = this.computeCartesian;
		}
	}
	getE1(): Expression {
		return this.E1;
	}
	setMin(_t) {
		Expression.delete(this.min);
		this.min = new Expression(this, _t);
		this.compute();
	}
	getMinSource(): string {
		return this.min ? this.min.getSource() : '';
	}
	setMax(_t) {
		Expression.delete(this.max);
		this.max = new Expression(this, _t);
		this.compute();
	}
	getMaxSource(): string {
		return this.max ? this.max.getSource() : '';
	}
	getValue(x) {
		return this.E1.value(x);
	}
	refreshNames() {
		if (this.E1)  {this.E1.refreshNames();}
		if (this.min) {this.min.refreshNames();}
		if (this.max) {this.max.refreshNames();}
	}
	private computeMinMaxStepCartesian() {
		var mn = this.min ? this.min.value() : NaN;
		var mx = this.max ? this.max.value() : NaN;
		var x0 = this.Cn.coordsSystem.x(0);
		var x1 = this.Cn.coordsSystem.x(this.Cn.getBounds().width);
		this.MIN = isNaN(mn) ? x0 : Math.max(mn, x0);
		this.MAX = isNaN(mx) ? x1 : Math.min(mx, x1);
		this.NB = this.Cn.coordsSystem.lx(this.MAX - this.MIN);
		this.STEP = (this.MAX - this.MIN) / this.NB;
	}
	private computeCartesian() {
		if (this.E1)  {this.E1.compute();}
		if (this.min) {this.min.compute();}
		if (this.max) {this.max.compute();}
		this.computeMinMaxStepCartesian();
		var k = this.MIN;
		for (var i = 0; i < this.NB; i++) {
			this.Ptab[i].x = this.Cn.coordsSystem.px(k);
			this.Ptab[i].y = this.Cn.coordsSystem.py(this.E1.value(k));
			// Petit problème d'affichage sur certains navigateur lorsque
			// l'ordonnée (en pixel) est trop grande :
			if (Math.abs(this.Ptab[i].y) > 20000000) {this.Ptab[i].y = NaN;}
			k += this.STEP;
		}
	}
	private computeMinMaxStepParam() {
		var mn = this.min ? this.min.value() : NaN;
		var mx = this.max ? this.max.value() : NaN;
		this.MIN = (isNaN(mn)) ? 0 : mn;
		this.MAX = (isNaN(mx)) ? 1 : mx;
		this.STEP = (this.MAX - this.MIN) / this.NB;
	}
	private computeParametric() {
		if (this.E1)  {this.E1.compute();}
		if (this.min) {this.min.compute();}
		if (this.max) {this.max.compute();}
		this.computeMinMaxStepParam();
		var k = this.MIN;
		for (var i = 0; i < this.NB; i++) {
			var t = this.E1.value(k);
			this.Ptab[i].x = this.Cn.coordsSystem.px(t[0]);
			this.Ptab[i].y = this.Cn.coordsSystem.py(t[1]);
			k += this.STEP;
		}
	}
}
