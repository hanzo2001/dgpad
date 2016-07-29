
import {PropertiesPanel} from './PropertiesPanel';

export class PropertiesManager {
	protected canvas;
	protected propsPanel: PropertiesPanel;
	constructor(_canvas) {
		this.canvas = _canvas;
		this.propsPanel = null;
		// On a cliqué sur l'icône Properties :
	}
	showPanel() {
		if (!this.propsPanel) {
			this.propsPanel = new PropertiesPanel(this.canvas);
		}
	}
	hidePanel() {
		if (this.propsPanel) {
			this.propsPanel.close();
			this.propsPanel = null;
			this.clearEditMode();
		}
	}
	clearEditMode() {
		var Cn = this.canvas.getConstruction();
		var v = Cn.elements();
		let i=0, s=v.length;
		while (i<s) {v[i++].setEditMode(0);}
	}
	edit(_obj) {
		this.clearEditMode();
		if (this.propsPanel) {
			_obj.setEditMode(1);
			this.propsPanel.showProperties(_obj);
		}
	}
}
