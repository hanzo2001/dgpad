
import {Panel} from './Panel';

export class CenterPanel extends Panel {
	protected canvas;
	constructor(_canvas, _w, _h) {
		super(_canvas.getDocObject());
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = _canvas;
		this.height = _h;
		this.width = _w;
		this.setAttr("className", "centerPanel");
		this.transition("scale", 0.2);
		this.init();
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
	init() {
		let t = this.getOwnerBounds();
		this.setBounds(t.left + (t.width - this.width) / 2, t.top + (t.height - this.height) / 2, this.width, this.height);
	}
}
