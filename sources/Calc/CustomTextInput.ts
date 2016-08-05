
import {Panel} from '../GUI/panels/Panel';
import {GUIElement} from '../GUI/elements/GUIElement';
import {CustomTextSelection} from './CustomTextSelection';

var $U = (<any>window).$U;
var $APPLICATION = (<any>window).$APPLICATION;
var $STANDARD_KBD = (<any>window).$STANDARD_KBD;

export class CustomTextInput extends Panel {
	lb;
	inp;
	sel;
	man;
	content;
	bounds;
	active;
	click_on;
	standard;
	preferredKB;
	LabelWidth;
	constructor(_man, _ownerdiv, _lbl) {
		super(_ownerdiv);
		//$U.extend(this, new GUIElement(_ownerdiv, "div"));
		//$U.extend(this, new Panel(_ownerdiv.getDocObject()));
		this.man = _man;
		this.LabelWidth = 70;
		this.bounds = {};
		this.active = false;
		this.click_on = false;
		this.sel = new CustomTextSelection(this);
		this.preferredKB = 0; // Clavier préféré : 0 pour custom, et 1 pour standard
		this.lb = new GUIElement(this, "div");
		this.inp = new GUIElement(this, "div");
		this.content = new GUIElement(this, "span");
		var doc = this.inp.getDocObject();
		this.standard = null;
		//-linear-gradient(top, #eeeef0, #d3d3d9)
		this.setStyles("opacity:0");
		this.transition("opacity", 0.4);
		this.setStyles("position:absolute;border-radius:5px;border: 1px solid #b4b4b4;background-color:#FAFAFA");
		//this.setStyles("background: " + $U.browserCode() + "-linear-gradient(top, #E1E3CD, #EFF2DA);text-shadow: 0 1px 0 #fff;display: inline-block");
		this.lb.setAttr("textContent", _lbl);
		this.lb.setStyles("position:absolute;left:20px;top:0px;width:" + this.LabelWidth + "px;background-color:rgba(0,0,0,0);padding-left:0px;font-family:Helvetica,Arial,sans-serif;font-size:18px;color:#666;outline-width:0px;border:0px;border-radius:0px");
		this.inp.setStyles("position:absolute;left:" + (this.LabelWidth + 20) + "px;z-index:1;overflow:hidden;background-color:rgba(0,0,0,0);border:0px;font-family:Courier New, Courier, monospace;font-size:20px;text-align:left;vertical-align:middle;outline-width:0px;border-radius:0px;padding:0px");
		this.content.setStyles("background-color:rgba(0,0,0,0);white-space:nowrap;font-family:Courier New, Courier, monospace;font-size:20px;text-align:left");
		this.addContent(this.lb);
		this.addContent(this.sel);
		this.addContent(this.inp);
		setTimeout(() => {
			var doc = ($APPLICATION) ? window.parent.document.body : window.document.body;
			this.standard = new GUIElement(this, "input");
			var kb = this.standard.getDocObject();
			this.standard.hide();
			this.standard.setAttr("type", "text");
			var pos = $U.getElementOffset(this.lb.getDocObject());
			var stls = "left:" + (pos.left + this.lb.getDocObject().offsetWidth) + "px;";
			stls += "top:" + (pos.top + 1) + "px;";
			stls += "width:" + (this.bounds.width - 40 - this.lb.getDocObject().offsetWidth) + "px;";
			stls += "height:" + this.bounds.height + "px;";
			this.standard.setStyles(stls += "background-color:#FAFAFA;z-index:3;position:absolute;overflow:hidden;border:0px;font-family:Courier New, Courier, monospace;font-size:20px;text-align:left;vertical-align:middle;outline-width:0px;border-radius:0px;padding:0px");
			kb.onblur = () => {
				this.man.filterKB(false);
				this.man.setKeyEvents(false);
				this.setText(kb.value);
				if (this.active)
					this.sel.setSelectionRange(kb.selectionStart, kb.selectionEnd);
				this.standard.hide();
				setTimeout($STANDARD_KBD.setbtn, 5000);
			};
			kb.onkeydown = function () { };
			kb.onkeyup = () => {
				this.changedFilter(kb.value);
			};
			this.standard.quit = function () {
				kb.blur();
			};
			doc.appendChild(kb);
		}, 1);
	}
	show() {
		if (this.isHidden()) {
			this.applyTransitionIN();
			this.inp.addDownEvent(this.mousedown);
			this.inp.addUpEvent(this.mouseup, window);
			this.inp.addMoveEvent(this.mousemove);
		}
	}
	hide() {
		this.applyTransitionOUT();
		this.inp.removeDownEvent(this.mousedown);
		this.inp.removeUpEvent(this.mouseup, window);
		this.inp.removeMoveEvent(this.mousemove);
	}
	setPreferredKB(_kb) {
		this.preferredKB = _kb
	}
	setSelectionRange(_s, _e) {
		this.sel.setSelectionRange(_s, _e);
	}
	setActive(_b) {
		this.active = _b;
		this.sel.setActive();
		if ((!this.active) && (this.standard))
			this.standard.quit();
		if ((this.active) && (this.preferredKB === 1)) {
			this.showKB();
			if (this.standard)
				this.standard.getDocObject().setSelectionRange(0, 1000);
		}
		if ((this.active) && (this.preferredKB === 0))
			this.man.setKeyEvents(false);
	}
	isActive() {
		return this.active;
	}
	setChangedFilter(_proc) {
		this.changedFilter = _proc;
	}
	getInputDIV() {
		return this.inp;
	}
	getContentSPAN() {
		return this.content;
	}
	getInput() {
		return this.standard.getDocObject();
	}
	getSel() {
		return this.sel;
	}
	showKB() {
	}
	isStandardKB() {
		return (this.standard !== null);
	}
	setBounds(l, t, w, h) {
		this.bounds = {
			left: l,
			top: t,
			width: w,
			height: h
		};
		this.setStyles("left:" + l + "px;top:" + t + "px;width:" + w + "px;height:" + h + "px");
		this.lb.setStyles("height:" + h + "px;line-height:" + h + "px");
		this.inp.setBounds(this.LabelWidth + 20, 0, w - this.LabelWidth - 40, h);
		this.inp.setStyles("line-height:" + h + "px");
		this.sel.setStyles("height:" + (h - 4) + "px");
		// Tout ceci pour mesurer la largeur d'un caractère :
		this.content.setAttr("textContent", "abcdefghijklmnopqrstuvwxyz");
		this.content.setStyles("margin-left:0px")
		this.addContent(this.content);
		setTimeout(function () {
			this.sel.setCarLength(this.content.getDocObject().offsetWidth / 26);
			this.sel.setOffset(this.lb.getDocObject().offsetWidth + 20);
			this.content.setAttr("textContent", "");
			this.removeContent(this.content);
			this.inp.addContent(this.content);
		}, 1);
	}
	setLabel(_l) {
		this.lb.setAttr("textContent", _l);
		// this.setBounds(this.bounds.left, this.bounds.top, this.bounds.width, this.bounds.height);
		// setTimeout(function() {
		// 		this.sel.setSelectionRange(0, 0);
		// }, 1);
	}
	setText(txt) {
		this.content.setAttr("textContent", txt);
		this.changedFilter(txt);
	}
	getText() {
		return this.content.getAttr("textContent");
	}
	insertText(_st) {
		if (!this.active)
			return;
		this.sel.insertText(_st);
	}
	nextCar() {
		this.sel.nextCar();
	}
	executeCommand(_st) {
		this.sel.executeCommand(_st);
	}
	private isHidden() {
		return (parseInt(this.getStyle("opacity")) === 0);
	}
	private mouseX(ev) {
		return (ev.pageX - this.bounds.left - this.lb.getDocObject().offsetWidth - 20);
	}
	private mousedown(ev) {
		this.man.activate(this);
		this.sel.mousedown(this.mouseX(ev));
		this.click_on = true;
	}
	private mouseup() {
		this.click_on = false;
	}
	private mousemove(ev) {
		if (this.click_on) {
			this.sel.mousemove(this.mouseX(ev));
		}
	}
	// Appelée à chaque fois que le texte change, quel
	// que soit le clavier choisi. A surcharger par setChangedFilter :
	private changedFilter(txt) {
	}
}
