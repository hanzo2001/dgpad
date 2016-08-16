/// <reference path="../../typings/iCanvas.d.ts" />

import {Panel} from './Panel';
import {BubbleListPanel} from './BubbleListPanel';

var $U = (<any>window).$U;

export class BubblePanel extends Panel {
	protected canvas: iCanvas;
	protected x: number;
	protected y: number;
	protected callback;
	protected closeFn: ()=>void;
	protected listener: (e:Event)=>void;
	constructor(canvas:iCanvas, exec, close, event:MouseEvent, _t, title:string, width:number, height:number, titleheight:number) {
		super(canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = canvas;
		this.x = canvas.mouseX(event) + 5;
		this.y = canvas.mouseY(event) - 45;
		this.width = width;
		this.height = height;
		this.callback = exec;
		this.closeFn = close;
		this.setAttr("className", "coincidencePanel");
		this.transition("scale", 0.15);
		let bubbleList = new BubbleListPanel(this, _t, this.width, this.height, titleheight, title);
		this.init();
		this.show();
	}
	isVisible() {
		return (this.getDocObject().parentNode !== null);
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(() => {
			if (this.getDocObject().parentNode !== null) {
				this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
			}
			let action = $U.isMobile.any() ? 'touchstart' : 'mousedown';
			window.removeEventListener(action,this.listener, false);
			this.closeFn();
		}, 300);
	}
	exec(args) {
		this.callback(args);
		this.close();
	}
	init() {
		this.setBounds(this.x,this.y,this.width,this.height);
		let action = $U.isMobile.any() ? 'touchstart' : 'mousedown';
		if (!this.listener) {this.listener = this.closeIfNeeded.bind(this);}
		window.addEventListener(action,this.listener,false);
	}
	private closeIfNeeded(event:MouseEvent) {
		let x = this.canvas.mouseX(event);
		let y = this.canvas.mouseY(event);
		if (x < this.x || y < this.y || x > (this.x + this.width) || y > (this.y + this.height)) {
			this.close();
		}
	}
}
