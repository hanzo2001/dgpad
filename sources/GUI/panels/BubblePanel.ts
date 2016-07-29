
import {Panel} from './Panel';
import {BubbleListPanel} from './BubbleListPanel';

var $U = (<any>window).$U;

export class BubblePanel extends Panel {
	protected canvas;
	protected x: number;
	protected y: number;
	protected callback;
	protected closeFn: ()=>void;
	protected listener: (e:Event)=>void;
	constructor(_canvas, _exec, _close, _ev, _t, _title, _w, _h, _titleheight) {
		super(_canvas.getDocObject());
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.canvas = _canvas;
		this.x = _canvas.mouseX(_ev) + 5;
		this.y = _canvas.mouseY(_ev) - 45;
		this.width = _w;
		this.height = _h;
		this.callback = _exec;
		this.closeFn = _close;
		this.setAttr("className", "coincidencePanel");
		this.transition("scale", 0.15);
		let bubbleList = new BubbleListPanel(this, _t, this.width, this.height, _titleheight, _title);
		this.init();
		this.show();
	}
	isVisible() {
		return (this.getDocObject().parentNode !== null);
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(function() {
			if (this.getDocObject().parentNode !== null) {
				this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
			}
			let action = $U.isMobile.any() ? 'touchstart' : 'mousedown';
			window.removeEventListener(action,this.listener, false);
			this.closeFn();
		}, 300);
	}
	exec(args) {
		this.callback(args);
		this.close();
	}
	init() {
		//let t = this.getOwnerBounds();
		this.setBounds(this.x,this.y,this.width,this.height);
		let action = ($U.isMobile.any()) ? 'touchstart' : 'mousedown';
		if (!this.listener) {this.listener = this.closeIfNeeded.bind(this);}
		window.addEventListener(action,this.listener,false);
	}
	private closeIfNeeded(ev) {
		let x = this.canvas.mouseX(ev);
		let y = this.canvas.mouseY(ev);
		if (x < this.x || y < this.y || x > (this.x + this.width) || y > (this.y + this.height)) {
			this.close();
		}
	}
}
