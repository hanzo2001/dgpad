
import {Panel} from '../GUI/panels/Panel';

export class props_panel extends Panel {
	obj;
	owner;
	constructor(_owner) {
		super(_owner.getDocObject());
		//$U.extend(this, new Panel(_owner.getDocObject()));
		this.obj = null;
		this.owner = _owner;
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
