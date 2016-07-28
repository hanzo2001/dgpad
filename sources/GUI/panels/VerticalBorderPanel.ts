
import {Panel} from './Panel';

export class VerticalBorderPanel extends Panel {
	protected canvas;
	protected isLeft;
	constructor(_canvas, _w, _isLeft) {
		super(_canvas.getDocObject());
		// have this in mind when instantiating
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = _canvas;
		this.width  = _w;
		this.isLeft = _isLeft;
		this.setAttr('className', 'verticalPanel');
		this.transition('translate_x', 0.2, (this.isLeft) ? -this.width : this.width);
		//this.transition('translate_y', 0.2, (isLeft) ? -width : width);
		this.init();
	}
	show() {
		//document.body.parentNode.appendChild(this.getDocObject());
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(function() {
			//document.body.parentNode.removeChild(this.getDocObject());
			this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
		}, 300);
	}
	init() {
		let t = this.getOwnerBounds();
		if (this.isLeft) {
			this.setBounds(t.left + 10, t.top + 10, this.width, t.height - 20 - this.canvas.prefs.controlpanel.size);
		} else {
			this.setBounds(t.left + t.width - this.width - 10, t.top + 10, this.width, t.height - 20 - this.canvas.prefs.controlpanel.size);
		}
	}
}
