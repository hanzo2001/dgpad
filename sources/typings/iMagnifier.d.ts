/// <reference path="./GUI/iPanel.d.ts" />

interface iDemoModePanel extends iPanel {
	removeEvents();
}

interface iMagnifierManager {
	setMagnifierMode(magn:boolean);
	getMagnifierMode(): boolean;
	hide();
	show();
	magnifierPaint(coords);
}

interface iMagnifierPanel extends iPanel {
	init();
	magnifierPaint(coords);
}

interface iDemoModeManager {
	setDemoMode(demo:boolean);
	getDemoMode(): boolean;
}
