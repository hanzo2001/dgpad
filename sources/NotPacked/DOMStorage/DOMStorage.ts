/// <reference path="./DOMStorage.d.ts" />

export class DOMStorage<T> implements DOMStorage<T> {
	protected i:number;
	protected s:string;
	protected h:{[i:number]:T};
	constructor(dataId:string) {
		this.s = dataId;
		this.i = 0;
		this.h = Object.create(null);
	}
	push(e:HTMLElement, d:T) {
		let i = ++this.i;
		this.h[i] = d;
		e.dataset[this.s] = i.toString(16);
	}
	collect(e:HTMLElement): T {
		let i = e.dataset[this.s];
		return this.h[i] || null;
	}
	remove(e:HTMLElement): T {
		let i = e.dataset[this.s];
		let d = this.h[i] || null;
		delete this.h[i];
		e.dataset[this.s] = '';
		return d;
	}
	clear() {
		for (let i in this.h) {this.h[i] = null;}
		this.h = Object.create(null);
		this.i = 0;
	}
	each(fn:(d:T, i?:number)=>void, tArg=null) {
		for (let i in this.h) {fn.call(tArg,this.h[i],i);}
	}
}
