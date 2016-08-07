/// <reference path="../../typings/GUI/iBasicGUIElement.d.ts" />

import {ElementContainer} from './ElementContainer';

export class BasicGUIElement extends ElementContainer implements iBasicGUIElement {
	protected owner: iElementContainer;
	protected top: number;
	protected left: number;
	protected width: number;
	protected height: number;
	constructor(owner: iElementContainer, type: string) {
		super();
		this.owner = owner;
		this.docObject = document.createElement(type);
	}
	setBoundDim(dim: BoundDimensions, units?:string) {
		this.top   = dim.top;
		this.left  = dim.left;
		this.width = dim.width;
		this.height= dim.height;
		if (!units) {units = 'px'}
		this.docObject.style.top   = dim.top+units;
		this.docObject.style.left  = dim.left+units;
		this.docObject.style.width = dim.width+units;
		this.docObject.style.height= dim.height+units;
	}
	setBoundObj(style: BoundStyle) {
		this.docObject.style.top   = style.top;
		this.docObject.style.left  = style.left;
		this.docObject.style.width = style.width;
		this.docObject.style.height= style.height;
	}
	setBounds(left:number, top:number, width:number, height:number, units?:string) {
		this.setBoundDim({top,left,width,height},units||'px');
	}
	getBounds(): BoundDimensions {
		return {
			left:  this.left,
			top:   this.top,
			width: this.width,
			height:this.height
		};
	}
	getOwnerBounds(): BoundDimensions {
		// let top   = this.owner.docObject.offsetTop   || 0;
		// let left  = this.owner.docObject.offsetLeft  || 0;
		// let width = this.owner.docObject.offsetWidth || 0;
		// let height= this.owner.docObject.offsetHeight|| 0;
		// return {top,left,width,height};
		return this.owner.getDocObjectBounds();
	}
	getStyle(p:string): string {
		return this.docObject.style.getPropertyValue(p);
	}
	setStyle(p:string, v:string) {
		this.docObject.style.setProperty(p,v);
	}
	setStyles(style:string) {
		let t=style.split(';'), i=0, s=t.length;
		while (i<s) {
			let [p,v] = t[i].split(':');
			this.setStyle(p.trim(),v.trim());
		}
	}
	setStylesObject(o: GUIStyleObject) {
		for (let i in o) {
			this.docObject.style.setProperty(i,o[i]);
		}
	}
	getAttr(n:string): string {
		return this.docObject.getAttribute(n);
	}
	setAttr(n:string, v:string) {
		this.docObject.setAttribute(n,v);
	}
	hide() {
		this.docObject.style.setProperty('visibility','hidden');
	}
	show() {
		this.docObject.style.setProperty('visibility','visible');
	}
	isVisible(): boolean {
		return this.docObject.style.visibility  === 'visible';
	}
	setLayer(layer:number) {
		this.docObject.style.setProperty('z-index',layer+'');
	}
	hasContent(ge: BasicGUIElement) {
		return ge && ge.docObject && ge.docObject.parentNode === this.docObject;
	}
	addContent(ge: BasicGUIElement) {
		this.docObject.appendChild(ge.docObject);
	}
	removeContent(ge: BasicGUIElement) {
		try {
			this.docObject.removeChild(ge.docObject);
		} catch (e) {
			console.log(e);
		}
	}
	clearContent() {
		let p, l = this.docObject.lastChild;
		while (l) {
			p = l.previousSibling;
			this.docObject.removeChild(l);
			l = p;
		}
	}
	setAbsolute() {
		this.docObject.style.position = 'absolute';
		this.docObject.style.margin = '0px';
		this.docObject.style.padding = '0px';
	}
	setPosition(mode:string) {
		this.docObject.style.position = mode;
	}
	setColor(color:string) {
		this.docObject.style.backgroundColor = color;
	}
	setBackgroundColor(color:string) {
		this.docObject.style.backgroundColor = color;
	}
	setBackgroundImage(src:string) {
		this.docObject.style.backgroundImage = src;
		this.docObject.style.backgroundSize  = '100%';
		this.docObject.style.backgroundRepeat= 'no-repeat';
	}
}
