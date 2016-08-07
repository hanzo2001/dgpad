/// <reference path="./iBasicGUIElement.d.ts" />

interface iGUIElementEvent {
	(event?:MouseEvent|Touch): void;
	MouseEvent_Function?: (event:MouseEvent) => void;// used for removing the listener, very handy but limited
	TouchEvent_Function?: (event:TouchEvent) => void;// used for removing the listener, very handy but limited
}

interface iGUIElement extends iBasicGUIElement {
	addImage(src:string);
	setTouchNumber(i:number);
	setPreventDefault(on:boolean);
	touch(touch:TouchEvent, procMouse:(MouseEvent)=>void);
	addDblClickEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addClickEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addDownEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addMoveEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addUpEvent(proc:iGUIElementEvent, target?:HTMLElement);
	removeDownEvent(proc:iGUIElementEvent, target?:HTMLElement);
	removeMoveEvent(proc:iGUIElementEvent, target?:HTMLElement);
	removeUpEvent(proc:iGUIElementEvent, target?:HTMLElement);
}
