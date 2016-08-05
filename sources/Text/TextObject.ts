/// <reference path="../typings/iCanvas.d.ts" />

import {Panel} from '../GUI/panels/Panel';
import {GUIElement} from '../GUI/elements/GUIElement';
import {ImageBox} from '../GUI/elements/ImageBox';
import {CloseBox} from '../GUI/elements/CloseBox';
import {PrintPanel} from './PrintPanel';
import {Color} from '../Utils/Color';
// solve katex dependency

var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $APP_PATH = (<any>window).$APP_PATH;

export class TextObject extends Panel implements iTextObject {
	private canvas: iCanvas;
	private Cn: any;
	private txt: string;
	private EXPs;//Expression[]
	private SCPs: {src:string}[];
	private bgcolor: Color;
	private borderSize: number;
	private borderRadius: number;
	private numPrec: number;
	private jsbox: ImageBox;
	private txbox: ImageBox;
	private exbox: ImageBox;
	private printPanel: PrintPanel;
	private styles: string;
	private xx: number;
	private yy: number;
	private closebox: CloseBox;
	private container: GUIElement;
	private editBox: GUIElement;
	constructor(canvas: iCanvas, _m:string, left:number, top:number, width:number, height:number) {
		super(canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = canvas;
		this.Cn = this.canvas.getConstruction();
		this.txt = _m;
		this.EXPs = [];
		this.SCPs = [];
		this.bgcolor = new Color();
		this.borderSize = 3;
		this.borderRadius = 5;
		this.numPrec = 1e4;
		this.closebox = null;
		this.jsbox = null;
		this.txbox = null;
		this.exbox = null;
		this.printPanel = null;
		this.styles = null;
		this.xx = 0;
		this.yy = 0;
		this.container = new GUIElement(this.canvas, "div");
		this.editBox = new GUIElement(this.canvas, "textarea");
		this.setAttr("className", "textPanel");
		this.transition("scale", 0.2);
		this.parseExpressions();
		this.container.setAbsolute();
		this.container.setStyle("cursor", "move");
		this.addContent(this.container);
		this.setHTML(this.txt);
		this.editBox.setStyles("position:absolute;font-family:'Lucida Console';font-size:13px;line-height:20px");
		this.editBox.setStyle("width", (width - 33) + "px");
		this.editBox.setStyle("height", (114) + "px");
		this.editBox.getDocObject().oninput = (event) => this.endInput();
		// this.container.addClickEvent(this.edit);
		var growbox = new GUIElement(this.canvas, "div");
		growbox.setAbsolute();
		growbox.setStyles("width:30px;height:30px;right:0px;bottom:0px;cursor:se-resize");
		this.addContent(growbox);
		this.container.addDownEvent((e) => this.dragdown(e));
		// this.container.getDocObject().addEventListener('touchstart', dragdown, false);
		// this.container.getDocObject().addEventListener('mousedown', dragdown, false);
		this.container.getDocObject().addEventListener('touchstart', this.edit, false);
		this.container.getDocObject().addEventListener('click', this.edit, false);
		growbox.addDownEvent((e) => this.sizedown(e));
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
		this.init();
	}
	parseExpressions() {
		this.EXPs = [];
		this.SCPs = [];
		var t = this.txt.split('%');
		let i=1, s=t.length;
		while (i<s) {this.EXPs.push(this.canvas.getExpression(t[i])), i+=2;}
		//for (var i = 1, len = t.length; i < len; i += 2) {this.EXPs.push(this.canvas.getExpression(t[i]));}
		t = this.txt.split('§');
		i=1, s=t.length;
		while (i<s) {
			t[i] = t[i].replace(/^[^\n]*name\s*=\s*"([^\"]*)"/, '');
			t[i] = t[i].replace(/^[^\n]*style\s*=\s*"([^\"]*)"/, '');
			this.SCPs.push({src: t[i]});
			i += 2;
		}
	}
	exec(index:number) {
		var src = this.SCPs[index].src;
		var t = src.split("%");
		let i=1, s=t.length;
		while (i<s) {
			var exp = this.canvas.getExpression(t[i]);
			// exp.compute();
			t[i] = $U.parseArrayEnglish(exp.value(), this.numPrec, true);
			i += 2;
		}
		this.canvas.InterpretScript(this, t.join(""));
	}
	print(txt:string) {
		if (!this.printPanel) {
			this.printPanel = new PrintPanel(this.canvas, () => this.closePrint());
		}
		this.printPanel.setText(txt);
	}
	refreshInputs() {
		// convert HTMLCollection to Array :
		var inps = [].slice.call(this.container.getDocObject().getElementsByTagName('input'));
		var sels = this.container.getDocObject().getElementsByTagName('select');
		let i=0, s=sels.length;
		while (i<s) {inps.push(sels[i++]);}
		var tas = this.container.getDocObject().getElementsByTagName('textarea');
		i=0, s=tas.length;
		while (i<s) {inps.push(tas[i++]);}
		i=0, s=inps.length;
		while (i<s) {
			inps[i].ontouchstart = inps[i].onmousedown = (e) => e.stopPropagation();
			if (inps[i].hasAttribute("target")) {
				var o = inps[i].targetObject = this.Cn.find(inps[i].getAttribute("target"));
				if (o) {
					var evtpe = "oninput";
					switch (inps[i].type) {
						case "select-one":
							evtpe = "onchange";
							inps[i].value = o.getExp();
							break;
						case "checkbox":
							evtpe = "onchange";
							inps[i].checked = o.getValue();
							break;
						case "button":
							evtpe = "onmouseup";
							break;
						default:
							inps[i].value = o.getExp();
					}
					inps[i][evtpe] = function (event) {
						var obj = event.target.targetObject;
						if (obj) {
							var val = event.target.value;
							switch (event.target.type) {
								case "checkbox":
									val = event.target.checked;
									break;
								case "button":
									val = !obj.getValue();
									break;
							}
							obj.setExp(val);
							obj.compute();
							obj.computeChilds();
							this.canvas.paint();
						}
					}
				}
			}
			i++;
		}
	}
	noedit() {
		this.removeContent(this.editBox);
		this.removeContent(this.closebox);
		this.removeContent(this.jsbox);
		this.removeContent(this.txbox);
		this.removeContent(this.exbox);
		this.setStyle("z-index", '0');
	}
	setEditFocus() {
		setTimeout(() => {
			this.editBox.getDocObject().focus();
			this.editBox.getDocObject().setSelectionRange(0, 9999);
		}, 100);
	}
	doedit() {
		if ((!this.hasContent(this.editBox)) && (this.canvas.getMode() === 10)) {
			this.setStyle("z-index", '3');
			this.editBox.setAttr("innerHTML", this.txt);
			this.addContent(this.editBox);
			this.closebox = new CloseBox(this, () => this.deleteTeX());
			this.jsbox = new ImageBox(this, $APP_PATH + "NotPacked/images/tex/js.svg", 30, 30, () => this.insertJS());
			this.txbox = new ImageBox(this, $APP_PATH + "NotPacked/images/tex/tex.svg", 30, 30, () => this.insertTeX());
			this.exbox = new ImageBox(this, $APP_PATH + "NotPacked/images/tex/exp.svg", 30, 30, () => this.insertEXP());
			this.moveStyles();
		}
	}
	edit() {
		this.canvas.textManager.edit(this);
	}
	compute() {
		let i=0, s=this.EXPs.length;
		while (i<s) {this.EXPs[i++].compute();}
	}
	evaluateString() {
		var t = this.txt.split("%");
		var changed = (t.length > 1);
		let i=1, s=t.length;
		while (i<s) {
			try {
				var k = (i - 1) / 2;
				this.EXPs[k].compute();
				t[i] = $U.parseArray(this.EXPs[k].value(), this.numPrec);
				i += 2;
			} catch (e) { }
		}
		t = t.join("").split("$");
		changed = changed || (t.length > 1);
		i=1, s=t.length;
		while (i<s) {
			try {
				t[i] = katex.renderToString(t[i]);
				i += 2;
			} catch (e) { }
		}
		if (changed) {this.setHTML(t.join(''));}
	}
	getColor(): string {
		return (this.bgcolor.getHEX());
	}
	setColor(color:string) {
		let opacity = this.bgcolor.getOpacity();
		this.bgcolor.set(color);
		this.bgcolor.setOpacity(opacity);
		this.setStyle("background-color", this.bgcolor.getRGBA());
		this.setStyle("border-color", this.bgcolor.getRGBA());
	}
	getOpacity(): number {
		return (this.bgcolor.getOpacity());
	}
	setOpacity(opacity:number) {
		this.bgcolor.setOpacity(opacity);
		this.setStyle("background-color", this.bgcolor.getRGBA());
		this.setStyle("border-color", this.bgcolor.getRGBA());
	}
	getBorderSize(): number {
		return this.borderSize;
	}
	setBorderSize(size:number) {
		this.borderSize = size;
		this.setStyle("border-width", this.borderSize + "px");
	}
	getBorderRadius(): number {
		return this.borderRadius;
	}
	setBorderRadius(radius:number) {
		this.borderRadius = radius;
		this.setStyle("border-radius", this.borderRadius + "px");
	}
	setNumPrec(pow:number) {
		this.numPrec = Math.pow(10, pow);
		this.evaluateString();
	}
	getNumPrec(): number {
		return Math.round(Math.log(this.numPrec) / Math.LN10);
	}
	addName(name:string) {
		if (this.hasContent(this.editBox)) {
			$U.addTextToInput(this.editBox.getDocObject(), name, "add");
			this.endInput();
		}
	}
	setStyles(styles:string) {
		this.styles = styles;
		let a=styles.split(";"), i=0, s=a.length;
		while (i<s) {
			let [type, val] = a[i++].split(":");
			switch (type) {
				case "c": // Color
					this.bgcolor.set(val);
					this.setStyle("background-color", this.bgcolor.getRGBA());
					this.setStyle("border-color", this.bgcolor.getRGBA());
					break;
				case "s": // Border size
					this.borderSize = parseFloat(val);
					this.setStyle("border-width", this.borderSize + "px");
					break;
				case "r": //Border radius
					this.borderRadius = parseInt(val);
					this.setStyle("border-radius", this.borderRadius + "px");
					break;
				case "p": //Number precision
					this.numPrec = Math.pow(10, parseInt(val));
					break;
			}
		}
	}
	getStyles(): string {
		var stls = "c:" + this.bgcolor.getRGBA();
		stls += ";s:" + this.borderSize;
		stls += ";r:" + this.borderRadius;
		stls += ";p:" + Math.round(Math.log(this.numPrec) / Math.LN10);
		return stls;
	}
	setText(txt:string) {
		this.txt = txt;
		// this.container.setAttr("innerHTML", _t);
		// console.log("set text !");
	}
	getRawText(): string {
		return this.txt;
	}
	getText(): string {
		var s = this.txt;
		if (this.txt.split('$').length > 1) {s = s.replace(/\\/g, '\\\\');}
		return s;
	}
	init() {
		this.setBounds(this.left, this.top, this.width, this.height);
		this.container.setBounds(10, 10, this.width - 20, this.height - 20);
	}
	private closePrint() {
		if (this.printPanel) {this.printPanel.close();}
		this.printPanel = null;
	}
	private setHTML(_t) {
		// On enlève tous les scripts injectés précédemment dans
		// ce widget :
		var scps = this.getDocObject().getElementsByTagName('script');
		let i=0, s=scps.length;
		while (i<s) {
			scps[i++].parentNode.removeChild(scps[i]);
		}
		var tab = _t.split("§");
		i=1, s=tab.length;
		while (i<s) {
			var k = (i - 1) / 2;
			var match = tab[i].match(/^[^\n]*name\s*=\s*\"([^\"]*)\"/);
			var nm = match ? match[1] : 'RUN';
			match = tab[i].match(/^[^\n]*style\s*=\s*\"([^\"]*)\"/);
			var st = "-webkit-appearance: button;"+(match?match[1]:'');
			match = tab[i].match(/^[^\n]*id\s*=\s*\"([^\"]*)\"/);
			var id = match ? match[1] : '';
			tab[i] = 
`<input type="button" value="${nm}" style="${st}" ${id?'id="'+id+'"':''}
	ontouchend="$CANVAS.textManager.executeScript("${this.canvas.textManager.getPosition(this)}","${k}");this.blur()"
	 onmouseup="$CANVAS.textManager.executeScript("${this.canvas.textManager.getPosition(this)}","${k}");this.blur()"
/>`;
			i += 2;
		}
		_t = tab.join("");
		// Le tag pre est là pour conserver les espaces multiples 
		// et les retours à la ligne :
		this.container.setAttr("innerHTML", "<pre class=\"TeXDisplay\">" + _t + "</pre>");
		// Interprétation des balises scripts éventuellement injectées dans 
		// le source (le innerHTML ne suffit pas) :
		scps = this.container.getDocObject().getElementsByTagName('script');
		i=0, s=scps.length;
		while (i<s) {
			var scp = document.createElement('script');
			scp.src = scps[i].src;
			scp.type = scps[i].type;
			scp.appendChild(document.createTextNode(scps[i].innerHTML));
			this.getDocObject().insertBefore(scp, this.container.getDocObject());
			i++;
		}
		this.refreshInputs();
	}
	private endInput() {
		this.txt = this.editBox.getDocObject().value;
		this.parseExpressions();
		this.setHTML(this.txt);
		this.canvas.getConstruction().computeAll();
		this.evaluateString();
	}
	private deleteTeX() {
		this.canvas.undoManager.swap(this);
		this.canvas.textManager.deleteTeX(this);
	}
	private insertJS() {
		var js = `§ name="${$L.props_text_js}" style="font-size:24px;color:blue"
for (var i=0; i<100; i++) {
	A = Point(Math.random()*16 - 8, Math.random()*16 - 8)
}
§`;
		this.addName(js);
	}
	private insertTeX() {
		var tx = "$\\frac{6+1}{3}\\approx2.3$";
		this.addName(tx);
	}
	private insertEXP() {
		var ex = "%5*2^2+9%";
		this.addName(ex);
	}
	private moveStyles() {
		this.editBox.setStyle("left", (35) + "px");
		this.editBox.setStyle("top", (this.height + 4) + "px");
		// this.editBox.setStyle("width", (this.width - 33) + "px");
		// this.editBox.setStyle("height", (114) + "px");
		if (this.jsbox) {
			this.jsbox.setStyle("left", (0) + "px");
			this.jsbox.setStyle("top", (this.height + 4) + "px");
			this.txbox.setStyle("left", (0) + "px");
			this.txbox.setStyle("top", (this.height + 44) + "px");
			this.exbox.setStyle("left", (0) + "px");
			this.exbox.setStyle("top", (this.height + 84) + "px");
		}
	}
	private dragmove(event) {
		this.top += (event.pageY - this.yy);
		this.left += (event.pageX - this.xx);
		this.setStyle("top", this.top + "px");
		this.setStyle("left", this.left + "px");
		this.xx = event.pageX;
		this.yy = event.pageY;
	}
	private dragdown(event) {
		// this.removeContent(this.editBox);
		this.xx = event.pageX;
		this.yy = event.pageY;
		window.addEventListener('touchmove',(e) => this.dragmove(e), false);
		window.addEventListener('touchend', (e) => this.dragup(e), false);
		window.addEventListener('mousemove',(e) => this.dragmove(e), false);
		window.addEventListener('mouseup',  (e) => this.dragup(e), false);
	}
	private dragup(event) {
		window.removeEventListener('touchmove',(e) => this.dragmove(e), false);
		window.removeEventListener('touchend', (e) => this.dragup(e), false);
		window.removeEventListener('mousemove',(e) => this.dragmove(e), false);
		window.removeEventListener('mouseup',  (e) => this.dragup(e), false);
	}
	private sizemove(event) {
		this.width += (event.pageX - this.xx);
		this.height += (event.pageY - this.yy);
		this.setStyle("width", this.width + "px");
		this.setStyle("height", this.height + "px");
		this.container.setStyle("width", (this.width - 20) + "px");
		this.container.setStyle("height", (this.height - 20) + "px");
		this.xx = event.pageX;
		this.yy = event.pageY;
		this.moveStyles();
		if (this.closebox)
			this.closebox.setStyle("left", (this.width - 15) + "px");
	}
	private sizedown(event) {
		this.xx = event.pageX;
		this.yy = event.pageY;
		window.addEventListener('touchmove',(e) => this.sizemove(e), false);
		window.addEventListener('touchend', (e) => this.sizeup(e), false);
		window.addEventListener('mousemove',(e) => this.sizemove(e), false);
		window.addEventListener('mouseup',  (e) => this.sizeup(e), false);
	}
	private sizeup(event) {
		window.removeEventListener('touchmove',(e) => this.sizemove(e), false);
		window.removeEventListener('touchend', (e) => this.sizeup(e), false);
		window.removeEventListener('mousemove',(e) => this.sizemove(e), false);
		window.removeEventListener('mouseup',  (e) => this.sizeup(e), false);
	}
}
