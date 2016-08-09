/// <reference path="./Objects/iConstructionObject.d.ts" />

interface iBlocklyObject {
	getXML(): string;
	getSNC(): string;
	setBehavior(_m:string, _xml:string, _sync:string, _async);
	evaluate();
	setChilds(_childs);
	getChilds();
	setParents(_parents);
	getParents();
}

interface iBlocklyObjects {
	setMode(_tab, _cur);
	getMode();
	isEmpty(): boolean;
	getCn();
	getObj();
	clear();
	setCurrent(_c);
	getCurrent();
	getCurrentObj();
	getCurrentXML();
	get(_m);
	getXML(_m);
	getSNC(_m);
	setChilds(_m, _childs);
	setParents(_m, _childs);
	evaluate(_m);
	setBehavior(_m, _xml, _sync, _async);
	getSource();
	setSource(_src);
}

interface iTurtleObject {
	isOn(): boolean;
	reset(_n);
	show(P:iPointObject);
	hide();
	changeUVW(name:string, u: number[], v: number[], w: number[]);
	changePT(name:string, P);
	paint();
}

interface iBlocklyPanel {
	DIV;
	XML;
	getMode(): number;
	setbounds(left:number, top:number, width:number, height:number);
	getBounds();
	hide(event:Event);
	show();
	isHidden(): boolean;
	setTitle(name:string);
	setMode(tabs:string[], current:string);
}

interface iBlocklyManager {
	paintTurtle();
	changeTurtleUVW(name:string, u: number[], v: number[], w: number[]);
	changeTurtlePT(name:string, P:iPointObject);
	resetTurtle(name:string);
	tryEdit(o);
	edit(_o);
	print(txt:string);
}

interface iBlocklyButtonObject extends iConstructionObject {
	getAssociatedTools(): string;
	getCode(): string;
	getFamilyCode(): string;
	run();
	setLabel(label:string);
	getLabel(): string;
	paintObject(ctx:CanvasRenderingContext2D);
	setXY(x:number, y:number);
	startDrag(x:number, y:number);
	compute();
	getSource(src);
	insideButton(event:MouseEvent);
	mouseInside(event:MouseEvent);
}
