
import {Panel} from '../GUI/panels/Panel';
import {GUIElement} from '../GUI/elements/GUIElement';
import {DigitBtn} from './DigitBtn';

var $U = (<any>window).$U;
var $P = (<any>window).$P;

// expando property <txt>

export class DigitCalcPanel extends Panel {
	protected canvas;
	protected btns;
	constructor(_man, _canvas) {
		super(_canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		var man = _man;
		this.canvas = _canvas;
		this.btns = [];
		var width = this.canvas.getWidth();
		var scl = ($U.isMobile.mobilePhone()) ? $P.MobileScale - 0.02 : 1;
		this.setAttr("className", "digitCalcPanel");
		//this.setStyles("background: " + $U.browserCode() + "-linear-gradient(top, #9c9ba6, #57575f);box-shadow: inset 0 1px 0 #bfbfbf;border-top: 1px solid #303236");
		//this.setStyles("background: -webkit-linear-gradient(top, #9c9ba6, #57575f);margin: 20px auto;padding-top: 10px;box-shadow: inset 0 1px 0 #bfbfbf;border-top: 1px solid #303236;border-radius: 0 0 5px 5px");
		(function () {
			var t = this.getOwnerBounds();
			this.setBounds(0, t.height - this.canvas.prefs.controlpanel.size - 190 * scl, width, 190 * scl);
		}).call(this);
		var gap = 10 * scl;
		var bgap = 10 * scl;
		var btnW = 35 * scl;
		var btnH = 35 * scl;
		var numBtnW = btnW * scl;
		// Pavé numérique :
		var numspad = new GUIElement(this, "div");
		numspad.setAbsolute();
		var pi = String.fromCharCode(0x03C0); // Juste pour tromper jscompress qui converti abusivement...
		var nums = ("|d|x|7|8|9|+_|" + pi + "|y|4|5|6|-_||z|1|2|3|*_||t|0|.|^|/").split("_");
		var g = 0;
		for (var i = 0; i < nums.length; i++) {
			if (nums[i].length === 0) {g += bgap;}
			else {
				var line = nums[i].split("|");
				for (var k = 0; k < line.length; k++) {
					if (line[k] !== "") {
						var btn = new DigitBtn(this);
						btn.setBounds(k * (btnW + gap), g, btnW, btnH);
						btn.getDocObject().txt = line[k];
						btn.setText(line[k]);
						btn.addDownEvent(man.keypressed);
						btn.setEnabled(false);
						this.btns.push(btn);
						numspad.addContent(btn);
					}
				}
				g += btnH + gap;
			}
		}
		var wNum = btnW * 7 + gap * 6;
		numspad.setBounds(this.getBounds().width - wNum - gap, gap, wNum, g);
		btnW = 35 * scl;
		btnH = 35 * scl;
		var funcpad = new GUIElement(this, "div");
		funcpad.setAbsolute();
		//    funcpad.setStyles("background-color:green");
		var fcts = "cos@|sin@|tan@|exp@|round@|mod@|x()_acos@|asin@|atan@|log@|floor@|arg@|y()_sqrt@|abs@|max@|min@|random@|conj@|d(,)".split("_");
		var h = 0;
		var line = "?|:|=|<|>|( )|[ ]|;|,|i".split("|");
		for (var k = 0; k < line.length; k++) {
			//        console.log(k);
			var btn = new DigitBtn(this);
			btn.setBounds(k * (btnW + gap), h, btnW, btnH);
			btn.setStyles("font-size:16px");
			btn.getDocObject().txt = line[k].replace("@", "(@)").replace("()", "(@)").replace("(,", "(@,");
			btn.setText(line[k].replace("@", ""));
			btn.addDownEvent(man.keypressed);
			btn.setEnabled(false);
			this.btns.push(btn);
			funcpad.addContent(btn);
		}
		var lim = 5;
		btnW = 64 * scl;
		var smallBtnW = 35 * scl;
		h += btnH + gap;
		for (var i = 0; i < fcts.length; i++) {
			if (fcts[i].length === 0) {h += bgap;}
			else {
				var line = fcts[i].split("|");
				var col = 0;
				for (var k = 0; k < line.length; k++) {
					var ww = btnW;
					if (k > lim) {ww = smallBtnW;}
					var btn = new DigitBtn(this);
					btn.setBounds(col, h, ww, btnH);
					btn.setStyles("font-size:16px");
					btn.getDocObject().txt = line[k].replace("@", "(@)").replace("()", "(@)").replace("(,", "(@,");
					btn.setText(line[k].replace("@", ""));
					btn.addDownEvent(man.keypressed);
					btn.setEnabled(false);
					this.btns.push(btn);
					funcpad.addContent(btn);
					col += ww + gap;
				}
				h += btnH + gap;
			}
		}
		var wFunc = btnW * 6 + smallBtnW * 2 + gap * 7;
		funcpad.setBounds(gap, gap, wFunc, h);
		btnW = 80 * scl;
		btnH = 35 * scl;
		var cmdpad = new GUIElement(this, "div");
		cmdpad.setAbsolute();
		var cmds = "DEL|CLR_◀|▶".split("_");
		var m = 0;
		for (var i = 0; i < cmds.length; i++) {
			if (cmds[i].length === 0) {m += bgap;}
			else {
				var line = cmds[i].split("|");
				for (var k = 0; k < line.length; k++) {
					var btn = new DigitBtn(this);
					btn.setBounds(k * (btnW + gap), m, btnW, btnH);
					btn.setStyles("font-size:16px");
					btn.getDocObject().txt = "cmd_" + line[k];
					btn.setText(line[k]);
					btn.addDownEvent(man.keypressed);
					btn.setEnabled(false);
					this.btns.push(btn);
					cmdpad.addContent(btn);
				}
				m += btnH + gap;
			}
		}
		var wCmd = btnW * 2 + gap * 1;
		cmdpad.setBounds(wFunc + (this.getBounds().width - wFunc - wNum - wCmd + numBtnW + gap) / 2, this.getBounds().height - m, wCmd, m - gap);
		this.transition("scale", 0.2, g);
		this.addContent(numspad);
		this.addContent(funcpad);
		this.addContent(cmdpad);
		this.show();
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	};
	close() {
		this.applyTransitionOUT();
		setTimeout(() => {
			if (this.getDocObject().parentNode !== null) {
				this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
			}
		}, 300);
	};
	activateBtns(_b) {
		for (var i = 0, len = this.btns.length; i < len; i++) {
			this.btns[i].setEnabled(_b);
		}
	};
}
