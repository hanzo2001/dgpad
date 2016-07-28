
import {GUIElement} from './GUIElement';

export class Iframe extends GUIElement {
	constructor(owner:GUIElement, src:string) {
		super(owner,'iframe');
		this.setAttr('frameborder', '0');
		this.setStyle('border', '0');
		this.setAttr('marginheight', '0');
		this.setAttr('marginwidth', '0');
		//this.setAttr('scrolling', 'yes');
		this.setAttr('src',src);
	};
	setURL(url:string) {
		this.setAttr('src',url);
	};
}