
import {GUIElement} from './GUIElement';

export class InputText extends GUIElement {
	private inp: HTMLInputElement;
	private form: GUIElement;
	private name: GUIElement;
	valid_callback = function(_t) {};
	keyup_callback = function(_t) {};
	focus_callback = function() {};
	constructor(_owner) {
		super(_owner,'div');
		this.setStylesObject({
			'position': 'relative',
			'background-color': 'whitesmoke',
			'border-radius': '12px'
		});
		this.valid_callback = function(_t) {};
		this.keyup_callback = function(_t) {};
		this.focus_callback = function() {};
		this.form = new GUIElement(this,'form');
		this.form.setAttr("action", "javascript:void(0);");
		this.form.getDocObject().onsubmit = this.valid.bind(this);
		this.name = new GUIElement(this,'input');
		this.name.setAttr("type", "text");
		this.name.setStyles("position:absolute;background-color:whitesmoke;border:0px;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:center;vertical-align:middle;outline-width:0px;border-radius:0px;padding:0px");
		this.inp = <HTMLInputElement>this.name.getDocObject();
		this.inp.onmouseup = (e: Event) => e.preventDefault();
		this.inp.onfocus = (e: Event) => {
			e.preventDefault();
			this.inp.setSelectionRange(0, 9999);
			if (Object.touchpad) {window.scrollTo(0, 0);}
		}; 
		this.inp.onkeyup = (e: Event) => {
			e.preventDefault();
			this.keyup_callback(this.name.getAttr("value"));
		};
		this.inp.onblur = (e: Event) => {if (Object.touchpad) {window.scrollTo(0, 0);}};
		this.form.addContent(this.name);
		this.addContent(this.form);
	}
	selectAll() {
		this.inp.setSelectionRange(0, 9999);
	}
	setBounds(left:number, top:number, width:number, height:number) {
		this.docObject.style.top   = top + "px";
		this.docObject.style.left  = left + "px";
		this.docObject.style.width = width + "px";
		this.docObject.style.height= height + "px";
		this.inp.style.top   = "1px";
		this.inp.style.left  = "20px";
		this.inp.style.width = (width - 40) + "px";
		this.inp.style.height= (height - 2) + "px";
	}
	setText(txt: string) {
		this.name.setAttr("value",txt);
	}
	focus() {
		let e = this.name.getDocObject();
		e.focus();
		this.focus_callback();
	}
	private valid() {
		let e = this.name.getDocObject();
		e.blur();
		this.valid_callback(this.name.getAttr("value"));
	};
}
