
import {GhostLine} from './GhostLine';

export class Ghost {
	X: number;
	Y: number;
	path = [];
	lines = [];
	currentLine = null;
	ghostOn = false;
	polygon = false;
	canvas;
	Cn;
	prec2: number;
	minLength:number = 5;
	constructor(canvas) {
		this.canvas = canvas;
		this.Cn = canvas.getConstruction();
		this.prec2 = canvas.prefs.precision.caress;
		this.prec2 *= this.prec2;
//		if (Object.touchpad) {
//			minLength*=canvas.prefs.precision.over.touchfactor;
//		}
	}
	ghost(_sim) {
		this.ghostOn = ((_sim) && (this.canvas.getConstruction().getMode() === 7));
	}
	clear() {
		this.path = [];
		this.lines = [];
		this.ghostOn = false;
		this.polygon = false;
	}
	setXY(ev) {
		this.clear();
		this.X = this.canvas.mouseX(ev);
		this.Y = this.canvas.mouseY(ev);
		this.currentLine = new GhostLine(this.X, this.Y);
		this.lines.push(this.currentLine);
		this.record(this.X, this.Y);
	}
	recordXY(ev) {
		if (this.ghostOn) {
			let x = this.canvas.mouseX(ev);
			let y = this.canvas.mouseY(ev);
			this.record(x, y);
			this.currentLine.record(this.getIndicatedPoint(), x, y);

			if (this.linesLength() < this.minLength) return;

			this.canvas.stopChrono();
			let cornerPos = this.findCorner();
			if (cornerPos) {
				this.polygon = true;
				let corner = this.path[cornerPos];
				let P1 = this.currentLine.getP1();
				let P2 = this.currentLine.getP2();
				this.createPoint(P1, ev);
				this.createPoint(P2, ev, true);
				this.path = this.path.slice(cornerPos);
				this.currentLine = new GhostLine(corner.x, corner.y);
				this.lines.push(this.currentLine);
				this.currentLine.getP1().setPointObject(P2.getPointObject());
			};
		}
	}
	isInside(ev) {
		let x0 = this.canvas.mouseX(ev);
		let y0 = this.canvas.mouseY(ev);
		return (((this.X - x0) * (this.X - x0) + (this.Y - y0) * (this.Y - y0)) < this.prec2);
	};
	paint(ctx) {
		if (this.ghostOn) {
			if (this.linesLength() < this.minLength) return;
			this.paintPath(ctx);
			this.paintLines(ctx);
		}
	};
	create(ev) {
		if (this.ghostOn) {
			this.ghostOn = false;
			if (this.linesLength() < this.minLength) return;
			if (this.polygon) {
				// Création des sommets et du polygone :
				let Aoc = this.canvas.getConstructor("area");
				Aoc.clearC();
				let len = this.lines.length;
				for (let i = 0; i < len; i++) {
					this.createPoint(this.lines[i].getP1(), ev);
					Aoc.addC(this.lines[i].getP1().getPointObject());
				}
				this.createPoint(this.lines[len - 1].getP2(), ev, true);
				// A décommenter pour le rendu du polygone :
				//    Aoc.addC(lines[len-1].getP2().getPointObject());
				//      if (lines[0].getP1().getPointObject()!=lines[len-1].getP2().getPointObject()) {
				//      Aoc.addC(lines[0].getP1().getPointObject());
				//    }
				//    Aoc.createObj(canvas, ev);
				// Création des segments :
				let Soc = this.canvas.getConstructor("segment");
				len = this.lines.length;
				for (let i = 0; i < len; i++) {
					Soc.clearC();
					Soc.addC(this.lines[i].getP1().getPointObject());
					Soc.addC(this.lines[i].getP2().getPointObject());
					Soc.createObj(this.canvas, ev);
				}
				if (this.lines[0].getP1().getPointObject() !== this.lines[len - 1].getP2().getPointObject()) {
					Soc.clearC();
					Soc.addC(this.lines[0].getP1().getPointObject());
					Soc.addC(this.lines[len - 1].getP2().getPointObject());
					Soc.createObj(this.canvas, ev);
				}
			} else {
				let P1 = this.lines[0].getP1();
				let P2 = this.lines[0].getP2();
				let oc2 = this.canvas.getConstructor("line");
				if ((P1.isLimited()) && (P2.isLimited())) {
					oc2 = this.canvas.getConstructor("segment");
				}
				if ((P1.isLimited()) && (!P2.isLimited())) {
					oc2 = this.canvas.getConstructor("ray");
				}
				if ((!P1.isLimited()) && (P2.isLimited())) {
					oc2 = this.canvas.getConstructor("ray");
					let P = P1;
					P1 = P2;
					P2 = P;
				}
				this.createPoint(P1, ev);
				this.createPoint(P2, ev, true);
				oc2.clearC();
				oc2.addC(P1.getPointObject());
				oc2.addC(P2.getPointObject());
				oc2.createObj(this.canvas, ev);
			}
			this.canvas.paint(ev);
		}
	}
	start() {
		this.canvas.setPressedFilter(this.mousePressed);
		this.canvas.setMovedFilter(this.mouseMoved);
		this.canvas.setReleasedFilter(this.mouseReleased);
	}


	private record(_x, _y) {
		let pos = {
			"x": _x,
			"y": _y
		};
		this.path.push(pos);
	}
	private getIndicatedPoint() {
		let inds = this.canvas.getConstruction().getIndicated();
		let len = inds.length;
		for (let i = 0; i < len; i++) {
			if (inds[i].isInstanceType("point")) {
				return inds[i];
			}
		}
		return null;
	}
	private vector(x, y) {
		return {
			x: x,
			y: y
		};
	}
	private delta(a, b) {
		return this.vector(a.x - b.x, a.y - b.y);
	}
	private angle_between(a, b) {
		return Math.acos((a.x * b.x + a.y * b.y) / (this.len(a) * this.len(b)));
	}
	private len(v) {
		return Math.sqrt(v.x * v.x + v.y * v.y);
	}
	private findCorner(): any {
		let n = 0;
		let t = 0;
		let angleMin = (this.lines.length === 1) ? Math.PI / 3 : Math.PI / 4;
		for (let i = 1; i < this.path.length - 2; i++) {
			let pt = this.path[i + 1];
			let d = this.delta(this.path[0], this.path[i - 1]);
			if (this.len(d) > 20 && n > 2) {
				let ac = this.delta(this.path[i - 1], pt);
				if (Math.abs(this.angle_between(ac, d)) > angleMin) {
					return i;
				}
			}
			n++;
		}
		return false;
	}
	private linesLength() {
		let ln = this.lines.length;
		let totalLength = 0;
		for (let i = 0; i < ln - 1; i++) {
				totalLength += this.lines[i].length();
		}
		if (ln > 0) totalLength += this.len(this.delta(this.path[0], this.path[this.path.length - 1]));
		return totalLength;
	}
	private createPoint = function(_P, ev, checkPointOn?) {
		if (!_P.getPointObject()) {
			let pc = this.canvas.getPointConstructor();
			if (checkPointOn) {
				pc.setInitialObjects(this.canvas.getConstruction().getIndicated());
			}
			let o1 = pc.createObj(this.canvas, ev);
			o1.setXY(_P.getX(), _P.getY());
			_P.setPointObject(o1);
			pc.clearC();
			this.canvas.getConstruction().validate(ev);
		}
	}
	private paintPath(ctx) {
		ctx.globalAlpha = 0.2;
		ctx.lineWidth = 10;
		ctx.lineJoin = "round";
		ctx.strokeStyle = "#000000";
		let len = this.path.length;
		ctx.beginPath();
		ctx.moveTo(this.path[0].x, this.path[0].y);
		for (let i = 1; i < len; i++) {
			ctx.lineTo(this.path[i].x, this.path[i].y);
		}
		ctx.moveTo(this.path[len - 1].x, this.path[len - 1].y);
		ctx.closePath();
		ctx.stroke();
	}
	private paintLines(ctx) {
		let len = this.lines.length;
		ctx.lineWidth = this.canvas.prefs.size.line;
		ctx.globalAlpha = 0.5;
		if (Object.touchpad) {
			ctx.lineWidth *= this.canvas.prefs.size.touchfactor;
		}
		if (this.polygon) {
			ctx.strokeStyle = this.canvas.prefs.color.area;
		} else {
			let P1 = this.currentLine.getP1();
			let P2 = this.currentLine.getP2();
			ctx.strokeStyle = this.canvas.prefs.color.line;
			if ((P1.isLimited()) && (P2.isLimited())) {
				ctx.strokeStyle = this.canvas.prefs.color.segment;
			} else if ((P1.isLimited()) || (P2.isLimited())) {
				ctx.strokeStyle = this.canvas.prefs.color.ray;
			}
		}
		for (let i = 0; i < len; i++) {
			this.lines[i].draw(ctx, this.polygon);
		}
	}
	private mousedown = false;
	private mousePressed = function(ev) {
			this.clear();
			this.setXY(ev);
			this.ghostOn = true;
			this.mousedown = true;
	}
	private mouseMoved = function(ev) {
			if (this.mousedown) {
					this.recordXY(ev);
					this.Cn.validate(ev);
					this.canvas.paint(ev);
			}
	}
	private mouseReleased = function(ev) {
			this.mousedown = false;
			this.create(ev);
			this.Cn.validate(ev);
			this.Cn.clearSelected();
			this.Cn.clearIndicated();
			this.canvas.paint(ev);
			this.ghostOn = false;
	}
}
