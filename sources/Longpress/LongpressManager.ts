/// <reference path="../typings/iCanvas.d.ts" />

import {ExpressionObject} from '../Objects/ExpressionObject';
import {ListObject} from '../Objects/ListObject';
import {BubblePanel} from '../GUI/panels/BubblePanel';
import {BlocklyButtonObject} from '../Objects/BlocklyButtonObject';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class LongpressManager {
	private canvas: iCanvas;
	private Cn: iConstruction;
	private panel: BubblePanel;
	private x: number;
	private y: number;
	private tab: any[];
	constructor(_canvas) {
		this.canvas = _canvas;
		this.Cn = this.canvas.getConstruction();
		this.panel = null;
		this.x = 0;
		this.y = 0;
		this.tab = [
			[$L.create_blockly_button, () => this.createBlocklyButton()],
			[$L.create_exp, () => this.createExp()],
			[$L.create_exp_pts, () => this.createExpPts()],
			[$L.create_exp_segs, () => this.createExpSegs()],
			[$L.create_cursor_int, () => this.createIntCursor()],
			[$L.create_cursor_cont, () => this.createContCursor()],
			[$L.create_widget_edit, () => this.createEditWidget()]
		];
	}
	isVisible(): boolean {
		return this.panel && this.panel.isVisible();
	}
	show(event:MouseEvent) {
		this.x = this.canvas.mouseX(event);
		this.y = this.canvas.mouseY(event);
		this.x = Math.round(this.x / 10) * 10;
		this.y = Math.round(this.y / 10) * 10;
		this.panel = new BubblePanel(this.canvas, this.exec, close, event, this.tab, $L.longpress_message, 270, 240, 30);
	}
	private newExp(_ex) {
		var o = new ExpressionObject(this.Cn, '_a', '', '', '', _ex, this.x, this.y);
		if (this.canvas.namesManager.isVisible()) {
			this.canvas.namesManager.setName(o);
		} else {
			o.setName(this.getName("abcdefghijklmnopqrsuvw"));
		}
		o.setT("");
		var r = Math.random() * 128;
		var g = Math.random() * 128;
		var b = Math.random() * 128;
		o.setRGBColor(r, g, b);
		this.canvas.addObject(o);
		return o;
	}
	private newList(_ex) {
		var OBJ = new ListObject(this.Cn, "_l", _ex);
		OBJ.setSegmentsSize(0);
		var c = _ex.getColor();
		OBJ.setRGBColor(c.getR(), c.getG(), c.getB());
		this.canvas.addObject(OBJ);
		return OBJ;
	}
	private getList() {
		var cx = this.Cn.coordsSystem.x(this.Cn.getWidth() / 2);
		var cy = this.Cn.coordsSystem.y(this.Cn.getHeight() / 2);
		var l = this.Cn.coordsSystem.l(this.Cn.getHeight()) / 4;
		var L = l * (1 + Math.sqrt(5)) / 2;
		// var str="["+(cx-L/2)+","+(cy-l/2)+"]";
		var t = [
			[cx - L / 2, cy - l / 2],
			[cx + L / 2, cy - l / 2],
			[cx + L / 2, cy + l / 2],
			[cx - L / 2, cy + l / 2],
			[cx - L / 2, cy - l / 2]
		];
		let i=0, s=t.length, u=new Array(s);
		while (i<s) {u[i++] = `[${t[i].toString()}]`;}
		return `[${u.join(',')}]`;
		//return "[" + t.toString() + "]";
	}
	private createExp() {
		this.newExp("(1+sqrt(5))/2");
		this.Cn.compute();
		this.canvas.paint();
	}
	private createExpPts() {
		this.newList(this.newExp(this.getList()));
		this.Cn.compute();
		this.canvas.paint();
	}
	private createExpSegs() {
		var o = this.newList(this.newExp(this.getList()));
		o.setSegmentsSize(1);
		this.Cn.compute();
		this.canvas.paint();
	}
	private getName(_t) {
		var t = _t.match(/.{1,1}/g);
		for (var i = 0; i < t.length; i++) {
			if (!this.Cn.find(t[i])) return t[i];
		}
		return t[0];
	}
	private createIntCursor() {
		var o = this.newExp("");
		if (!this.canvas.namesManager.isVisible()) {o.setName(this.getName("nmkabcuvwrst"));}
		o.setMin("0");
		o.setMax("10");
		o.setIncrement(1);
		this.Cn.compute();
		this.canvas.paint();
	}
	private createContCursor() {
		var o = this.newExp("0");
		if (!this.canvas.namesManager.isVisible()) {o.setName(this.getName("nmkabcuvwrst"));}
		o.setMin("-10");
		o.setMax("10");
		this.Cn.compute();
		this.canvas.paint();
	}
	private createEditWidget() {
		this.canvas.addText($L.edit_widget_name + " : <input id=\"exp_name\" interactiveinput=\"replace\">\n\n\u00a7  name=\"" + $L.edit_widget_edit + "\" style=\"font-size:18px;padding: 5px 10px;background: #4479BA;color: #FFF;-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;border: solid 1px #20538D;text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);-moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);\"\nvar exp_n=Find(\"exp_name\");\nvar exp_e=Find(\"exp_edit\");\nexp_e.setAttribute(\"target\",exp_n.value);\nRefreshInputs();\n\n\u00a7\n\n<textarea id=\"exp_edit\" target=\"aa\" style=\"width:500px;height:400px\"></textarea>\n", this.x, this.y, 550, 530, "c:rgba(59,79,115,0.18);s:3;r:15;p:4");
	}
	private createBlocklyButton() {
		$U.prompt($L.create_blockly_program_change_message, $L.create_blockly_program_name, "text", function (_old, _new) {
			if (_new === "") _new = _old;
			var OBJ = new BlocklyButtonObject(this.Cn, "blk_btn", _new, this.x, this.y);
			OBJ.setOpacity(this.canvas.prefs.opacity.blockly_button);
			this.canvas.addObject(OBJ);
			this.Cn.compute();
			this.canvas.paint();
			this.canvas.blocklyManager.edit(OBJ);
		}, 450, 165, 430);
	}
	private close() {
		this.panel = null;
	}
	private exec(_proc) {
		_proc();
	}
}
