
import {ConstructionObject} from './ConstructionObject';
import {VirtualPointObject} from './VirtualPointObject';

var $U = (<any>window).$U;

/**
 * Issues with undefined methods: startDragX, startDragY AGAIN!!??
 * Redeclaration of variables in very long math operation
 */

export class QuadricObject extends ConstructionObject {
	protected MTH;
	protected P;
	protected X: number[];
	protected NB: number;
	protected Ptab;
	protected PtabRow;
	protected MIN;
	protected MAX;
	protected STEP;
	protected FOCI;
	constructor(_construction:iConstruction, _name:string, _P1, _P2, _P3, _P4, _P5) {
		super(_construction, _name);
		// $U.extend(this, new ConstructionObject(_construction, _name));
		// $U.extend(this, new MoveableObject(_construction)); // Héritage
		// Récupération de l'objet Math situé dans le scope de la fenêtre de l'interpréteur
		// pour le calcul sur les complexes :
		this.MTH = this.Cn.getInterpreter().getMath();
		this.P = [_P1, _P2, _P3, _P4, _P5];
		this.X = [0, 0, 0, 0, 0, 0]; // Coefficient de l'équation de la conique
		this.setParent(_P1, _P2, _P3, _P4, _P5);
		this.NB = 500;
		this.Ptab = []; // Tableau de tableaux représentant les parties connexes de la conique
		this.PtabRow = []; // Tous les points de la conique
		this.MIN;
		this.MAX;
		this.STEP;
		this.FOCI = [];
		this.setPrecision(500);
		this.setDefaults("quadric");
	}
	getCoeffs(): number[] {
		return this.X;
	}
	getCode(): string {
		return "quadric";
	}
	getFamilyCode(): string {
		return "quadric";
	}
	isInstanceType(_c): boolean {
		return _c === "quadric";
	}
	getAssociatedTools(): string {
		return "point,@callproperty,@calltrash,@callcalc";
	}
	getPrecision(): number {
		return this.NB;
	}
	getRealPrecision(): number {
		return this.NB;
	}
	setPrecision(_prec) {
		_prec = parseInt(_prec);
		this.NB = (_prec === 0) ? 1000 : _prec; // Compatibilité avec les anciens lieux
	}
	// Seulement pour les macros :
	setMacroAutoObject() {
		var vn = this.getVarName();
		for (var i = 0, len = this.P.length; i < len; i++) {
			var Pt = this.P[i];
			Pt.setMacroMode(1);
			Pt.setMacroSource(this.getMacroFunc(Pt.getVarName(), vn, i));
		}
	}
	// Seulement pour les macros :
	isAutoObjectFlags() {
		var fl = false;
		for (var i = 0; i < this.P.length; i++) {
			fl = fl || this.P[i].Flag;
		}
		return fl;
	}
	// Seulement pour les macros :
	getPt(_i:number) {
		return this.P[_i];
	}
	mouseInside(event:MouseEvent): boolean {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		for (var i = 0, len = this.PtabRow.length; i < len; i++) {
			if ($U.isNearToPoint(this.PtabRow[i].x, this.PtabRow[i].y, mx, my, this.getOversize()))
				return true;
		}
		return false;
	}
	isMoveable(): boolean {
		// Si les extrémités sont des points libres :
		if ((this.P[0].getParentLength() === 0) && (this.P[1].getParentLength() === 0) &&
			(this.P[2].getParentLength() === 0) && (this.P[3].getParentLength() === 0) &&
			(this.P[4].getParentLength() === 0))
			return true;
		return false;
	}
	dragObject(_x:number, _y:number) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.P[0].setXY(this.P[0].getX() + vx, this.P[0].getY() + vy);
		this.P[1].setXY(this.P[1].getX() + vx, this.P[1].getY() + vy);
		this.P[2].setXY(this.P[2].getX() + vx, this.P[2].getY() + vy);
		this.P[3].setXY(this.P[3].getX() + vx, this.P[3].getY() + vy);
		this.P[4].setXY(this.P[4].getX() + vx, this.P[4].getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.Cn.computeChilds(this.P);
	}
	// Pour le preview dans PointConstructor :
	intersectXY(_C, _x:number, _y:number) {
		if (_C.isInstanceType("quadric")) {
			var Pts = this.intersectQuadricQuadricXY(_C.getCoeffs());
			var p = _x;
			var q = _y;
			var dmin = NaN;
			var pos = 0;
			for (var i = 0; i < Pts.length; i++) {
				var dd = (Pts[i][0] - p) * (Pts[i][0] - p) + (Pts[i][1] - q) * (Pts[i][1] - q);
				if ((isNaN(dmin)) || (dd < dmin)) {
					dmin = dd;
					pos = i;
				}
			}
			return [Pts[pos][0], Pts[pos][1]];
		}
	}
	// Actualisation de la position pour le compute du point :
	intersect(_C, _P) {
		if (_C.isInstanceType("quadric")) {
			var Pts = this.intersectQuadricQuadricXY(_C.getCoeffs());
			_P.setXY(Pts[_P.getOrder()][0], Pts[_P.getOrder()][1]);
		}
	}
	// Pour la création de l'objet dans PointConstructor :
	initIntersect2(_C, _P) {
		if (_C.isInstanceType("quadric")) {
			// console.log("_C.getCoeffs()=" + _C.getCoeffs());
			var Pts = this.intersectQuadricQuadricXY(_C.getCoeffs());
			var p = _P.getX();
			var q = _P.getY();
			var dmin = NaN;
			var pos = 0;
			for (var i = 0; i < Pts.length; i++) {
				// console.log("i=" + i + "  Pts[i][0]=" + Pts[i][0]);
				var dd = (Pts[i][0] - p) * (Pts[i][0] - p) + (Pts[i][1] - q) * (Pts[i][1] - q);
				if ((isNaN(dmin)) || (dd < dmin)) {
					dmin = dd;
					pos = i;
				}
			}
			_P.setOrder(pos);
			_P.setXY(Pts[pos][0], Pts[pos][1]);
		}
	}
	projectXY(p, q) {
		// Le système à résoudre pour trouver le projeté d'un point
		// sur une conique se ramène à la recherche de l'intersection
		// de deux coniques :
		var Pts = this.intersectQuadricQuadricXY([this.X[4] / 2, -this.X[4] / 2, this.X[3] / 2 - p * this.X[4] / 2 + this.X[0] * q, this.X[4] / 2 * q - p * this.X[1] - this.X[2] / 2, this.X[1] - this.X[0], this.X[2] / 2 * q - p * this.X[3] / 2]);
		var dmin = NaN;
		var pos = 0;
		for (var i = 0; i < Pts.length; i++) {
			var dd = (Pts[i][0] - p) * (Pts[i][0] - p) + (Pts[i][1] - q) * (Pts[i][1] - q);
			if ((isNaN(dmin)) || (dd < dmin)) {
				dmin = dd;
				pos = i;
			}
		}
		return Pts[pos];
	}
	// Ancienne méthode laissée là pour comparaison 
	projectXY2(_x:number, _y:number): number[] {
		var xAB = (this.PtabRow[0].x - _x);
		var yAB = (this.PtabRow[0].y - _y);
		var d2 = xAB * xAB + yAB * yAB;
		var d1 = 0;
		var k = 0;
		for (var i = 1, len = this.PtabRow.length; i < len; i++) {
			xAB = (this.PtabRow[i].x - _x);
			yAB = (this.PtabRow[i].y - _y);
			d1 = xAB * xAB + yAB * yAB;
			if (d1 < d2) {
				k = i;
				d2 = d1;
			}
		}
		return [this.PtabRow[k].x, this.PtabRow[k].y];
	}
	project(p) {
		var coords = this.projectXY(p.getX(), p.getY());
		p.setXY(coords[0], coords[1]);
	}
	projectAlpha(p) {
		var G = p.getAlpha();
		if (($U.isArray(G)) && (G.length === 2)) {
			var AA = this.P[0];
			var BB = this.P[1];
			var CC = this.P[2];
			var xa = AA.getX();
			var ya = AA.getY();
			var xb = BB.getX();
			var yb = BB.getY();
			var xc = CC.getX();
			var yc = CC.getY();
			var xm = xa + G[0] * (xb - xa) + G[1] * (xc - xa);
			var ym = ya + G[0] * (yb - ya) + G[1] * (yc - ya);
			p.setXY(xm, ym);
			this.project(p);
			// if ((p.getX() !== xm) || (p.getY() !== ym)) {
			//	this.setAlpha(p);
			// }
		} else {
			// Compatibilité avec les "anciennes" figures :
			if (this.PtabRow.length === 0) {return;}
			var k = p.getAlpha();
			if (k < 0)
				k = 0;
			if (k > this.PtabRow.length - 1)
				k = this.PtabRow.length - 1;
			p.setXY(this.PtabRow[k].x, this.PtabRow[k].y);
			this.setAlpha(p);
		}
	}
	setAlpha(p) {
		var AA = this.P[0];
		var BB = this.P[1];
		var CC = this.P[2];
		var a = BB.getX() - AA.getX();
		var b = CC.getX() - AA.getX();
		var c = p.getX() - AA.getX();
		var d = BB.getY() - AA.getY();
		var e = CC.getY() - AA.getY();
		var f = p.getY() - AA.getY();
		var det = a * e - d * b;
		if (det !== 0) {
			p.setAlpha([(c * e - b * f) / det, (a * f - c * d) / det]);
		}
	}
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb) {
		var step = 1;
		var Ptab = []; // Liste des sommets du polygone représentant le lieu
		// Initialisation de Ptab :
		for (var i = 0; i < this.NB; i++) {
			Ptab.push({
				"alpha": i,
				"x": 0,
				"y": 0,
				"x1": 0,
				"y1": 0,
				"r": 0
			});
		}
		return Ptab;
	}
	setLocusAlpha(p, a:number) {
		if (this.PtabRow[a] !== undefined) {
			p.setXY(this.PtabRow[a].x, this.PtabRow[a].y);
		}
	}
	center() {
		// pour ax^2 + 2bxy + cy^2 + 2dx + 2ey + f = 0
		//        var a = this.X[0], b = this.X[4] / 2, c = this.X[1], d = this.X[2] / 2, e = this.X[3] / 2, f = this.X[5];
		//        var det = a * c - b * b;
		//        var x0 = (b * e - c * d) / det;
		//        var y0 = (b * d - a * e) / det;
		//        x0 = this.Cn.coordsSystem.x(x0);
		//        y0 = this.Cn.coordsSystem.y(y0);
		//        return [x0, y0];
		var M = this.MTH.quotient(this.MTH.plus(this.FOCI[0], this.FOCI[1]), 2);
		return this.Cn.coordsSystem.xy(M);
	}
	foci() {
		//        // pour ax^2 + 2bxy + cy^2 + 2dx + 2ey + f = 0
		//        var a = this.X[0], b = this.X[4] / 2, c = this.X[1], d = this.X[2] / 2, e = this.X[3] / 2, f = this.X[5];
		//        var A = [b * b - a * c, 0];
		//        var B = [c * d - b * e, a * e - b * d];
		//        var C = [e * e - d * d + f * (a - c), 2 * (b * f - d * e)];
		//
		////         Résolution de l'équation complexe Az^2+2Bz+C=0 :
		////         Racine du discriminant réduit :
		//        var SQ = this.MTH.csqrt(this.MTH.minus(this.MTH.times(B, B), this.MTH.times(A, C)))[0];
		//        var z1 = this.MTH.quotient(this.MTH.plus(B, SQ), A);
		//        var z2 = this.MTH.quotient(this.MTH.minus(B, SQ), A);
		//        return [this.Cn.coordsSystem.xy(z1), this.Cn.coordsSystem.xy(z2)];
		return [this.Cn.coordsSystem.xy(this.FOCI[0]), this.Cn.coordsSystem.xy(this.FOCI[1])];
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		for (var i = 0, len1 = this.Ptab.length; i < len1; i++) {
			var tab = this.Ptab[i];
			ctx.beginPath();
			ctx.moveTo(tab[0].x, tab[0].y);
			for (var k = 0, len2 = tab.length; k < len2; k++) {
				ctx.lineTo(tab[k].x, tab[k].y);
			}
			ctx.stroke();
			ctx.fill();
		}
	}
	compute() {
		var x01 = this.P[1].getX() - this.P[0].getX();
		var y01 = this.P[1].getY() - this.P[0].getY();
		var x02 = this.P[2].getX() - this.P[0].getX();
		var y02 = this.P[2].getY() - this.P[0].getY();
		var x03 = this.P[3].getX() - this.P[0].getX();
		var y03 = this.P[3].getY() - this.P[0].getY();
		var x04 = this.P[4].getX() - this.P[0].getX();
		var y04 = this.P[4].getY() - this.P[0].getY();
		// Test très grossier (rapidité) pour le cas ou les trois
		// premiers points sont alignés, on fait comme si les 5 l'étaient
		// et on affiche un segment (pour la 3D) :
		if ((Math.abs(x01 * y02 - x02 * y01) < 1e-10) || (Math.abs(x01 * y03 - x03 * y01) < 1e-10) || (Math.abs(x01 * y04 - x04 * y01) < 1e-10)) {
			var x0 = Math.min(this.P[0].getX(), this.P[1].getX(), this.P[2].getX(), this.P[3].getX(), this.P[4].getX());
			var y0 = Math.max(this.P[0].getY(), this.P[1].getY(), this.P[2].getY(), this.P[3].getY(), this.P[4].getY());
			var x1 = Math.max(this.P[0].getX(), this.P[1].getX(), this.P[2].getX(), this.P[3].getX(), this.P[4].getX());
			var y1 = Math.min(this.P[0].getY(), this.P[1].getY(), this.P[2].getY(), this.P[3].getY(), this.P[4].getY());
			this.Ptab = [];
			this.PtabRow = [];
			var tab = [];
			tab.push({ x: x0, y: y0 });
			tab.push({ x: x1, y: y1 });
			this.Ptab.push(tab);
			return;
		}
		var A = [];
		for (var i = 0; i < 5; i++) {
			var x = this.P[i].getX();
			var y = this.P[i].getY();
			A[i] = [x * x, y * y, x, y, x * y, 1];
			var sum = 0;
			for (var j = 0; j < 6; j++) {sum += A[i][j] * A[i][j];}
			sum = Math.sqrt(sum);
			for (var j = 0; j < 6; j++) {A[i][j] /= sum;}
		}
		var r = 0;
		var colindex = [];
		for (var c = 0; c < 6; c++) {
			if (r >= 5) {
				colindex[c] = -1;
				continue;
			}
			var max = Math.abs(A[r][c]);
			var imax = r;
			for (var i = r + 1; i < 5; i++) {
				var h = Math.abs(A[i][c]);
				if (h > max) {
					max = h;
					imax = i;
				}
			}
			if (max > 1e-13) {
				if (imax != r) {
					var h = A[imax];
					A[imax] = A[r];
					A[r] = h;
				}
				for (var i = r + 1; i < 5; i++) {
					var lambda = A[i][c] / A[r][c];
					for (var j = c + 1; j < 6; j++) {A[i][j] -= lambda * A[r][j];}
				}
				colindex[c] = r;
				r++;
			} else {
				colindex[c] = -1;
			}
		}

		for (var j = 5; j >= 0; j--) {
			if (colindex[j] < 0) {
				this.X[j] = 1;
			} else {
				var h = 0;
				var i = colindex[j];
				for (var k = j + 1; k < 6; k++) {h += A[i][k] * this.X[k];}
				this.X[j] = -h / A[i][j];
			}
		}
		var sum = 0;
		for (var i = 0; i <= 5; i++) {
			sum += Math.abs(this.X[i]);
		}
		//        if (sum<1e-10) {
		//            Valid=false;
		//        }
		for (var i = 0; i <= 5; i++) {
			this.X[i] /= sum;
			// Ce qui suit ressemble à un gag, pourtant il semble que l'epsilon au lieu de 0 en coeffs permet
			// de surmonter les effets de bord dans des cas particuliers (ex. hyperbole equilatère/parabole)
			// sans pour autant porter atteinte à la précision des coordonnées des points d'intersections
			// qui restent fiables à 1e-12, soit la précision maximale affichée du logiciel :
			//            this.X[i]=n(this.X[i]);
		}

		// Calcul des coordonnées des foyers de la conique (double pour parabole) :

		// pour ax^2 + 2bxy + cy^2 + 2dx + 2ey + f = 0
		var a = this.X[0],
			b = this.X[4] / 2,
			c = this.X[1],
			d = this.X[2] / 2,
			e = this.X[3] / 2,
			f = this.X[5];
		var A = [b * b - a * c, 0];
		var B = [c * d - b * e, a * e - b * d];
		var C = [e * e - d * d + f * (a - c), 2 * (b * f - d * e)];

		if (Math.abs(A[0]) < 1e-20) {
			// Il s'agit d'une parabole, résolution de -2Bz+C=0 :
			var z0 = this.MTH.quotient(C, this.MTH.times(2, B));
			this.FOCI = [z0, z0];
		} else {
			// Il s'agit d'une ellipse ou d'une hyperbole.
			// Résolution de l'équation complexe Az^2-2Bz+C=0 :
			// Racine du discriminant réduit :
			var SQ = this.MTH.csqrt(this.MTH.minus(this.MTH.times(B, B), this.MTH.times(A, C)))[0];
			var z1 = this.MTH.quotient(this.MTH.plus(B, SQ), A);
			var z2 = this.MTH.quotient(this.MTH.minus(B, SQ), A);
			this.FOCI = [z1, z2];
		}
		// var a = this.X[0], b = this.X[4], c = this.X[1], d = this.X[2], e = this.X[3], f = this.X[5];
		// console.log("det="+((a*c-b*b/4)*f+b*e*d/4-c*d*d/4-a*e*e/4));
		// console.log(" this.X[0]=" + this.X[0] + " this.X[1]=" + this.X[1] + " this.X[2]=" + this.X[2] + " this.X[3]=" + this.X[3] + " this.X[4]=" + this.X[4] + " this.X[5]=" + this.X[5]);
		this.computeMinMaxStep();
		this.Ptab = [];
		this.computeUpper();
		this.computeLower();
		this.analysePartiesConnexes();
		this.PtabRow = [];
		// Regroupement en un seul tableau de toutes les parties connexes
		// de la conique :
		for (var i = 0; i < this.Ptab.length; i++) {
			this.PtabRow = this.PtabRow.concat(this.Ptab[i]);
		}
		// console.log("x0="+this.X[0]+" x1="+this.X[1]+" x2="+this.X[2]+" x3="+this.X[3]+" x4="+this.X[4]+" x5="+this.X[5]);
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Quadric", this.P[0].getVarName(), this.P[1].getVarName(), this.P[2].getVarName(), this.P[3].getVarName(), this.P[4].getVarName());
	}
	//    this.projectAlpha = function(p) {
	//        if (this.PtabRow.length===0) return;
	//        var k = p.getAlpha();
	//        if (k < 0) k = 0;
	//        if (k > (this.PtabRow.length - 1)) k = this.PtabRow.length - 1;
	//        p.setXY(this.PtabRow[k].x, this.PtabRow[k].y);
	//    };
	//
	//    this.setAlpha = function(p) {
	//        var xAB = 0, yAB = 0;
	//        for (var i = 0, len = this.PtabRow.length; i < len; i++) {
	//            xAB = (this.PtabRow[i].x - p.getX()), yAB = (this.PtabRow[i].y - p.getY());
	//            if ((xAB === 0) && (yAB === 0)) {
	//                p.setAlpha(i);
	//                return;
	//            }
	//        }
	//    };
	// Seulement pour les macros :
	private getMacroFunc(nme, vn, i) {
		return function (src) {
			src.geomWrite(false, nme, "DefinitionPoint", vn, i);
		};
	};
	private intersectQuadricQuadricXY(TAB:number[]): number[][] {
		// pour ax^2 + bxy + cy^2 + dx + ey + f = 0
		var a0 = this.X[0];
		var b0 = this.X[4];
		var c0 = this.X[1];
		var d0 = this.X[2];
		var e0 = this.X[3];
		var f0 = this.X[5];
		var a1 = TAB[0];
		var b1 = TAB[4];
		var c1 = TAB[1];
		var d1 = TAB[2];
		var e1 = TAB[3];
		var f1 = TAB[5];
		// Si les deux coniques sont homothétiques (cas courant en 3D) :
		if ((Math.abs(a0 / a1 - c0 / c1) < 1e-10)) {
			d1 = d1 * (a0 / a1) - d0;
			e1 = e1 * (a0 / a1) - e0;
			f1 = f1 * (a0 / a1) - f0;
			var c01 = (c0 * d1 * d1 - b0 * d1 * e1 + a0 * e1 * e1);
			var c02 = (e1 * e1 * f0 - e0 * e1 * f1 + c0 * f1 * f1);
			var c03 = (-d1 * e0 * e1 + d0 * e1 * e1 + 2 * c0 * d1 * f1 - b0 * e1 * f1);
			var c04 = (c03 * c03 - 4 * c01 * c02);
			var c05 = d1 * e0 * e1 - d0 * e1 * e1 - 2 * c0 * d1 * f1 + b0 * e1 * f1;
			var c06 = (2 * c01);
			var x0 = (c05 - Math.sqrt(c04)) / c06;
			var x1 = (c05 + Math.sqrt(c04)) / c06;
			var y0 = (-f1 - d1 * x0) / e1;
			var y1 = (-f1 - d1 * x1) / e1;
			return [
				[x0, y0],
				[x1, y1],
				[NaN, NaN],
				[NaN, NaN]
			];
		}
		var k1 = -a1 * b0 * b1 * c0 + a0 * b1 * b1 * c0 + a1 * a1 * c0 * c0 + a1 * b0 * b0 * c1 - a0 * b0 * b1 * c1 - 2 * a0 * a1 * c0 * c1 + a0 * a0 * c1 * c1;
		var k2 = b1 * b1 * c0 * d0 - b0 * b1 * c1 * d0 - 2 * a1 * c0 * c1 * d0 + 2 * a0 * c1 * c1 * d0 - b0 * b1 * c0 * d1 + 2 * a1 * c0 * c0 * d1 + b0 * b0 * c1 * d1 - 2 * a0 * c0 * c1 * d1 - a1 * b1 * c0 * e0 + 2 * a1 * b0 * c1 * e0 - a0 * b1 * c1 * e0 - a1 * b0 * c0 * e1 + 2 * a0 * b1 * c0 * e1 - a0 * b0 * c1 * e1;
		var k3 = c1 * c1 * d0 * d0 - 2 * c0 * c1 * d0 * d1 + c0 * c0 * d1 * d1 - b1 * c1 * d0 * e0 - b1 * c0 * d1 * e0 + 2 * b0 * c1 * d1 * e0 + a1 * c1 * e0 * e0 + 2 * b1 * c0 * d0 * e1 - b0 * c1 * d0 * e1 - b0 * c0 * d1 * e1 - a1 * c0 * e0 * e1 - a0 * c1 * e0 * e1 + a0 * c0 * e1 * e1 + b1 * b1 * c0 * f0 - b0 * b1 * c1 * f0 - 2 * a1 * c0 * c1 * f0 + 2 * a0 * c1 * c1 * f0 - b0 * b1 * c0 * f1 + 2 * a1 * c0 * c0 * f1 + b0 * b0 * c1 * f1 - 2 * a0 * c0 * c1 * f1;
		var k4 = c1 * d1 * e0 * e0 - c1 * d0 * e0 * e1 - c0 * d1 * e0 * e1 + c0 * d0 * e1 * e1 + 2 * c1 * c1 * d0 * f0 - 2 * c0 * c1 * d1 * f0 - b1 * c1 * e0 * f0 + 2 * b1 * c0 * e1 * f0 - b0 * c1 * e1 * f0 - 2 * c0 * c1 * d0 * f1 + 2 * c0 * c0 * d1 * f1 - b1 * c0 * e0 * f1 + 2 * b0 * c1 * e0 * f1 - b0 * c0 * e1 * f1;
		var k5 = -c1 * e0 * e1 * f0 + c0 * e1 * e1 * f0 + c1 * c1 * f0 * f0 + c1 * e0 * e0 * f1 - c0 * e0 * e1 * f1 - 2 * c0 * c1 * f0 * f1 + c0 * c0 * f1 * f1;
		var u1 = k2 / (4 * k1);
		var u2 = (k2 * k2) / (4 * k1 * k1) - 2 * k3 / (3 * k1);
		var u3 = (k2 * k2) / (2 * k1 * k1) - 4 * k3 / (3 * k1);
		var u4 = (-k2 * k2 * k2) / (k1 * k1 * k1) + (4 * k2 * k3) / (k1 * k1) - (8 * k4) / k1;
		var p1 = k3 * k3 - 3 * k2 * k4 + 12 * k1 * k5;
		var p2 = 2 * k3 * k3 * k3 - 9 * k2 * k3 * k4 + 27 * k1 * k4 * k4 + 27 * k2 * k2 * k5 - 72 * k1 * k3 * k5;
		var q1 = this.MTH.csqrt([-4 * p1 * p1 * p1 + p2 * p2, 0]);
		q1 = this.MTH.plus(q1[0], [p2, 0]);
		q1 = this.MTH.power(q1, 1 / 3);
		q1 = q1[0];
		var cub2 = Math.pow(2, 1 / 3);
		var r1 = this.MTH.quotient([cub2 * p1, 0], this.MTH.times([3 * k1, 0], q1));
		r1 = this.MTH.plus(r1, this.MTH.quotient(q1, [3 * cub2 * k1, 0]));
		var sa = this.MTH.plus([u2, 0], r1);
		sa = this.MTH.quotient(this.MTH.csqrt(sa)[0], 2);
		var sb = this.MTH.minus([u3, 0], r1);
		sb = this.MTH.minus(sb, this.MTH.quotient([u4, 0], this.MTH.times(8, sa)));
		sb = this.MTH.quotient(this.MTH.csqrt(sb)[0], 2);
		var sc = this.MTH.minus([u3, 0], r1);
		sc = this.MTH.plus(sc, this.MTH.quotient([u4, 0], this.MTH.times(8, sa)));
		sc = this.MTH.quotient(this.MTH.csqrt(sc)[0], 2);
		var XX = [];
		var cu1 = [-u1, 0];
		XX[0] = this.MTH.minus(cu1, sa);
		XX[0] = this.MTH.minus(XX[0], sb);
		XX[1] = this.MTH.minus(cu1, sa);
		XX[1] = this.MTH.plus(XX[1], sb);
		XX[2] = this.MTH.plus(cu1, sa);
		XX[2] = this.MTH.minus(XX[2], sc);
		XX[3] = this.MTH.plus(cu1, sa);
		XX[3] = this.MTH.plus(XX[3], sc);
		var points = [];
		var A = c0;
		var B;
		var C;
		var AA = c1;
		var BB;
		var CC;
		for (var i = 0; i < 4; i++) {
			if (Math.abs(XX[i][1]) > 1e-5) {
				// Un complexe rencontré, ie une intersection non existante :
				points.push([NaN, NaN]);
			} else {
				B = b0 * XX[i][0] + e0;
				C = a0 * XX[i][0] * XX[i][0] + d0 * XX[i][0] + f0;
				BB = b1 * XX[i][0] + e1;
				CC = a1 * XX[i][0] * XX[i][0] + d1 * XX[i][0] + f1;
				var denom = A * BB - B * AA;
				if (Math.abs(denom) < 1E-20) {
					points.push([NaN, NaN]);
				} else {
					var y = (C * AA - A * CC) / denom; //formule de Dominique Tournès
					points.push([XX[i][0], y]);
				}
			}
		}
		return (points);
	}
	private computeMinMaxStep() {
		this.MIN = -1;
		this.MAX = this.Cn.getBounds().width + 2;
		this.STEP = (this.MAX - this.MIN) / this.NB;
	}
	private computeUpper() {
		var y = NaN;
		var tab = [];
		for (var x = this.MIN; x < this.MAX; x += this.STEP) {
			if (Math.abs(this.X[1]) > 1e-13) {
				var p = (this.X[3] + x * this.X[4]) / this.X[1],
					q = (this.X[0] * x * x + this.X[2] * x + this.X[5]) / this.X[1];
				var h = p * p / 4 - q;
				y = -p / 2 - Math.sqrt(h);
			} else {
				y = NaN;
			}
			if (isNaN(y)) {
				if (tab.length > 0) {
					this.Ptab.push(tab);
					tab = [];
				}
			} else
				tab.push({
					x: x,
					y: y
				});
		}
		if (tab.length > 0) {this.Ptab.push(tab);}
	}
	private computeLower() {
		var y = NaN;
		var tab = [];
		for (var x = this.MIN; x < this.MAX; x += this.STEP) {
			if (Math.abs(this.X[1]) > 1e-13) {
				var p = (this.X[3] + x * this.X[4]) / this.X[1];
				var q = (this.X[0] * x * x + this.X[2] * x + this.X[5]) / this.X[1];
				var h = p * p / 4 - q;
				y = -p / 2 + Math.sqrt(h);
			} else {
				y = -(this.X[0] * x * x + this.X[2] * x + this.X[5]) / (this.X[3] + this.X[4] * x);
			}
			if (isNaN(y)) {
				if (tab.length > 0) {
					this.Ptab.push(tab);
					tab = [];
				}
			} else
				tab.push({
					x: x,
					y: y
				});
		}
		if (tab.length > 0) {this.Ptab.push(tab);}
	}
	private analysePartiesConnexes() {
		var dis = this.X[4] * this.X[4] - 4 * this.X[0] * this.X[1];
		if (dis < 0) {
			// Il s'agit d'une ellipse (b2-4ac<0) :
			if (this.Ptab.length === 2) {
				this.Ptab[0] = this.Ptab[0].concat(this.Ptab[1].reverse());
				this.Ptab[0].push({
					x: this.Ptab[0][0].x,
					y: this.Ptab[0][0].y
				});
				this.Ptab.splice(1, 1);
			}
		} else {
			// Il s'agit d'une hyperbole (ou parabole) :
			if (this.Ptab.length === 4) {
				this.Ptab[0] = this.Ptab[0].concat(this.Ptab[2].reverse());
				this.Ptab[1].reverse();
				this.Ptab[1] = this.Ptab[1].concat(this.Ptab[3]);
				this.Ptab.splice(2, 2);
			}
		}
	}
}
