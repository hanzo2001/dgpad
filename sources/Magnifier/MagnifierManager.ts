/// <reference path="../typings/iCanvas.d.ts" />

import {MagnifierPanel} from './MagnifierPanel';

export class MagnifierManager {
	private canvas: iCanvas;
	private panel: MagnifierPanel;
	constructor(_canvas:iCanvas) {
		this.canvas = _canvas;
		this.panel = null;
		this.setMagnifierMode(Object.touchpad);
	}
	setMagnifierMode(_magn:boolean) {
		if (_magn) {
			this.panel = new MagnifierPanel(this.canvas);
			this.panel.show();
		} else if (this.panel) {
			this.panel.close();
			this.panel = null;
		}
	}
	getMagnifierMode(): boolean {
		return this.panel !== null;
	}
	hide() {
		if (this.panel) {this.panel.setStyle("visibility", "hidden");}
	}
	show() {
		if (this.panel) {this.panel.setStyle("visibility", "visible");}
	}
	magnifierPaint(coords) {
		if (this.panel) {
			this.panel.magnifierPaint(coords);
		}
	}
}
