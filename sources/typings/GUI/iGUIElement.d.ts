/// <reference path="./iBasicGUIElement.d.ts" />

interface iGUIElementEvent {
	(event?:MouseEvent|Touch): void;
	MouseEvent_Function?: (event:MouseEvent) => void;
	TouchEvent_Function?: (event:TouchEvent) => void;
}

interface iGUIElement extends iBasicGUIElement {
	addImage(src:string);
	setTouchNumber(i:number);
	setPreventDefault(on:boolean);
	touch(touch, procMouse:(MouseEvent)=>void);
	addDblClickEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addClickEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addDownEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addMoveEvent(proc:iGUIElementEvent, target?:HTMLElement);
	addUpEvent(proc:iGUIElementEvent, target?:HTMLElement);
	removeDownEvent(proc:iGUIElementEvent, target?:HTMLElement);
	removeMoveEvent(proc:iGUIElementEvent, target?:HTMLElement);
	removeUpEvent(proc:iGUIElementEvent, target?:HTMLElement);
}
