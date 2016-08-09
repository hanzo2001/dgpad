
interface iVirtualPointObject {
	getX(): number;
	getY(): number;
	setXY(x: number, y: number);
	setAlpha(alpha: number);
	getAlpha(): number;
	near(x: number, y: number);
	is3D(): boolean;
	set3D(on: boolean);
}
