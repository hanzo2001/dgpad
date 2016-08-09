/// <reference path="../typings/iTools.d.ts" />

import {ToolBtn} from './ToolBtn';

export class Tool implements iTool {
	protected canvas: iCanvas;
	protected toolmanager: iToolsManager;
	protected objectConstructor: any;
	protected image: ToolBtn;
	protected x: number;
	protected y: number;
	protected width: number;
	protected height: number;
	constructor(canvas:iCanvas, toolmanager:iToolsManager, objectConstructor) {
		this.canvas = canvas;
		this.toolmanager = toolmanager;
		this.objectConstructor = objectConstructor;
		this.image = new ToolBtn(this.canvas, this.objectConstructor, (e)=>this.mouseDown, (e)=>this.mouseReleased);
	}
	getConstructor() {
		return this.objectConstructor;
	}
	getX(): number {
		return this.x;
	}
	getY(): number {
		return this.y;
	}
	getW(): number {
		return this.width;
	}
	getH(): number {
		return this.height;
	}
	init(x:number, y:number, size:number) {
		this.x = x;
		this.y = y;
		this.width = size;
		this.height = size;
		this.image.init(this.x, this.y, this.width, this.height);
	}
	hide() {
		this.image.hide();
	}
	close() {
		this.image.close();
		//this.image=new ToolBtn(this.canvas,this.objectConstructor.getCode(),mouseDown,mouseReleased);
	}
	private mouseDown = function (event: MouseEvent) {
		event.preventDefault();
		this.toolmanager.mouseDown(event, this);
	}
	private mouseReleased = function (event: MouseEvent) {
		event.preventDefault();
		this.toolmanager.mouseReleased(event);
	}
}
