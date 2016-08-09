
import {iPadDOMElt} from './iPadDOMElt';

export class iPadList {
	protected items: any[];
	protected wr: iPadDOMElt;
	protected ct: iPadDOMElt;
	protected label: iPadDOMElt;
	protected rootLI: iPadDOMElt;
	protected currentUL: iPadDOMElt;
	protected backBtn: iPadDOMElt;
	protected proc: (li, macro) => void;
	constructor(owner, proc:(li,macro)=>void, name:string, left:number, top:number, width:number, height:number) {
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
		this.wr.add(this.ct);
		this.wr.add(this.backBtn);
		this.wr.add(this.label);
		owner.appendChild(this.wr.o());
	}
	getCurrentPath() {
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
			let d = this.ct.o();
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
	append(_txt, _refcon?) {
		let t = _txt.split('/');
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
		item.macro = _refcon ? null : _refcon;
		dir.childs.push(item);
		this.items.push(item);
	}
	getDocObject() {
		return this.wr ? this.wr.o() : null;
	}
	// Un item (pas un répertoire) a été tapé :
	private touchItem(_li) {
		this.proc(_li, _li.macro);
	}
	// Si le bouton back a été pressé, _back est true,
	// sinon c'est qu'on a tapé sur un répertoire dans la liste :
	private touchDir(_li, _back) {
		if (this.currentUL) {this.currentUL.transitionOUT(this.ct, _back);}
		this.currentUL = new iPadDOMElt('ul');
		this.currentUL.location = _li;
		this.currentUL.attr('className', 'iPadListUL');
		if (_back) {this.currentUL.transform(-100);}
		for (let i = 0; i < _li.childs.length; i++) {this.currentUL.add(_li.childs[i]);}
		this.ct.add(this.currentUL);
		this.currentUL.transitionIN();
		if (_li === this.rootLI) {this.backBtn.stl('visibility:hidden');}
		else {
			this.backBtn.stl('visibility:visible');
			this.backBtn.settxt(_li.gettxt());
			this.backBtn.evt((event:Event) => {
				event.preventDefault();
				this.touchDir(_li.parent, true);
			});
		}
	}
	private newDirLI(_parent) {
		let li = new iPadDOMElt('li');
		li.childs = [];
		li.parent = _parent;
		li.attr('className', 'iPadListLI');
		li.evt((event:Event) => {
			event.preventDefault();
			this.touchDir(li,false);
		});
		return li;
	}
	private DirLI(_parent, _t) {
		let i=0, s=_parent.childs.length;
		while (i<s) {
			if (_parent.childs[i].gettxt() === _t) {return _parent.childs[i];}
			i++;
		}
		let newLI = this.newDirLI(_parent);
		newLI.settxt(_t);
		let arrow = new iPadDOMElt('div');
		arrow.attr('className', 'iPadArrowRight');
		newLI.add(arrow);
		_parent.childs.push(newLI);
		return newLI;
	}
}
