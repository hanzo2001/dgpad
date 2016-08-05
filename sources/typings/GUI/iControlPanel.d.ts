/// <reference path="./iHorizontalBorderPanel.d.ts" />

interface iControlPanel extends iHorizontalBorderPanel {
	selectPropBtn();
	selectCalcBtn();
	setUndoBtn(active);
	setRedoBtn(active);
	selectArrowBtn();
	forceArrowBtn();
	deselectPointer();
	deselectAll();
	selectNameBtn(b);
}
