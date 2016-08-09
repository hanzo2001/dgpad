
interface iGhost {
	ghost(sim:boolean);
	clear();
	setXY(event:MouseEvent);
	recordXY(event:MouseEvent);
	isInside(event:MouseEvent);
	paint(ctx:CanvasRenderingContext2D);
	create(event:MouseEvent);
	start();
}

interface iGhostLine {
	getP1(): iGhostPoint;
	getP2(): iGhostPoint;
	length(): number;
	record(P:iGhostPoint, x:number, y:number);
	draw(ctx:CanvasRenderingContext2D, polygon:boolean);
}

interface iGhostPoint {
	getX(): number;
	getY(): number;
	isLimited(): boolean;
	setXY(x:number, y:number);
	getPointObject(): iGhostPoint;
	setPointObject(P:iGhostPoint);
	draw(ctx:CanvasRenderingContext2D);
}
