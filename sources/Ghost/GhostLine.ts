
import {GhostPoint} from './GhostPoint';

var $U = (<any>window).$U;

export class GhostLine {
	private prec = 200;
	private P1: GhostPoint;
	private P2: GhostPoint;
	constructor(x:number, y:number) {
    this.prec = 200;
    this.P1 = new GhostPoint(x,y);
    this.P2 = new GhostPoint(x,y);
	}
	getP1(): GhostPoint {
		return this.P1;
	}
	getP2(): GhostPoint {
		return this.P2;
	}
	length(): number {
		var x1 = this.P1.getX();
		var y1 = this.P1.getY();
		var x2 = this.P2.getX();
		var y2 = this.P2.getY();
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}
	record(P:GhostPoint, x:number, y:number) {
		this.setP2(x, y);
		if (P) {
			let p1 = this.P1.getPointObject();
			let p2 = this.P2.getPointObject();
			if (P === p1 || P === p2) {return;}
			if (!p1) {
				this.P1.setPointObject(P);
				return;
			}
			if (!p2) {
				this.P2.setPointObject(P);
				return;
			}
		}
	}
	draw(ctx:CanvasRenderingContext2D, polygon:boolean) {
		$U.drawPartialLine(ctx, this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), !polygon && !this.P1.isLimited(), !polygon && !this.P2.isLimited());
	};
	private setP2(x:number, y:number) {
		this.P2.setXY(x, y);
	};
}
