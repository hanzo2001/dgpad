/// <reference path="../../typings/GUI/iElementContainer.d.ts" />

export abstract class ElementContainer implements iElementContainer {
	protected docObject: HTMLElement;
	getDocObject(): HTMLElement {
		return this.docObject;
	}
	getDocObjectBounds(): BoundDim {
		let top   = this.docObject.offsetTop   || 0;
		let left  = this.docObject.offsetLeft  || 0;
		let width = this.docObject.offsetWidth || 0;
		let height= this.docObject.offsetHeight|| 0;
		return {top,left,width,height};
	}
	appendChild(e: HTMLElement): HTMLElement {
		return <HTMLElement>this.docObject.appendChild(e);
	}
}
