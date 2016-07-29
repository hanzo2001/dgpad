
var $U = (<any>window).$U;

export class iPadDOMElt {
	protected CLK: boolean;
	protected docObject: HTMLElement;
	childs: any[];
	parent: any;
	location: any;
	text: any;
	macro: any;
	constructor(type:string) {
		this.CLK = true;
		this.docObject = document.createElement(type);
	}
	setStyle(p:string, v:string) {
		this.docObject.style.setProperty(p,v);
	};
	stl(style:string) {
		let t = style.split(';'), i=0, s=t.length;
		while (i<s) {
			let a = t[i++].split(':');
			this.docObject.style.setProperty(a[0].trim(),a[1].trim());
		}
	};
	attr(n:string, v:string) {
		this.docObject.setAttribute(n,v);
	};
	evt(proc) {
		// Encore du bricolage pour les navigateurs android... :
		if ($U.isMobile.android()) {
			this.docObject.addEventListener('touchstart', () => this.touchstart(), false);
			this.docObject.addEventListener('touchmove', () => this.touchmove(), false);
			this.docObject.addEventListener('touchend', (e) => this.CLK && proc(e), false);
		} else {
			this.docObject.addEventListener('mousedown', proc, false);
		}
	};
	o() {
		return this.docObject;
	};
	clr() {
		let a = this.docObject, p, l = a.lastChild;
		while (l) {
			p = l.previousSibling;
			a.removeChild(l);
			l = p;
		}
	};
	add(o:any) {
		this.docObject.appendChild(o.docObject);
	};
	settxt(text:string) {
		this.attr('textContent',text);
	};
	gettxt() {
		return this.docObject.getAttribute('textContent');
	};
	transform(t) {
		this.stl('transform:translateX(' + t + '%);-webkit-transform:translateX(' + t + '%);-moz-transform:translateX(' + t + '%);-o-transform:translateX(' + t + '%)');
	};
	transitionIN() {
		setTimeout(() => this.transform(0), 1);
	};
	transitionOUT(owner, opp) {
		let pc = opp === undefined || !opp ? '-100' : '100';
		setTimeout(() => this.transform(pc), 1);
		setTimeout(() => owner.docObject.removeChild(this.docObject), 200);
	};
	private touchstart() {
		this.CLK = true;
	};
	private touchmove() {
		this.CLK = false;
	};
}
