/// <reference path="../typings/iEraser.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {Panel} from '../GUI/panels/Panel';
import {Checkbox} from '../GUI/elements/Checkbox';

var $L = (<any>window).$L;

export class EraserPanel extends Panel implements iEraserPanel {
	private canvas: iCanvas;
	private man: iEraserManager;
	constructor(_canvas:iCanvas, _man) {
		super(_canvas);
		//$U.extend(this, new Panel(_canvas));
		this.canvas = _canvas;
		this.man = _man;
		this.setAttr("className", "erase_messageDIV");
		this.transition("scale", 0.2);
		var cbApplyAll = new Checkbox(this.getDocObject(), 0, 0, 250, 35, this.man.filters['global'], $L.erase_ckb_show_hidden, this.ShowHiddensCallback);
		cbApplyAll.setTextColor("#252525");
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(() => this.canvas.getDocObject().parentNode.removeChild(this.getDocObject()), 300);
	}
	private ShowHiddensCallback(val) {
		this.man.filters['global'] = val;
		this.man.refreshDisplay();
	}
}
