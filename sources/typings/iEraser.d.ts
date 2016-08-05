/// <reference path="./GUI/iPanel.d.ts" />

interface iEraserManager {
	filters: {[filter:string]:any};
	refreshDisplay();
	showPanel();
	hidePanel();
}

interface iEraserPanel extends iPanel {
	show();
	close();
}
