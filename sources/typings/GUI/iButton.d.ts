/// <reference path="./iGUIElement.d.ts" />

interface iButton extends iGUIElement {
	setText(text:string);
	getText();
	setCallBack(proc);
}
