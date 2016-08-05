
export class VirtualPointObject {
	protected x: number;
	protected y: number;
	protected alpha: number;
	protected is_3D: boolean;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.alpha = 0;
		this.is_3D = false;
	}
	getX() {
		return this.x;
	}
	getY() {
		return this.y;
	}
	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	setAlpha(alpha: number) {
		this.alpha = alpha;
	}
	getAlpha() {
		return this.alpha;
	}
	near(x: number, y: number) {
		return (Math.abs(this.x - x) < 1E-10 && Math.abs(this.y - y) < 1E-10);
	}
	is3D() {
		return this.is_3D;
	}
	set3D(on: boolean) {
		this.is_3D = on;
	}
}
