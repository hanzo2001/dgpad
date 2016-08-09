/// <reference path="../typings/iCanvas.d.ts" />

import {CenterPanel} from '../GUI/panels/CenterPanel';
import {GUIElement} from '../GUI/elements/GUIElement';
import {Label} from '../GUI/elements/Label';
import {CloseBox} from '../GUI/elements/CloseBox';

var $L = (<any>window).$L;

export class PrintPanel extends CenterPanel {
	private editBox: GUIElement;
	private x: number;
	private y: number;
	private closeProc:iGUIElementEvent;
	private dragListeners: {[type:string]: (e) => void};
	constructor(canvas:iCanvas, closeProc:iGUIElementEvent) {
		var width = 450;
		var height = 300;
		super(canvas,width,height);
		var label = new Label(this);
		// label.setStyles("font-size:18px;color:black");
		label.setText("<p style='line-height:100%'><span style='font-size:18px;color:black'>" + $L.props_text_console + "</span></p>");
		label.setBounds(0, 0, width, 40);
		this.addContent(label);
		this.editBox = new GUIElement(canvas,"textarea");
		this.editBox.setStylesObject({
			'position':'absolute',
			'box-sizing':'border-box',
			'-webkit-box-sizing':'border-box',
			'-moz-box-sizing':'border-box',
			'font-family':'Lucida Console',
			'resize':'none',
			'font-size':'18px',
			'line-height':'20px',
			'max-width':(width - 20)+'px',
			'min-width':(width - 20)+'px',
			'cursor':'move'
		});
		//this.editBox.setStyles("position:absolute;-webkit-box-sizing: border-box;box-sizing: border-box;-moz-box-sizing: border-box;font-family:'Lucida Console';resize:none;font-size:18px;line-height:20px");
		this.editBox.setBounds(10, 40, (width - 20), (height - 50));
		this.addContent(this.editBox);
		this.show();
		new CloseBox(this, closeProc);
		this.x = 0;
		this.y = 0;
		var bounds = this.getBounds();
		this.top = bounds.top;
		this.left = bounds.left;
		// container.addDownEvent(dragdown);
		this.getDocObject().addEventListener('touchstart',(e)=>this.dragdown(<any>e), false);
		this.getDocObject().addEventListener('mousedown', (e)=>this.dragdown(e), false);
		this.closeProc = closeProc;
	}
	setText(txt:string) {
		(<HTMLTextAreaElement>this.editBox.getDocObject()).value += txt;
		this.editBox.getDocObject().scrollTop = this.editBox.getDocObject().scrollHeight;
	}
	close() {
		this.closeProc();
	}
	private dragmove(event:MouseEvent) {
		this.top += (event.pageY - this.y);
		this.left += (event.pageX - this.x);
		this.setStyle("top", this.top + "px");
		this.setStyle("left", this.left + "px");
		this.x = event.pageX;
		this.y = event.pageY;
	}
	private dragdown(event:MouseEvent) {
		// this.removeContent(editBox);
		this.x = event.pageX;
		this.y = event.pageY;
		this.dragListeners = {
			'touchmove':(e) => this.dragmove(<any>e),
			'touchend': (e) => this.dragup(),
			'mousemove':(e) => this.dragmove(e),
			'mouseup':  (e) => this.dragup()
		};
		for (let type in this.dragListeners) {
			window.addEventListener(type,this.dragListeners[type],false);
		}
	}
	private dragup() {
		for (let type in this.dragListeners) {
			window.removeEventListener(type,this.dragListeners[type],false);
		}
		this.dragListeners = null;
	}
}
