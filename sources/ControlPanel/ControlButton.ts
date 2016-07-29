
var $APP_PATH = (<any>window).$APP_PATH;

export class ControlButton {
	protected group;
	protected isOn;
	protected active;
	protected opacityFactor;
	protected docObject;
	constructor(owner, l, t, w, h, src, _isOn, _group, _proc) {
		this.docObject = document.createElement("div");
		this.group = _group;
		if (this.group) {this.group.add(this);}
		this.isOn = _isOn;
		this.active = true;
		this.opacityFactor = 0.5;
		var proc = _proc;
		var bounds = this.getBounds(l,t,w,h);
		this.docObject.style.backgroundImage = "url('" + $APP_PATH + src + "')"; // for image
		this.docObject.style.backgroundSize = "100%";
		this.docObject.style.backgroundRepeat = "no-repeat";
		this.docObject.style.position = "absolute";
		this.docObject.style.backgroundColor = "rgba(0,0,0,0)";
		this.docObject.style.opacity = this.isOn ? '1' : this.opacityFactor+'';
		this.docObject.style.border = "0px";
		this.docObject.style.width = bounds.width + "px";
		this.docObject.style.height = bounds.height + "px";
		this.docObject.style.left = bounds.left + "px";
		this.docObject.style.top = bounds.top + "px";
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
			if (this.active) {
				if (!this.isOn) {
					this.docObject.style.opacity = this.opacityFactor+'';
				}
			}
		}, false);
		this.docObject.addEventListener('mousedown', () => {
			if (this.active) {
				if (this.group) {
					//this.group.deselect();
					this.select();
				};
				if (proc) {proc();}
			}
		}, false);
		owner.getDocObject().appendChild(this.docObject);
	}
	getBounds(l, t, w, h) {
		return {
			"top": t,
			"left": l,
			"width": w,
			"height": h
		};
		// var cb = owner.getBounds();
		// var cw = w;
		// var ch = h;
		// var ct = cb.top + t;
		// var cl = cb.left + l;
		// return {
		// 		"left": cl,
		// 		"top": ct,
		// 		"width": cw,
		// 		"height": ch
		// };
	}
	setActive(_bool) {
		this.active = _bool;
		if (this.active) {
			this.docObject.style.opacity = "1";
		} else {
			this.docObject.style.opacity = this.opacityFactor;
		}
	}
	deselect() {
		this.isOn = false;
		this.docObject.style.opacity = this.opacityFactor;
	}
	select() {
		if (this.group) this.group.deselect();
		this.isOn = true;
		this.docObject.style.opacity = "1";
	}
	isSelected() {
		return this.isOn;
	}
	getDocObject() {
		return this.docObject;
	}
}
