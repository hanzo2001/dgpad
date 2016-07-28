
import {Panel} from './Panel';
import {GUIElement} from '../elements/GUIElement';

export class viewportListPanel extends Panel {
	protected rootUL: GUIElement;
	constructor(_owner) {
		super(_owner);
		this.rootUL = new GUIElement(this, 'ul');
		this.setAttr('className', 'viewportListPanel');
		this.rootUL.setAttr('className', 'viewportListUL');
		this.addContent(this.rootUL);
		this.owner.addContent(this);
	}
	addItem(path:string) {
		let myul = this.rootUL;
		let tab = path.split('/');
		let len = tab.length - 1;
		let i=0, s=len;
		while (i<s) {
			let ul = new GUIElement(this,'ul');
			ul.setAttr('className','viewportListUL');
			myul.addContent(ul);
			myul = ul;
			i++;
		}
		let name = tab[len];
		let li = new GUIElement(this,'li');
		li.setAttr('className','viewportListLI');
		li.setAttr('innerHTML',name);
		//li.setAttr('onmousedown', mousedown);
		myul.addContent(li);
	}
}

export class viewportListUL extends GUIElement {
	constructor(_owner) {
		super(_owner,'ul');
		this.setAttr('className','viewportListUL');
	};
}
