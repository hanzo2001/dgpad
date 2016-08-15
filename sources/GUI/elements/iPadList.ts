
import {iPadDOMElt} from './iPadDOMElt';
import {Macro} from '../../Macros/Macro';

export class iPadList {
	protected items: any[];
	protected wr: iiPadDOMElt;
	protected ct: iiPadDOMElt;
	protected label: iiPadDOMElt;
	protected rootLI: iiPadDOMElt;
	protected currentUL: iiPadDOMElt;
	protected backBtn: iiPadDOMElt;
	protected proc: (li: iiPadDOMElt, macro: iMacro) => void;
	constructor(owner:HTMLElement, proc:(li,macro)=>void, name:string, left:number, top:number, width:number, height:number) {
		this.items = [];
		this.wr = new iPadDOMElt('div');
		this.ct = new iPadDOMElt('div');
		this.label = new iPadDOMElt('div');
		this.rootLI = new iPadDOMElt('li');
		this.currentUL = null;
		this.backBtn = new iPadDOMElt('a');
		this.proc = proc;
		this.label.stl('position:absolute;left:0px;top:0px;width:' + width + 'px;height:30px;line-height:30px;color:#252525;font-family:Helvetica, Arial, sans-serif;font-size:13px;text-align:center');
		this.label.settxt(name);
		this.rootLI.childs = [];
		this.rootLI.parent = null;
		this.backBtn.attr('className', 'iPadBtnBack');
		this.backBtn.settxt('Bacthis.k');
		this.wr.attr('className', 'iPadListMasterDIV');
		this.wr.stl(`left:${left}px;top:${top}px;width:${width}px;height:${height}px`);
		this.ct.attr('className', 'iPadListContentDIV');
		this.wr.appendChild(this.ct);
		this.wr.appendChild(this.backBtn);
		this.wr.appendChild(this.label);
		owner.appendChild(this.wr.getDocObject());
	}
	getCurrentPath(): string {
		if (!this.currentUL) {return '';}
		let path = '';
		let li = this.currentUL.location;
		while (li.parent) {
			path = li.gettxt() + '/' + path;
			li = li.parent;
		}
		return path;
	}
	// r est le refcon passé éventuellement à la methode me.append.
	// La liste se place dans le dossier contenant le LI cible, et
	// ensuite scroll la liste pour que le LI soit visible :
	targetLI(_r) {
		//console.log('target!');
		let i = 0;
		while (i < this.items.length && this.items[i].macro !== _r) {i++;}
		if (this.items[i].macro === _r) {
			let li = this.items[i];
			this.touchDir(li.parent, true);
			let pos = 0;
			while (li.parent.childs[pos] !== li) {pos++;}
			let tf = pos * li.o().offsetHeight;
			let d = this.ct.getDocObject();
			let s = 5; // vitesse : nombre de pixels par 100eme de seconde
			let t0 = d['scrollTop'];
			if (t0 !== tf) {
				let i = s * (tf - t0) / Math.abs(tf - t0);
				let interval = setInterval(function() {
					d['scrollTop'] = t0;
					t0 += i;
					if (Math.abs(tf - t0) < s) {
						d['scrollTop'] = tf;
						clearInterval(interval);
					}
				}, 10);
			}
		}
	}
	show() {
		this.touchDir(this.rootLI, false);
	}
	reInit() {
		let i=0, s=this.items.length;
		while (i<s) {this.items[i++].settxt(this.items[i].text);}
	}
	append(name:string, macro?:iMacro) {
		let t = name.split('/');
		let dir = this.rootLI;
		for (let i = 0; i < (t.length - 1); i++) {dir = this.DirLI(dir, t[i]);}
		let item = new iPadDOMElt('li');
		item.settxt(t[t.length - 1]);
		item.text = t[t.length - 1];
		item.evt((event:Event) => {
			event.preventDefault();
			this.touchItem(item);
		});
		item.attr('className', 'iPadListLI');
		item.parent = dir;
		item.macro = macro ? null : macro;
		dir.childs.push(item);
		this.items.push(item);
	}
	getDocObject(): HTMLElement {
		return this.wr ? this.wr.getDocObject() : null;
	}
	// Un item (pas un répertoire) a été tapé :
	private touchItem(li:iPadDOMElt) {
		this.proc(li, li.macro);
	}
	// Si le bouton back a été pressé, _back est true,
	// sinon c'est qu'on a tapé sur un répertoire dans la liste :
	private touchDir(li:iiPadDOMElt, back:boolean) {
		if (this.currentUL) {this.currentUL.transitionOUT(this.ct, back);}
		this.currentUL = new iPadDOMElt('ul');
		this.currentUL.location = li;
		this.currentUL.attr('className', 'iPadListUL');
		if (back) {this.currentUL.transform('-100');}
		for (let i = 0; i < li.childs.length; i++) {this.currentUL.appendChild(li.childs[i]);}
		this.ct.appendChild(this.currentUL);
		this.currentUL.transitionIN();
		if (li === this.rootLI) {this.backBtn.stl('visibility:hidden');}
		else {
			this.backBtn.stl('visibility:visible');
			this.backBtn.settxt(li.gettxt());
			this.backBtn.evt((event:Event) => {
				event.preventDefault();
				this.touchDir(li.parent, true);
			});
		}
	}
	private newDirLI(parent:iiPadDOMElt): iPadDOMElt {
		let li = new iPadDOMElt('li');
		li.childs = [];
		li.parent = parent;
		li.attr('className', 'iPadListLI');
		li.evt((event:Event) => {
			event.preventDefault();
			this.touchDir(li,false);
		});
		return li;
	}
	private DirLI(parent:iiPadDOMElt, name:string): iiPadDOMElt {
		let i=0, s=parent.childs.length;
		while (i<s) {
			if (parent.childs[i].gettxt() === name) {return parent.childs[i];}
			i++;
		}
		let arrow = new iPadDOMElt('div');
		let li = this.newDirLI(parent);
		li.settxt(name);
		arrow.attr('className', 'iPadArrowRight');
		li.appendChild(arrow);
		parent.childs.push(li);
		return li;
	}
}
