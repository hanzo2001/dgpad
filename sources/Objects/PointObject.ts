/// <reference path="../typings/Objects/iPointObject.d.ts" />

import {ConstructionObject} from './ConstructionObject';
import {VirtualPointObject} from './VirtualPointObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

// external definition of PointObjectAnimation in *.d.ts

export class PointObject extends ConstructionObject implements iPointObject {
	private shape;
	private X: number;
	private Y: number;
	private X_old: number;
	private ORG3D;
	private X3D: number;
	private Y3D: number;
	private Z3D: number;
	private X3D_OLD: number;
	private Y3D_OLD: number;
	private Z3D_OLD: number;
	private pt3D;
	private EXY;
	private lastX;
	private lastY;
	private order: number;
	private inc: number;
	private macrosource: (v) => any;
	private away;
	private fillStyle: string;
	private aTXT: number;
	private cosTXT: number;
	private sinTXT: number;
	private currentMagnet;
	private Alpha: number;
	private paintProc: (ctx:CanvasRenderingContext2D) => void;
	constructor(_construction, _name, _x, _y) {
		super(_construction, _name);
		//var parent = $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		let parent = PointObject.prototype;
		this.Cn = _construction;
		this.shape = 0; // 0 for circle, 1 for cross,
		this.X = _x;
		this.Y = _y;
		this.X_old = 0;
		this.ORG3D = null;
		this.X3D = NaN;
		this.Y3D = NaN;
		this.Z3D = NaN;
		this.X3D_OLD = NaN;
		this.Y3D_OLD = NaN;
		this.Z3D_OLD = NaN;
		this.pt3D = this.Cn.getInterpreter().getEX().EX_point3D;
		this.EXY = null;
		this.lastX = _x;
		this.lastY = _y; // For TrackObject;
		this.order = 0; // this.order, only for Intersection points 
		this.inc = 0; // increment
		this.macrosource = null;
		this.away = null;
		this.fillStyle = this.prefs.color.point_free;
		this.aTXT;
		this.cosTXT;
		this.sinTXT; // angle donnant la position du nom autour du point
		this.currentMagnet = null; // Pour gérer les changements de magnétisme : utilise pour
		this.Alpha = 0;
		this.paintProc = this.paintCircle;
		// les traces d'objets.
		this.blocks.setMode(["onlogo", "onmousedown", "ondrag", "onmouseup", "oncompute"], "ondrag");
		this.setNamePosition(0);
		this.compute = this.computeGeom;
		this.getSource = this.getSourceGeom;
		this.setDefaults("point");
		(<any>parent).setExpression = this.setExpression;// Pour Blockly
		(<any>parent).setEXY = PointObject.prototype.setExp;
	}
	// ****************************************
	// **** Uniquement pour les animations ****
	// ****************************************
	isAnimationPossible(): boolean {
		return (this.getParentLength() === 1 && this.getParentAt(0).getAlphaBounds);
	}
	getAnimationSpeedTab() {
		return this.getParentAt(0).getAnimationSpeedTab();
	}
	getAnimationParams(mx, my) {
		return this.getParentAt(0).getAnimationParams(this.X, this.Y, mx, my);
	}
	incrementAlpha(anim:PointObjectAnimation) {
		var v = anim.speed;
		var s = anim.direction;
		var ar = anim.ar;
		var d = new Date();
		anim.timestamp = d.getTime();
		anim.delay = d.getTime() - anim.timestamp;
		// b[0] et b[1] indiquent l'intervalle this.Alpha
		// b[2] indique l'incrément
		var b = this.getParentAt(0).getAlphaBounds(anim, this);
		// console.log(b[2]);
		if (b) {
			this.Alpha += b[2];
			if (this.Alpha < b[0]) {
				if (ar) {
					anim.direction *= -1;
					this.Alpha = 2 * b[0] - this.Alpha;
				} else {
					this.Alpha = b[1] + this.Alpha - b[0];
				}
			}
			if (this.Alpha > b[1]) {
				if (ar) {
					anim.direction *= -1;
					this.Alpha = 2 * b[1] - this.Alpha;
				} else {
					this.Alpha = b[0] + this.Alpha - b[1];
				}
			}
			if (this.Alpha < b[0]) this.Alpha = b[0];
			if (this.Alpha > b[1]) this.Alpha = b[1];
		}
		this.blocks.evaluate('ondrag');
	}
	// ****************************************
	// ****************************************
	getValue(): number[] {
		if (this.EXY) {return this.EXY.value();}
		if (this.Cn.is3D()) {
			// if (this === this.ORG3D)
			if (this.Cn.isOrigin3D(this)) {
				return [0, 0, 0];
			} else if (this.is3D()) {
				return this.coords3D();
			}
			// else return this.coords3D();
		}
		return [this.getCn().coordsSystem.x(this.X), this.getCn().coordsSystem.y(this.Y)];
	}
	isMoveable(): boolean {
		return this.getParentLength() < 2;
	}
	isCoincident(_C): boolean {
		if (_C.isInstanceType('point')) {
			// Si les points sont confondus :
			if ($U.approximatelyEqual(this.X, _C.getX()) && $U.approximatelyEqual(this.Y, _C.getY())) {
				return true;
			}
		}
		return false;
	}
	setNamePosition(_a:number) {
		this.aTXT = _a;
		this.cosTXT = Math.cos(_a);
		this.sinTXT = Math.sin(_a);
	}
	getNamePosition(): number {
		return this.aTXT;
	}
	setAway(_P) {
		this.away = _P;
	}
	getAway() {
		return this.away;
	}
	setFillStyle() {
		var len = this.getParentLength();
		switch (len) {
			case 0: this.fillStyle = this.prefs.color.point_free; break; // Point libre :
			case 1: this.fillStyle = this.prefs.color.point_on;   break; // Point sur objet :
			case 2: this.fillStyle = this.prefs.color.point_inter;break; // Point d'intersection :
		}
	}
	forceFillStyle(_fs) {
		this.fillStyle = this.prefs.color.point_inter;
	}
	setMacroSource(_p:(v)=>any) {
		this.macrosource = _p;
	}
	execMacroSource(_src) {
		if (this.macrosource) {
			this.macrosource(_src);
			return true;
		}
		return false;
	}
	getAssociatedTools(): string {
		var at = "@namemover,@callproperty,@calltrash,segment,line,ray,midpoint,symc,perpbis,anglebiss,vector,BR,circle,circle1,circle3,circle3pts,arc3pts,area,angle,fixedangle";
		if (this.isMoveable()) {
			at += ",@objectmover";
		}
		if (this.getParentLength() === 0) {
			at += ",@anchor";
		} else {
			at += ",@noanchor";
		}
		if (this.getEXY() || (this.getParentLength() === 0 && !this.getFloat())) {
			at += ",@callcalc";
		}
		if (this.getParentLength() < 2){
			at += ",@blockly";
		}
		if (this.isMoveable()) {
			at += ",@pushpin";
			at += ",@magnet";
		}
		if (this.isAnimationPossible()) {
			at += ",@spring";
		}
		if (this.getCn().findPtOn(this) !== null) {
			at += ",locus";
		}
		return at;
	}
	setIncrement(_i:number) {
		if (this.getParentLength() < 2) {
			this.inc = _i;
			this.computeIncrement(this.X, this.Y);
		}
	}
	getIncrement(): number {
		return this.inc;
	}
	computeIncrement(_x:number, _y:number) {
		if (this.inc) {
			var x = this.getCn().coordsSystem.x(_x);
			var y = this.getCn().coordsSystem.y(_y);
			x = this.inc * Math.round(x / this.inc);
			y = this.inc * Math.round(y / this.inc);
			x = this.getCn().coordsSystem.px(x);
			y = this.getCn().coordsSystem.py(y);
			this.setXY(x, y);
		} else {
			this.setXY(_x, _y);
		}
	}
	isInstanceType(_c:string) {
		return _c === 'point';
	}
	getCode(): string {
		return 'point';
	}
	getFamilyCode(): string {
		return 'point';
	}
	setShape(shape:number) {
		this.shape = shape;
		switch (this.shape) {
			case 0: this.paintProc = this.paintCircle; break;
			case 1: this.paintProc = this.paintCross; break;
			case 2: this.paintProc = this.paintDiamond; break;
			case 3: this.paintProc = this.paintSquare; break;
		}
	}
	getShape(): number {
		return this.shape;
	}
	isPointOn(): boolean {
		return this.getParentLength() === 1;
	}
	setOrder(order:number) {
		this.order = order;
	}
	getOrder(): number {
		return this.order;
	}
	// this.Alpha represents relative coord for point on object M :
	// For lines by two points, and segments, it's P1M= this.Alpha x P1P2
	// For lines by one point (parallel, perpendicular), it's PM= this.Alpha x U (U=unit vector of line)
	// For Circle, it's a radian in [0;2π[
	setAlpha(alpha:number) {
		this.Alpha = alpha;
	}
	getAlpha(): number {
		return this.Alpha;
	}
	// Pour la redéfinition d'objet (par exemple Point libre/Point sur) :
	attachTo(_o) {
		this.setParentList(_o.getParent());
		this.setXY(_o.getX(), _o.getY());
		var childs = _o.getChildList();
		let i=0, s=childs.length;
		while (i<s) {
			childs[i++].redefine(_o, this);
		}
		this.Cn.remove(_o);
		this.setFillStyle();
		this.Cn.reconstructChilds();
		this.computeChilds();
	}
	deleteAlpha() {
		var parents = this.getParent();
		this.setXY(this.getX() + 25, this.getY() - 25);
		let i=0, s=parents.length;
		while (i<s) {
			parents[i++].deleteChild(this);
		}
		this.setParent();
		this.setFillStyle();
		this.Cn.reconstructChilds();
		this.computeChilds();
	}
	getX(): number {
		return this.X;
	}
	getY(): number {
		return this.Y;
	}
	setXY(x, y) {
		this.X = x;
		this.Y = y;
	}
	setxy(x:number, y:number) {
		this.X = this.Cn.coordsSystem.px(x);
		this.Y = this.Cn.coordsSystem.py(y);
	}
	getx(): number {
		return this.Cn.coordsSystem.x(this.X);
	}
	gety(): number {
		return this.Cn.coordsSystem.y(this.Y);
	}
	// Seulement pour les points magnétiques :
	projectMagnetAlpha(p) {
	};
	setMagnetAlpha(p) {
	};
	/*************************************
	 ************************************* 
	 ***********  3D part  ***************
	 *************************************
	 *************************************/
	setXYZ(_coords:number[]) {
		this.X3D = _coords[0];
		this.Y3D = _coords[1];
		this.Z3D = _coords[2];
		if (this.ORG3D === null) {
			this.ORG3D = this.Cn.get3DOrigin(this);
		}
		var c2d = this.pt3D([this.Cn.coordsSystem.x(this.ORG3D.getX()), this.Cn.coordsSystem.y(this.ORG3D.getY())], _coords);
		this.X = this.Cn.coordsSystem.px(c2d[0]);
		this.Y = this.Cn.coordsSystem.py(c2d[1]);
	}
	getXYZ(): number[] {
		return [this.X3D, this.Y3D, this.Z3D];
	}
	// Abscisse sauvegardée par le 1er tour
	// de compute, correspondant à phi=phi+delta :
	storeX() {
		this.X_old = this.X;
	}
	getOldcoords(): number[] {
		return [this.X3D_OLD, this.Y3D_OLD, this.Z3D_OLD];
	}
	coords3D(): number[] {
		if (!isNaN(this.X3D)) {return [this.X3D_OLD = this.X3D, this.Y3D_OLD = this.Y3D, this.Z3D_OLD = this.Z3D];}
		if (this.ORG3D === null) {
			this.ORG3D = this.Cn.get3DOrigin(this);
			if (this.ORG3D === null) {return [NaN, NaN, NaN];}
		}
		var phi = this.Cn.getPhi();
		var theta = this.Cn.getTheta();
		var stheta = this.Cn.sin(theta);
		var ctheta = this.Cn.cos(theta);
		var sphi = this.Cn.sin(phi[0]);
		var sphid = this.Cn.sin(phi[1]);
		var cphi = this.Cn.cos(phi[0]);
		var cphid = this.Cn.cos(phi[1]);
		var dis = sphi * cphid - sphid * cphi;
		var xO = this.ORG3D.getX();
		this.X3D_OLD = ((this.X_old - xO) * cphid - (this.X - xO) * cphi) / dis;
		this.Y3D_OLD = (sphi * (this.X - xO) - sphid * (this.X_old - xO)) / dis;
		this.Z3D_OLD = (this.X3D_OLD * cphid * stheta - this.Y3D_OLD * sphid * stheta + this.ORG3D.getY() - this.Y) / ctheta;
		this.X3D_OLD = this.Cn.coordsSystem.l(this.X3D_OLD);
		this.Y3D_OLD = this.Cn.coordsSystem.l(this.Y3D_OLD);
		this.Z3D_OLD = this.Cn.coordsSystem.l(this.Z3D_OLD);
		return [this.X3D_OLD, this.Y3D_OLD, this.Z3D_OLD];
	}
	coords2D(): number[] {
		return [this.Cn.coordsSystem.x(this.getX()), this.Cn.coordsSystem.y(this.getY())];
	}
	getEXY() {
		return this.EXY;
	}
	// Pour Blockly :
	setExpression(exy) {
		var elt;
		try {
			elt = JSON.parse(exy);
		} catch (e) {
			elt = exy;
		}
		if ((elt.constructor === Array) && (elt.length === 2)) {
			this.setExp(this.Cn.coordsSystem.px(elt[0]), this.Cn.coordsSystem.py(elt[1]));
		} else {
			this.setExp(exy);
		}
	}
	// exy est soit une formule (string), soit un nombre. S'il s'agit
	// d'un nombre, c'est l'abscisse et le second param
	// est l'ordonnée. S'il s'agit d'une formule, et s'il y a un second
	// param, celui-ci est un booléen qui indique s'il s'agit ou non d'un point 3D.
	// S'il n'y a pas de second param, le logiciel détermine s'il s'agit d'un
	// point 2d ou 3d.
	// setExp pour les widgets  :
	setExp(exy, ey?) {
		// console.log(exy);
		if ($U.isStr(exy)) {
			// Si ex et ey sont des expressions :
			this.setParent();
			this.EXY = Expression.delete(this.EXY);
			this.EXY = new Expression(this, exy);
			this.fillStyle = this.prefs.color.point_fixed;
			this.isMoveable = () => false;
			this.setXY = function (_x, _y) { };
			this.compute = this.computeFixed;
			this.getSource = this.getSourceFixed;
			var t = this.EXY.value();
			this.set3D($U.isArray(t) && t.length === 3);
		} else {
			// Si ex et ey sont des nombres :
			this.EXY = Expression.delete(this.EXY);
			this.X = exy;
			this.Y = ey;
			this.fillStyle = this.prefs.color.point_free;
			this.isMoveable = () => true;
			this.setXY = function (x, y) {
				this.X = x;
				this.Y = y;
			};
			this.compute = this.computeGeom;
			this.getSource = this.getSourceGeom;
			this.setParent()
		}
	}
	getExp(): string {
		return this.getEXY().getSource();
	}
	near(_x:number, _y:number) {
		return Math.abs(this.X - _x) < 1E-10 && (Math.abs(this.Y - _y) < 1E-10);
	}
	dragObject(_x:number, _y:number) {
		this.computeIncrement(_x, _y);
		if (this.getParentLength() === 1) {
			this.getParentAt(0).project(this);
			this.getParentAt(0).setAlpha(this);
		}
	}
	computeDrag() {
		this.compute();
		this.computeChilds();
	}
	computeMagnets() {
		var mgObj = null;
		var t = this.getMagnets();
		if (t.length === 0) {return;}
		var reps = [];
		for (var i = 0; i < t.length; i++) {
			var c = t[i][0].projectXY(this.X, this.Y);
			var pt = new VirtualPointObject(c[0], c[1]);
			t[i][0].setMagnetAlpha(pt);
			t[i][0].projectMagnetAlpha(pt);
			c[0] = pt.getX();
			c[1] = pt.getY();
			var d2 = (c[0] - this.X) * (c[0] - this.X) + (c[1] - this.Y) * (c[1] - this.Y);
			// Si la distance entre le projeté et le point
			// de coordonnées (_x,_y) est inférieure au rayon d'attaction :
			if (d2 < t[i][1] * t[i][1]) {reps.push([t[i][0], d2, c[0], c[1]]);}
		}
		if (reps.length > 0) {
			reps.sort(this.magnetsSortFilter);
			mgObj = reps[0][0];
			this.setXY(reps[0][2], reps[0][3]);
			// reps[0][0].setAlpha(this);
			// reps[0][0].projectAlpha(this);
			this.computeChilds();
		}
		if (this.currentMagnet != mgObj) {
			this.currentMagnet = mgObj;
			this.lastX = this.X;
			this.lastY = this.Y;
			let i=0, s=this.getChildLength();
			while (i<s) {this.getChildAt(i++).beginTrack();}
		}
	}
	checkMagnets() {
		if (this.getMagnets().length) {
			this.computeMagnets();
			// this.dragObject(this.X, this.Y);
			if (this.getParentLength() === 1) {
				this.getParentAt(0).project(this);
				this.getParentAt(0).setAlpha(this);
			}
		}
	}
	projectXY(_x, _y): number[] {
		return [this.X, this.Y];
	}
	mouseInside(event:MouseEvent) {
		if (isNaN(this.X + this.Y)) {return false;}
		return Math.abs(this.mouseX(event) - this.X) < this.getOversize() &&
					 Math.abs(this.mouseY(event) - this.Y) < this.getOversize()
	}
	private computeGeom() {
		// console.log(this.getName()+" len="+this.getParentLength());
		// this.computeMagnets();
		// console.log(this.getName()+" : ");
		var len = this.getParentLength();
		if (len === 0) {return;}
		if (len === 1) {
			// This is a point on object :
			this.getParentAt(0).projectAlpha(this);
		} else if (len === 2) {
			// This is an intersection point :
			this.getParentAt(0).intersect(this.getParentAt(1), this);
			this.getParentAt(0).checkIfValid(this);
			this.getParentAt(1).checkIfValid(this);
		}
	}
	private computeFixed() {
		this.EXY.compute();
		var t = this.EXY.value();
		// if (this.getName()==="A") console.log("t="+t);
		if ($U.isArray(t)) {
			// S'il s'agit d'un point 3D :
			if (t.length === 3) {
				if (this.ORG3D === null) {
					this.ORG3D = this.Cn.get3DOrigin(this);
				}
				this.X3D = t[0];
				this.Y3D = t[1];
				this.Z3D = t[2];
				var c2d = this.pt3D([this.Cn.coordsSystem.x(this.ORG3D.getX()), this.Cn.coordsSystem.y(this.ORG3D.getY())], t);
				this.X = this.Cn.coordsSystem.px(c2d[0]);
				this.Y = this.Cn.coordsSystem.py(c2d[1]);
			} else {
				// Sinon on est en 2D :
				this.X3D = NaN;
				this.Y3D = NaN;
				this.Z3D = NaN;
				this.X = this.Cn.coordsSystem.px(t[0]);
				this.Y = this.Cn.coordsSystem.py(t[1]);
			}
		} else {
			this.X = NaN;
			this.Y = NaN;
		}
	}
	refreshNames() {
		if (this.EXY)
			this.EXY.refreshNames();
	}
	private paintTxt(ctx:CanvasRenderingContext2D, txt:string) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "left";

		var sz = 2 * this.getRealsize();
		var xtxt = sz * this.cosTXT + ctx.measureText(txt).width * (this.cosTXT - 1) / 2;
		var ytxt = sz * this.sinTXT + this.getFontSize() * (this.sinTXT - 1) / 2;
		ctx.fillText(txt, this.X + xtxt, this.Y - ytxt);
	}
	paintLength(ctx:CanvasRenderingContext2D) {
		var prec = this.getPrecision();
		var x = $L.number(Math.round(this.getCoordsSystem().x(this.X) * prec) / prec);
		var y = $L.number(Math.round(this.getCoordsSystem().y(this.Y) * prec) / prec);
		var txt = this.getShowName() ? this.getSubName() : "";
		txt += "(" + x + $L.separator_coords + y + ")";
		this.paintTxt(ctx, txt);
	}
	paintName(ctx:CanvasRenderingContext2D) {
		// Si une mesure doit être affichée, paintLength se chargera
		// d'afficher le nom avec :
		if (this.getPrecision() === -1) {this.paintTxt(ctx, this.getSubName());}
	}
	private paintCircle(ctx:CanvasRenderingContext2D) {
		if (this.getOpacity() === 0) {ctx.fillStyle = this.fillStyle;}
		ctx.lineWidth = this.prefs.size.pointborder;
		ctx.beginPath();
		ctx.arc(this.X, this.Y, this.getRealsize(), 0, Math.PI * 2, true);
		ctx.fill();
		ctx.stroke();
	}
	private paintCross(ctx:CanvasRenderingContext2D) {
		var sz = this.getRealsize() * 0.9;
		ctx.lineWidth = this.prefs.size.pointborder;
		ctx.beginPath();
		ctx.moveTo(this.X - sz, this.Y + sz);
		ctx.lineTo(this.X + sz, this.Y - sz);
		ctx.moveTo(this.X - sz, this.Y - sz);
		ctx.lineTo(this.X + sz, this.Y + sz);
		ctx.stroke();
	}
	private paintSquare(ctx:CanvasRenderingContext2D) {
		var sz = this.getRealsize() * 1.8;
		if (this.getOpacity() === 0) {ctx.fillStyle = "rgba(255,255,255,1)";}
		ctx.lineWidth = this.prefs.size.pointborder;
		ctx.beginPath();
		ctx.rect(this.X - sz / 2, this.Y - sz / 2, sz, sz);
		ctx.fill();
		ctx.stroke();
	}
	private paintDiamond(ctx:CanvasRenderingContext2D) {
		var sz = this.getRealsize() * 1.3;
		if (this.getOpacity() === 0) {ctx.fillStyle = "rgba(255,255,255,1)";}
		ctx.lineWidth = this.prefs.size.pointborder;
		ctx.beginPath();
		ctx.moveTo(this.X, this.Y - sz);
		ctx.lineTo(this.X - sz, this.Y);
		ctx.lineTo(this.X, this.Y + sz);
		ctx.lineTo(this.X + sz, this.Y);
		ctx.lineTo(this.X, this.Y - sz);
		ctx.fill();
		ctx.stroke();
	}
	beginTrack() {
		this.lastX = this.X;
		this.lastY = this.Y;
	}
	drawTrack(ctx:CanvasRenderingContext2D) {
		if (!isNaN(this.X) && !isNaN(this.Y) && !this.isHidden()) {
			if ((this.X !== this.lastX) || (this.Y != this.lastY)) {
				ctx.strokeStyle = this.getColor().getRGBA();
				ctx.lineWidth = this.getSize();
				ctx.lineCap = 'round';
				if (!isNaN(this.lastX) && !isNaN(this.lastY)) {
					ctx.beginPath();
					ctx.moveTo(this.lastX, this.lastY);
					ctx.lineTo(this.X, this.Y);
					ctx.stroke();
				}
			}
		}
		this.lastX = this.X;
		this.lastY = this.Y;
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		this.paintProc(ctx);
	}
	private getSourceGeom(src) {
		if (this.execMacroSource(src)) {return;}
		var len = this.getParentLength();
		var x = this.getCn().coordsSystem.x(this.getX());
		var y = this.getCn().coordsSystem.y(this.getY());
		switch (len) {
			case 0:
				src.geomWrite(false, this.getName(), "Point", x, y);
				break;
			case 1:
				// point sur objet :
				src.geomWrite(false, this.getName(), "PointOn", this.getParentAt(0).getVarName(), this.Alpha);
				// src.geomWrite(false, this.getName(), "PointOn", this.getParentAt(0).getName(), x, y);
				break;
			case 2:
				// point d'intersection :
				if (this.away) {
					src.geomWrite(false, this.getName(), "OrderedIntersection", this.getParentAt(0).getVarName(), this.getParentAt(1).getVarName(), this.order, this.away.getVarName());
				} else {
					src.geomWrite(false, this.getName(), "OrderedIntersection", this.getParentAt(0).getVarName(), this.getParentAt(1).getVarName(), this.order);
				}
				break;
		}
	}
	private getSourceFixed(src) {
		if (this.execMacroSource(src)) {return;}
		var _ex = this.EXY.getUnicodeSource().replace(/\n/g, "\\n");
		src.geomWrite(true, this.getName(), "Point", _ex, (this.is3D()) ? 1 : 0);
	}
	private magnetsSortFilter(a, b): number {
		var ap = a[0].isInstanceType("point");
		var bp = b[0].isInstanceType("point");
		if (ap && bp) {return (a[1] - b[1]);}
		if (ap) {return -1;}
		if (bp) {return 1;}
		return a[1] - b[1];
	}
}
