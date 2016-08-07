
interface MiniSelectorDictHash<T> {
	[key:string]: T;
}

interface MiniSelectorArrayHash<T> {
	length: number;
	[key:number]: T;
}

interface MiniSelectorExtendable {
	extend(clone:boolean, a:Object, ...args:Object[]): Object;
	extend(a:Object, ...args:Object[]): Object;
	extend(...args:Object[]): Object;
}

declare type MiniSelectorElementBounds = {top?:string,left?:string,width?:string,height?:string,position?:string};

interface MiniSelectorEvent extends Event {
	data: any;
}

declare type MiniSelectorListener = (e:MiniSelectorEvent) => void | boolean;

interface MiniSelector extends MiniSelectorExtendable {
	fn: MiniSelectorExtendable;
	(select:string|Node|Node[]): MiniSelectorResult;
	isObject(o:any): boolean;
	isResult(o:any): boolean;
	each(o:Object, fn:(v:any, k?:number|string)=>void);
	each(fn:(v:any, k?:number|string)=>void);
}

interface MiniSelectorResult extends MiniSelectorArrayHash<HTMLElement>, MiniSelectorExtendable {
	setStyle(p:string, v:string): MiniSelectorResult;
	setStyleString(str:string): MiniSelectorResult;
	setStyles(o: {[name:string]: string}): MiniSelectorResult;
	toggleVisibility(): MiniSelectorResult;
	setDisplayStyle(display:string): MiniSelectorResult;
	setBounds(bounds:MiniSelectorElementBounds): MiniSelectorResult;
	setAbsolute(): MiniSelectorResult;
	on(type:string, fn:MiniSelectorListener, data?:any): MiniSelectorResult;
	off(type?:string, fn?:MiniSelectorListener): MiniSelectorResult;
	children(): MiniSelectorResult;
	append(...args): MiniSelectorResult;
	remove(): MiniSelectorResult;
	empty(): MiniSelectorResult;
	text(txt:string): MiniSelectorResult;
}

declare type MiniSelectorHashIterator<T> = (v:T, i?:string|number) => void;

declare let S: MiniSelector;
