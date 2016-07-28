
import {Panel} from './Panel';
import {GUIElement} from '../elements/GUIElement';

export class progressBar extends Panel {
	protected moveableBar: GUIElement;
	protected canvas;
	protected ctx;
	protected bw;
	protected bh;
	protected ww;
	protected hh;
	protected ll;
	protected tt;
	constructor(_canvas) {
		super(_canvas.getDocObject());
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = _canvas;
		this.ctx = _canvas.getContext('2d');
		this.bw = _canvas.getWidth();
		this.bh = 3;
		this.ww = _canvas.getWidth();
		this.hh = 3;
		this.ll = 0;
		this.tt = _canvas.getHeight() - this.hh - _canvas.prefs.controlpanel.size;
		this.setAttr("className", "progressPanel");
		this.setBounds(this.ll, this.tt, this.ww, this.hh);
		this.transition("scale", 0.2);
		let bar = new GUIElement(this, "div");
		bar.setAttr("className", "progressBar");
		bar.setAbsolute();
		bar.setBounds((this.ww - this.bw) / 2, (this.hh - this.bh) / 2, this.bw, this.bh);
		this.moveableBar = new GUIElement(this, "div");
		this.moveableBar.setAttr("className", "moveprogressBar");
		this.moveableBar.setBounds(0, 0, 50, this.bh);
		bar.addContent(this.moveableBar);
		this.addContent(bar);
		this.show();
	}
	move(_pc) {
		let w = this.bw * _pc;
		this.moveableBar.setBounds(0, 0, w, this.bh);
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(() => {
			this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
		}, 300);
	}
}
