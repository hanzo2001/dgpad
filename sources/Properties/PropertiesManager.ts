/// <reference path="../typings/iCanvas.d.ts" />

import {PropertiesPanel} from './PropertiesPanel';

export class PropertiesManager {
	protected canvas: iCanvas;
	protected propsPanel: PropertiesPanel;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
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
		var v = this.canvas.getConstruction().elements();
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
