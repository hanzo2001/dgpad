
import {GUIElement} from './GUIElement';
import {DlogContent} from './DlogContent.js';
import {Utils} from '../../Utils/Utils';

export class SimpleDialog extends GUIElement {
	private browser;
	private content: GUIElement;
	//private closeBoxSize=Object.touchpad?30:20;
	//private closeBoxMargin=5;
	constructor(owner, left:number, top:number, width:number, height:number) {
		super(owner,'div');
		this.left  = left + owner.getBounds().left;
		this.top   = top  + owner.getBounds().top;
		this.width = width;
		this.height= height;
		this.browser = Utils.browserCode();
		this.setAbsolute();
		this.setStylesObject({
			backgroundColor: 'rgba(230,230,230,0.9)',
			border: '1px solid #b4b4b4',
			width:  this.width+'px',
			height: this.height+'px',
			left:   this.left+'px',
			top:   (this.top-this.height)+'px'
		});
		/*
		//this.docObject.style.backgroundColor="#FFFFFF";
		this.docObject.style.backgroundColor = "rgba(230,230,230,0.9)";
		//this.docObject.style.background=browser+"-linear-gradient(top, #9c9ba6, #57575f)";
		//this.docObject.style.backgroundSize = "100%";
		//this.docObject.style.backgroundRepeat="no-repeat";
		this.docObject.style.position = "absolute";
		this.docObject.style.border = "1px solid #b4b4b4";
		this.docObject.style.margin = "0px";
		this.docObject.style.padding = "0px";
		this.docObject.style.width = this.w + "px";
		this.docObject.style.height = this.h + "px";
		this.docObject.style.left = this.l + "px";
		this.docObject.style.top = (this.t - this.h) + "px";
		*/
		this.content = new DlogContent(this);
		this.appendChild((<SimpleDialog>this.content).docObject);
		this.owner.appendChild(this.docObject);
		this.setStylesObject({
			'-webkit-transition': '-webkit-transform 0.2s linear',
			   '-moz-transition': '-moz-transform 0.2s linear',
			'-webkit-transform' : 'translateY(0)',
			   '-moz-transform' : 'translateY(0)'
		});
		setTimeout(() => this.setStylesObject({
			'-webkit-transform': 'translate3d(0,'+this.height+'px, 0)',
			   '-moz-transform': 'translate3d(0,'+this.height+'px, 0)'
		}),1);
	}
	getTitleBarHeight() {
		return 0;
	}
	getCloseBoxBounds() {
	}
	drag(dx, dy) {
		this.left += dx;
		this.top  += dy;
		this.docObject.style.left = this.left+'px';
		this.docObject.style.top = this.top+'px';
	}
	callBackClose() {
	}
	close() {
		setTimeout(() => this.setStylesObject({
			'-webkit-transform': 'translate3d(0,-'+this.height+'px,0)',
			   '-moz-transform': 'translate3d(0,-'+this.height+'px,0)'
		}), 20);
		setTimeout(() => {
			this.owner.getDocObject().parentNode.removeChild(this.docObject);
			this.docObject = null;
			this.callBackClose();
		}, 300);
	}
	addContent(ge: GUIElement) {
		this.content.appendChild((<SimpleDialog>ge).docObject);
	}
};
