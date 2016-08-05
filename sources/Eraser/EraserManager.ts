/// <reference path="../typings/iEraser.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {EraserPanel} from './EraserPanel';

export class EraserManager implements iEraserManager {
	private canvas;
	private panel: EraserPanel;
	filters: {[filter:string]:any};
	constructor(_canvas) {
		this.canvas = _canvas;
		this.panel = null;
		this.filters = {'global': true};
	}
	refreshDisplay() {
		var t = this.canvas.getConstruction().elements();
		var m = this.filters['global'] ? 2 : 1;
		let i = 0, s = t.length;
		while (i < s) { t[i++].setMode(m); }
		this.canvas.paint();
	}
	// On a cliqué sur l'icône Gomme :
	showPanel() {
		if (!this.panel) {
			this.panel = new EraserPanel(this.canvas, this);
			this.panel.show();
			setTimeout(() => this.refreshDisplay(), 1);
		}
	}
	hidePanel() {
		if (this.panel) {
			this.panel.close();
			this.panel = null;
		}
	}
}
