/// <reference path="../typings/iCalc.d.ts" />

import {CustomTextInput} from './CustomTextInput';

export class CustomTexts implements iCustomTexts {
	protected owner: iMainCalcPanel;
	protected txts: iCustomTextInput[];
	protected active_elt;
	protected firstActivation: boolean;
	protected maybesimplequote: boolean;
	constructor(_owner:iMainCalcPanel) {
		this.owner = _owner;
		this.txts = [];
		this.active_elt = null;
		this.firstActivation = true;
		this.maybesimplequote = false;
	}
	filterKB(_standardON) {
	}
	getActive() {
		return this.active_elt;
	}
	add(_lbl:string, _l:number, _t:number, _w:number, _h:number): iCustomTextInput {
		var txt = new CustomTextInput(this, this.owner, _lbl);
		txt.setBounds(_l, _t, _w, _h);
		//this.owner.addContent(txt);
		this.txts.push(txt);
		return txt;
	}
	removeAll() {
		for (var i = 0; i < this.txts.length; i++) {
			if (this.txts[i].getDocObject().parentNode !== null)
				this.owner.removeContent(this.txts[i]);
		};
		this.owner.getDocObject().innerHTML = "";
		this.txts = [];
	}
	deactiveAll() {
		for (var i = 0; i < this.txts.length; i++) {
			this.txts[i].setActive(false);
		}
		this.active_elt = null;
	}
	close() {
		this.removeAll();
		window.removeEventListener("keypress", ()=>this.keypress, false);
		window.removeEventListener("keydown", ()=>this.keydown, false);
		window.removeEventListener("keyup", ()=>this.keyup, false);
	}
	focus() { };
	setFirst(_b) {
		this.firstActivation = _b;
	}
	activate(txt) {
		if (this.active_elt !== txt) {
			if (this.firstActivation) {
				this.owner.createObj();
				this.firstActivation = false;
			}
			this.deactiveAll();
			txt.setActive(true);
			this.active_elt = txt;
			this.focus();
		}
	}
	insertText(_st) {
		if (this.active_elt != null)
			this.active_elt.insertText(_st);
	}
	showKB() {
		if (this.active_elt != null)
			this.active_elt.showKB();
	}
	nextCar() {
		if (this.active_elt != null)
			this.active_elt.nextCar();
	}
	setKeyEvents(_standardKB:boolean) {
		if (Object.touchpad)
			return;
		if (_standardKB) {
			window.removeEventListener("keypress", ()=>this.keypress, false);
			window.removeEventListener("keydown", ()=>this.keydown, false);
			window.removeEventListener("keyup", ()=>this.keyup, false);
		} else {
			window.addEventListener("keypress", ()=>this.keypress, false);
			window.addEventListener("keydown", ()=>this.keydown, false);
			window.addEventListener("keyup", ()=>this.keyup, false);
			window.addEventListener("paste", function (ev) {
			//console.log(ev.clipboardData.getData('text/plain'));
			//alert(ev.clipboardData.getData('text/plain'));
			}, false);
		}
	}
	private keypress(ev) {
		//console.log("keypress");
		var key = ev.keyCode || ev.charCode;
		//console.log("keypress=" + key);
		// Simple quote :
		if (this.maybesimplequote && (key === 39)) {
			this.insertText("'");
			ev.preventDefault();
			return false;
		};
		// Point décimal: 
		if (key === 46) {
			this.insertText(".");
			ev.preventDefault();
			return false;
		};
		if ((key === 8) || (key === 13) || (key === 27) || (key === 37) || (key === 39) || (key === 46))
			return;
		if (this.active_elt === null)
			return false;
		this.insertText(String.fromCharCode(key));
		ev.preventDefault();
		return false;
	}
	private keydown(ev) {
		//console.log("keydown");
		this.maybesimplequote = false;
		if (this.active_elt === null)
			return false;
		var key = ev.keyCode || ev.charCode;
		//        console.log("keydown=" + key);
		switch (key) {
			case 8: //DEL
				this.active_elt.executeCommand("DEL");
				break;
			case 13: //ENTER
				this.owner.valid();
				break;
			case 27: //ESC
				this.owner.cancel();
				break;
			case 37: //LEFT
				this.active_elt.executeCommand("LEFT");
				break;
			case 39: //RIGHT
				this.active_elt.executeCommand("RIGHT");
				break;
			case 46: //CLR
				this.active_elt.executeCommand("CLR");
				break;
			case 52:
			case 222: //guillemet simple
				this.maybesimplequote = true;
				//this.insertText(String.fromCharCode(39));
				return true;
			default:
				return true;
		}
		ev.preventDefault();
		return false;
	}
	private keyup(ev) {
		ev.preventDefault();
		return false;
	}
}
