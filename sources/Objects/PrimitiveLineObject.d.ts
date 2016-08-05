/// <reference path="./ConstructionObject.d.ts" />

type VirtualPointObject = {};

interface PrimitiveLineObject extends ConstructionObject {
	P1: VirtualPointObject;
	getAssociatedTools():string;
	isCoincident(_C:any):boolean;
	getXmax():number;
	getYmax():number;
	getXmin():number;
	getYmin():number;
	getFamilyCode():string;
	getAlphaBounds(anim:any):number[];
	getAnimationSpeedTab():number[];
	getAnimationParams(x0:number, y0:number, x1:number, y1:number):any;
	setDXDY(_x0:number, _y0:number, _x1:number, _y1:number);
	getNDX():number;
	getNDY():number;
	getDX():number;
	getDY():number;
	getP1():VirtualPointObject;
	mouseInside(ev:MouseEvent): boolean;
	dragObject(_x:number, _y:number);
	computeDrag();
	// Calcule les coordonnées du symétrique d'un point _M par rapport à moi :
	reflect(_M:any, _P:VirtualPointObject);
	intersectLineCircle(_C:any, _P:VirtualPointObject);
	intersectLineLine(_D, _P:VirtualPointObject);
	intersectLineQuadric(_Q:any, _P:VirtualPointObject);
	intersect(_C:any, _P:VirtualPointObject);
	initIntersect2(_C:any, _P:VirtualPointObject);
	// Calcule les coordonnées du symétrique d'un point P(_x;_y) par rapport à moi :
	reflectXY(_x:number, _y:number): number[];
	intersectXY(_C:any, _x:number, _y:number): number[];
	projectXY(_x:number, _y:number): number[];
	project(p:VirtualPointObject);
	projectAlpha(p:VirtualPointObject);
	setAlpha(p:VirtualPointObject);
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb:number, _linear:boolean): any[];
	setLocusAlpha(p:VirtualPointObject, a:number);
	compute();
	paintObject(ctx:CanvasRenderingContext2D);
	beginTrack();
	drawTrack(ctx:CanvasRenderingContext2D);
	// Alpha, dans le repère coordsSystem de l'objet Construction.
	// (for CaRMetal .zir translation)
	transformAlpha(_alpha:number): number;
}
