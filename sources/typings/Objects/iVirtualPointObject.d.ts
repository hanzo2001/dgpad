
interface iVirtualPointObject {
	getX();
	getY();
	setXY(x: number, y: number);
	setAlpha(alpha: number);
	getAlpha();
	near(x: number, y: number);
	is3D();
	set3D(on: boolean);
}
