/// <reference path="../typings/iTools.d.ts" />

import {Panel} from '../GUI/panels/Panel';

var $U = (<any>window).$U;
var $APP_PATH = (<any>window).$APP_PATH;

export class ToolBtn extends Panel implements iToolBtn {
	private canvas: iCanvas;
	private objectConstructor;
	private code: string;
	private procDown;
	private procUp;
	constructor(canvas:iCanvas, objectConstructor:any, _procDown, _procUp) {
		super(canvas.getDocObject());
		this.canvas = canvas;
		this.objectConstructor = objectConstructor;
		this.code = this.objectConstructor.getCode();
		this.procDown = _procDown;
		this.procUp = _procUp;
		switch (this.objectConstructor.getType()) {
			case 0:
				this.addImage($APP_PATH+"NotPacked/images/tools/bg_standard2.svg");
				break;
			case 1:
				this.addImage($APP_PATH+"NotPacked/images/tools/bg_property2.svg");
				break;
		}
		this.addImage($APP_PATH+"NotPacked/images/tools/"+this.code+".svg");
		//console.log($APP_PATH+"NotPacked/images/tools/"+this.code+".svg");
		this.transition("scale", 0.1);
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.setBounds(-500, -500, 10, 10);
		this.applyTransitionOUT();
		this.docObject.addEventListener('touchstart', function (event:Event) {
			event.preventDefault();
			if (event.touches.length === 1) {
				var touch = event.touches[0] || event.changedTouches[0];
				var e = $U.PadToMouseEvent(touch);
				this.procDown(e);
			}
		}, false);
		this.docObject.addEventListener('touchmove', (event:Event) => {
			event.preventDefault();
			this.canvas.touchMoved(event);
		}, false);
		this.docObject.addEventListener('touchend', (event:Event) => {
			event.preventDefault();
			this.canvas.touchEnd(event);
		}, false);
		this.docObject.addEventListener('mousedown', (e) => this.procDown(e), false);
		this.docObject.addEventListener('mouseup', (e) => this.procUp(e), false);
		this.applyTransitionIN();
	}
	show() {
	}
	close() {
		this.applyTransitionOUT();
	}
	hide() {
		this.applyTransitionOUT();
	}
	init(left:number, top:number, width:number, height:number) {
		var bounds = this.getOwnerBounds();
		this.setBounds(bounds.left + left, bounds.top + top, width, height);
		this.show();
	}
}
