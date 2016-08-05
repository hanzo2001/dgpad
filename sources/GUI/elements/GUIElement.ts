/// <reference path="../../typings/GUI/iGUIElement.d.ts" />

import {Utils} from '../../Utils/Utils';
import {BasicGUIElement} from './BasicGUIElement';

export class GUIElement extends BasicGUIElement implements iGUIElement {
	protected touchNumber = 0;
	protected preventDefault = true;
	addImage(src:string) {
		var img = new Image();
		img.src = src;
		img.style.position = "absolute";
		img.style.left = "0px";
		img.style.top = "0px";
		img.style.width = "100%";
		img.style.height = "100%";
		this.docObject.appendChild(img);
	}
	setTouchNumber(i:number) {
		this.touchNumber = i;
	}
	setPreventDefault(on:boolean) {
		this.preventDefault = on;
	}
	touch(touch, procMouse:(MouseEvent)=>void) {
		touch.preventDefault();
		procMouse(this.PadToMouseEvent(touch.touches[0]||touch.changedTouches[0]));
	}
	addDblClickEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.addEventListener('dblclick', this.exe(proc), false);
		}
	}
	addClickEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.addEventListener('touchstart', this.exeTCH(proc), false);
			o.addEventListener('click', this.exe(proc), false);
		}
	}
	addDownEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.addEventListener('touchstart', this.exeTCH(proc), false);
			if (!Utils.isMobile.android() && !Utils.isMobile.ios()) {
				o.addEventListener('mousedown', this.exe(proc), false);
			}
		}
	}
	addMoveEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.addEventListener('touchmove', this.exeTCH(proc), false);
			if (!Utils.isMobile.android() && !Utils.isMobile.ios()) {
				o.addEventListener('mousemove', this.exe(proc), false);
			}
		}
	}
	addUpEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.addEventListener('touchend', this.exeTCH(proc), false);
			if (!Utils.isMobile.android() && !Utils.isMobile.ios()) {
				o.addEventListener('mouseup', this.exe(proc), false);
			}
		}
	}
	removeDownEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.removeEventListener('touchstart', proc.TouchEvent_Function, false);
			o.removeEventListener('mousedown', proc.MouseEvent_Function, false);
		}
	}
	removeMoveEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.removeEventListener('touchmove', proc.TouchEvent_Function, false);
			o.removeEventListener('mousemove', proc.MouseEvent_Function, false);
		}
	}
	removeUpEvent(proc:iGUIElementEvent, target?:HTMLElement) {
		if (proc) {
			var o = (arguments.length > 1) ? target : this.docObject;
			o.removeEventListener('touchend', proc.TouchEvent_Function, false);
			o.removeEventListener('mouseup', proc.MouseEvent_Function, false);
		}
	}
	protected PadToMouseEvent(touch:MouseEvent): MouseEvent {
		var event = new MouseEvent('mouseup',{
			bubbles: true,// canBubble? which one is it
			cancelable: true,
			view: window,
			detail: 1,
			screenX: touch.screenX,
			screenY: touch.screenY,
			clientX: touch.clientX,
			clientY: touch.clientY,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: null
		});
		return event;
	}
	protected exe(p:iGUIElementEvent): (e:MouseEvent)=>void {
		if (this.preventDefault) {
			p.MouseEvent_Function = function(event: MouseEvent) {
				event.preventDefault();
				p(event);
			};
		} else {
			p.MouseEvent_Function = function(event: MouseEvent) {
				p(event);
			};
		}
		return p.MouseEvent_Function;
	}
	protected exeTCH(p:iGUIElementEvent): (e:TouchEvent)=>void {
		if (this.preventDefault) {
			p.TouchEvent_Function = function(tch:TouchEvent) {
				tch.preventDefault();
				var touch = tch.touches[this.touchNumber] || tch.changedTouches[this.touchNumber];
				p(touch);
			};
		} else {
			p.TouchEvent_Function = function(tch) {
				var touch = tch.touches[this.touchNumber] || tch.changedTouches[this.touchNumber];
				p(touch);
			};
		}
		return p.TouchEvent_Function;
	}
}
