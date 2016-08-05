/// <reference path="../../typings/iCanvas.d.ts" />

import {Panel} from './Panel';

export class VerticalBorderPanel extends Panel {
	protected canvas: iCanvas;
	protected isLeft: boolean;
	constructor(canvas:iCanvas, width:number, isLeft:boolean) {
		super(canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = canvas;
		this.width  = width;
		this.isLeft = isLeft;
		this.setAttr('className', 'verticalPanel');
		this.transition('translate_x', 0.2, (this.isLeft) ? -this.width : this.width);
		//this.transition('translate_y', 0.2, (isLeft) ? -width : width);
		this.init();
	}
	show() {
		//document.body.parentNode.appendChild(this.getDocObject());
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(() => {
			//document.body.parentNode.removeChild(this.getDocObject());
			this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
		}, 300);
	}
	init() {
		let t = this.getOwnerBounds();
		if (this.isLeft) {
			this.setBounds(t.left + 10, t.top + 10, this.width, t.height - 20 - this.canvas.prefs.controlpanel.size);
		} else {
			this.setBounds(t.left + t.width - this.width - 10, t.top + 10, this.width, t.height - 20 - this.canvas.prefs.controlpanel.size);
		}
	}
}
