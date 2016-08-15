/// <reference path="../typings/GUI/iBtnGroup.d.ts" />

var $APP_PATH = (<any>window).$APP_PATH;

export class ControlButton {
	protected group: iBtnGroup;
	protected isOn: boolean;
	protected active: boolean;
	protected opacityFactor: number;
	protected docObject: HTMLElement;
	constructor(owner:iControlPanel, left:number, top:number, width:number, height:number, src:string, isOn:boolean, group:iBtnGroup, _proc:()=>void) {
		this.docObject = document.createElement("div");
		this.group = group;
		if (this.group) {this.group.add(this);}
		this.isOn = isOn;
		this.active = true;
		this.opacityFactor = 0.5;
		var proc = _proc;
		var bounds = this.getBounds(left,top,width,height);
		this.docObject.style.backgroundImage = "url('"+$APP_PATH+src+"')"; // for image
		this.docObject.style.backgroundSize = "100%";
		this.docObject.style.backgroundRepeat = "no-repeat";
		this.docObject.style.position = "absolute";
		this.docObject.style.backgroundColor = "rgba(0,0,0,0)";
		this.docObject.style.opacity = this.isOn ? '1' : this.opacityFactor+'';
		this.docObject.style.border = "0px";
		this.docObject.style.width = bounds.width+"px";
		this.docObject.style.height = bounds.height+"px";
		this.docObject.style.left = bounds.left+"px";
		this.docObject.style.top = bounds.top+"px";
		this.docObject.style.setProperty("-webkit-tap-highlight-color", "transparent");
		this.docObject.addEventListener('touchstart', (e) => {
			e.preventDefault();
			if (this.active) {
				if (this.group) {
					this.group.deselect();
					this.select();
				};
				if (proc) {proc();}
			}
		}, false);
		this.docObject.addEventListener('mouseover', () => {
			if (this.active) {
				this.docObject.style.opacity = "1";
			}
		}, false);
		this.docObject.addEventListener('mouseout', () => {
			if (this.active && !this.isOn) {
				this.docObject.style.opacity = this.opacityFactor+'';
			}
		}, false);
		this.docObject.addEventListener('mousedown', () => {
			if (this.active) {
				if (this.group) {this.select();};
				if (proc) {proc();}
			}
		}, false);
		owner.getDocObject().appendChild(this.docObject);
	}
	getBounds(left:number, top:number, width:number, height:number) {
		return {top, left, width, height};
	}
	setActive(bool:boolean) {
		this.active = bool;
		this.docObject.style.opacity = this.active ? '1' : this.opacityFactor+'';
	}
	deselect() {
		this.isOn = false;
		this.docObject.style.opacity = this.opacityFactor+'';
	}
	select() {
		if (this.group) {this.group.deselect();}
		this.isOn = true;
		this.docObject.style.opacity = "1";
	}
	isSelected(): boolean {
		return this.isOn;
	}
	getDocObject(): HTMLElement {
		return this.docObject;
	}
}
