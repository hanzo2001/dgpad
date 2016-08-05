/// <reference path="../typings/iProperties.d.ts" />

import {props_panel} from './props_panel';
import {InputText} from '../GUI/elements/InputText';
import {Checkbox} from '../GUI/elements/Checkbox';

var $L = (<any>window).$L;

export class props_namePanel extends props_panel {
	protected input: InputText;
	protected checkbox: Checkbox;
	constructor(owner:iPropertiesPanel) {
		super(owner);
		//$U.extend(this, new props_panel(_owner));
		this.setAttr("className", "props_nameDIV");
		this.transition("translate_x", 0.2, 200);
		this.input = new InputText(this);
		this.input.setBounds(10, 10, 100, 25);
		this.addContent(this.input);
		var show_callback = (toggle) => {
			this.obj.setShowName(toggle);
			this.repaint();
		}
		this.checkbox = new Checkbox(this.getDocObject(), 130, 8, 100, 30, false, $L.props_showname, show_callback);
		this.checkbox.setTextColor("#252525");
		this.input.valid_callback = () => {};
		this.input.keyup_callback = (_t) => {
			this.obj.setName(_t);
			this.obj.setShowName(true);
			this.checkbox.setValue(true);
			this.obj.refreshChildsNames();
			this.repaint();
		}; 
	}
	focus() {
		this.input.focus();
		this.input.selectAll();
	}
	setObj() {
		this.input.setText(this.obj.getName());
		this.checkbox.setValue(this.obj.getShowName());
		if (this.isVisible()) {
			if (!Object.touchpad) {this.focus();}
		} else {
			this.show();
			if (!Object.touchpad) {setTimeout(() => this.focus(), 300);}
		}
	}
}
