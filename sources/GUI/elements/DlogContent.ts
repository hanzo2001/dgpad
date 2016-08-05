
import {GUIElement} from './GUIElement';

export class DlogContent extends GUIElement {
	constructor(owner) {
		super(owner,'div');
		let top = owner.getTitleBarHeight();
		let width = owner.getBounds().width;
		let left = 0;
		let height = owner.getBounds().height - owner.getTitleBarHeight();
		this.setAbsolute();
		this.setBoundDim({top,left,width,height},'px');
		//this.setStylesObject({backgroundColor: "rgba(200,200,200,0.5)"});
	}
}
