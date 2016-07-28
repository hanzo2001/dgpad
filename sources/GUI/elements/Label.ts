
import {Utils} from '../../Utils/Utils';
import {GUIElement} from './GUIElement';

var $SCALE = (<any>window).$SCALE;

export class Label extends GUIElement {
	constructor(owner) {
		super(owner,'div');
		this.setAttr("type", "div");
		this.setAbsolute();
		this.setStylesObject({
			'color':'#BBB',
			'font-family':'Helvetica, Arial, sans-serif',
			'font-size':(13*$SCALE)+'px',
			'text-align':'center'
		});
	}
	setText(text: string) {
		this.docObject.innerHTML = text;
	};
	getText(): string {
		return this.docObject.innerHTML;
	};
}
