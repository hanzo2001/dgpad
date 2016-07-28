
import {GUIElement} from './GUIElement';

export class Button extends GUIElement {
	constructor(owner:GUIElement) {
		super(owner,'button');
		this.setAttr("type","button");
		this.setAbsolute();
	}
	setText(text:string) {
		this.docObject.innerHTML = text;
	};
	getText() {
		return this.docObject.innerHTML;
	};
	setCallBack(proc) {
		this.addUpEvent(proc);
	};
}
