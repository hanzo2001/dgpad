
import {HashStorageForElements as Hash} from './HashStorageForElements';

type ElementBounds = {top?:string,left?:string,width?:string,height?:string,position?:string,};

type AbstractEventListener = (e:Event) => void | boolean;

interface Extendable {
	extend(clone:boolean, a:Object, ...args:Object[]): Object;
	extend(a:Object, ...args:Object[]): Object;
	extend(...args:Object[]): Object;
}

interface Selector extends Extendable {
	fn: Extendable;
	(select:string|Node|Node[]): SelectorResult;
	isObject(o:any): boolean;
	isResult(o:any): boolean;
	each(o:Object, fn:(v:any, k?:number|string)=>void);
	each(fn:(v:any, k?:number|string)=>void);
}

interface DictHash<T> {
	[key:string]: T;
}

interface ArrayHash<T> {
	length: number;
	[key:number]: T;
}

interface SelectorResult extends ArrayHash<Node>, Extendable {
	setStyle(p:string, v:string): SelectorResult;
	setStyleString(str:string): SelectorResult;
	setStyles(o: {[name:string]: string}): SelectorResult;
	toggleVisibility(): SelectorResult;
	setDisplayStyle(display:string): SelectorResult;
	setBounds(bounds:ElementBounds): SelectorResult;
	setAbsolute(): SelectorResult;
	on(type:string, fn:AbstractEventListener, data?:any);
	off(type:string, fn?:AbstractEventListener);
}

(function(){
	let trim = String.prototype.trim;
	let slice = Array.prototype.slice;
	let isArr = Array.isArray;
	let proto = Object.getPrototypeOf;
	let nul = () => Object.create(null);
	let isObj = (o) => o && typeof o === 'object';
	let fEach = Array.prototype.forEach;
	let count = (o) => Object.keys(o).length;
	function oEach(o:Object, fn:(v:any, i?:string|number)=>void)
	function oEach(fn:(v:any, i?:string|number)=>void) {
		let o = arguments.length > 1 ? arguments[0] : this;
		for (let i in o) {fn(o[i],i);}
		return o;
	}
	// Main Utility: Selector
	var lib: Selector = (function(){
		function extend(clone:boolean, a:Object, ...args:Object[]): Object
		function extend(a:Object, ...args:Object[]): Object
		function extend(...args:Object[]): Object {
			let a: Object, b: Object, c: Object;
			let s:number, i:string, j:number = 0;
			let clone = typeof args[0] === 'boolean' ? <boolean>args.shift() : false;
			a = args.shift();
			if (!a) {return this;}
			s = args.length;
			if (s === 0) {s = args.push(a), a = this;}
			if (clone) {
				while (j<s) {
					b = args[j++];
					for (i in b) {
						c = b[i];
						if (isArr(c)) {c = extend([],c);}
						else
						if (isObj(c)) {
							c = (<any>c).clone ? (<any>c).clone() : extend(proto(c)?{}:nul(),c);
						}
						a[i] = c;
					}
				}
			} else {
				while (j<s) {
					b = args[j++];
					for (i in b) {a[i] = b[i];}
				}
			}
			return a;
		}
		class Factory {
			length: number;
			[index:number] : Node;
			constructor(a:Node[], public selector:string) {
				extend(this,a);
				Object.defineProperty(this,'length',{value:a.length})
			}
		}
		var selector: any = function(select:string|Node|Node[]) {
			let nodeList: Node[];
			let selector: string = null;
			if (select instanceof Node) {
				nodeList = [select];
			} else if (Array.isArray(select)) {
			} else {
				nodeList = slice.call(document.querySelectorAll(<string>select));
				selector = select;
			}
			return new Factory(nodeList,selector);
		}
		Factory.prototype = nul();
		selector.extend = extend;
		extend(selector,{
			each: oEach,
			isObject: isObj,
			isResult: (o) => o instanceof Factory,
		});
		extend(Factory.prototype,extend);
		selector.fn = Factory.prototype;
		selector.fn.extend({
			each: oEach,
		});
		return selector;
	}());
	// Style methods
	(function(lib:Selector){
		lib.fn.extend({
			setStyle: function (p:string, v:string) {
				let i=0, s=this.length;
				while (i<s) {(<HTMLElement>this[i++]).style.setProperty(p,v);}
				return this;
			},
			setStyleString: function (str:string) {
				let ts = str.split(';').map(trim).map((v)=>v.split(':'));
				let i=0, j, s=this.length, t=ts.length;
				while (i<s) {
					j=0;
					while (j<t) {this[i].style.setProperty(ts[j][0],ts[j][1]), j++;}
					i++;
				}
				return this;
			},
			setStyles: function (o: {[name:string]: string}) {
				let i=0, s=this.length;
				while (i<s) {
					for (let j in o) {this[i].style.setProperty(j,o[j]);}
					i++;
				}
				return this;
			},
			toggleVisibility: function () {
				let i=0, s=this.length, hidden: boolean;
				while (i<s) {
					hidden = this[i].style.getProperty('visibility') === 'hidden';
					this[i++].style.setProperty('visibility',hidden?'visible':'hidden');
				}
				return this;
			},
			setDisplayStyle: function (display:string) {
				let i=0, s=this.length;
				while (i<s) {
					this[i++].style.setProperty('display',display);
				}
				return this;
			},
			setBounds: function (bounds:ElementBounds) {
				let i=0, s=this.length;
				while (i<s) {
					for (let j in bounds) {this[i].style.setProperty(j,bounds[j]);}
					i++;
				}
				return this;
			},
			setAbsolute: function () {
				return this.setStyles({position:'absolute',margin:'0',padding:'0'});
			}
		});
	}(lib));
	// Event Engine
	(function(lib:Selector){

		type EventTypeHash = DictHash<ListenerData>;

		var _i = 0;
		function idGenerator(): number {return ++_i;}
		let dataId:string = 'eventHashId';

		class ListenerData {
			length: number;
			type: string;
			protected listener: AbstractEventListener = null;
			protected fn: AbstractEventListener[] = [];
			constructor(
				protected e: Node,
				type: string,
				protected useCapture: boolean,
				protected data: any
			) {
				this.init();
				Object.defineProperties(this,{
					'type': {value: type},
					'length': {get: function () {return this.fn.length;}}
				});
			}
			node() {
				return this.e;
			}
			listen() {
				this.e && this.e.addEventListener(this.type,this.listener,this.useCapture);
			}
			ignore() {
				this.e && this.e.removeEventListener(this.type,this.listener,this.useCapture);
			}
			clear() {
				this.ignore();
				this.e = null;
				this.listener = null;
				this.fn = [];
			}
			push(fn:AbstractEventListener): number {
				return this.fn.push(fn);
			}
			splice(fn:AbstractEventListener): number|boolean {
				let index = this.fn.indexOf(fn);
				if (index<0) {return false;}
				this.fn.splice(index,1);
				return this.fn.length;
			}
			init() {
				this.listener = (e:Event) => {
					(<any>e).data = this.data;
					let i=0, s=this.fn.length, go=true;
					while (go && i<s) {go = this.fn[i++].call(this.e,e) !== false;}
				};
				this.listen();
			}
		}
		class ListenerFactory {
			private hash: Hash<EventTypeHash>;
			constructor() {
				this.hash = new Hash<EventTypeHash>(dataId);
			}
			on(e:Node, type:string, fn: AbstractEventListener, data?:any, useCapture:boolean=false): Node {
				let events = this.hash.collect(<HTMLElement>e);
				let o: ListenerData;
				if (events) {
					o = events[type] || null;
				} else {
					events = nul();
					this.hash.push(<HTMLElement>e,events);
					o = new ListenerData(e,type,false,data);
					events[type] = o;
				}
				o.push(fn);
				return e;
			}
			off(e:Node, type?:string, fn?:AbstractEventListener, useCapture:boolean=false) {
				let events = this.hash.collect(<HTMLElement>e);
				if (!events) {return e;}
				if (type === undefined) {
					for (type in events) {events[type].clear();}
					this.hash.remove(<HTMLElement>e);
				} else if (!fn) {
					let o = events[type];
					o.clear();
					if (!count(events)) {this.hash.remove(<HTMLElement>e);}
				} else {
					let o = events[type];
					if (!o.splice(fn)) {
						o.clear();
						if (!count(events)) {this.hash.remove(<HTMLElement>e);}
					}
				}
				return e;
			}
			clearAll() {
				this.hash.each(function(events){
					oEach(events,function(event:ListenerData){event.clear();});
				})
				this.hash.clear();
			}
		}
		lib.extend({_eventFactory: new ListenerFactory()});
		lib.fn.extend({
			on: function (type:string, fn: AbstractEventListener, data?:any) {
				let i=0, s=this.length;
				while (i<s) {(<any>lib)._eventFactory.on(this[i++],type,fn,data);}
			},
			off: function (type:string, fn?: AbstractEventListener) {
				let i=0, s=this.length;
				while (i<s) {(<any>lib)._eventFactory.off(this[i++],type,fn);}
			},
			clearAllEvents: function () {
				(<any>lib)._eventFactory.clearAll();
			}
		});
	}(lib));
	
}());
