/// <reference path="./MiniSelector.d.ts" />

import {DOMStorage} from '../DOMStorage/DOMStorage';

(function(global){
	let trim = String.prototype.trim;
	let slice = Array.prototype.slice;
	let isArr = Array.isArray;
	let proto = Object.getPrototypeOf;
	let nul = () => Object.create(null);
	let isObj = (o) => o && typeof o === 'object';
	let fEach = Array.prototype.forEach;
	let count = (o) => Object.keys(o).length;
	function oEach<T>(o:Object, fn:MiniSelectorHashIterator<T>)
	function oEach<T>(fn:MiniSelectorHashIterator<T>) {
		let o = arguments.length > 1 ? arguments[0] : this;
		for (let i in o) {fn(o[i],i);}
		return o;
	}
	function iterateChildElements(o:HTMLElement, fn:(c:HTMLElement)=>void) {
		let i=0, cs=o.childNodes, s=cs.length;
		while (i<s) {
			let c = cs[i++];
			if (c.nodeType === Node.ELEMENT_NODE) {fn(<HTMLElement>c);}
			else {
				i++;
				continue;
			}
		}
		return o;
	}
	function traverseAllQuickly(m:Node, fn:(o:Node, depth?:number)=>void) {
		let q: Node[] = [];
		let n: Node;
		let i = -1;
		let d = 0;
		while (m) {
			if (m === q[i]) {// is queued
				q.pop();// branch done
				n = m.previousSibling;// store next
				fn(m, d);
				if (!d) {break;}// finished
				m = n;// mutate to next
				if (!m) {m = q[--i], d--;}// mutate to parent, depth--
			} else {// is not queued
				q[++i] = m;// queue
				if (m.lastChild) {m = m.lastChild, d++;}// child found, mutate, depth++
			}
		}
	}
	// Main Utility: MiniSelector
	var lib: MiniSelector = (function(){
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
						if (isObj(c)) {c = (<any>c).clone ? (<any>c).clone() : extend(proto(c)?{}:nul(),c);}
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
		class Factory implements MiniSelectorArrayHash<Node> {
			selector:string;
			length: number;
			[index:number] : HTMLElement;
			constructor(a:Node[], selector:string) {
				extend(this,a);
				Object.defineProperty(this,'length',{value:a.length})
				Object.defineProperty(this,'selector',{value:selector})
			}
		}
		var selector: any = function(select:string|Node|Node[]) {
			let nodeList: Node[];
			let selector: string = null;
			if (select instanceof Node) {
				nodeList = [select];
			} else if (Array.isArray(select)) {
				nodeList = select;
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
		extend(Factory.prototype,{extend});
		selector.fn = Factory.prototype;
		selector.fn.extend({
			each: oEach,
		});
		return selector;
	}());
	// Style methods
	(function(lib:MiniSelector){
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
			setBounds: function (bounds:MiniSelectorElementBounds) {
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
	(function(lib:MiniSelector){

		interface ListenerData {
			length: number;
			type: string;
			node();
			listen();
			ignore();
			clear();
			push(fn:MiniSelectorListener): number;
			splice(fn:MiniSelectorListener): number|boolean;
		}

		type EventTypeHash = MiniSelectorDictHash<ListenerData>;

		let dataId:string = 'eventHashId';

		class ListenerData implements ListenerData {
			protected listener: MiniSelectorListener = null;
			protected fn: MiniSelectorListener[] = [];
			constructor(
				protected e: Node,
				type: string,
				protected useCapture: boolean,
				protected data: any
			) {
				Object.defineProperties(this,{
					'type': {value: type},
					'length': {get: function () {return this.fn.length;}}
				});
				this.listener = (e:MiniSelectorEvent) => {
					e.data = this.data;
					let i=0, s=this.fn.length, go=true;
					while (go && i<s) {go = this.fn[i++].call(this.e,e) !== false;}
				};
				this.listen();
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
			push(fn:MiniSelectorListener): number {
				this.splice(fn);
				return this.fn.push(fn);
			}
			splice(fn:MiniSelectorListener): number|boolean {
				let index = this.fn.indexOf(fn);
				if (index<0) {return false;}
				this.fn.splice(index,1);
				return this.fn.length;
			}
		}
		class ListenerFactory {
			private hash: DOMStorage<EventTypeHash>;
			constructor() {
				this.hash = new DOMStorage<EventTypeHash>(dataId);
			}
			on(e:Node, type:string, fn:MiniSelectorListener, data?:any, useCapture:boolean=false): Node {
				let events = this.hash.collect(<HTMLElement>e);
				if (!events) {
					events = nul();
					this.hash.push(<HTMLElement>e,events);
				}
				let o = events[type];
				if (!events[type]) {
					o = new ListenerData(e,type,false,data);
					events[type] = o;
				}
				o.push(fn);
				return e;
			}
			off(e:Node, type?:string, fn?:MiniSelectorListener, useCapture:boolean=false) {
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
					oEach<ListenerData>(events,function(event:ListenerData){event.clear();});
				});
				this.hash.clear();
			}
		}
		lib.extend({_eventFactory: new ListenerFactory()});
		lib.fn.extend({
			on: function (type:string, fn:MiniSelectorListener, data?:any) {
				let i=0, s=this.length;
				while (i<s) {(<any>lib)._eventFactory.on(this[i++],type,fn,data);}
				return this;
			},
			off: function (type?:string, fn?:MiniSelectorListener) {
				let i=0, s=this.length;
				while (i<s) {(<any>lib)._eventFactory.off(this[i++],type,fn);}
				return this;
			},
			clearAllEvents: function () {
				(<any>lib)._eventFactory.clearAll();
				return this;
			}
		});
	}(lib));
	// Manipulation methods
	(function(lib:MiniSelector){
		function removeNodeHook(o:HTMLElement) {
			if (o.dataset) {(<any>lib)._eventFactory.off(o);}
			o.parentNode && o.parentNode.removeChild(o);
		}
		lib.fn.extend({
			children,
			append,
			remove,
			empty,
			text
		});
		function children() {
			let i=0, s=this.length;
			let cs:Node[] = [];
			while (i<s) {
				let e = <HTMLElement>this[i++];
				cs = cs.concat(slice.call(e.childNodes));
			}
			return lib(cs);
		}
		function append(...args): MiniSelectorResult {
			let i=0, s=arguments.length, a=<Node[]>[], e=<HTMLElement>this[0];
			if (e) while (i<s) {
				let c = arguments[i++];
				if (isArr(c)) {
					(<Node[]>c).forEach((v)=>a.push(e.appendChild(v)));
				} else {
					a.push(e.appendChild(c));
				}
			}
			return lib(a);
		}
		function remove(): MiniSelectorResult {
			let i=0, s=this.length;
			while (i<s) {
				let e = <HTMLElement>this[i++];
				traverseAllQuickly(e,removeNodeHook);
			}
			return this;
		}
		function empty(): MiniSelectorResult {
			let i=0, s=this.length;
			while (i<s) {
				let e = <HTMLElement>this[i++];
				if (e.nodeType !== Node.ELEMENT_NODE) {
					e.parentNode.removeChild(e);
					i++;
					continue;
				}
				slice.call(e.childNodes).forEach((o:Node) => traverseAllQuickly(o,removeNodeHook));
			}
			return this;
		}
		function text(txt:string): MiniSelectorResult {
			let i=0, s=this.length;
			while (i<s) {
				let e = <HTMLElement>this[i++];
				slice.call(e.childNodes).forEach((o:Node) => traverseAllQuickly(o,removeNodeHook));
				e.appendChild(document.createTextNode(txt));
			}
			return this;
		}
	}(lib));
	global.S = lib;
}(window));

export default S;
