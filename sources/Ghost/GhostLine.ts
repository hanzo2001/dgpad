
import {GhostPoint} from './GhostPoint';

export class GhostLine {
	prec = 200;
	P1;
	P2;
	constructor(x:number, y:number) {
    this.prec = 200;
    this.P1 = new GhostPoint(x,y);
    this.P2 = new GhostPoint(x,y);
	}
	getP1() {
		return this.P1;
	}
	getP2() {
		return this.P2;
	}
	length() {
		var x1 = this.P1.getX(),
				y1 = this.P1.getY();
		var x2 = this.P2.getX(),
				y2 = this.P2.getY();
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}
	record(_P, _x, _y) {
		this.setP2(_x, _y);
		if (_P) {
			let p1 = this.P1.getPointObject();
			let p2 = this.P2.getPointObject();
			if ((_P === p1) || (_P === p2)) {
				return;
			}
			if (!p1) {
				this.P1.setPointObject(_P);
				return;
			}
			if (!p2) {
				this.P2.setPointObject(_P);
				return;
			}
		}
	}
	draw(ctx, polygon) {
		$U.drawPartialLine(ctx, this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), !polygon && !this.P1.isLimited(), !polygon && !this.P2.isLimited());
	};
	private setP2(_x, _y) {
		this.P2.setXY(_x, _y);
	};
}
