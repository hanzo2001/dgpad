/// <reference path="./iConstructionObject.d.ts" />

interface iLocusPoint {
	alpha:number;
	x:number;
	y:number;
	x1:number;
	y1:number;
	r:number;
}
/*
interface iPoint {
	fill: number;
	text: string[];
	x:number;
	y:number;
	tab:number[];
	r:number;
	g:number;
	b:number;
	rgb:string;
	sz:number;
	pz:number;
	fnt:any[];
}
*/
interface iListObject extends iConstructionObject {
	setArrow(_t);
	getArrow(): number[];
	getEXP();
	setSegmentsSize(size:number);
	getSegmentsSize(): number;
	getAssociatedTools(): string;
	isInstanceType(_c): boolean;
	getCode(): string;
	getFamilyCode(): string;
	setShape(shape:number);
	getShape(): number;
	getPtNum(_i:number): number[];
	getPtLength(): number;
	projectXY(x:number, y:number): number[];
	project(p);
	projectAlpha(p);
	setAlpha(p);
	initLocusArray(_nb): iLocusPoint[];
	setLocusAlpha(p, i:number);
	mouseInside(event:MouseEvent): boolean;
	compute();
	paintObject(ctx: CanvasRenderingContext2D);
	getSource(src);
}
