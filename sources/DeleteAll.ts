/// <reference path="./typings/iDeleteAll.d.ts" />
/// <reference path="./typings/iCanvas.d.ts" />

import {Button} from './GUI/elements/Button';

var $L = (<any>window).$L;

export class DeleteAll implements iDeleteAll {
	protected canvas: iCanvas;
	protected tmargin: number;
	protected width: number;
	protected height: number;
	protected btn: Button;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
		this.tmargin = 20;
		this.width = 250;
		this.height = 30;
		this.btn = new Button(canvas);
		//    btn.setBounds((canvas.getWidth() - w) / 2, tmargin, w, h);
		this.btn.setText($L.clear_all);
		this.btn.setStyles("line-height:30px;vertical-align: middle;outline: none;cursor: pointer;text-align: center;text-decoration: none;font: 14px Arial, Helvetica, sans-serif;-webkit-border-radius: .5em;-moz-border-radius: .5em;border-radius: .5em;color: #252525;border: 2px solid #b4b4b4;background-color: rgba(230,230,230,0.9)");
		this.btn.addDownEvent(this.exe.bind(this));
	}
	deleteAll() {
		this.exe()
	}
	show() {
		this.btn.setBounds((this.canvas.getWidth() - this.width) / 2, this.tmargin, this.width, this.height);
		this.canvas.getDocObject().parentNode.appendChild(this.btn.getDocObject());
	}
	hide() {
		if (this.btn.getDocObject().parentNode) {
			this.canvas.getDocObject().parentNode.removeChild(this.btn.getDocObject());
		}
	}
	private exe(event?:Event) {
		this.canvas.selectArrowBtn();
		this.canvas.saveToLocalStorage();
		this.canvas.undoManager.clear();
		this.canvas.undoManager.deleteObjs(this.canvas.getConstruction().elements());
		this.canvas.getConstruction().deleteAll();
		//this.canvas.macrosManager.clearTools();
		this.canvas.textManager.clear();
		this.canvas.getDocObject().style.visibility = "visible";
		this.canvas.paint();
	}
}
