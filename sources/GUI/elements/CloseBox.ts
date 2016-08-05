
import {GUIElement} from './GUIElement';

var $APP_PATH = (<any>window).$APP_PATH;

export class CloseBox extends GUIElement {
	constructor(owner:GUIElement, proc:iGUIElementEvent) {
		super(owner,'img');
		this.setAbsolute();
		this.setAttr('src', $APP_PATH + 'NotPacked/images/dialog/closebox.svg');
		this.setBounds(owner.getBounds().width - 15, -15, 30, 30);
		this.addDownEvent(proc);
		owner.addContent(this);
	}
}
