/// <reference path="./iElementContainer.d.ts" />

declare type GUIStyleObject = {[name:string]: string};

declare type BoundStyle = {
	top: string;
	left: string;
	width: string;
	height: string;
};

interface iBasicGUIElement extends iElementContainer {
	setBoundDim(dim: BoundDim, units?:string);
	setBoundObj(style: BoundStyle);
	setBounds(left:number, top:number, width:number, height:number, units?:string);
	getBounds(): BoundDim;
	getOwnerBounds(): BoundDim;
	getStyle(p:string): string;
	setStyle(p:string, v:string);
	setStyles(style:string);
	setStylesObject(o: GUIStyleObject);
	getAttr(n:string): string;
	setAttr(n:string, v:string);
	hide();
	show();
	isVisible(): boolean;
	setLayer(layer:number);
	hasContent(ge: iBasicGUIElement);
	addContent(ge: iBasicGUIElement);
	removeContent(ge: iBasicGUIElement);
	clearContent();
	setAbsolute();
	setPosition(mode:string);
	setColor(color:string);
	setBackgroundColor(color:string);
	setBackgroundImage(src:string);
}
