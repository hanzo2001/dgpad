/// <reference path="./GUI/iHorizontalBorderPanel.d.ts" />

interface iControlButton {
	getBounds(left:number, top:number, width:number, height:number): {left:number, top:number, width:number, height:number};
	setActive(activate:boolean);
	deselect();
	select();
	isSelected(): boolean;
	getDocObject(): HTMLElement;
}

interface iControlPanel extends iHorizontalBorderPanel {
	selectPropBtn();
	selectCalcBtn();
	setUndoBtn(activate:boolean);
	setRedoBtn(activate:boolean);
	selectArrowBtn();
	forceArrowBtn();
	deselectPointer();
	deselectAll();
	selectNameBtn(select:boolean);
}

interface iWindowOpenIFrame {
	div(): HTMLElement;
	frame(): HTMLIFrameElement;
	show();
	close();
	reload();
}
