
import {GUIElement} from '../GUI/elements/GUIElement';

export class CustomTextSelection extends GUIElement {
	private ti;
	private offsetX: number;
	private clickpos: number;
	private selStart: number;
	private selEnd: number;
	private selStartX: number;
	private selEndX: number;
	private blinkvar: number;
	private ONECAR: number;
	private marginOffsetX: number;
	constructor(_ti) {
		super(_ti,'div');
		//$U.extend(this, new GUIElement(_ti, "div"));
		this.ti = _ti;
		this.offsetX = 0;
		this.clickpos = NaN;
		this.selStart = NaN;
		this.selEnd = NaN;
		this.selStartX = NaN;
		this.selEndX = NaN;
		this.blinkvar = NaN;
		this.ONECAR = NaN;
		this.marginOffsetX = 0;
		this.setStyles("pointer-events:none;z-index:2;visibility:hidden;position:absolute;background-color:blue;left:0px;top:2px;width:3px");
	}
	setOffset(_x:number) {
		this.offsetX = _x;
	}
	setHide(_h:boolean) {
		if (_h)
			this.setStyle("display", "none");
		else {
			this.setStyle("display", "inline");
			this.setStyle("visibility", "visible");
			//console.log("show !!!");
		}
	}
	nextCar() {
		if (this.selStart < this.ti.getText().length) {
			this.selStart++;
			this.selStartX = this.ONECAR * this.selStart;
			this.selEnd = this.selStart;
			this.selEndX = this.selStartX;
			this.clickpos = this.selStart;
			this.display(true);
		}
	}
	getSelStart(): number {
		return this.selStart;
	}
	getSelEnd(): number {
		return this.selEnd;
	}
	setSelectionRange(_start:number, _end:number) {
		this.selStart = _start;
		this.selStartX = this.ONECAR * this.selStart;
		this.selEnd = _end;
		this.selEndX = this.ONECAR * this.selEnd;
		this.clickpos = this.selStart;
		this.display(true);
	}
	setCarLength(x:number) {
		this.ONECAR = x;
	}
	getCarLength(): number {
		return this.ONECAR;
	}
	mousedown(x:number) {
		if (!this.ti.isActive()) {return;}
		x = x - this.marginOffsetX;
		this.selStart = Math.round(x / this.ONECAR);
		if (this.selStart > this.ti.getText().length) {this.selStart = this.ti.getText().length;}
		this.selStartX = this.ONECAR * this.selStart;
		this.selEnd = this.selStart;
		this.selEndX = this.selStartX;
		this.clickpos = this.selStart;
		this.display(false);
	}
	mousemove(x) {
		if (!this.ti.isActive()) {return;}
		x = x - this.marginOffsetX;
		var xpos = Math.round(x / this.ONECAR);
		if (xpos < 0) {xpos = 0;}
		this.selStart = Math.min(xpos, this.clickpos);
		this.selEnd = Math.max(xpos, this.clickpos);
		if (this.selEnd > this.ti.getText().length) {this.selEnd = this.ti.getText().length;}
		this.selStartX = this.ONECAR * this.selStart;
		this.selEndX = this.ONECAR * this.selEnd;
		this.display(false);
	}
	setActive() {
		if (!this.ti.isActive()) {
			this.selStart = NaN, this.selEnd = NaN, this.selStartX = NaN, this.selEndX = NaN;
			this.display(true);
		}
	}
	getText() {
		return (this.ti.getText().substring(this.selStart, this.selEnd));
	}
	executeCommand(_st:string) {
		switch (_st) {
			case "DEL":
				if (this.selStart > 0) {
					var s = this.ti.getText();
					if (this.selStart === this.selEnd) {
						var before = s.slice(0, this.selStart - 1);
						var after = s.slice(this.selEnd);
					} else {
						var before = s.slice(0, this.selStart);
						var after = s.slice(this.selEnd);
					}
					this.ti.setText(before + after);
					this.selStart = before.length;
					//this.selStart--;
				}
				break;
			case "CLR":
				this.ti.setText("");
				this.selStart = 0;
				break;
			case "LEFT":
				if (this.selStart > 0)
					this.selStart--;
				break;
			case "RIGHT":
				if (this.selStart < this.ti.getText().length)
					this.selStart++;
				break;
		}
		this.selStartX = this.ONECAR * this.selStart;
		this.selEnd = this.selStart;
		this.selEndX = this.selStartX;
		this.clickpos = this.selStart;
		this.setStyle("visibility", "visible");
		this.display(true);
	}
	insertText(_st:string) {
		if (!this.command(_st)) {
			if (!this.particularCases(_st)) {
				var s = this.ti.getText();
				var before = s.slice(0, this.selStart);
				var middle = s.substring(this.selStart, this.selEnd);
				var after = s.slice(this.selEnd);
				if (_st.indexOf("@") === -1) {
					middle = _st;
					this.selStart += _st.length;
				} else {
					var empty = (middle === "");
					middle = _st.replace("@", middle);
					this.selStart += empty ? middle.length - (_st.length - _st.indexOf("@") - 1) : middle.length;
				}
				this.ti.setText(before + middle + after);
			}
		}
		this.selStartX = this.ONECAR * this.selStart;
		this.selEnd = this.selStart;
		this.selEndX = this.selStartX;
		this.clickpos = this.selStart;
		this.setStyle("visibility", "visible");
		this.display(true);
	}
	private setMarginOffset() {
		if (this.selStartX > this.ti.getInputDIV().getBounds().width) {
			this.marginOffsetX = this.ti.getInputDIV().getBounds().width - this.selStartX;
			this.ti.getContentSPAN().setStyles("margin-left:" + this.marginOffsetX + "px");
		} else {
			this.ti.getContentSPAN().setStyles("margin-left:0px");
			this.marginOffsetX = 0;
		}
	}
	private display(_withOffset:boolean) {
		if (_withOffset)
			this.setMarginOffset();
		if (isNaN(this.selStart)) {
			clearInterval(this.blinkvar);
			this.blinkvar = NaN;
			this.setStyles("visibility:hidden;left:" + (this.offsetX + this.marginOffsetX) + "px;width:0px");
		} else {
			if (this.selStart === this.selEnd) {
				if (isNaN(this.blinkvar)) {
					this.setStyle("visibility", "visible");
					this.blinkvar = setInterval(() => this.blink, 500);
				}
				this.setStyles("background-color:rgba(0,0,255,1);left:" + (this.selStartX + this.offsetX + this.marginOffsetX) + "px;width:3px");
			} else {
				clearInterval(this.blinkvar);
				this.blinkvar = NaN;
				this.setStyles("visibility:visible;background-color:rgba(0,0,255,0.2);left:" + (this.selStartX + this.offsetX + this.marginOffsetX) + "px;width:" + (this.selEndX - this.selStartX) + "px");
			}
		}
	}
	private blink() {
		let b = this.getStyle("visibility") === "hidden";
		this.setStyle("visibility", b ? "visible" : 'hidden');
	}
	private command(_st:string): boolean {
		if (_st.indexOf("cmd_") !== 0) {return false;}
		_st = _st.replace("cmd_", "");
		switch (_st) {
			case "DEL": this.executeCommand("DEL"); break;
			case "CLR": this.executeCommand("CLR"); break;
			case "◀": this.executeCommand("LEFT"); break;
			case "▶": this.executeCommand("RIGHT"); break;
		}
		return true;
	}
	private particularCases(_st): boolean {
		var s = this.ti.getText();
		var before = s.slice(0, this.selStart);
		var middle = s.substring(this.selStart, this.selEnd);
		var after = s.slice(this.selEnd);
		switch (_st) {
			case "( )":
				this.ti.setText(before + "(" + middle + ")" + after);
				this.selStart += (middle.length === 0) ? 1 : middle.length + 2;
				return true;
			case "[ ]":
				this.ti.setText(before + "[" + middle + "]" + after);
				this.selStart += (middle.length === 0) ? 1 : middle.length + 2;
				return true;
			default:
				return false;
		}
	}
}
