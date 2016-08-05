/// <reference path="../typings/iCanvas.d.ts" />

import {VerticalBorderPanel} from '../GUI/panels/VerticalBorderPanel';
import {props_textPanel} from './props_textPanel';

var $L = (<any>window).$L;

export class TextPanel extends VerticalBorderPanel {
	private props: props_textPanel;
	constructor(canvas:iCanvas) {
		super(canvas,240,false);
		//$U.extend(this, new VerticalBorderPanel(canvas, 240, false));
		this.setBounds(this.getBounds().left + 15, -5, 0, 0); // Le fond n'est pas affiché
		this.show();
		this.props = new props_textPanel(this);
		// Une ineptie necessaire parce que sinon le clavier virtuel
		// de l'ipad change la position du panneau de propriété :
		if (Object.touchpad) {window.scrollTo(0, 0);}
		this.props.show();
	}
	addTeXObject() {
		var r = Math.round(Math.random() * 128);
		var g = Math.round(Math.random() * 128);
		var b = Math.round(Math.random() * 128);
		var op = Math.round((0.1 + Math.random() / 3) * 100) / 100;
		//        var stl = "c:rgba(" + r + "," + g + "," + b + "," + op + ")";
		//        console.log(stl);
		var stl = "c:" + this.props.getRGBAColor();
		//        stl += ";s:6";
		//        stl += ";r:50";
		stl += ";s:" + this.props.getBorderSize();
		stl += ";r:" + this.props.getBorderRadius();
		stl += ";p:" + this.props.getPrecision();
		this.canvas.textManager.addText($L.props_text_example, 70, 10, 500, 65, stl);
	}
	edit(txt:iTextObject) {
		this.props.edit(txt)
	}
	addName(name:string) {
		this.props.addName(name);
	}
}
