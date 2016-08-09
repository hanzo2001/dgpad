/// <reference path="../typings/iCanvas.d.ts" />

import {DemoModePanel} from './DemoModePanel';

export class DemoModeManager {
	private canvas: iCanvas;
	private fingers: DemoModePanel[];
	private max: number;
	constructor(_canvas:iCanvas) {
		this.canvas = _canvas;
		this.fingers = [];
		this.max = 3;
	}
	setDemoMode(demo:boolean) {
		if (demo) {
			for (let i = 0; i < this.max; i++) {
				this.fingers[i] = new DemoModePanel(this.canvas, i);
				this.fingers[i].applyTransitionOUT();
			}
		} else if (this.fingers.length > 0) {
			for (let i = 0; i < this.max; i++) {
				this.fingers[i].removeEvents();
				this.fingers[i].close();
				this.fingers[i] = null;
			}
			this.fingers = [];
		}
	}
	getDemoMode(): boolean {
		return this.fingers.length > 0;
	}
}
