
import {ConstructionObject} from './ConstructionObject';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

// something to do with locus ?? only one function uses it
type Point = {
	alpha: number,
	x: number,
	y: number,
	x1: number,
	y1: number,
	r: number
}

/**
 * Same undeclared drag methods
 */

export class AreaObject extends ConstructionObject {
	protected valid;
	protected X: number;
	protected Y: number;
	protected A: number;
	protected onBounds: boolean;
	protected Ptab: any[];
	constructor(_construction, _name, _Ptab) {
		super(_construction, _name);
		//$U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		this.valid = true;
		this.X = NaN;
		this.Y = NaN; // Coordonnées du barycentre (utilisées pour l'aire)
		this.A = NaN;
		this.onBounds = false;
		this.Ptab = [];
		this.setParent();
		// this.setOpacity(0.2);
		this.setDefaults("area");
		for (var i = 0, len = _Ptab.length; i < len - 1; i++) {
			this.addParent(_Ptab[i]);
			this.Ptab.push(_Ptab[i]);
		}
	}
	redefine(_old, _new) {
		for (var i = 0, len = this.Ptab.length; i < len; i++) {
			if (_old === this.Ptab[i]) {
				this.addParent(_new);
				this.Ptab[i] = _new;
				return;
			}
		}
	}
	isCoincident(_C) {
		return _C.isInstanceType("area");
	}
	isInstanceType(_c) {
		return (_c === "area");
	}
	getFamilyCode() {
		return "area";
	}
	getCode() {
		return "area";
	}
	getAssociatedTools() {
		return "point,@callproperty,@calltrash,@callcalc,@depends";
	}
	barycenter() {
		var len = this.Ptab.length;
		var xg = 0,
			yg = 0;
		for (var i = 0; i < len; i++) {
			xg += this.Ptab[i].getX();
			yg += this.Ptab[i].getY();
		}
		return [this.Cn.coordsSystem.x(xg / len), this.Cn.coordsSystem.y(yg / len)];
	}
	barycenter3D() {
		var len = this.Ptab.length;
		var xg = 0;
		var yg = 0;
		var zg = 0;
		for (var i = 0; i < len; i++) {
			var t = this.Ptab[i].coords3D();
			xg += t[0];
			yg += t[1];
			zg += t[2];
		}
		return [xg / len, yg / len, zg / len];
	}
	// Seulement pour les macros :
	setMacroAutoObject() {
		var vn = this.getVarName();
		for (var i = 0, len = this.Ptab.length; i < len; i++) {
			var Pt = this.Ptab[i];
			Pt.setMacroMode(1);
			var nme = Pt.getName();
			Pt.setMacroSource(this.getMacroFunc(Pt.getName(), vn, i));
		}
	}
	// Seulement pour les macros :
	isAutoObjectFlags() {
		var fl = false;
		for (var i = 0; i < this.Ptab.length; i++) {
			fl = fl || this.Ptab[i].Flag;
		}
		return fl;
	}
	// Seulement pour les macros :
	getPt(_i) {
		return this.Ptab[_i];
	}
	mouseInside(ev) {
		if (!this.valid) {return false;}
		if (this.getOpacity()) {
			return this.isInside(this.Ptab, this.mouseX(ev), this.mouseY(ev));
		}
		for (var i = 0, len = this.Ptab.length - 1, x = this.mouseX(ev), y = this.mouseY(ev), ov = this.getOversize(); i < len; i++) {
			if ($U.isNearToSegment(this.Ptab[i].getX(), this.Ptab[i].getY(), this.Ptab[i + 1].getX(), this.Ptab[i + 1].getY(), x, y, ov))
				return true;
		}
		return $U.isNearToSegment(this.Ptab[0].getX(), this.Ptab[0].getY(), this.Ptab[i].getX(), this.Ptab[i].getY(), x, y, ov);
	}
	dragObject(_x:number, _y:number) {
		// console.log("dragTo !");
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		var len = this.Ptab.length;
		for (var i = 0; i < len; i++) {
			this.Ptab[i].setXY(this.Ptab[i].getX() + vx, this.Ptab[i].getY() + vy);
		}
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.Cn.computeChilds(this.Ptab);
	}
	getAlphaBounds(anim, _p) {
		if (this.Ptab.length > 1) {
			if (!anim.hasOwnProperty("min")) {
				// Recherche du segment contenant le point :
				var c = this.getEdge(_p.getX(), _p.getY());
				anim.min = c.min;
				anim.max = c.max;
				anim.AM = c.AM;
				anim.AB = c.AB;
			}
			var inc =
				anim.direction * (anim.speed * anim.delay / 1000);
			anim.AM += inc;
			if (anim.AM > anim.AB) {
				anim.AM = anim.AM - anim.AB;
				anim.min = anim.max;
				anim.max = (anim.min === this.Ptab.length - 1) ? 0 : anim.min + 1;
				anim.AB = $U.d(this.Ptab[anim.min], this.Ptab[anim.max]);
			} else if (anim.AM < 0) {
				anim.max = anim.min;
				anim.min = (anim.max === 0) ? this.Ptab.length - 1 : anim.max - 1;
				anim.AB = $U.d(this.Ptab[anim.min], this.Ptab[anim.max]);
				anim.AM = anim.AB + anim.AM;
			}
			var x = this.Ptab[anim.min].getX() + (anim.AM / anim.AB) * (this.Ptab[anim.max].getX() - this.Ptab[anim.min].getX());
			var y = this.Ptab[anim.min].getY() + (anim.AM / anim.AB) * (this.Ptab[anim.max].getY() - this.Ptab[anim.min].getY());
			_p.setXY(x, y);
			this.setAlpha(_p);
		};
		return null;
	}
	getAnimationSpeedTab(): number[] {
		return [0, 20, 25, 50, 100, 200, 400, 500, 750, 1000, 1500];
	}
	getAnimationParams(x0, y0, mx, my) {
		var d = Math.sqrt((mx - x0) * (mx - x0) + (my - y0) * (my - y0));
		var fce = this.getAnimationSpeedTab();
		var f = Math.floor(d / (300 / fce.length));
		if (f >= fce.length) f = fce.length - 1;
		var c = this.getEdge(x0, y0);
		var xp = this.Ptab[c.min].getX();
		var yp = this.Ptab[c.min].getY();
		var ps = (xp - x0) * (mx - x0) + (yp - y0) * (my - y0);
		var dir = (ps > 0) ? 1 : -1;
		var px = fce[f] + " px/s";
		return {
			message: px + "",
			speed: fce[f],
			direction: dir,
			ar: false
		}
	}
	// ****************************************
	// ****************************************
	setBoundaryMode(_P) {
		var c = this.projectXY(_P.getX(), _P.getY());
		var d = (_P.getX() - c[0]) * (_P.getX() - c[0]) + (_P.getY() - c[1]) * (_P.getY() - c[1]);
		_P.setOnBoundary(d < 50);
	}
	projectXY(x:number, y:number) {
		var p = this.Ptab[0];
		var x1 = p.getX();
		var y1 = p.getY();
		var xstart = x1;
		var ystart = y1;
		var count = 0;
		var xmin = x1;
		var ymin = y1;
		var dmin = 1e20;
		var hmin = 0;
		for (var i = 1, len = this.Ptab.length; i < len; i++) {
			p = this.Ptab[i];
			var x2 = p.getX();
			var y2 = p.getY();
			var dx = x2 - x1;
			var dy = y2 - y1;
			var r = dx * dx + dy * dy;
			if (r > 1e-5) {
				var h = dx * (x - x1) / r + dy * (y - y1) / r;
				if (h > 1) {
					h = 1;
				} else if (h < 0) {
					h = 0;
				}
				var xh = x1 + h * dx;
				var yh = y1 + h * dy;
				var dist = Math.sqrt((x - xh) * (x - xh) + (y - yh) * (y - yh));
				if (dist < dmin) {
					dmin = dist;
					xmin = xh;
					ymin = yh;
					hmin = count + h;
				}
			}
			count++;
			x1 = x2;
			y1 = y2;
		}

		var x2 = xstart;
		var y2 = ystart;
		var dx = x2 - x1;
		var dy = y2 - y1;
		var r = dx * dx + dy * dy;
		if (r > 1e-5) {
			var h = dx * (x - x1) / r + dy * (y - y1) / r;
			if (h > 1) {
				h = 1;
			} else if (h < 0) {
				h = 0;
			}
			var xh = x1 + h * dx;
			var yh = y1 + h * dy;
			var dist = Math.sqrt((x - xh) * (x - xh) + (y - yh) * (y - yh));
			if (dist < dmin) {
				dmin = dist;
				xmin = xh;
				ymin = yh;
				hmin = count + h;
			}
		}
		return [xmin, ymin];
	}
	project(p) {
		var px = p.getX(),
			py = p.getY();
		if ((p.getOnBoundary()) || (!this.contains(px, py))) {
			var coords = this.projectXY(px, py);
			p.setXY(coords[0], coords[1]);
		}
	}
	projectAlpha(p) {
		var G = p.getAlpha();
		if (this.Ptab.length > 2) {
			var xa = this.Ptab[0].getX();
			var ya = this.Ptab[0].getY();
			var xb = this.Ptab[1].getX();
			var yb = this.Ptab[1].getY();
			var xc = this.Ptab[2].getX();
			var yc = this.Ptab[2].getY();
			var xm = xa + G[0] * (xb - xa) + G[1] * (xc - xa);
			var ym = ya + G[0] * (yb - ya) + G[1] * (yc - ya);
			p.setXY(xm, ym);
			this.project(p);
			if ((p.getX() !== xm) || (p.getY() !== ym)) {
				this.setAlpha(p);
			}
		}
	}
	setAlpha(p) {
		if (this.Ptab.length > 2) {
			var xAB = this.Ptab[1].getX() - this.Ptab[0].getX();
			var xAC = this.Ptab[2].getX() - this.Ptab[0].getX();
			var xAM = p.getX() - this.Ptab[0].getX();
			var yAB = this.Ptab[1].getY() - this.Ptab[0].getY();
			var yAC = this.Ptab[2].getY() - this.Ptab[0].getY();
			var yAM = p.getY() - this.Ptab[0].getY();
			var det = xAB * yAC - yAB * xAC;
			if (det !== 0) {
				p.setAlpha([(xAM * yAC - xAC * yAM) / det, (xAB * yAM - xAM * yAB) / det]);
			}
		}
	}
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb): Point[] {
		var PtsTab = []; // Liste des sommets du polygone représentant le lieu
		// Initialisation de this.Ptab :
		for (var i = 0; i < this.Ptab.length; i++) {
			PtsTab.push({
				"alpha": i,
				"x": 0,
				"y": 0,
				"x1": 0,
				"y1": 0,
				"r": 0
			});
		}
		PtsTab.push({
			"alpha": i,
			"x": 0,
			"y": 0,
			"x1": 0,
			"y1": 0,
			"r": 0
		});
		return PtsTab;
	}
	setLocusAlpha(p, a) {
		if (a < this.Ptab.length) {
			p.setXY(this.Ptab[a].getX(), this.Ptab[a].getY());
		} else if (a === this.Ptab.length) {
			p.setXY(this.Ptab[0].getX(), this.Ptab[0].getY());
		}
	}
	getValue() {
		return this.A;
	}
	compute() {
		this.X = 0;
		this.Y = 0;
		for (var i = 0, len = this.Ptab.length; i < len; i++) {
			if (isNaN(this.Ptab[i].getX())) {
				this.valid = false;
				this.X = NaN;
				this.Y = NaN;
				return;
			}
			this.X += this.Ptab[i].getX();
			this.Y += this.Ptab[i].getY();
		}
		this.X = this.X / this.Ptab.length;
		this.Y = this.Y / this.Ptab.length;
		// Calcul de l'aire :
		var sum = 0;
		var len = this.Ptab.length;
		for (var i = 1; i < len; i++) {
			sum += (this.Ptab[i].getX() - this.X) * (this.Ptab[i - 1].getY() - this.Y) - (this.Ptab[i].getY() - this.Y) * (this.Ptab[i - 1].getX() - this.X);
		}
		sum += (this.Ptab[0].getX() - this.X) * (this.Ptab[len - 1].getY() - this.Y) - (this.Ptab[0].getY() - this.Y) * (this.Ptab[len - 1].getX() - this.X);
		this.A = this.getCn().coordsSystem.a(Math.abs(sum / 2));
		this.valid = true;
	}
	paintLength(ctx:CanvasRenderingContext2D) {
		ctx.textAlign = "center";
		ctx.fillStyle = ctx.strokeStyle;
		var prec = this.getPrecision();
		var display = Math.round(this.A * prec) / prec;
		ctx.fillText($L.number(display), this.X, this.Y);
		ctx.restore();
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		if (this.valid) {
			ctx.beginPath();
			var len = this.Ptab.length;
			ctx.moveTo(this.Ptab[0].getX(), this.Ptab[0].getY());
			for (var i = 1; i < len; i++) {
				ctx.lineTo(this.Ptab[i].getX(), this.Ptab[i].getY());
			}
			ctx.lineTo(this.Ptab[0].getX(), this.Ptab[0].getY());
			ctx.closePath();
			ctx.fill();
			// if (this.getSize() > 0.5) ctx.stroke();
			if ((this.getSize() > 0.5) || (this.isIndicated()))
				ctx.stroke();
		}
	}
	getSource(src) {
		var len = this.Ptab.length;
		var pts = [];
		for (var i = 0; i < len; i++) {
			pts.push("_" + this.Ptab[i].getVarName());
		}
		src.geomWrite(true, this.getName(), "Polygon", pts.join(","));
	}
	// Seulement pour les macros :
	private getMacroFunc(nme, vn, i) {
		return function (src) {
			src.geomWrite(false, nme, "DefinitionPoint", vn, i);
		};
	}
	// Renvoie les caractéristiques du côté contenant
	// un point donné :
	private isInside(poly, x:number, y:number) {
		for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
			((poly[i].getY() <= y && y < poly[j].getY()) || (poly[j].getY() <= y && y < poly[i].getY())) && (x < (poly[j].getX() - poly[i].getX()) * (y - poly[i].getY()) / (poly[j].getY() - poly[i].getY()) + poly[i].getX()) && (c = !c);
		return c;
	}
	private getEdge(_xp:number, _yp:number) {
		var xp = _xp;
		var yp = _yp;
		var x0 = this.Ptab[0].getX();
		var y0 = this.Ptab[0].getY();
		var x1 = this.Ptab[1].getX();
		var y1 = this.Ptab[1].getY();
		var hmin = 0;
		var AM = Math.sqrt((x0 - xp) * (x0 - xp) + (y0 - yp) * (y0 - yp));
		var MB = Math.sqrt((x1 - xp) * (x1 - xp) + (y1 - yp) * (y1 - yp));
		var AB = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
		var nMB = MB;
		var nAM;// fixed a probable typo
		var nAB;
		for (var i = 2, len = this.Ptab.length; i < len; i++) {
			x0 = x1;
			y0 = y1;
			x1 = this.Ptab[i].getX();
			y1 = this.Ptab[i].getY();
			nAM = nMB;
			nMB = Math.sqrt((x1 - xp) * (x1 - xp) + (y1 - yp) * (y1 - yp));
			nAB = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
			if ((nAM + nMB - nAB) < (AM + MB - AB)) {
				hmin = i - 1;
				AM = nAM;
				MB = nMB;
				AB = nAB;
			}
		}
		x0 = x1;
		y0 = y1;
		x1 = this.Ptab[0].getX();
		y1 = this.Ptab[0].getY();
		nAM = nMB;
		nMB = Math.sqrt((x1 - xp) * (x1 - xp) + (y1 - yp) * (y1 - yp));
		nAB = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
		if ((nAM + nMB - nAB) < (AM + MB - AB)) {
			hmin = i - 1;
			AM = nAM;
			MB = nMB;
			AB = nAB;
		}
		var hmax = (hmin === this.Ptab.length - 1) ? 0 : hmin + 1;
		return {
			"min": hmin,
			"max": hmax,
			"AM": AM,
			"MB": MB,
			"AB": AB
		};
	}
	private contains(x, y): boolean {
		var npoints = this.Ptab.length;
		if (npoints <= 2) {
			return false;
		}
		var hits = 0;
		var lastx = this.Ptab[npoints - 1].getX();
		var lasty = this.Ptab[npoints - 1].getY();
		var curx = 0;
		var cury = 0;
		var test1;
		var test2;
		var leftx;
		for (var i = 0; i < npoints; lastx = curx, lasty = cury, i++) {
			var p = this.Ptab[i];
			curx = p.getX();
			cury = p.getY();
			if (cury === lasty) {continue;}
			if (curx < lastx) {if (x >= lastx) {continue;}
				leftx = curx;
			} else {
				if (x >= curx) {continue;}
				leftx = lastx;
			}
			if (cury < lasty) {
				if (y < cury || y >= lasty) {continue;}
				if (x < leftx) {
					hits++;
					continue;
				}
				test1 = x - curx;
				test2 = y - cury;
			} else {
				if (y < lasty || y >= cury) {continue;}
				if (x < leftx) {
					hits++;
					continue;
				}
				test1 = x - lastx;
				test2 = y - lasty;
			}
			if (test1 < (test2 / (lasty - cury) * (lastx - curx))) {hits++;}
		}
		return (hits & 1) !== 0;
	}
}
