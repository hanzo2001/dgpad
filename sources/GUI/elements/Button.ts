/// <reference path="../../typings/GUI/iButton.d.ts" />

import {GUIElement} from './GUIElement';

export class Button extends GUIElement implements iButton {
	constructor(owner:iElementContainer) {
		super(owner,'button');
		this.setAttr('type','button');
		this.setAbsolute();
	}
	setText(text:string) {
		this.docObject.innerHTML = text;
	}
	getText() {
		return this.docObject.innerHTML;
	}
	setCallBack(proc) {
		this.addUpEvent(proc);
	}
}
