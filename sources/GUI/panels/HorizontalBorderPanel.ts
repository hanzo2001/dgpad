
import {Panel} from './Panel';

export class HorizontalBorderPanel extends Panel {
	protected canvas;
	protected isTop;
	constructor(_canvas, _h, _isTop) {
		super(_canvas.getDocObject());
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = _canvas;
		this.height = _h;
		this.isTop = _isTop;
		this.setAttr('className', 'horizontalPanel');
		//this.transition('translate_x', 0.2, (isTop) ? -width : width);
		this.init();
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		//this.applyTransitionIN();
	}
	close() {
		//this.applyTransitionOUT();
		//setTimeout(function() {
		//	this.owner.parentNode.removeChild(this.getDocObject());
		//}, 300);
	}
	init() {
			let t = this.getOwnerBounds();
			if (this.isTop) {
					this.setBounds(t.left, t.top, t.width, this.height);
			} else {
					this.setBounds(t.left, t.top + t.height - this.height, t.width, this.height);
			}
	}
}
