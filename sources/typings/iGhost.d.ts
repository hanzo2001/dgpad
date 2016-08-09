
interface iGhostPoint {
	getX(): number;
	getY(): number;
	isLimited(): boolean;
	setXY(x:number, y:number);
	getPointObject();
	setPointObject(P);
	draw(ctx:CanvasRenderingContext2D);
}

interface GhostLine {
	getP1();
	getP2();
	length(): number;
	record(_P, _x:number, _y:number);
	draw(ctx:CanvasRenderingContext2D, polygon);
}

export class Ghost {
	ghost(_sim);
	clear();
	setXY(ev);
	recordXY(ev);
	isInside(ev);
	paint(ctx:CanvasRenderingContext2D);
	create(ev);
	start();
}
