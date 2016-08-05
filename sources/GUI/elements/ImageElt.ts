
import {Panel} from '../panels/Panel';

var $APP_PATH = (<any>window).$APP_PATH;

export class ImageElt extends Panel {
	protected proc: iGUIElementEvent;
	constructor(owner:iGUIElement, src:string, proc:iGUIElementEvent, left:number, top:number, width:number, height:number) {
		super(owner);
		//$U.extend(this, new GUIElement(_owner, "div"));
		//$U.extend(this, new Panel(_owner.getDocObject()));
		this.setStyles("opacity:0");
		this.transition("opacity", 0.4);
		//this.hide();
		this.setAbsolute();
		this.setBounds(left, top, width, height);
		this.setStylesObject({
			'margin':'0px',
			'padding':'0px',
			'background-size':'100%',
			'background-repeat':'no-repeat',
			'background-image':'url('+$APP_PATH+src+')'
		});
		//this.setStyles("margin:0px;padding:0px;background-size:100%;background-repeat:no-repeat;background-image:url(" + $APP_PATH + _src + ")");
		this.addDownEvent(proc);
		this.proc = proc;
		owner.addContent(this);
	}
	show() {
		this.setLayer(100);
		this.applyTransitionIN();
		this.addDownEvent(this.proc);
	}
	hide() {
		this.setLayer(0);
		this.applyTransitionOUT();
		this.removeDownEvent(this.proc);
	}
}
