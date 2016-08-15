/// <reference path="../iMacros.d.ts" />

interface iiPadDOMElt {
	childs: iiPadDOMElt[];
	parent: iiPadDOMElt;
	location: any;
	text: string;
	macro: iMacro;
	setStyle(p:string, v:string);
	stl(style:string);
	attr(n:string, v:string);
	evt(proc:(e)=>void);
	getDocObject(): HTMLElement;
	clr();
	appendChild(e:iiPadDOMElt);
	settxt(text:string);
	gettxt(): string;
	transform(t:string);
	transitionIN();
	transitionOUT(owner:iiPadDOMElt, opp?:boolean);
}
