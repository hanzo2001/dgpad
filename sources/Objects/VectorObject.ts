
import {TwoPointsLineObject} from './TwoPointsLineObject';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class VectorObject extends TwoPointsLineObject {
	constructor(_construction: iConstruction, _name: string, _P1, _P2) {
		super(_construction, _name, _P1, _P2, true);
		// var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, _P1, _P2, true)); // Héritage
		this.setParent(this.P1, this.P2);
		this.setDefaults("vector");
	}
	getCode(): string {
		return "vector";
	}
	getAssociatedTools(): string {
		return super.getAssociatedTools() + ",midpoint,perpbis";
	}
	// Pour l'interpréteur de DG_scripts :
	coords2D(): number[] {
		var vx = this.getCn().coordsSystem.x(this.P2.getX()) - this.getCn().coordsSystem.x(this.P1.getX());
		var vy = this.getCn().coordsSystem.y(this.P2.getY()) - this.getCn().coordsSystem.y(this.P1.getY());
		return [vx, vy];
	}
	// Pour l'interpréteur de DG_scripts :
	coords3D() {
		this.P1.coords3D();
		this.P2.coords3D();
	}
	// Pour l'interpréteur de DG_scripts :
	getOldcoords(): number[] {
		var p1 = this.P1.getOldcoords();
		var p2 = this.P2.getOldcoords();
		return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
	}
	getValue(): number[] {
		if ((this.Cn.is3D()) && (this.is3D())) {
			var p1 = this.P1.coords3D();
			var p2 = this.P2.coords3D();
			return [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
		}
		var vx = this.getCn().coordsSystem.x(this.P2.getX()) - this.getCn().coordsSystem.x(this.P1.getX());
		var vy = this.getCn().coordsSystem.y(this.P2.getY()) - this.getCn().coordsSystem.y(this.P1.getY());
		return [vx, vy];
	}
	//        getValue() {
	//        return (this.getCn().coordsSystem.l(this.R));
	//    };
	setAlpha(p) {
		super.setAlpha(p);
		var a = p.getAlpha();
		if (a < 0) {
			p.setAlpha(0);
		}
		if (a > 1) {
			p.setAlpha(1);
		}
	}
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb) {
		var aMin = 0;
		var aMax = 1;
		var step = (aMax - aMin) / (_nb - 1);
		var Ptab = []; // Liste des sommets du polygone représentant le lieu
		// Initialisation de Ptab :
		for (var i = 0; i < _nb; i++) {
			Ptab.push({
				"alpha": aMin + step * i,
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
		var xB = this.P2.getX();
		var yB = this.P2.getY();
		p.setXY(xA + a * (xB - xA), yA + a * (yB - yA));
	}
	getXmax(): number {
		return this.P1.getX();
	}
	getYmax(): number {
		return this.P1.getY();
	}
	getXmin(): number {
		return this.P2.getX();
	}
	getYmin(): number {
		return this.P2.getY();
	}
	isInstanceType(_c): boolean {
		return _c === "line" || _c === "segment";
	}
	// see if point inside 2 border points
	checkIfValid(_P) {
		var xPA = this.P1.getX() - _P.getX();
		var yPA = this.P1.getY() - _P.getY();
		var xPB = this.P2.getX() - _P.getX();
		var yPB = this.P2.getY() - _P.getY();
		if ((xPA * xPB + yPA * yPB) > 0) {_P.setXY(NaN, NaN);}
	}
	mouseInside(event:MouseEvent) {
		return $U.isNearToSegment(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), this.mouseX(event), this.mouseY(event), this.getOversize());
	}
	paintLength(ctx:CanvasRenderingContext2D) {
		ctx.save();
		var a = Math.atan2(this.P2.getY() - this.P1.getY(), this.P2.getX() - this.P1.getX());
		if ((a < -$U.halfPI) || (a > $U.halfPI)) {
			a += Math.PI;
		}
		ctx.textAlign = "center";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.translate((this.P1.getX() + this.P2.getX()) / 2, (this.P1.getY() + this.P2.getY()) / 2);
		ctx.rotate(a);
		var prec = this.getPrecision();
		var display = Math.round($U.d(this.P1, this.P2) / this.getUnit() * prec) / prec;
		ctx.fillText($L.number(display), 0, -this.prefs.fontmargin - this.getRealsize() / 2);
		ctx.restore();
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		var x1 = this.P1.getX();
		var y1 = this.P1.getY();
		var x2 = this.P2.getX();
		var y2 = this.P2.getY();
		var headlen = this.prefs.size.vectorhead;
		var angle = Math.atan2(y2 - y1, x2 - x1);
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2 - headlen * Math.cos(angle), y2 - headlen * Math.sin(angle));
		ctx.stroke();
		ctx.lineCap = 'butt';
		var c1 = Math.cos(angle - Math.PI / 10);
		var s1 = Math.sin(angle - Math.PI / 10);
		ctx.beginPath();
		ctx.moveTo(x2, y2);
		ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
		ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 10), y2 - headlen * Math.sin(angle + Math.PI / 10));
		ctx.lineTo(x2, y2);
		ctx.lineTo(x2 - headlen * c1, y2 - headlen * s1);
		ctx.stroke();
		ctx.fill();
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Vector", this.P1.getVarName(), this.P2.getVarName());
	}
}
