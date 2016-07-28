
import {GUIElement} from './GUIElement';

export class DlogContent extends GUIElement {
	constructor(owner) {
		super(owner,'div');
		let h = owner.getBounds().height - owner.getTitleBarHeight();
		this.setStylesObject({
			//backgroundColor: "rgba(200,200,200,0.5)",
			position: "absolute",
			left: "0px",
			top: owner.getTitleBarHeight() + "px",
			margin: "0px",
			padding: "0px",
			width: owner.getBounds().width + "px",
			height: h + "px"
		});
	}
}
