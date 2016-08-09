/// <reference path="../typings/iNames.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {NamesPanel} from './NamesPanel';

export class NamesManager implements iNamesManager {
	private canvas: iCanvas;
	private Cn: iConstruction;
	private visible: boolean;
	private top: number;
	private left: number;
	private width: number;
	private height: number;
	private panel: NamesPanel;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
		this.Cn = this.canvas.getConstruction();
		this.visible = false;
		this.left = 0;
		this.top = 0;
		this.width = 500;
		this.height = 170;
		this.panel = new NamesPanel(<HTMLBodyElement>window.document.body, this.left, this.top, this.width, this.height, ()=>this.Cn.getNames(), ()=>this.close());
		this.left = this.canvas.getWidth() - this.width - 5;
		this.top = this.canvas.getHeight() - this.height - this.canvas.prefs.controlpanel.size - 5;
	}
	isVisible(): boolean {
		return this.panel.isVisible()
	}
	show() {
		this.panel.show()
	}
	hide() {
		this.panel.hide()
	}
	refresh() {
		this.panel.refreshkeyboard()
	}
	getName() {
		return this.panel.getName();
	}
	setName(_o) {
		if (this.panel.isVisible()) {
			_o.setName(this.panel.getName());
			_o.setShowName(true);
			this.panel.refreshkeyboard();
		}
	}
	replaceName(_o) {
		if (this.panel.isVisible() && this.panel.isEditMode()) {
			_o.setName(this.panel.getName());
			_o.setShowName(true);
			this.panel.refreshkeyboard();
			return true;
		}
		return false;
	}
	setObserver(fn:()=>string[]) {
		if (this.panel != null) this.panel.setObserver(fn);
	}
	private close() {
		this.canvas.selectNameBtn(false);
	}
}
