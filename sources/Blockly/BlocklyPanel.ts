/// <reference path="../typings/iBlockly.d.ts" />
/// <reference path='../typings/iCanvas.d.ts' />

var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $APP_PATH = (<any>window).$APP_PATH;

// Large Dependency!!!
var Blockly;// this should be loaded from some place

function stl(el:HTMLElement, p:string, v:string) {
	el.style.setProperty(p, v);
}

function stls(el:HTMLElement, styleStr:string) {
	let t = styleStr.split(';');
	let i=0, s=t.length;
	while (i<s) {
		let a = t[i++].split(':');
		el.style.setProperty(a[0].trim(),a[1].trim());
	}
}

function bnds(el:HTMLElement, l, t, w, h) {
	stls(el,`top:${t}px;left:${l}px;width:${w}px;height:${h}px;`);
}

function moveDown(el:HTMLElement, fn:(e)=>void) {
	el.addEventListener('touchstart', fn, false);
	el.addEventListener('mousedown', fn, false);
	//el.event_proc.push(_p);
};
function moveUp(el:HTMLElement, fn:(e)=>void) {
	el.addEventListener('touchend', fn, false);
	el.addEventListener('mouseup', fn, false);
	//el.event_proc.push(_p);
};

export class BlocklyPanel implements iBlocklyPanel {
	private owner;
	private canvas: iCanvas;
	private left: number;
	private top: number;
	private width: number;
	private height: number;
	private wp: HTMLElement;
	private tl: HTMLElement;
	private mn: HTMLElement;
	private cb: HTMLElement;
	private ct: HTMLElement;
	private rz: HTMLElement;
	private tb: HTMLElement;
	private closeCallback: () => void;
	private currentTabCallback: () => void;
	private tabs: HTMLElement[];
	private tab_width: number;
	private tab_height: number;
	private tab_gap: number;
	private tab_left_margin: number;
	private currentTab: number;
	private xx: number;
	private yy: number;
	private tl_str: string;
	private tl_height: number;
	private cb_width: number;
	private cb_margin_top: number;
	private cb_margin_right: number;
	private rz_width: number;
	private rz_margin: number;
	private ph_margin: number;
	private pl_margin: number;
	private tb_height: number;
	DIV: HTMLElement;
	XML: HTMLElement;
	private dragListeners: {[type:string]: (e) => void};
	private resizeListeners: {[type:string]: (e) => void};
	constructor(_owner, _canvas:iCanvas, _closeCallback, _currentTabCallBack, _height:number) {
		this.canvas = _canvas;
		this.owner = _owner;
		this.closeCallback = _closeCallback;
		this.currentTabCallback = _currentTabCallBack;
		this.tl_str = 'DG-Blocks'; // Window title
		this.tl_height = 28; // Title bar height
		this.cb_width = 20; // Close box width
		this.cb_margin_top = 3; // Margins from top
		this.cb_margin_right = 5; // Margins from right
		// var mn_width = 20; // Settings box width
		// var mn_margin_top = 3; // Margins from top
		// var mn_margin_left = 5; // Margins from left
		this.rz_width = 20; // Resize box width
		this.rz_margin = 3; // Resize box margin
		this.ph_margin = 10; // Panel margin from top and bottom
		this.pl_margin = 10; // Panel margin from left
		this.tb_height = 30; // Bottom toolbar height
		this.left = 0;
		this.top = 0;
		this.width = 0;
		this.height = 0;
		this.tabs = []; // tab set
		this.tab_width = 80; // tab width
		this.tab_height = 20; // tab height
		this.tab_gap = 5; // gap between tabs
		this.tab_left_margin = 133; // space before tabs
		this.currentTab = -1; // Current selected tab
		this.xx = 0;
		this.yy = 0;
		this.wp = document.createElement('div'); // main div wrapper
		this.tl = document.createElement('div'); // title bar div
		this.mn = document.createElement('div'); // Contextual menu div
		this.cb = document.createElement('div'); // close box div
		this.ct = document.createElement('div'); // content div
		this.rz = document.createElement('div'); // resize box div
		this.tb = document.createElement('div'); // bottom toolbar div
		var xml = document.createElement('div'); // div for loading Blockly categories
		var cb_src = $APP_PATH + 'NotPacked/images/dialog/closebox.svg'; // Closebox image
		// var mn_src = $APP_PATH + 'NotPacked/images/dialog/settings.svg'; // Settings image
		var rz_src = $APP_PATH + 'NotPacked/images/dialog/resize.svg'; // Closebox image
		// xml.att('id', 'dgpad_xml');
		bnds(xml,0, 0, 0, 0);
		stls(this.wp,'position:absolute;border-bottom-left-radius:10px;border-bottom-right-radius:10px;overflow:hidden;border: 1px solid #b4b4b4;transition:transform 0.2s linear;transform:scale(0);z-index:9000');
		stls(this.tl,'cursor:all-scroll;background-color:rgba(210,210,210,1);position:absolute;font-size: 16px;font-family: Helvetica, Arial, sans-serif;text-shadow: 1px 1px 5px #777;text-align: center;white-space: pre-wrap;margin: 0px;vertical-align:middle');
		// stls(this.mn,'background-color:rgba(0,0,0,0);position:absolute;background-position:center;background-repeat:no-repeat;background-size:100% 100%');
		// stl(this.mn,'background-image', 'url(' + mn_src + ')');
		stls(this.cb,'background-color:rgba(0,0,0,0);position:absolute;background-position:center;background-repeat:no-repeat;background-size:100% 100%');
		stl(this.cb,'background-image', 'url(' + cb_src + ')');
		stls(this.rz,'background-color:rgba(0,0,0,0);position:absolute;background-position:center;background-repeat:no-repeat;background-size:100% 100%;cursor:se-resize');
		stl(this.rz,'background-image', 'url(' + rz_src + ')');
		stls(this.ct,'background-color:rgba(230, 230, 230, 0.4);position:absolute')
		// rl.stls('position:absolute;background-color:rgba(230,230,230,0.5);border: 0px;cursor:ew-resize')
		stls(this.tb,'background-color:rgba(200, 200, 200, 0.9);position:absolute')
		this.tl.innerHTML = this.tl_str;
		moveDown(this.cb, (e) => this.hide(e));
		moveDown(this.tl, (e) => this.dragdown(e));
		moveDown(this.rz, (e) => this.resizedown(e));
		moveUp(this.tl, (e) => this.dragup(e));
		moveUp(this.rz, (e) => this.resizeup(e));
		this.setbounds(this.pl_margin, this.ph_margin - 1, 600, _height - 2 * this.ph_margin);
		this.wp.appendChild(xml);
		this.wp.appendChild(this.tl);
		this.wp.appendChild(this.ct);
		this.wp.appendChild(this.tb);
		this.wp.appendChild(this.cb);
		this.wp.appendChild(this.mn);
		this.wp.appendChild(this.rz);
		this.show();
		this.DIV = this.ct;
		this.XML = xml;
	}
	getMode(): number {
		return this.currentTab;
	}
	setbounds(left, top, width, height) {
		var ch = this.canvas.getHeight() - this.tl_height;
		var cw = this.canvas.getWidth();
		this.left = (left + width < 20) ? 20 - width : ((left > cw - 20) ? cw - 20 : left);
		this.top = (top < 0) ? 0 : ((top > ch) ? ch : top);
		this.width = width;
		this.height = height;
		bnds(this.wp,left, top, width, height);
		bnds(this.tl,0, 0, width, this.tl_height);
		stl(this.tl,'line-height', this.tl_height + 'px');
		bnds(this.cb,width - this.cb_width - this.cb_margin_right, this.cb_margin_top, this.cb_width, this.cb_width);
		// bnds(this.mn,mn_margin_left, mn_margin_top, mn_width, mn_width);
		bnds(this.ct,0, this.tl_height + 1, width, height - this.tl_height - this.tb_height - 2);
		// rl.bnds(width - rl_width, 0, rl_width, height);
		bnds(this.tb,0, height - this.tb_height, width, this.tb_height);
		bnds(this.rz,width - this.rz_width - this.rz_margin, height - this.rz_width - this.rz_margin, this.rz_width, this.rz_width);
		var toolbox = <HTMLElement>document.getElementsByClassName('blocklyToolboxDiv')[0];
		if (toolbox !== undefined) {
			toolbox.style['left'] = (left + 1) + 'px';
			toolbox.style['top'] = (top + this.tl_height + 2) + 'px';
			toolbox.style['height'] = (height - this.tl_height - this.tb_height - 3) + 'px';
		};
		// if (typeof Blockly !== 'undefined') Blockly.fireUiEvent(window, 'resize');
	}
	getBounds() {
		return {
			l: this.left,
			t: this.top,
			w: this.width,
			h: this.height
		}
	}
	hide(event:Event) {
		// window.prompt(Blockly.JavaScript.workspaceToCode(Blockly.mainWorkspace))
		// Blockly.mainWorkspace.updateToolbox('<xml id='toolbox' style='display: none'><block type='dgpad_point'></block></xml>');
		this.closeCallback();
		// event.stopPropagation();
		event.preventDefault();
		setTimeout(() => {
			stls(this.wp,'transform:scale(0)');
		}, 1);
		setTimeout(() => {
			// if (typeof Blockly !== 'undefined') Blockly.fireUiEvent(window, 'resize');
			this.owner.removeChild(this.wp);
		}, 210);
	}
	show() {
		if (this.wp.parentNode === null) {this.owner.appendChild(this.wp);}
		setTimeout(() => {
			stls(this.wp,'transform:scale(1)');
		}, 1);
		setTimeout(() => {
			this.setbounds(this.left, this.top, this.width, this.height)
		}, 310);
	}
	isHidden(): boolean {
		return this.wp.parentNode === null;
	}
	setTitle(name:string) {
		this.tl.innerHTML = this.tl_str + ' : ' + name;
	}
	setMode(tabs:string[], current:string) {
		let i=0, s=this.tabs.length;
		while (i<s) {
			this.tb.removeChild(this.tabs[i++]);
		}
		this.tabs = [];
		this.currentTab = -1;
		i=0, s=tabs.length;
		while (i<s) {
			this.createtab($L.blockly.tabs[tabs[i++]]);
		}
		this.selectTab(tabs.indexOf(current));
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
		this.dragListeners = {
			'touchmove':(e) => this.dragmove(e),
			'touchend': (e) => this.dragup(e),
			'mousemove':(e) => this.dragmove(e),
			'mouseup':  (e) => this.dragup(e),
		};
		for (let type in this.dragListeners) {
			window.addEventListener(type,this.dragListeners[type],false);
		}
	}
	private dragup(event:Event) {
		event.preventDefault();
		for (let type in this.dragListeners) {
			window.removeEventListener(type,this.dragListeners[type],false);
		}
		this.dragListeners = null;
	}
	private resizemove(event:MouseEvent) {
		event.preventDefault();
		var w = (this.width + event.pageX - this.xx < 100) ? this.width : (this.width + event.pageX - this.xx);
		var h = (this.height + event.pageY - this.yy < 100) ? this.height : (this.height + event.pageY - this.yy);
		this.setbounds(this.left, this.top, w, h);
		this.xx = event.pageX;
		this.yy = event.pageY;
		if (typeof Blockly !== 'undefined') {Blockly.fireUiEvent(window, 'resize');}
	}
	private resizedown(event:MouseEvent) {
		event.preventDefault();
		this.xx = event.pageX;
		this.yy = event.pageY;
		this.resizeListeners = {
			'touchmove':(e) => this.resizemove(e),
			'touchend': (e) => this.resizeup(e),
			'mousemove':(e) => this.resizemove(e),
			'mouseup':  (e) => this.resizeup(e),
		};
		for (let type in this.resizeListeners) {
			window.addEventListener(type,this.resizeListeners[type],false);
		}
	}
	private resizeup(event:Event) {
		event.preventDefault();
		for (let type in this.resizeListeners) {
			window.removeEventListener(type,this.resizeListeners[type],false);
		}
		this.resizeListeners = null;
	}
	private selectTab(index:number) {
		// console.log(_s);
		if (index !== this.currentTab) {
			this.currentTab = index;
			let i=0, s=this.tabs.length;
			while (i<s) {
				stls(this.tabs[i++],'background-color:rgba(90,90,90,1);color:rgba(230,230,230,1)');
			}
			stls(this.tabs[index],'background-color:rgba(245,245,245,1);color:rgba(30,30,30,1)');
		}
	}
	// this.selectTab = function(_i) {
	//     selectTab(_i);
	// }
	private createtab(name:string) {
		var t = document.createElement('div');
		var i = this.tabs.length;
		moveDown(t,(event) => {
			event.preventDefault();
			this.selectTab(i);
			this.currentTabCallback;
		});
		stls(t,'cursor:pointer;border-left: 1px solid #b4b4b4;border-bottom: 1px solid #b4b4b4;border-right: 1px solid #b4b4b4;background-color:rgba(90,90,90,1);color:rgba(230,230,230,1);position:absolute;border-bottom-right-radius:10px;width:' + this.tab_width + 'px;height:' + this.tab_height + 'px;font-size: 14px;font-weight:normal;font-family: Helvetica, Arial, sans-serif;text-align: center;white-space: pre-wrap;margin: 0px;line-height:' + this.tab_height + 'px;vertical-align:middle;top:' + (-1) + 'px;left:' + (this.tab_left_margin + this.tabs.length * (this.tab_width + this.tab_gap)) + 'px');
		t.innerHTML = name;
		this.tb.appendChild(t);
		this.tabs.push(t);
	}
}
