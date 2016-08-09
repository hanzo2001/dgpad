
import {PointObject} from '../Objects/PointObject';

export class GhostPoint {
	private P: GhostPoint;
	private limited: boolean;
	private x: number;
	private y: number;
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.P = null;
		this.limited = false;
	}
	getX(): number {
		return this.P ? this.P.getX() : this.x;
	}
	getY(): number {
		return this.P ? this.P.getY() : this.y;
	}
	isLimited(): boolean {
		return this.limited;
	}
	//Only for P2 :
	setXY(x:number, y:number) {
		this.x = x;
		this.y = y;
		if (this.P) {
			var x0 = this.P.getX();
			var y0 = this.P.getY();
			this.limited = ((this.x - x0) * (this.x - x0) + (this.y - y0) * (this.y - y0)) < 10000;
		}
	}
	getPointObject(): GhostPoint {
		return this.P;
	}
	setPointObject(P:GhostPoint) {
		this.P = P;
		var x0 = this.P.getX();
		var y0 = this.P.getY();
		this.limited = ((this.x - x0) * (this.x - x0) + (this.y - y0) * (this.y - y0)) < 10000;
		this.x = x0;
		this.y = y0;
	}
	draw(ctx:CanvasRenderingContext2D) {
		if (!this.P) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
		}
	}
}
