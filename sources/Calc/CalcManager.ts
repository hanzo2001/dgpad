
import {MainCalcPanel} from './MainCalcPanel';
import {DigitCalcPanel} from './DigitCalcPanel';

export class CalcManager {
	protected canvas;
	protected maincalc;
	protected digitcalc;
	constructor(_canvas) {
		this.canvas = _canvas;
		this.maincalc = null;
		this.digitcalc = null;
	}
	keypressed(ev) {
		var target = ev.target || ev.srcElement;
		this.maincalc.insertText(target.txt);
	}
	// On a cliqué sur l'icône Macro :
	showPanel() {
		if (!this.maincalc) {
			this.maincalc = new MainCalcPanel(this, this.canvas);
			this.digitcalc = new DigitCalcPanel(this, this.canvas);
		}
	}
	hidePanel() {
		if (this.maincalc) {
			this.maincalc.close();
			this.digitcalc.close();
			this.maincalc = null;
			this.digitcalc = null;
		}
	}
	getCustomKB() {
		return this.digitcalc;
	}
	activateBtns(_b) {
		this.digitcalc.activateBtns(_b);
	}
	edit(_obj) {
		this.maincalc.edit(_obj);
	}
}
