
import {ConstructionObject} from './ConstructionObject';

var $U = (<any>window).$U;

/**
 * Issues with undefined methods: startDragX, startDragY AGAIN!!??
 * undefined getP2
 * misterious _P1 lurking around... must review: changed to `this.P1`
 */

export class PrimitiveLineObject extends ConstructionObject {
	protected DX: number;
	protected DY: number;
	protected NDX: number;
	protected NDY: number;
	protected xmin: number;
	protected ymin: number;
	protected xmax: number;
	protected ymax: number;
	protected lastxmin: number;
	protected lastymin: number;
	protected lastxmax: number;
	protected lastymax: number;
	protected P1;// defined as public in the original
	protected P2;// added by me
	constructor(_construction:iConstruction, _name:string, _P1) {
		super(_construction, _name);
		//$U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		this.DX = 0;
		this.DY = 0;
		this.NDX = 0;
		this.NDY = 0;
		this.xmin;
		this.ymin;
		this.xmax;
		this.ymax;
		this.lastxmin;
		this.lastymin;
		this.lastxmax;
		this.lastymax;
		this.P1 = _P1;
		this.setDefaults("line");
	}
	getAssociatedTools(): string {
		var at = "@callproperty,@calltrash,point,parallel,plumb,syma";
		if (this.getCn().findPtOn(this) !== null) {
			at += ",locus";
		}
		if (this.isMoveable()) {
			at += ",@objectmover";
		}
		return at;
	}
	isCoincident(_C): boolean {
		if (_C.isInstanceType("line")) {
			// Si les droites (segments) sont confondus :
			if ($U.approximatelyEqual(this.NDX, _C.getNDX()) && $U.approximatelyEqual(this.NDY, _C.getNDY())) {return true;}
			if ($U.approximatelyEqual(-this.NDX, _C.getNDX()) && $U.approximatelyEqual(-this.NDY, _C.getNDY())) {return true;}
		}
		return false;
	}
	getXmax(): number {
		return this.xmax;
	}
	getYmax(): number {
		return this.ymax;
	}
	getXmin(): number {
		return this.xmin;
	}
	getYmin(): number {
		return this.ymin;
	}
	isInstanceType(_c) {
		return (_c === "line");
	}
	getFamilyCode() {
		return "line";
	}
	// ****************************************
	// **** Uniquement pour les animations ****
	// ****************************************
	getAlphaBounds(anim): number[] {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var w = this.getWidth();
		var h = this.getHeight();
		var dx = this.NDX;
		var dy = this.NDY;
		var tsort = (a, b) => a - b;
		var t = (dy === 0)
			? [-xA / dx, (w - xA) / dx]
			: ((dx === 0) ? [-yA / dy, (h - yA) / dy] : [-xA / dx, (w - xA) / dx, -yA / dy, (h - yA) / dy]);
		t.sort(tsort);
		if (t.length === 4) {
			t.splice(0, 1);
			t.splice(2, 1);
		}
		var d = Math.sqrt((t[1] - t[0]) * (t[1] - t[0]) * (dx * dx + dy * dy));
		var inc = Math.abs(t[1] - t[0]) * anim.direction * (anim.speed * anim.delay / 1000) / d;
		return [t[0], t[1], inc]
	}
	getAnimationSpeedTab(): number[] {
		return [0, 1, 5, 10, 25, 50, 100, 200, 300, 500, 800, 1000, 1500];
	}
	getAnimationParams(x0:number, y0:number, x1:number, y1:number) {
		var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var fce = this.getAnimationSpeedTab();
		var f = Math.floor(d / (400 / fce.length));
		if (f >= fce.length) f = fce.length - 1;
		var ps = this.NDX * (x1 - x0) + this.NDY * (y1 - y0);
		var dir = (ps > 0) ? -1 : 1;
		var dom = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var aller_retour = (Math.abs(ps / dom) < 0.707);
		return {
			message: aller_retour ? fce[f] + " px/s \u21C4" : fce[f] + " px/s",
			speed: fce[f],
			direction: dir,
			ar: aller_retour
		}
	}
	// ****************************************
	// ****************************************
	setDXDY(_x0:number, _y0:number, _x1:number, _y1:number) {
		this.DX = _x1 - _x0;
		this.DY = _y1 - _y0;
		var n = Math.sqrt(this.DX * this.DX + this.DY * this.DY);
		this.NDX = this.DX / n;
		this.NDY = this.DY / n;
		// En 2D, on normalise :
		if (!this.is3D()) {
			this.DX = this.NDX;
			this.DY = this.NDY;
		}
	}
	getNDX(): number {
		return this.NDX;
	}
	getNDY(): number {
		return this.NDY;
	}
	getDX(): number {
		return this.DX;
	}
	getDY(): number {
		return this.DY;
	}
	getP1() {
		return this.P1;
	}
	mouseInside(ev:MouseEvent) {
		return $U.isNearToLine(this.P1.getX(), this.P1.getY(), this.NDX, this.NDY, this.mouseX(ev), this.mouseY(ev), this.getOversize());
	}
	dragObject(_x:number, _y:number) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.P1.setXY(this.P1.getX() + vx, this.P1.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.compute();
		this.computeChilds();
	}
	// Calcule les coordonnées du symétrique d'un point _M par rapport à moi :
	reflect(_M, _P) {
		var x1 = this.P1.getX();
		var y1 = this.P1.getY();
		var x2 = _M.getX();
		var y2 = _M.getY();
		var dxy = this.NDX * this.NDY;
		var dx2 = this.NDX * this.NDX;
		var dy2 = this.NDY * this.NDY;
		var d = dx2 + dy2;
		var xP = (2 * dxy * (y2 - y1) + dy2 * (2 * x1 - x2) + dx2 * x2) / d;
		var yP = (2 * dxy * (x2 - x1) + dx2 * (2 * y1 - y2) + dy2 * y2) / d;
		_P.setXY(xP, yP);
	}
	intersectLineCircle(_C, _P) {
		var x = _C.getP1().getX();
		var y = _C.getP1().getY();
		var r = _C.getR();
		var d = (x - this.getP1().getX()) * this.NDY - (y - this.getP1().getY()) * this.NDX;
		// Si le cercle et la droite sont tangents :
		if (Math.abs(r - Math.abs(d)) < 1e-12) {
			var c = this.projectXY(x, y);
			_P.setXY(c[0], c[1]);
			return;
		}
		x -= d * this.NDY;
		y += d * this.NDX;
		var h = r * r - d * d;
		if (h >= 0) {
			h = Math.sqrt(h);
			var hDX = h * this.NDX;
			var hDY = h * this.NDY;
			if (_P.getAway()) {
				_P.getAway().near(x + hDX, y + hDY)
					? _P.setXY(x - hDX, y - hDY)
					: _P.setXY(x + hDX, y + hDY);
			} else {
				_P.getOrder() === 0
					? _P.setXY(x + hDX, y + hDY)
					: _P.setXY(x - hDX, y - hDY);
			}
		} else {
			_P.setXY(NaN, NaN);
		}
	}
	intersectLineLine(_D, _P) {
		var dxA = this.NDX;
		var dyA = this.NDY;
		var dxB = _D.getNDX();
		var dyB = _D.getNDY();
		var det = dxB * dyA - dxA * dyB;
		if (det !== 0) {
			var A = this.P1;
			var B = _D.P1;
			var num1 = dyA * A.getX() - dxA * A.getY();
			var num2 = dxB * B.getY() - dyB * B.getX();
			// if (_P.getName() === "N") {
			//     console.log("intersectLineLine");
			//     console.log(((dxB * num1 + dxA * num2) / det));
			//     console.log(((dyB * num1 + dyA * num2) / det));
			// }
			_P.setXY((dxB * num1 + dxA * num2) / det, (dyB * num1 + dyA * num2) / det);
		}
	}
	intersectLineQuadric(_Q, _P) {
		var c = this.intersectLineQuadricXY(_Q);
		if (c.length === 0) {
			_P.setXY(NaN, NaN);
		} else {
			if (_P.getAway()) {
				_P.getAway().near(c[0], c[1])
					? _P.setXY(c[2], c[3])
					: _P.setXY(c[0], c[1]);
			} else {
				_P.getOrder() === 0
					? _P.setXY(c[0], c[1])
					: _P.setXY(c[2], c[3]);
			}
		}
	}
	intersect(_C, _P) {
		if (_C.isInstanceType("line")) {
			this.intersectLineLine(_C, _P);
		} else if (_C.isInstanceType("circle")) {
			this.intersectLineCircle(_C, _P);
		} else if (_C.isInstanceType("quadric")) {
			this.intersectLineQuadric(_C, _P);
		}
	}
	initIntersect2(_C, _P) {
		if (_C.isInstanceType("circle")) {
			var x = _C.getP1().getX(),
				y = _C.getP1().getY();
			var r = _C.getR();
			var d = (x - this.getP1().getX()) * this.NDY - (y - this.getP1().getY()) * this.NDX;
			x -= d * this.NDY;
			y += d * this.NDX;
			var h = r * r - d * d;
			if (h > 0) {
				h = Math.sqrt(h);
				var x0 = x + h * this.NDX,
					y0 = y + h * this.NDY,
					x1 = x - h * this.NDX,
					y1 = y - h * this.NDY;
				var d0 = (_P.getX() - x0) * (_P.getX() - x0) + (_P.getY() - y0) * (_P.getY() - y0);
				var d1 = (_P.getX() - x1) * (_P.getX() - x1) + (_P.getY() - y1) * (_P.getY() - y1);
				if (d0 < d1) {
					_P.setOrder(0);
					_P.setXY(x0, y0);
					// Si l'un des points constituant de la droite est sur l'autre
					// intersection, il faut en rester loin :
					if (this.P1.near(x1, y1)) {
						_P.setAway(this.P1);
					} else if ((this.getCode() === "line") && this.P2.near(x1, y1)) {
						_P.setAway(this.P2);
					}
					// Si l'un des points constituant du cercle est sur l'autre
					// intersection, il faut en rester loin :
					else if (_C.P1.near(x1, y1)) {
						_P.setAway(_C.P1);
					} else if ((_C.getCode() === "circle") && _C.P2.near(x1, y1)) {
						_P.setAway(_C.P2);
					}
				} else {
					_P.setOrder(1);
					_P.setXY(x1, y1);
					// Si l'un des points constituant de la droite est sur l'autre
					// intersection, il faut en rester loin :
					if (this.P1.near(x0, y0))
						_P.setAway(this.P1);
					else if ((this.getCode() === "line") && this.P2.near(x0, y0))
						_P.setAway(this.P2);
					// Si l'un des points constituant du cercle est sur l'autre
					// intersection, il faut en rester loin :
					else if (_C.P1.near(x0, y0))
						_P.setAway(_C.P1);
					else if ((_C.getCode() === "circle") && _C.P2.near(x0, y0))
						_P.setAway(_C.P2);
				}
			}
		} else if (_C.isInstanceType("quadric")) {
			//            console.log("yes !!");
			var c = this.intersectLineQuadricXY(_C);
			var d0 = (_P.getX() - c[0]) * (_P.getX() - c[0]) + (_P.getY() - c[1]) * (_P.getY() - c[1]);
			var d1 = (_P.getX() - c[2]) * (_P.getX() - c[2]) + (_P.getY() - c[3]) * (_P.getY() - c[3]);
			if (d0 < d1) {
				_P.setOrder(0);
				_P.setXY(c[0], c[1]);
				// Si l'un des points constituant de la droite est sur l'autre
				// intersection, il faut en rester loin :
				if (this.P1.near(c[2], c[3]))
					_P.setAway(this.P1);
				else if ((this.getCode() === "line") && this.P2.near(c[2], c[3]))
					_P.setAway(this.P2);
			} else {
				_P.setOrder(1);
				_P.setXY(c[2], c[3]);
				// Si l'un des points constituant de la droite est sur l'autre
				// intersection, il faut en rester loin :
				if (this.P1.near(c[0], c[1]))
					_P.setAway(this.P1);
				else if ((this.getCode() === "line") && this.P2.near(c[0], c[1]))
					_P.setAway(this.P2);
			}
		}
	}
	// Calcule les coordonnées du symétrique d'un point P(_x;_y) par rapport à moi :
	reflectXY(_x:number, _y:number) {
		var x1 = this.P1.getX();
		var y1 = this.P1.getY();
		var dxy = this.NDX * this.NDY;
		var dx2 = this.NDX * this.NDX;
		var dy2 = this.NDY * this.NDY;
		var d = dx2 + dy2;
		var xM = (2 * dxy * (_y - y1) + dy2 * (2 * x1 - _x) + dx2 * _x) / d;
		var yM = (2 * dxy * (_x - x1) + dx2 * (2 * y1 - _y) + dy2 * _y) / d;
		return [xM, yM];
	}
	intersectXY(_C, _x:number, _y:number) {
		if (_C.isInstanceType("circle")) {
			var x = _C.getP1().getX();
			var y = _C.getP1().getY();
			var r = _C.getR();
			var d = (x - this.getP1().getX()) * this.NDY - (y - this.getP1().getY()) * this.NDX;
			x -= d * this.NDY;
			y += d * this.NDX;
			var h = r * r - d * d;
			if (h > 0) {
				h = Math.sqrt(h);
				var x0 = x + h * this.NDX;
				var y0 = y + h * this.NDY;
				var x1 = x - h * this.NDX;
				var y1 = y - h * this.NDY;
				var d0 = (_x - x0) * (_x - x0) + (_y - y0) * (_y - y0);
				var d1 = (_x - x1) * (_x - x1) + (_y - y1) * (_y - y1);
				return d0 < d1 ? [x0, y0] : [x1, y1];
			}
		} else if (_C.isInstanceType("line")) {
			var dxA = this.NDX;
			var dyA = this.NDY;
			var dxB = _C.getNDX();
			var dyB = _C.getNDY();
			var det = dxB * dyA - dxA * dyB;
			if (det !== 0) {
				var A = this.P1;
				var B = _C.P1;
				var num1 = dyA * A.getX() - dxA * A.getY();
				var num2 = dxB * B.getY() - dyB * B.getX();
				return [(dxB * num1 + dxA * num2) / det, (dyB * num1 + dyA * num2) / det];
			}
		} else if (_C.isInstanceType("quadric")) {
			var c = this.intersectLineQuadricXY(_C);
			var d0 = (_x - c[0]) * (_x - c[0]) + (_y - c[1]) * (_y - c[1]);
			var d1 = (_x - c[2]) * (_x - c[2]) + (_y - c[3]) * (_y - c[3]);
			return d0 < d1 ? [c[0], c[1]] : [c[2], c[3]];
		}
	}
	projectXY(_x:number, _y:number) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var AB2 = this.DX * this.DX + this.DY * this.DY;
		var ABMA = this.DX * (xA - _x) + this.DY * (yA - _y);
		return [xA - (this.DX * ABMA) / AB2, yA - (this.DY * ABMA) / AB2];
	}
	project(p) {
		var coords = this.projectXY(p.getX(), p.getY());
		p.setXY(coords[0], coords[1]);
	}
	projectAlpha(p) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var a = p.getAlpha();
		p.setXY(xA + a * this.DX, yA + a * this.DY);
	}
	setAlpha(p) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var xp = p.getX();
		var yp = p.getY();
		if (Math.abs(xA - xp) > 1e-12) {
			p.setAlpha((xp - xA) / this.DX);
		} else if (Math.abs(yA - yp) > 1e-12) {
			p.setAlpha((yp - yA) / this.DY);
		} else {
			p.setAlpha(0);
		}
	}
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb:number, _linear:boolean) {
		var f = _linear ? x => x : this.f1;
		var aMax = Math.floor(_nb / 2);
		var aMin = -aMax;
		var fmax = f(aMax);
		var Ptab = []; // Liste des sommets du polygone représentant le lieu
		// Initialisation de Ptab :
		for (var i = aMin; i < aMax; i++) {
			var a = this.sign(i) * Math.abs(f(i) / fmax) * 1000;
			Ptab.push({
				"alpha": a,
				"x": 0,
				"y": 0,
				"x1": 0,
				"y1": 0,
				"r": 0
			});
		}
		return Ptab;
	}
	setLocusAlpha(p, a) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		p.setXY(xA + a * this.NDX, yA + a * this.NDY);
	}
	compute() {
		var t = $U.computeBorderPoints(this.P1.getX(), this.P1.getY(), this.NDX, this.NDY, this.getWidth(), this.getHeight());
		this.xmin = t[0];
		this.ymin = t[1];
		this.xmax = t[2];
		this.ymax = t[3];
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.xmin, this.ymin);
		ctx.lineTo(this.xmax, this.ymax);
		ctx.stroke();
	}
	beginTrack() {
		var t = $U.computeBorderPoints(this.P1.getX(), this.P1.getY(), this.NDX, this.NDY, this.getWidth(), this.getHeight());
		this.lastxmin = t[0];
		this.lastymin = t[1];
		this.lastxmax = t[2];
		this.lastymax = t[3];
	}
	drawTrack(ctx:CanvasRenderingContext2D) {
		if (!isNaN(this.xmin) && !isNaN(this.ymin) && !isNaN(this.xmax) && !isNaN(this.ymax)) {
			if ((this.xmin !== this.lastxmin) || (this.ymin != this.lastymin) || (this.xmax != this.lastxmax) || (this.ymax != this.lastymax)) {
				ctx.strokeStyle = this.getColor().getRGBA();
				ctx.lineWidth = this.getSize();
				ctx.lineCap = 'round';
				if (!isNaN(this.lastxmin) && !isNaN(this.lastymin) && !isNaN(this.lastxmax) && !isNaN(this.lastymax)) {
					ctx.beginPath();
					switch (this.getCode()) {
						case "ray":
							ctx.moveTo(this.getP1().getX(), this.getP1().getY());
							ctx.lineTo(this.xmax, this.ymax);
							break;
						case "segment":
							ctx.moveTo(this.getP1().getX(), this.getP1().getY());
							ctx.lineTo(this.getP2().getX(), this.getP2().getY());
							break;
						default:
							ctx.moveTo(this.xmin, this.ymin);
							ctx.lineTo(this.xmax, this.ymax);
							break;
					}
					ctx.stroke();
				}
			}
		}
		this.lastxmin = this.xmin;
		this.lastymin = this.ymin;
		this.lastxmax = this.xmax;
		this.lastymax = this.ymax;
	}
	// Alpha, dans le repère coordsSystem de l'objet Construction.
	// (for CaRMetal .zir translation)
	transformAlpha(alpha:number) {
		var x = this.getCn().coordsSystem.x(this.NDX) - this.getCn().coordsSystem.x(0);
		var y = this.getCn().coordsSystem.y(this.NDY) - this.getCn().coordsSystem.y(0);
		return alpha * Math.sqrt(x * x + y * y);
	}
	private intersectLineQuadricXY(_Q): number[] {
		// compute the intersection coordinates of a line with a quadric
		// done with XCAS :
		var X = _Q.getCoeffs();
		var M = -this.NDY;
		var N2 = this.NDX;
		var P = -(M * this.P1.getX() + N2 * this.P1.getY());
		var A = X[0];
		var B = X[1];
		var C = X[2];
		var D = X[3];
		var E = X[4];
		var F = X[5];
		var x1 = 0;
		var x2 = 0;
		var y1 = 0;
		var y2 = 0;
		if (N2 != 0) {
			var part1 = -2 * B * M * P - C * N2 * N2 + D * M * N2 + E * N2 * P;
			var part2 = Math.abs(N2) * Math.sqrt(-2 * M * D * N2 * C + 4 * P * D * A * N2 + 4 * P * M * B * C + 4 * E * M * N2 * F - 2 * E * P * N2 * C - 2 * E * P * M * D - 4 * M * M * B * F - 4 * P * P * A * B - 4 * A * N2 * N2 * F + N2 * N2 * C * C + M * M * D * D + E * E * P * P);
			var part3 = 2 * A * N2 * N2 + 2 * B * M * M + (-2 * E) * M * N2;
			x1 = (part1 + part2) / part3;
			if (isNaN(x1)) {
				return [];
			}
			y1 = (-M * x1 - P) / N2;
			x2 = (part1 - part2) / part3;
			y2 = (-M * x2 - P) / N2;
			if (((x2 - x1) / this.NDX) < 0) {
				return [x2, y2, x1, y1];
			}
		} else {
			x1 = -P / M;
			x2 = x1;
			var part1 = -D * M * M + E * M * P;
			var part2 = Math.abs(M) * Math.sqrt(4 * P * M * B * C - 2 * E * P * M * D - 4 * M * M * B * F - 4 * P * P * A * B + M * M * D * D + E * E * P * P);
			var part3 = 2 * M * M * B;
			y1 = (part1 + part2) / part3;
			if (isNaN(y1)) {
				return [];
			}
			y2 = (part1 - part2) / part3;
			if (((y2 - y1) / this.NDY) < 0) {
				return [x2, y2, x1, y1];
			}
		}
		return [x1, y1, x2, y2];
	}
	private f1(x:number): number {
		return x * x * x;
	}
	private sign(x:number): number {
		return x < 0 ? -1 : 1;
	}
}
