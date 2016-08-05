/// <reference path="../typings/GUI/ColorPicker.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {Panel} from '../GUI/panels/Panel';
import {Button} from '../GUI/elements/Button';
import {Label} from '../GUI/elements/Label';
import {slider} from '../GUI/elements/slider';
import {Color} from '../Utils/Color';

var ColorPicker: ColorPicker;

var $L = (<any>window).$L;

export class props_textPanel extends Panel {
	private currentObj: iTextObject;
	private cp: ColorPicker;
	private op: slider;
	private sz: slider;
	private rd: slider;
	private pr: slider;
	constructor(owner:iTextPanel) {// must implement addTeXObject
		super(owner);
		//$U.extend(this, new Panel(owner.getDocObject()));
		this.currentObj = null;
		this.setAttr("className", "props_TeX_DIV");
		this.transition("translate_x", 0.2, 200);
		var ch = 10;
		var sh = 35;
		var t1 = new Label(this);
		t1.setText($L.props_text_message);
		t1.setStyles("color:#252525;font-style: italic");
		t1.setBounds(10, ch, 200, 20);
		this.addContent(t1);
		ch += 50;
		this.cp = new ColorPicker(this.getDocObject(), 10, ch, 200, 200);
		this.cp.setHEXcallback((val) => this.COLORcallback(val));
		var cl = new Color();
		cl.set("rgba(59,79,115,0.18)");
		this.cp.setRGB(cl.getR(), cl.getG(), cl.getB());
		ch += 210;
		this.op = new slider(this.getDocObject(), 10, ch, 200, sh, 0, 1, cl.getOpacity(), (val) => this.OPcallback(val));
		this.setSlider(this.op, $L.props_text_opacity, 0.01);
		ch += sh;
		this.sz = new slider(this.getDocObject(), 10, ch, 200, sh, 0, 30, 3, (val) => this.SZcallback(val));
		this.setSlider(this.sz, $L.props_text_size, 0.5);
		ch += sh;
		this.rd = new slider(this.getDocObject(), 10, ch, 200, sh, 0, 200, 15, (val) => this.RDcallback(val));
		this.setSlider(this.rd, $L.props_text_radius, 0.5);
		ch += sh;
		this.pr = new slider(this.getDocObject(), 10, ch, 200, sh, 0, 13, 4, (val) => this.PRcallback(val));
		this.setSlider(this.pr, $L.props_text_precision, 1);
		ch += sh;
		ch += 10;
		var add = new Button(this);
		add.setBounds(10, ch, 200, 25);
		add.setText($L.props_text_add);
		add.setCallBack(() => this.addBtnCallBack());
		this.addContent(add);
	}
	addName(name:string) {
		if (this.currentObj) {this.currentObj.addName(name);}
	}
	edit(txt:iTextObject) {
		var focus = txt && this.currentObj !== txt;
		this.currentObj = txt;
		this.cp.setHEX(txt.getColor());
		this.op.setValue(txt.getOpacity());
		this.sz.setValue(txt.getBorderSize());
		this.rd.setValue(txt.getBorderRadius());
		this.pr.setValue(txt.getNumPrec());
		if (focus) {txt.setEditFocus();}
	}
	getRGBAColor(): string {
		var col = new Color();
		col.set(this.cp.getHEX());
		col.setOpacity(this.op.getValue());
		return col.getRGBA();
	}
	getBorderSize(): number {
		return (this.sz.getValue());
	}
	getBorderRadius(): number {
		return (this.rd.getValue());
	}
	getPrecision(): number {
		return (this.pr.getValue());
	}
	private COLORcallback(color:string) {
		if (this.currentObj) {this.currentObj.setColor(color);}
	}
	private OPcallback(opacity:number) {
		if (this.currentObj) {this.currentObj.setOpacity(opacity);}
	}
	private SZcallback(size:number) {
		if (this.currentObj) {this.currentObj.setBorderSize(size);}
	}
	private RDcallback(size:number) {
		if (this.currentObj) {this.currentObj.setBorderRadius(size);}
	}
	private PRcallback(precision:number) {
		if (this.currentObj) {this.currentObj.setNumPrec(precision);}
	}
	private addBtnCallBack() {
		(<iTextPanel>this.owner).addTeXObject();
	}
	private setSlider(slider:slider, txt:string, precision:number) {
		slider.setValueWidth(40);
		slider.setTextColor("#252525");
		slider.setBackgroundColor("rgba(0,0,0,0)");
		slider.setLabel(txt, 80);
		slider.setValuePrecision(precision);
	}
}
