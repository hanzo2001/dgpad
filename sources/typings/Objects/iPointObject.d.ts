/// <reference path="./iConstructionObject.d.ts" />

declare type PointObjectAnimation = {
	speed: number,
	direction: number,
	ar: boolean,
	timestamp?: number,
	delay?: number,
};

interface iPointObject extends iConstructionObject {
	isAnimationPossible(): boolean;
	getAnimationSpeedTab();
	getAnimationParams(mx, my);
	incrementAlpha(anim:PointObjectAnimation);
	getValue(): number[];
	isMoveable(): boolean;
	isCoincident(_C): boolean;
	setNamePosition(_a:number);
	getNamePosition(): number;
	setAway(_P);
	getAway();
	setFillStyle();
	forceFillStyle(_fs);
	setMacroSource(_p:(v)=>any);
	execMacroSource(_src);
	getAssociatedTools(): string;
	setIncrement(_i:number);
	getIncrement(): number;
	computeIncrement(_x:number, _y:number);
	isInstanceType(_c:string);
	getCode(): string;
	getFamilyCode(): string;
	setShape(shape:number);
	getShape(): number;
	isPointOn(): boolean;
	setOrder(order:number);
	getOrder(): number;
	// this.Alpha represents relative coord for point on object M :
	// For lines by two points, and segments, it's P1M= this.Alpha x P1P2
	// For lines by one point (parallel, perpendicular), it's PM= this.Alpha x U (U=unit vector of line)
	// For Circle, it's a radian in [0;2π[
	setAlpha(alpha:number);
	getAlpha(): number;
	// Pour la redéfinition d'objet (par exemple Point libre/Point sur) :
	attachTo(_o);
	deleteAlpha();
	getX(): number;
	getY(): number;
	setXY(x, y);
	setxy(x:number, y:number);
	getx(): number;
	gety(): number;
	// Seulement pour les points magnétiques :
	projectMagnetAlpha(p);
	setMagnetAlpha(p);
	/*************************************
	 ************************************* 
	 ***********  3D part  ***************
	 *************************************
	 *************************************/
	setXYZ(_coords:number[]);
	getXYZ(): number[];
	// Abscisse sauvegardée par le 1er tour
	// de compute, correspondant à phi=phi+delta :
	storeX();
	getOldcoords(): number[];
	coords3D(): number[];
	coords2D(): number[];
	getEXY();
	// Pour Blockly :
	setExpression(exy);
	// exy est soit une formule (string), soit un nombre. S'il s'agit
	// d'un nombre, c'est l'abscisse et le second param
	// est l'ordonnée. S'il s'agit d'une formule, et s'il y a un second
	// param, celui-ci est un booléen qui indique s'il s'agit ou non d'un point 3D.
	// S'il n'y a pas de second param, le logiciel détermine s'il s'agit d'un
	// point 2d ou 3d.
	// setExp pour les widgets  :
	setExp(exy, ey?);
	getExp(): string;
	near(_x:number, _y:number);
	dragObject(_x:number, _y:number);
	computeDrag();
	computeMagnets();
	checkMagnets();
	projectXY(_x, _y): number[];
	mouseInside(event:MouseEvent);
	refreshNames();
	paintLength(ctx:CanvasRenderingContext2D);
	paintName(ctx:CanvasRenderingContext2D);
	beginTrack();
	drawTrack(ctx:CanvasRenderingContext2D);
	paintObject(ctx:CanvasRenderingContext2D);
}
