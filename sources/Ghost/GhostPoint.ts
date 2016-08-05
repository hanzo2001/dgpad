
export class GhostPoint {
	P = null;
	limited = false;
	x: number;
	y: number;
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	getX() {
		if (this.P) {
			return this.P.getX();
		}
		return this.x;
	}
	getY() {
		if (this.P) {
			return this.P.getY();
		}
		return this.y;
	}
	isLimited() {
		return this.limited;
	}
	//Only for P2 :
	setXY(x, y) {
		this.x = x;
		this.y = y;
		if (this.P) {
			var x0 = this.P.getX();
			var y0 = this.P.getY();
			this.limited = ((this.x - x0) * (this.x - x0) + (this.y - y0) * (this.y - y0)) < 10000;
		}
	}
	getPointObject() {
		return this.P;
	}
	setPointObject(P) {
		this.P = P;
		var x0 = this.P.getX();
		var y0 = this.P.getY();
		this.limited = ((this.x - x0) * (this.x - x0) + (this.y - y0) * (this.y - y0)) < 10000;
		this.x = x0;
		this.y = y0;
	}
	draw(ctx) {
		if (!this.P) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.stroke();
		}
	}
}
