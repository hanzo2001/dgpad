
import {Color} from '../Utils/Color';
import {GUIElement} from '../GUI/elements/GUIElement';

var $U = (<any>window).$U;

export class props_generic_color extends GUIElement {
	constructor(owner:iGUIElement, color:string, left:number, top:number, width:number) {
		// iprops_colorPanel
		super(owner,'div');
		//$U.extend(this, new GUIElement(owner, "div"));
		var c = new Color();
		c.set(color);
		var lambda = 0.4;
		var r = Math.round(255 * (1 - lambda) + lambda * c.getR());
		var g = Math.round(255 * (1 - lambda) + lambda * c.getG());
		var b = Math.round(255 * (1 - lambda) + lambda * c.getB());
		var rgb = 'rgb('+r+','+g+','+b+')';
		this.setStyle('background-color', rgb);
		this.setStyle('border-color', color);
		this.setStyle('border-width', '4px');
		this.setStyle('border-style', 'solid');
		this.setStyle('border-radius', '16px');
		this.setAbsolute();
		this.setBounds(left, top, width, width);
		this.addDownEvent(()=>owner.setPickerColor(c.getHEX()));
		owner.addContent(this);
	}
}
