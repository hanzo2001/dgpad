/// <reference path="../typings/iNames.d.ts" />
/// <reference path="../typings/iUtils.d.ts" />

import {Checkbox} from '../GUI/elements/Checkbox';

var $U = (<any>window).$U;
var $APP_PATH = (<any>window).$APP_PATH;

export class NamesPanel implements iNamesPanel {
	private owner: HTMLBodyElement;
	private getNames: () => string[];
	private cb_src: string;
	private top: number;
	private left: number;
	private width: number;
	private height: number;
	private closeProc: () => void;
	private tl_height: number;
	private cb_width: number;
	private cb_margin: number;
	private tb_height: number;
	private replace_mode: boolean;
	private tabs: ExpandoDOMElement[];
	private mods: ExpandoDOMElement[];
	private keys: ExpandoDOMElement[];
	private modtab: string[];
	private tab_width: number;
	private tab_height: number;
	private tab_gap: number;
	private tab_left_margin: number;
	private mod_width: number;
	private mod_height: number;
	private mod_margin: number;
	private key_width: number;
	private key_height: number;
	private current_tab: number;
	private current_mod: number;
	private current_key: number;
	private kb_margins: number;
	private cbox_left: number;
	private cbox_top: number;
	private cbox_width: number;
	private cbox_height: number;
	private xx: number;
	private yy: number;
	private wp: ExpandoDOMElement;
	private tl: ExpandoDOMElement;
	private cb: ExpandoDOMElement;
	private md: ExpandoDOMElement;
	private kb: ExpandoDOMElement;
	private rl: ExpandoDOMElement;
	private tb: ExpandoDOMElement;
	private dragEvents: {[type:string]:(e:MouseEvent) => void};
	private resizeEvents: {[type:string]:(e:MouseEvent) => void};
	constructor(_owner: HTMLBodyElement, _l: number, _t: number, _w: number, _h: number, _observerproc:()=>string[], _closeproc:()=>void) {
		this.owner = _owner;
		this.top = _t;
		this.left = _l;
		this.width = _w;
		this.height = _h;
		this.getNames = _observerproc;
		this.closeProc = _closeproc;
		this.cb_src = $APP_PATH+'NotPacked/images/dialog/closebox.svg'; // Closebox image
		this.tl_height = 30; // Title bar this.height
		this.cb_width = 20; // Close box this.width
		this.cb_margin = 5; // Close box margin from right
		this.tb_height = 0; // Bottom toolbar this.height
		this.replace_mode = false; // edit mode
		this.tabs = []; // tab set
		this.mods = []; // modifiers
		this.keys = []; // keyboard this.keys
		this.modtab = ['', "'", "''", '\u2080'];
		this.tab_width = 60; // tab this.width
		this.tab_height = 25; // tab this.height
		this.tab_gap = 5; // gap between this.tabs
		this.tab_left_margin = 70; // space before this.tabs
		this.mod_width = 50; // modifier this.width
		this.mod_height = 25; // modifier this.height
		this.mod_margin = 10; // modifier this.left and right margin
		this.key_width = 35; // keyboard key this.width
		this.key_height = 30; // keyboard key this.height
		this.current_tab = -1; // Current selected tab
		this.current_mod = -1; // Current selected modifier
		this.current_key = -1; // Current key
		this.kb_margins = 10; // margins around keyboard
		this.cbox_left = 5;
		this.cbox_top = 2;
		this.cbox_width = 60;
		this.cbox_height = 30;
		this.xx = 0;
		this.yy = 0;
		this.wp = <ExpandoDOMElement>$U.createDiv(); // main div wrapper
		this.tl = <ExpandoDOMElement>$U.createDiv(); // title bar div
		this.cb = <ExpandoDOMElement>$U.createDiv(); // close box div
		this.md = <ExpandoDOMElement>$U.createDiv(); // modifiers div
		this.kb = <ExpandoDOMElement>$U.createDiv(); // Keyboard div
		this.rl = <ExpandoDOMElement>$U.createDiv(); // resize vertical line div
		this.tb = <ExpandoDOMElement>$U.createDiv(); // bottom toolbar div
		this.wp.stls('position:absolute;z-index:9000;border-bottom-left-radius:10px;border-bottom-right-radius:10px;overflow:hidden;border: 1px solid #b4b4b4;transition:transform 0.2s linear;transform:scale(0)');
		this.tl.stls('background-color:rgba(210,210,210,1);position:absolute');
		this.cb.stls('background-color:rgba(0,0,0,0);position:absolute;background-position:center;background-repeat:no-repeat;background-size:100% 100%');
		this.cb.stl('background-image', 'url(' + this.cb_src + ')');
		this.md.stls('background-color:rgba(230, 230, 230, 0.9);position:absolute');
		this.kb.stls('background-color:rgba(230, 230, 230, 0.9);position:absolute');
		this.tb.stls('background-color:rgba(200, 200, 200, 0.9);position:absolute');
		this.createtab('A', 'ABCDEFGHI_JKLMNOPQR_STUVWXYZ');
		this.createtab('a', 'abcdefghi_jklmnopqr_stuvwxyz');
		this.createtab('\u0394', '\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398_\u0399\u039A\u039B\u039C\u039D\u039E\u039F\u03A0_\u03A1\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9');
		this.createtab('\u03B4', '\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9_\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1_\u03C2\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03C9');
		this.select_tab(0);
		this.cb.md(this.hide);
		this.wp.md(this.dragdown);
		this.wp.mu(this.dragup);
		this.setbounds(this.left, this.top, this.width, this.height);
		this.wp.add(this.tl);
		this.wp.add(this.md);
		this.wp.add(this.kb);
		this.wp.add(this.tb);
		this.wp.add(this.cb);
		let editbox = new Checkbox(this.wp, this.cbox_left, this.cbox_top, this.cbox_width, this.cbox_height, this.replace_mode, '\u270D', this.setEdit.call(this));
		editbox.setTextFontSize(28);
		editbox.setTextColor('#252525');
	}
	isEditMode(): boolean {
		return this.replace_mode
	}
	setObserver(fn:() => string[]) {
		this.getNames = fn;
	}
	setbounds(l:number, t:number, w:number, h:number) {
		this.left = l;
		this.top = t;
		this.width = w;
		this.height = h;
		this.wp.bnds(l, t, w, h);
		this.tl.bnds(0, 0, w, this.tl_height);
		this.cb.bnds(
			w - this.cb_width - this.cb_margin,
			(this.tl_height - this.cb_width) / 2,
			this.cb_width,
			this.cb_width
			);
		this.md.bnds(
			w - this.mod_width - 2 * this.mod_margin,
			this.tl_height,
			this.mod_width + 2 * this.mod_margin,
			h - this.tl_height - this.tb_height
		);
		this.kb.bnds(
			0,
			this.tl_height,
			w - this.mod_width - 2 * this.mod_margin,
			h - this.tl_height - this.tb_height
		);
		this.tb.bnds(0, h - this.tb_height, w, this.tb_height);
	}
	getBounds(): {t:number,l:number,w:number,h:number} {
		return {
			l: this.left,
			t: this.top,
			w: this.width,
			h: this.height
		}
	}
	hide() {
		setTimeout(() => this.wp.stls('transform:scale(0)'), 1);
		setTimeout(() => {
			this.owner.removeChild(this.wp);
			this.closeProc();
		}, 210);
	}
	show() {
		if (this.wp.parentNode === null) {this.owner.appendChild(this.wp);}
		setTimeout(() => this.wp.stls('transform:scale(1)'), 1);
	}
	isVisible(): boolean {
		return (this.wp.parentNode !== null)
	}
	refreshkeyboard() {
		let nmes = this.getNames(); // All names already used
		for (let i = 0; i < this.keys.length; i++) {
			let t = this.keys[i];
			if (nmes.indexOf(this.keys[i].key) != -1) {
				t.rmevt();
				t.stls('background-color:rgba(200,200,200,1);color:rgba(150,150,150,1)');
			} else {
				this.seton(i);
			}
		}
		this.showCurrentKey();
		if (this.current_key === -1) {
			this.current_key = 0;
			this.showCurrentKey();
		}
	}
	getName(): string {
		return this.current_key !== -1
			? this.keys[this.current_key].key
			: 'P';
	}
	private setEdit(mode:boolean) {
		this.replace_mode = mode;
	}
	private dragmove(event:MouseEvent) {
		event.preventDefault();
		this.setbounds(this.left + event.pageX - this.xx, this.top + event.pageY - this.yy, this.width, this.height);
		this.xx = event.pageX;
		this.yy = event.pageY;
	}
	private dragdown(event:MouseEvent) {
		event.preventDefault();
		this.xx = event.pageX;
		this.yy = event.pageY;
		this.dragEvents = {
			'touchmove':(e) => this.dragmove(e),
			'touchend': (e) => this.dragup(e),
			'mousemove':(e) => this.dragmove(e),
			'mouseup':  (e) => this.dragup(e),
		};
		for (let i in this.dragEvents) {window.addEventListener(i, this.dragEvents[i], false)}
	}
	private dragup(event:MouseEvent) {
		event.preventDefault();
		if (this.dragEvents) {
			for (let i in this.dragEvents) {window.removeEventListener(i, this.dragEvents[i], false)}
			this.dragEvents = null;
		}
	}
	private resizemove(event:MouseEvent) {
		event.preventDefault();
		let w = (this.width + event.pageX - this.xx < 100) ? this.width : (this.width + event.pageX - this.xx);
		this.setbounds(this.left, this.top, w, this.height);
		this.xx = event.pageX;
	}
	private resizedown(event:MouseEvent) {
		event.preventDefault();
		this.xx = event.pageX;
		this.resizeEvents = {
			'touchmove':(e) => this.resizemove(e),
			'touchend': (e) => this.resizeup(e),
			'mousemove':(e) => this.resizemove(e),
			'mouseup':  (e) => this.resizeup(e),
		};
		for (let i in this.resizeEvents) {window.addEventListener(i,this.resizeEvents[i], false);}
	}
	private resizeup(event:MouseEvent) {
		event.preventDefault();
		if (this.resizeEvents) {
			for (let i in this.resizeEvents) {window.removeEventListener(i,this.resizeEvents[i], false);}
			this.resizeEvents = null;
		}
	}
	private showCurrentKey() {
		if (this.current_key === -1) {return;}
		let nmes = this.getNames(); // All names already used
		for (let i = this.current_key; i < this.keys.length; i++) {
			if (nmes.indexOf(this.keys[i].key) === -1) {
				this.current_key = i;
				this.keys[i].stls('background-color:rgba(50,50,50,1);color:rgba(230,230,230,1)');
				return;
			}
		}
		this.current_key = -1;
	}
	private seton(keyIndex:number) {
		let t = this.keys[keyIndex];
		t.stls('background-color:rgba(200,200,200,1);color:rgba(30,30,30,1)');
		t.rmevt();
		t.md(() => this.selectkey(keyIndex));
	}
	private selectkey(keyIndex:number) {
		this.current_key = keyIndex;
		this.refreshkeyboard();
	}
	private createkey(_s, _x, _y) {
		let t = <ExpandoDOMElement>$U.createDiv();
		let i = this.keys.length;
		t.md(() => this.selectkey(i));
		t.stls('border: 1px solid #b4b4b4;background-color:rgba(200,200,200,1);color:rgba(30,30,30,1);position:absolute;border-radius:5px;width:' + this.key_width + 'px;height:' + this.key_height + 'px;font-size: 18px;font-weight:normal;font-family: Helvetica, Arial, sans-serif;text-align: center;white-space: pre-wrap;margin: 0px;line-height:' + this.key_height + 'px;vertical-align:middle;top:' + _y + 'px;left:' + _x + 'px');
		t.innerHTML = _s;
		t.key = _s;
		this.kb.add(t);
		this.keys.push(t);
	}
	private initkeyboard() {
		this.keys = [];
		let kbd = this.tabs[this.current_tab].letters;
		let m = this.mods[this.current_mod].car;
		this.kb.innerHTML = '';
		let h = (this.height - this.tl_height - this.tb_height);
		let vgap = (h - kbd.length * this.key_height) / (kbd.length + 1);
		let i=0, s=kbd.length;
		while (i<s) {
			let w = this.width - this.mod_width - 2 * this.mod_margin;
			let hgap = (w - kbd[i].length * this.key_width) / (kbd[i].length + 1);
			let j=0, t=kbd[i].length;
			while (j<t) {
				this.createkey(kbd[i][j] + m, hgap + j * (this.key_width + hgap), vgap + i * (this.key_height + vgap));
				j++;
			}
			i++;
		}
		this.current_key = 0;
		this.refreshkeyboard();
	}
	private select_mod(_s) {
		this.current_mod = _s;
		let i=0, s=this.mods.length;
		while (i<s) {this.mods[i].stls('background-color:rgba(90,90,90,1);color:rgba(230,230,230,1)');};
		this.mods[_s].stls('background-color:rgba(200,200,200,1);color:rgba(30,30,30,1)');
		this.initkeyboard();
	}
	private createmod(_c:string, _m:string[]) {
		let t = <ExpandoDOMElement>$U.createDiv();
		let h = (this.height - this.tl_height - this.tb_height);
		let gap = (h - _m.length * this.mod_height) / (_m.length + 1);
		let i = this.mods.length;
		t.md(() => this.select_mod(i));
		t.stls('border: 1px solid #b4b4b4;background-color:rgba(90,90,90,1);color:rgba(230,230,230,1);position:absolute;border-radius:5px;width:' + this.mod_width + 'px;height:' + this.mod_height + 'px;font-size: 18px;font-weight:bold;font-family: Helvetica, Arial, sans-serif;text-align: center;white-space: pre-wrap;margin: 0px;line-height:' + this.mod_height + 'px;vertical-align:middle;top:' + (gap + i * (this.mod_height + gap)) + 'px;left:' + this.mod_margin + 'px');
		t.innerHTML = _c + _m[i];
		t.car = _m[i];
		this.md.add(t);
		this.mods.push(t);
	}
	private initmods(_c:string, _m:string[]) {
		this.mods = [];
		this.md.innerHTML = '';
		let i=0, s=_m.length;
		while (i<s) {this.createmod(_c, _m), i++;};
	}
	private select_tab(_s) {
		if (_s !== this.current_tab) {
			this.current_tab = _s;
			let i=0, s=this.tabs.length;
			while (i<s) {this.tabs[i++].stls('background-color:rgba(90,90,90,1);color:rgba(230,230,230,1)');};
			this.tabs[_s].stls('background-color:rgba(230,230,230,1);color:rgba(30,30,30,1)');
			this.initmods(this.tabs[_s].letters[0][0], this.modtab);
			this.select_mod(0);
		}
	}
	private createtab(_n, _c) {
		let t = <ExpandoDOMElement>$U.createDiv();
		let i = this.tabs.length;
		t.md(() => this.select_tab(i));
		t.stls('border-left: 1px solid #b4b4b4;border-top: 1px solid #b4b4b4;border-right: 1px solid #b4b4b4;background-color:rgba(90,90,90,1);color:rgba(230,230,230,1);position:absolute;border-top-right-radius:10px;width:' + this.tab_width + 'px;height:' + this.tab_height + 'px;font-size: 18px;font-weight:bold;font-family: Helvetica, Arial, sans-serif;text-align: center;white-space: pre-wrap;margin: 0px;line-height:' + this.tab_height + 'px;vertical-align:middle;top:' + (this.tl_height - this.tab_height) + 'px;left:' + (this.tab_left_margin + this.tabs.length * (this.tab_width + this.tab_gap)) + 'px');
		t.innerHTML = _n;
		let temp = _c.split('_');
		t.letters = [];
		let k=0, s=temp.length;
		while (k<s) {t.letters[k++] = (temp[k]).split('');}
		this.tl.add(t);
		this.tabs.push(t);
	}
}
