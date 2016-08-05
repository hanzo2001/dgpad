
import {slider} from '../GUI/elements/slider';
import {Panel} from '../GUI/panels/Panel';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class MagnetPanel extends Panel implements iMagnetPanel {
	private zc;
	private slider;
	constructor(owner:iElementContainer, proc:(n:number)=>void) {
		super(owner);
		//$U.extend(this, new Panel(owner.getDocObject()));
		this.setAttr("className", "magnetDIV bulleM");
		owner.getDocObject().parentNode.appendChild(this.getDocObject());
		this.slider = new slider(this.getDocObject(), 20, 5, 280, 30, 0, 1000, 0, proc);
		this.slider.setValueWidth(80);
		this.slider.setTextColor("#BBBBBB");
		this.slider.setTabValues([
			[0, $L.magnet_without], 1, 2, 5, 10, 15, 20, 30, 50, 100, 200, 500, 1000, [5000, $L.magnet_max]
		]);
		this.slider.setValue(20);
		this.slider.setBackgroundColor("rgba(0,0,0,0)");
		this.slider.setWindowsEvents();
	}
	quit() {
		this.slider.removeWindowsEvents();
		if (this.getDocObject().parentNode !== null) {
			this.owner.getDocObject().parentNode.removeChild(this.getDocObject());
		}
	}
	setXY(x:number, y:number) {
		this.setStyles(`left:${x}px;top:${y}px`);
	}
	setValue(num:number) {
		var t = this.slider.getTabValues().slice(0);
		var val = t[0];
		let i=1, s=t.length;
		while (i<s) {
			if (Math.abs(t[i] - num) < Math.abs(val - num)) {val = t[i];}
			i++;
		}
		this.slider.setValue(val);
	}
}
