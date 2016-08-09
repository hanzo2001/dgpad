/// <reference path="../typings/iBlockly.d.ts" />

import {ConstructionObject} from './ConstructionObject';

var $U = (<any>window).$U;

type ButtonInfo = {
	x: number,
	y: number,
	w: number,
	h: number,
	mouseInside: boolean
};

export class BlocklyButtonObject extends ConstructionObject implements iBlocklyButtonObject {
	private X: number;
	private Y: number;
	private W: number;
	private BTN: ButtonInfo;
	private LABEL: string;
	private dragX: number;
	private dragY: number;
	private OldX: number;
	private OldY: number;
	constructor(construction: iConstruction, name:string, displayName:string, x:number, y:number) {
		super(construction, name);
		//$U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		this.X = x;
		this.Y = y;
		this.W = 0;
		this.BTN = { x: 0, y: 0, w: 40, h: 35, mouseInside: false };
		this.LABEL = displayName;
		this.dragX;
		this.dragY;
		this.OldX;
		this.OldY;
		this.blocks.setMode(["onprogram"], "onprogram");
		this.setDefaults("blockly_button");
		this.dragTo = this._dragTo;
	}
	getAssociatedTools(): string {
		return "@callproperty,@dgscriptname,@blockly";
	}
	getCode(): string {
		return "blockly_button";
	}
	getFamilyCode(): string {
		return "blockly_button";
	}
	run() {
		this.blocks.evaluate("onprogram");
	}
	setLabel(label:string) {
		this.LABEL = label;
	}
	getLabel(): string {
		return this.LABEL;
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		if (this.BTN.mouseInside) {ctx.strokeStyle = this.getColor().getRGB();}
		this.W = ctx.measureText(this.LABEL).width;
		this.BTN.x = this.X - this.BTN.w;
		this.BTN.y = this.Y - 40 / 2;
		var fs = ctx.fillStyle;
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillText(this.LABEL, this.X - this.BTN.w - 20, this.Y);
		ctx.strokeStyle = this.getColor().getRGB();
		if (this.BTN.mouseInside) ctx.lineWidth = this.getSize() * 1.5;
		else ctx.lineWidth = this.getSize();
		ctx.fillStyle = fs;
		this.drawButton(ctx, this.BTN.x, this.BTN.y, this.BTN.w, this.BTN.h, 10);
		ctx.textBaseline = "alphabetic";
	}
	setXY(x:number, y:number) {
		this.X = x;
		this.Y = y;
	}
	startDrag(x:number, y:number) {
		this.dragX = x;
		this.dragY = y;
		this.OldX = this.X;
		this.OldY = this.Y;
	}
	compute() {
	}
	getSource(src) {
		var x = this.Cn.coordsSystem.x(this.X);
		var y = this.Cn.coordsSystem.y(this.Y);
		src.geomWrite(true, this.getName(), "BlocklyButton", $U.native2ascii(this.LABEL), x, y);
	}
	insideButton(event:MouseEvent) {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		return ((mx > this.BTN.x) && (mx < this.BTN.x + this.BTN.w) && (my > this.BTN.y) && (my < this.BTN.y + this.BTN.h));
	}
	mouseInside(event:MouseEvent) {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		var x = this.X - this.BTN.w - 20 - this.W;
		var inside = ((mx > x) && (mx < x + this.W) && (my < this.Y + this.getFontSize() / 2) && (my > this.Y - this.getFontSize() / 2));
		this.BTN.mouseInside = this.insideButton(event);
		return inside || this.BTN.mouseInside;
	}
	private drawButton(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = ctx.strokeStyle;
		var d = 5;
		ctx.moveTo(x + w / d, y + h / d);
		ctx.lineTo(x + w / d, y + (d - 1) * h / d);
		ctx.lineTo(x + (d - 1) * w / d, y + h / 2);
		ctx.lineTo(x + w / d, y + h / d);
		ctx.fill();
	}
	private _dragTo(x:number, y:number) {
		this.setXY(this.OldX + Math.round((x - this.dragX) / 10) * 10, this.OldY + Math.round((y - this.dragY) / 10) * 10);
	}
}
