/// <reference path="../typings/iProperties.d.ts" />

import {Panel} from '../GUI/panels/Panel';

export class props_panel extends Panel {
	protected obj;
	constructor(owner:iProperties) {
		super(owner);
		//$U.extend(this, new Panel(_owner.getDocObject()));
		this.obj = null;
	}
	set(_obj) {
		this.obj = _obj;
		this.setObj();
	}
	// callback function :
	setObj() {
	}
	repaint() {
		this.owner.repaint();
	}
	compute() {
		this.owner.compute();
	}
}
