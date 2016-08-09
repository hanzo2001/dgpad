/// <reference path="../typings/iCanvas.d.ts" />

import {Panel} from '../GUI/panels/Panel';
import {GUIElement} from '../GUI/elements/GUIElement';

var $P = (<any>window).$P;
var $APP_PATH = (<any>window).$APP_PATH;

export class MagnifierPanel extends Panel {
	private xx: number;
	private yy: number;
	private cW: number;
	private cnvs: GUIElement;
	private canvas: iCanvas;
	private ctx: CanvasRenderingContext2D;
	private downListener: (e) => void;
	private moveListener: (e) => void;
	private upListener: (e) => void;
	constructor(_canvas: iCanvas) {
		super(_canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = _canvas;
		this.xx = 0;
		this.yy = 0;
		this.left = $P.MagnifierBounds.l;
		this.top = $P.MagnifierBounds.t;
		this.width = $P.MagnifierBounds.w;
		this.height = $P.MagnifierBounds.w;
		this.cW = $P.MagnifierBounds.captureWidth;
		this.cnvs = new GUIElement(this, "canvas");
		this.ctx = this.cnvs.getDocObject().getContext('2d');
		this.setStyles("position:absolute;overflow:hidden;z-index:8;background-size:" + this.width + "px " + this.height + "px");
		this.setStyle("background-image", "url('" + $APP_PATH + "NotPacked/images/tools/loupe5.svg')");
		this.transition("scale", 0.2);
		this.cnvs.setStyles("position:absolute");
		this.cnvs.width = this.width;
		this.cnvs.height = this.height;
		this.addContent(this.cnvs);
		this.downListener = (e) => this.dragdown(e);
		this.addDownEvent(this.downListener);
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
		this.init();
	}
	init() {
		this.setBounds(this.left, this.top, this.width, this.height);
	}
	magnifierPaint(coords) {
		this.ctx.beginPath();
		this.ctx.clearRect(0, 0, this.width, this.height);
		if ((coords) && (!isNaN(coords.x)) && (!isNaN(coords.y)))
			if ((coords) && (!isNaN(coords.x)) && (!isNaN(coords.y)))
				this.ctx.drawImage(this.canvas.getDocObject(),
					coords.x - this.cW / 2, coords.y - this.cW / 2, this.cW, this.cW, 0, 0, this.width, this.height);
	}
	private dragmove(ev) {
		this.left += (ev.pageX - this.xx);
		this.top += (ev.pageY - this.yy);
		this.setStyle("left", this.left + "px");
		this.setStyle("top", this.top + "px");
		this.xx = ev.pageX;
		this.yy = ev.pageY;
	}
	private dragdown(ev) {
		this.xx = ev.pageX;
		this.yy = ev.pageY;
		this.moveListener = (e) => this.dragmove(e);
		this.upListener = (e) => this.dragup(e);
		this.addMoveEvent(this.moveListener, <any>window);
		this.addUpEvent(this.upListener, <any>window);
	}
	private dragup(ev) {
		this.removeMoveEvent(this.moveListener, <any>window);
		this.removeUpEvent(this.upListener, <any>window);
	}
}
