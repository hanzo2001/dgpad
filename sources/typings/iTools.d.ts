/// <reference path="../typings/iCanvas.d.ts" />
/// <reference path="./GUI/iPanel.d.ts" />

interface iToolBtn extends iPanel {
	show();
	close();
	hide();
	init(left:number, top:number, width:number, height:number);
}

interface iTool {
	getConstructor();
	getX(): number;
	getY(): number;
	getW(): number;
	getH(): number;
	init(x:number, y:number, size:number);
	hide();
	close();
}

interface iToolsManager {
	isVisible(): boolean;
	addTool(objectConstructor:any);
	getConstructor(code:string): any;
	closeTools();
	hideTools();
	showTools(event:MouseEvent);
	showOneTool(tool:iTool, event:MouseEvent);
	mouseDown(event:MouseEvent, tool:iTool);
	mouseMoved(event:MouseEvent);
	mouseReleased(event:MouseEvent);
}
