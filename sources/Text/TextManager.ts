/// <reference path="../typings/iCanvas.d.ts" />

import {TextPanel} from './TextPanel';
import {TextObject} from './TextObject';

var $U = (<any>window).$U;
var $APP_PATH = (<any>window).$APP_PATH;

export class TextManager {
	private canvas: iCanvas;
	private txts: iTextObject[];
	private firstLoad: boolean;
	private textPanel: TextPanel;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
		this.txts = [];
		this.firstLoad = true;
		this.textPanel = null;
	}
	compute() {
		let i=0, s=this.txts.length;
		while (i<s) {this.txts[i++].compute();}
	}
	refreshInputs() {
		let i=0, s=this.txts.length;
		while (i<s) {this.txts[i++].refreshInputs();}
	}
	evaluateStrings() {
		let i=0, s=this.txts.length;
		while (i<s) {this.txts[i++].evaluateString();}
	}
	executeScript(index:number, srcIndex:number) {
		if (index > -1) {
			this.canvas.undoManager.beginAdd();
			this.txts[index].exec(srcIndex);
			this.canvas.undoManager.endAdd();
		}
	}
	getPosition(txt:iTextObject) {
		let index = this.txts.indexOf(txt);
		return index < 0 ? this.txts.length : index;
	}
	edit(txt:iTextObject) {
		let i=0, s=this.txts.length;
		while (i<s) {this.txts[i++].noedit();};
		if (txt) {
			txt.doedit();
			if (this.textPanel) {this.textPanel.edit(txt);}
		}
	}
	deleteTeX(txt:iTextObject) {
		let index = this.txts.indexOf(txt);
		if (index >= 0) {
			this.txts.splice(index,1);
			txt.close();
		}
	}
	addName(name:string) {
		if (this.textPanel) {this.textPanel.addName(name);}
	}
	addTeXElement(str:string, left, top, width, height, styles?:string) {
		if (this.firstLoad) {
			this.loadKaTeX();
			this.firstLoad = false;
		}
		var txt = new TextObject(this.canvas, str, left, top, width, height);
		if (styles !== undefined) {
			txt.setStyles(styles);
		}
		this.txts.push(txt);
		txt.evaluateString();
		return txt;
	}
	// Pour le undoManager :
	add(txt:iTextObject) {
		var b = txt.getBounds();
		return this.addTeXElement(txt.getRawText(), b.left, b.top, b.width, b.height, txt.getStyles());
	}
	// Uniquement pour l'ajout de textes en manuel :
	addText(str:string, left, top, width, height, styles?:string) {
		this.canvas.undoManager.beginAdd();
		this.addTeXElement(str, left, top, width, height, styles).edit();
		this.canvas.undoManager.endAdd();
	}
	elements() {
		return this.txts;
	}
	getSource() {
		var t = "";
		for (var i = 0, len = this.txts.length; i < len; i++) {
			var b = this.txts[i].getBounds();
			var TX = this.txts[i].getText();
			TX = TX.replace(/\"/g, "\\\"");
			TX = $U.native2ascii(TX.split("\n").join("\\n"));
			t += "Text(\"" + TX + "\"," + b.left + "," + b.top + "," + b.width + "," + b.height;
			t += (this.txts[i].getStyles()) ? ",\"" + this.txts[i].getStyles() + "\"" : "";
			t += ");\n";
		}
		if (t !== "") {
			t = "\n\n// Texts :\n" + t;
		}
		return t;
	}
	clear() {
		for (var i = 0, len = this.txts.length; i < len; i++) {
			if (this.txts[i].getDocObject().parentNode !== null) {
				this.txts[i].getDocObject().parentNode.removeChild(this.txts[i].getDocObject());
			}
		}
		this.txts = [];
	}
	showPanel() {
		if (!this.textPanel) {this.textPanel = new TextPanel(this.canvas);}
	}
	hidePanel() {
		if (this.textPanel) {
			this.edit(null);
			this.textPanel.close();
			this.textPanel = null;
		}
	}
	private loadKaTeX() {
		var parent = document.getElementsByTagName("head")[0];
		var lnk = document.createElement("link");
		lnk.rel = "stylesheet";
		lnk.href = $APP_PATH + "NotPacked/thirdParty/katex.min.css";
		// lnk.href = "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.css";
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = $APP_PATH + "NotPacked/thirdParty/katex.min.js";
		// script.src = "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min.js";
		script.onload = () => {
			this.evaluateStrings();
			// script.id = "MathJax";
		};
		parent.appendChild(lnk);
		parent.appendChild(script);
	}
}
