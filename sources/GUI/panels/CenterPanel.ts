/// <reference path="../../typings/iCanvas.d.ts" />

import {Panel} from './Panel';

export class CenterPanel extends Panel {
	protected canvas: iCanvas;
	constructor(canvas:iCanvas, width:number, height:number) {
		super(canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this.setAttr("className", "centerPanel");
		this.transition("scale", 0.2);
		this.init();
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(() => {this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());}, 300);
	}
	init() {
		let t = this.getOwnerBounds();
		this.setBounds(t.left + (t.width - this.width) / 2, t.top + (t.height - this.height) / 2, this.width, this.height);
	}
}
