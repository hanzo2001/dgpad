
import {Panel} from '../GUI/panels/Panel';

export class DemoModePanel extends Panel {
	private downListener;
	private moveListener;
	private upListener;
	constructor(_canvas, _touchNum) {
		super(_canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.setAttr("className", "pointerDIV");
		this.transition("scale", 0.1);
		this.setTouchNumber(_touchNum);
		this.setPreventDefault(false);
		this.downListener = (e) => this.dragdown(<Touch>e);
		this.moveListener = (e) => this.dragmove(<Touch>e);
		this.upListener   = (e) => this.dragup();
		this.addDownEvent(this.downListener, <any>window);
		this.addMoveEvent(this.moveListener, <any>window);
		this.addUpEvent(this.upListener, <any>window);
		document.body.parentNode.appendChild(this.getDocObject());
	}
	removeEvents() {
			this.removeMoveEvent(this.downListener, <any>window);
			this.removeDownEvent(this.moveListener, <any>window);
			this.removeUpEvent(this.upListener, <any>window);
	}
	private dragmove(event:Touch) {
		if (event) {
			var w = this.docObject.offsetWidth;
			var h = this.docObject.offsetHeight;
			this.setStyle("left", (event.pageX - w / 2) + "px");
			this.setStyle("top", (event.pageY - h / 2) + "px");
		}
	}
	private dragdown(event:Touch) {
		if (event) {
			var w = this.docObject.offsetWidth;
			var h = this.docObject.offsetHeight;
			this.setStyle("left", (event.pageX - w / 2) + "px");
			this.setStyle("top", (event.pageY - h / 2) + "px");
			this.applyTransitionIN();
		}
	}
	private dragup() {
		this.applyTransitionOUT();
	}
}
