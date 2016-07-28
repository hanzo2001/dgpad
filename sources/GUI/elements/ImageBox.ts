
import {GUIElement} from './GUIElement';
import {Utils} from '../../Utils/Utils';

export class ImageBox extends GUIElement {
	constructor(owner:GUIElement, src:string, width:number, height:number, proc) {
		super(owner,'img');
    this.setAbsolute();
    this.setStyle('margin', '0px');
    this.setStyle('padding', '0px');
    this.setAttr('src',src);
    this.setBounds(0,0,width,height);
    this.addUpEvent(proc);
    owner.addContent(this);
	}
}
