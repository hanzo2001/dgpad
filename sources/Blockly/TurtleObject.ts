/// <reference path="../typings/iBlockly.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

var $APP_PATH = (<any>window).$APP_PATH;

export class TurtleObject implements iTurtleObject {
	private canvas: iCanvas;
	private Cn: iConstruction;
	private U: number[];
	private V: number[];
	private W: number[];
	private P: iPointObject;
	private TAB;
	private is3D: boolean;
	private X2D: number;
	private Y2D: number;
	private U2D: number[];
	private V2D: number[];
	private ORG3D;
	private pt3D;
	private imW: number;
	private imH: number;
	private _show: boolean;
	private img: HTMLImageElement;
	constructor(_canvas:iCanvas) {
		this.canvas = _canvas;
		this.Cn = this.canvas.getConstruction();
		this.U;
		this.V;
		this.W;
		this.P;
		this.TAB;
		this.is3D;
		this.X2D;
		this.Y2D;
		this.U2D;
		this.V2D;
		this.ORG3D;
		this.pt3D;
		this.imW;
		this.imH;
		this._show = false;
		this.img = new Image();
		this.img.src = $APP_PATH + "NotPacked/images/tools/turtle.png";
		var that = this;
		this.img.onload = function () {
			that.imW = this.width;
			that.imH = this.height;
		};
	}
	isOn(): boolean {
		return this._show;
	}
	reset(name:string) {
		if (this._show && name === this.P.getVarName()) {
			this.U = [1, 0, 0];
			this.V = [0, 1, 0];
			this.W = [0, 0, 1];
			this.TAB = [];
		}
	}
	show(P:iPointObject) {
		this.U = [1, 0, 0];
		this.V = [0, 1, 0];
		this.W = [0, 0, 1];
		this.TAB = []; // Tableau représentant le parcours
		this.P = P; // PointObject
		this.is3D = (this.P.is3D() || this.Cn.isOrigin3D(this.P));
		this.X2D = 0; // Abscisse du point en pixels
		this.Y2D = 0; // Ordonnée du point en pixels
		this.U2D = []; // vecteur this.U en pixels
		this.V2D = []; // vecteur this.V en pixels
		this.ORG3D = this.Cn.get3DOrigin(null);
		this.pt3D = this.Cn.getInterpreter().getEX().EX_point3D;
		this._show = true;
		this.Cn.computeAll();
	}
	hide() {
		this._show = false;
	}
	changeUVW(name:string, u: number[], v: number[], w: number[]) {
		if (this._show && name === this.P.getVarName()) {
			this.U = u;
			this.V = v;
			this.W = w;
		}
	}
	changePT(name:string, P) {
		if (this._show && name === this.P.getVarName()) {
			this.TAB.push(P);
		}
	}
	paint() {
		if (this._show) {
			this.compute();
			var ctx = this.canvas.getContext();
			if (this.is3D) {
				var ah = 0.6;
				var bh = 0.25;
				var ch = 0.2;
				ctx.beginPath();
				ctx.strokeStyle = "#222222";
				ctx.lineWidth = 1;
				ctx.fillStyle = (this.U2D[0] * this.V2D[1] - this.U2D[1] * this.V2D[0] < 0) ? "#00FF00" : "#555555";
				ctx.moveTo(this.X2D + this.U2D[0] * ah, this.Y2D + this.U2D[1] * ah);
				ctx.lineTo(this.X2D - this.V2D[0] * bh, this.Y2D - this.V2D[1] * bh);
				ctx.lineTo(this.X2D + this.U2D[0] * ch, this.Y2D + this.U2D[1] * ch);
				ctx.lineTo(this.X2D + this.V2D[0] * bh, this.Y2D + this.V2D[1] * bh);
				ctx.lineTo(this.X2D + this.U2D[0] * ah, this.Y2D + this.U2D[1] * ah);
				ctx.fill();
				ctx.stroke();
			} else {
				ctx.save();
				ctx.translate(this.X2D, this.Y2D);
				ctx.rotate(Math.atan2(this.U2D[1], this.U2D[0]));
				// ctx.setTransform(this.U2D[0] / du, this.U2D[1] / du, this.V2D[0] / dv, this.V2D[1] / dv, this.X2D, this.Y2D);
				ctx.drawImage(this.img, -this.imW / 2, -this.imH / 2, this.imW, this.imH);
				ctx.restore();
			}
		}
	}
	private compute() {
		var pt = (this.TAB.length === 0) ? this.P.getValue() : this.TAB[this.TAB.length - 1];
		// console.log(pt);
		if (this.is3D) {
			var org = [this.Cn.coordsSystem.x(this.ORG3D.getX()), this.Cn.coordsSystem.y(this.ORG3D.getY())];
			var c2d = this.pt3D(org, pt);
			this.X2D = this.Cn.coordsSystem.px(c2d[0]);
			this.Y2D = this.Cn.coordsSystem.py(c2d[1]);
			c2d = this.pt3D(org, this.U);
			this.U2D = [this.Cn.coordsSystem.px(c2d[0]) - this.ORG3D.getX(), this.Cn.coordsSystem.py(c2d[1]) - this.ORG3D.getY()];
			c2d = this.pt3D(org, this.V);
			this.V2D = [this.Cn.coordsSystem.px(c2d[0]) - this.ORG3D.getX(), this.Cn.coordsSystem.py(c2d[1]) - this.ORG3D.getY()];
		} else {
			this.X2D = this.Cn.coordsSystem.px(pt[0]);
			this.Y2D = this.Cn.coordsSystem.py(pt[1]);
			this.U2D = [this.Cn.coordsSystem.lx(this.U[0]), -this.Cn.coordsSystem.lx(this.U[1])];
			this.V2D = [this.Cn.coordsSystem.lx(this.V[0]), -this.Cn.coordsSystem.lx(this.V[1])];
		}
	}
}
