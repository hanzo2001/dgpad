
import {ConstructionObject} from './ConstructionObject';

var $U = (<any>window).$U;

/**
 * Unknown method on Construction
 */

// Lieux de points, de droites et de cercles :
export class LocusObject extends ConstructionObject {
	protected Ptab;
	protected NB: number;
	protected O;
	protected ON;
	protected depsChain;
	constructor(_construction: iConstruction, _name: string, _O, _ON) {
		super(_construction, _name);
		// var parentObject = $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		// $U.extend(this, new MoveableObject(_construction)); // Héritage
		this.NB; // nombre de côtés du polygone
		this.O = _O; // Objet dont on veut le lieu
		this.ON = _ON; // Point sur objet qui crée le lieu
		this.Ptab;
		this.depsChain = _construction.findDeps(this.O, this.ON); // Chaine de dépendance entre O et ON (exclus)
		this.setPrecision(1000);
		this.setParent(this.O, this.ON);
		this.setDefaults("locus");
		// ***********************************************************
		// *****Initialisation de this.compute et de this.paintObject*******
		// ***********************************************************
		switch (this.O.getFamilyCode()) {
			case "point":
				this.compute = this.computePoints;
				this.paintObject = this.paintObjectPoints;
				this.mouseInside = this.mouseInsidePoints;
				break;
			case "line":
				this.compute = this.computeLines;
				this.paintObject = this.paintObjectLines;
				this.mouseInside = this.mouseInsideLines;
				break;
			case "circle":
				this.compute = this.computeCircles;
				this.paintObject = this.paintObjectCircles;
				this.mouseInside = this.mouseInsidePoints;
				break;
		}
		//    var this.ON.getParentAt(0).initLocusArray(this.NB, (this.O.getCode() !== "point"));
		//    var Ptab = this.ON.getParentAt(0).initLocusArray(this.NB, (this.O.getCode() !== "point"));
		//    parentObject.setPrecision(7);
		//    
		//    // Il s'agit ici du réglage du nombre de côté du polygone de lieu
		//    // -1 pour 1000, 1 pour 10, 2 pour 20,...
		//    var precTab=[1000,1000,20,50,100,200,500,1000,1500,2000,3000,4000,5000,5000,5000,5000,5000];
		//    
		//    this.setPrecision = function(_prec) {
		//        var p=Math.round(1*_prec);
		//        parentObject.setPrecision(p);
		//        this.NB=precTab[p+1];
		//        Ptab = this.ON.getParentAt(0).initLocusArray(this.NB, (this.O.getCode() !== "point"));
		////        this.compute();
		////        console.log(p);
		//    };
	}
	getPrecision() {
		return this.NB;
	}
	getRealPrecision() {
		return this.NB;
	}
	setPrecision(_prec) {
		_prec = parseInt(_prec);
		this.NB = (_prec === 0) ? 1000 : _prec; // Compatibilité avec les anciens lieux
		if (this.NB > 500) {
			// S'il ne s'agit pas d'un lieu de point et que le point pilote
			// n'est pas sur une droite (qu'il est sur cercle ou segment), 
			// on réduit le nombre d'objets d'un facteur 10 :
			if ((this.O.getCode() !== "point") && (this.ON.getParentAt(0).getCode() !== "line"))
				this.NB = this.NB / 50;
			if ((this.O.getCode() !== "point") && (this.ON.getParentAt(0).getCode() === "line"))
				this.NB = this.NB / 5;
		}

		this.Ptab = this.ON.getParentAt(0).initLocusArray(this.NB, (this.O.getCode() !== "point"));
		this.NB = this.Ptab.length;
		// console.log("this.Ptab.length="+this.Ptab.length+" this.NB="+this.NB);
		// this.compute();
	}
	getAssociatedTools(): string {
		return "@callproperty,@calltrash,point";
	}
	isInstanceType(_c): boolean {
		return _c === "locus";
	}
	getCode(): string {
		return "locus";
	}
	getFamilyCode(): string {
		return "locus";
	}
	// ****************************************
	// **** Uniquement pour les animations ****
	// ****************************************
	getAlphaBounds(anim): number[] {
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
		var xAB = (this.Ptab[0].x - x0);
		var yAB = (this.Ptab[0].y - y0);
		var d2 = xAB * xAB + yAB * yAB;
		var d1 = 0;
		var k = 0;
		for (var i = 1; i < this.NB; i++) {
			xAB = (this.Ptab[i].x - x0);
			yAB = (this.Ptab[i].y - y0);
			d1 = xAB * xAB + yAB * yAB;
			if ((d1 < d2) || isNaN(d2)) {
				k = i;
				d2 = d1;
			}
		}
		var xp = this.Ptab[k - 1].x;
		var yp = this.Ptab[k - 1].y;
		var ps = (xp - x0) * (x1 - x0) + (yp - y0) * (y1 - y0);
		var dir = (ps > 0) ? 1 : -1;
		var dop = Math.sqrt((xp - x0) * (xp - x0) + (yp - y0) * (yp - y0));
		var dom = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var cs = ps / (dop * dom);
		var aller_retour = (Math.abs(cs) < 0.707);
		var pcent = Math.round(100 * fce[f] / fce[fce.length - 1]) + "%";
		return {
			message: aller_retour ? pcent + " \u21C4" : pcent + "",
			speed: fce[f],
			direction: dir,
			ar: aller_retour
		}
	}
	// ****************************************
	// ****************************************
	projectXY(_x:number, _y:number) {
		var xAB = (this.Ptab[0].x - _x);
		var yAB = (this.Ptab[0].y - _y);
		var d2 = xAB * xAB + yAB * yAB;
		var d1 = 0;
		var k = 0;
		for (var i = 1; i < this.NB; i++) {
			xAB = (this.Ptab[i].x - _x);
			yAB = (this.Ptab[i].y - _y);
			d1 = xAB * xAB + yAB * yAB;
			if ((d1 < d2) || isNaN(d2)) {
				k = i;
				d2 = d1;
			}
		}
		return [this.Ptab[k].x, this.Ptab[k].y];
	}
	project(p) {
		var coords = this.projectXY(p.getX(), p.getY());
		p.setXY(coords[0], coords[1]);
	}
	projectAlpha(p) {
		var k = p.getAlpha();
		if (k < 0)
			k = 0;
		if (k > (this.Ptab.length - 1))
			k = this.Ptab.length - 1;
		p.setXY(this.Ptab[k].x, this.Ptab[k].y);
	}
	setAlpha(p) {
		var xAB = 0;
		var yAB = 0;
		for (var i = 0; i < this.NB; i++) {
			xAB = (this.Ptab[i].x - p.getX()), yAB = (this.Ptab[i].y - p.getY());
			if ((xAB === 0) && (yAB === 0)) {
				p.setAlpha(i);
				return;
			}
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
		if (this.Ptab[a] !== undefined) {p.setXY(this.Ptab[a].x, this.Ptab[a].y);}
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Locus", this.O.getVarName(), this.ON.getVarName());
	}
	private mouseInsidePoints(event:MouseEvent): boolean {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		for (var i = 0; i < this.NB; i++) {
			if ($U.isNearToPoint(this.Ptab[i].x, this.Ptab[i].y, mx, my, this.getOversize()))
				return true;
		}
		return false;
	}
	private mouseInsideLines(event:MouseEvent): boolean {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		for (var i = 0; i < this.NB; i++) {
			if ($U.isNearToSegment(this.Ptab[i].x, this.Ptab[i].y, this.Ptab[i].x1, this.Ptab[i].y1, mx, my, this.getOversize()))
				return true;
		}
		return false;
	}
	// Recalcul de la chaine de dépendance qui mène de this.ON à this.O :
	private computeDeps() {
		for (var k = 0, len = this.depsChain.length; k < len; k++) {
			this.depsChain[k].compute();
		}
		this.O.compute();
	}
	private computePoints() {
		for (var i = 0; i < this.NB; i++) {
			this.ON.getParentAt(0).setLocusAlpha(this.ON, this.Ptab[i].alpha);
			this.computeDeps();
			this.Ptab[i].x = this.O.getX();
			this.Ptab[i].y = this.O.getY();
		}
		this.ON.compute(); // Rétablissement de la position d'origine
		this.computeDeps();
	}
	private computeLines() {
		for (var i = 0; i < this.NB; i++) {
			this.ON.getParentAt(0).setLocusAlpha(this.ON, this.Ptab[i].alpha);
			this.computeDeps();
			this.Ptab[i].x = this.O.getXmin();
			this.Ptab[i].y = this.O.getYmin();
			this.Ptab[i].x1 = this.O.getXmax();
			this.Ptab[i].y1 = this.O.getYmax();
		}
		this.ON.compute(); // Rétablissement de la position d'origine
		this.computeDeps();
	}
	private computeCircles() {
		for (var i = 0; i < this.NB; i++) {
			this.ON.getParentAt(0).setLocusAlpha(this.ON, this.Ptab[i].alpha);
			this.computeDeps();
			this.Ptab[i].x = this.O.getP1().getX();
			this.Ptab[i].y = this.O.getP1().getY();
			this.Ptab[i].r = this.O.getR();
		}
		this.ON.compute(); // Rétablissement de la position d'origine
		this.computeDeps();
	}
	private paintObjectPoints(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.Ptab[0].x, this.Ptab[0].y);
		for (var i = 1; i < this.NB; i++) {
			ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y);
		}
		ctx.stroke();
		ctx.fill();
	}
	private paintObjectLines(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.moveTo(this.Ptab[0].x, this.Ptab[0].y);
		ctx.lineTo(this.Ptab[0].x1, this.Ptab[0].y1);
		for (var i = 1; i < this.NB; i++) {
			ctx.moveTo(this.Ptab[i].x, this.Ptab[i].y);
			ctx.lineTo(this.Ptab[i].x1, this.Ptab[i].y1);
		}
		ctx.stroke();
	}
	private paintObjectCircles(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		for (var i = 0; i < this.NB; i++) {
			ctx.moveTo(this.Ptab[i].x + this.Ptab[i].r, this.Ptab[i].y);
			ctx.arc(this.Ptab[i].x, this.Ptab[i].y, this.Ptab[i].r, 0, Math.PI * 2, false);
		}
		ctx.stroke();
	}
}
