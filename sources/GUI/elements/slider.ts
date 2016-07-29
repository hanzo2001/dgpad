
var $U = (<any>window).$U;
var $L = (<any>window).$L;

var css = (e:HTMLElement, p:string, v:string) => e.style.setProperty(p,v);

export class slider {
	protected tabvalues;
	protected tablabels;
	protected labelwidth;
	protected label;
	protected valuewidth;
	protected fontsize;
	protected valueprecision;
	protected sliderheight;
	protected indicatorwidth;
	protected top;
	protected left;
	protected width;
	protected height;
	protected min;
	protected max;
	protected value;
	protected callback;
	protected sw_width;
	protected discrete;
	protected createDiv;
	protected mousepressed;
	protected owner;
	protected wrapper: HTMLElement;
	protected label_wrapper: HTMLElement;
	protected slider_wrapper: HTMLElement;
	protected value_wrapper: HTMLElement;
	protected indicator: HTMLElement;
	protected slider_back: HTMLElement;
	protected slider_front: HTMLElement;
	constructor(owner, left, top, width, height, min, max, value, callback) {
		this.tabvalues = null;
		this.tablabels = null;
		this.labelwidth = 0;
		this.label = "";
		this.valuewidth = 40;
		this.fontsize = 12;
		this.valueprecision = Math.round(1 / 0.01);
		this.sliderheight = 6;
		this.indicatorwidth = 18;
		this.top = top;
		this.left = left;
		this.width = width;
		this.height = height;
		this.min = min;
		this.max = max;
		this.value = value;
		this.callback = callback;
		this.sw_width;
		this.discrete = false;
		this.createDiv = () => document.createElement("div");
		this.mousepressed = false;
		this.owner = owner;
		this.wrapper = this.createDiv();
		this.label_wrapper = this.createDiv();
		this.slider_wrapper = this.createDiv();
		this.value_wrapper = this.createDiv();
		this.indicator = this.createDiv();
		this.slider_back = this.createDiv();
		this.slider_front = this.createDiv();
		this.init();
		this.slider_wrapper.addEventListener('touchstart', (e)=>this.touchdown(e), false);
		this.slider_wrapper.addEventListener('touchmove', (e)=>this.touchmove(e), false);
		this.owner.addEventListener('touchend', (e)=>this.touchup(e), false);
		this.slider_wrapper.addEventListener('mousedown', (e)=>this.mousedown(e), false);
		this.slider_wrapper.addEventListener('mousemove', (e)=>this.mousemove(e), false);
		this.owner.addEventListener('mouseup', (e)=>this.mouseup(e), false);
		this.setBounds(this.left, this.top, this.width, this.height);
		this.slider_wrapper.appendChild(this.slider_back);
		this.slider_wrapper.appendChild(this.slider_front);
		this.slider_wrapper.appendChild(this.indicator);
		this.wrapper.appendChild(this.label_wrapper);
		this.wrapper.appendChild(this.value_wrapper);
		this.wrapper.appendChild(this.slider_wrapper);
		this.owner.appendChild(this.wrapper);

	}
	setHeights(h1, h2) {
		this.sliderheight = h1;
		this.indicatorwidth = h2;
		this.init();
		this.setBounds(this.left, this.top, this.width, this.height);
	};
	setDiscrete(dis) {
		this.discrete = dis;
	};
	setLabel(t, w) {
		this.label = t;
		this.labelwidth = w;
		css(this.label_wrapper,"left", "0px");
		css(this.label_wrapper,"top", "0px");
		css(this.label_wrapper,"width", w + "px");
		css(this.label_wrapper,"height", this.height + "px");
		css(this.slider_wrapper,"left", w + "px");
		this.sw_width = (this.width - this.valuewidth - w);
		css(this.slider_wrapper,"width", this.sw_width + "px");
		css(this.indicator,"left", ((this.value - this.min) * (this.width - this.valuewidth - w) / (this.max - this.min) - this.indicatorwidth / 2) + "px");
		css(this.slider_front,"width", ((this.value - this.min) * (this.width - this.valuewidth - w) / (this.max - this.min)) + "px");
		this.label_wrapper.innerHTML = t;
	};
	setValueWidth(v) {
		this.valuewidth = v;
		this.setBounds(this.left, this.top, this.width, this.height);
		this.setLabel(this.label, this.labelwidth);
	};
	setTextColor(col) {
		css(this.label_wrapper,"color", col);
		css(this.value_wrapper,"color", col);
	};
	setFontSize(sz) {
		this.fontsize = sz;
		css(this.label_wrapper,"font-size", sz + "px");
		css(this.value_wrapper,"font-size", sz + "px");
	};
	setValuePrecision(prec) {
		this.valueprecision = Math.round(1 / prec);
		this.refreshValue();
	};
	setMin(m) {
		this.min = m;
		this.refreshValue();
	};
	setMax(m) {
		this.max = m;
		this.refreshValue();
	};
	setBackgroundColor(col) {
		css(this.wrapper,"background-color", col);
	};
	getValue() {
		if (this.tabvalues)
				return this.tabvalues[Math.round(this.value)];
		else
				return (Math.round(this.value * this.valueprecision) / this.valueprecision);
	};
	getDocObject() {
		return this.wrapper;
	}
	setValue(val) {
		var v = (this.tabvalues) ? this.tabvalues.indexOf(val) : val;
		this.value = v;
		this.refreshValue();
		this.setValueWidth(this.valuewidth);
	};
	setTabValues(t) {
		this.min = 0;
		this.max = t.length - 1;
		this.valueprecision = 1;
		this.tabvalues = [];
		this.tablabels = [];
		for (var i = 0; i < t.length; i++) {
			if (t[i] instanceof Array) {
				this.tabvalues.push(t[i][0]);
				this.tablabels.push(t[i][1]);
			} else {
				this.tabvalues.push(t[i]);
				this.tablabels.push(t[i]);
			}
		}
		//this.tabvalues = t;
	};
	getTabValues() {
		return this.tabvalues;
	};
	setWindowsEvents() {
		this.slider_wrapper.removeEventListener('touchstart', (e)=>this.touchdown(e), false);
		this.slider_wrapper.removeEventListener('touchmove', (e)=>this.touchmove(e), false);
		this.slider_wrapper.removeEventListener('mousemove', (e)=>this.mousemove(e), false);
		this.owner.removeEventListener('mouseup', (e)=>this.mouseup(e), false);
		this.owner.addEventListener('touchstart', (e)=>this.touchdown(e), false);
		this.owner.addEventListener('touchmove', (e)=>this.touchmove(e), false);
		window.addEventListener('mousemove', (e)=>this.mousemove(e), false);
		window.addEventListener('mouseup', (e)=>this.mouseup(e), false);
	};
	removeWindowsEvents() {
		window.removeEventListener('mousemove', (e)=>this.mousemove(e), false);
		window.removeEventListener('mouseup', (e)=>this.mouseup(e), false);
	};
	private init() {
		css(this.wrapper,"background-color", "rgba(0,0,0,1)");
		css(this.wrapper,"position", "absolute");
		css(this.value_wrapper,"background-color", "rgba(0,0,0,0)");
		css(this.value_wrapper,"position", "absolute");
		css(this.value_wrapper,"font-family", "Helvetica, Arial, sans-serif");
		css(this.value_wrapper,"font-size", this.fontsize + "px");
		css(this.value_wrapper,"text-align", "center");
		css(this.value_wrapper,"line-height", this.height + "px");
		css(this.value_wrapper,"overflow", "hidden");
		css(this.slider_wrapper,"background-color", "rgba(0,0,0,0)");
		css(this.slider_wrapper,"position", "absolute");
		css(this.slider_wrapper,"overflow", "visible");
		css(this.label_wrapper,"background-color", "rgba(0,255,0,0)");
		css(this.label_wrapper,"position", "absolute");
		css(this.label_wrapper,"font-family", "Helvetica, Arial, sans-serif");
		css(this.label_wrapper,"font-size", this.fontsize + "px");
		css(this.label_wrapper,"text-align", "center");
		css(this.label_wrapper,"line-height", this.height + "px");
		css(this.slider_back,"position", "absolute");
		css(this.slider_back,"background-image", "linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)");
		css(this.slider_back,"background-image", "-o-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)");
		css(this.slider_back,"background-image", "-moz-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)");
		css(this.slider_back,"background-image", "-webkit-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)");
		css(this.slider_back,"background-image", "-ms-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)");
		css(this.slider_back,"-moz-border-radius", "6px");
		css(this.slider_back,"-o-border-radius", "6px");
		css(this.slider_back,"-webkit-border-radius", "6px");
		css(this.slider_back,"border-radius", "6px");
		css(this.slider_back,"border", "1px solid #A7A7A7");
		css(this.slider_front,"position", "absolute");
		css(this.slider_front,"background-image", "linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)");
		css(this.slider_front,"background-image", "-o-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)");
		css(this.slider_front,"background-image", "-moz-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)");
		css(this.slider_front,"background-image", "-webkit-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)");
		css(this.slider_front,"background-image", "-ms-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)");
		css(this.slider_front,"-moz-border-radius", "6px");
		css(this.slider_front,"-o-border-radius", "6px");
		css(this.slider_front,"-webkit-border-radius", "6px");
		css(this.slider_front,"border-radius", "6px");
		css(this.slider_front,"border", "1px solid #789BBF");
		css(this.indicator,"position", "absolute");
		css(this.indicator,"background-image", "linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)");
		css(this.indicator,"background-image", "-o-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)");
		css(this.indicator,"background-image", "-moz-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)");
		css(this.indicator,"background-image", "-webkit-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)");
		css(this.indicator,"background-image", "-ms-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)");
		css(this.indicator,"-moz-border-radius", (this.indicatorwidth / 2) + "px");
		css(this.indicator,"-o-border-radius", (this.indicatorwidth / 2) + "px");
		css(this.indicator,"-webkit-border-radius", (this.indicatorwidth / 2) + "px");
		css(this.indicator,"border-radius", (this.indicatorwidth / 2) + "px");
		css(this.indicator,"border", "1px solid #BEBEBE");
	}
	private refreshValue() {
		this.value_wrapper.innerHTML = (this.tabvalues) ? this.tablabels[Math.round(this.value)] : this.getValue();
	};
	private setBounds(l, t, w, h) {
		css(this.wrapper,"left", l + "px");
		css(this.wrapper,"top", t + "px");
		css(this.wrapper,"width", w + "px");
		css(this.wrapper,"height", h + "px");
		css(this.value_wrapper,"left", (w - this.valuewidth) + "px");
		css(this.value_wrapper,"top", "0px");
		css(this.value_wrapper,"width", this.valuewidth + "px");
		css(this.value_wrapper,"height", h + "px");
		css(this.slider_wrapper,"left", "0px");
		css(this.slider_wrapper,"top", "0px");
		this.sw_width = (w - this.valuewidth);
		css(this.slider_wrapper,"width", this.sw_width + "px");
		css(this.slider_wrapper,"height", h + "px");
		css(this.slider_back,"top", ((h - this.sliderheight) / 2) + "px");
		css(this.slider_back,"width", "100%");
		css(this.slider_back,"height", this.sliderheight + "px");
		css(this.indicator,"top", ((h - this.indicatorwidth) / 2) + "px");
		css(this.indicator,"width", this.indicatorwidth + "px");
		css(this.indicator,"height", this.indicatorwidth + "px");
		//console.log(this.value* (w - this.valuewidth) / (this.max - this.min));
		css(this.indicator,"left", ((this.value - this.min) * (w - this.valuewidth) / (this.max - this.min) - this.indicatorwidth / 2) + "px");
		css(this.slider_front,"top", ((h - this.sliderheight) / 2) + "px");
		css(this.slider_front,"width", ((this.value - this.min) * (w - this.valuewidth) / (this.max - this.min)) + "px");
		css(this.slider_front,"height", this.sliderheight + "px");
		css(this.slider_front,"left", "0px");
		this.refreshValue();
	}
	private getOffset(obj) {
		var obj2 = obj;
		var curtop = 0;
		var curleft = 0;
		if (document.getElementById || document.all) {
			do {
				curleft += obj.offsetLeft - obj.scrollLeft;
				curtop += obj.offsetTop - obj.scrollTop;
				obj = obj.offsetParent;
				obj2 = obj2.parentNode;
				while (obj2 !== obj) {
					curleft -= obj2.scrollLeft;
					curtop -= obj2.scrollTop;
					obj2 = obj2.parentNode;
				}
			} while (obj.offsetParent)
		} else if ((<any>document).layers) {
			curtop += obj.y;
			curleft += obj.x;
		}
		//alert("left="+curleft+" top="+curtop);
		return {
			"left": curleft,
			"top": curtop
		};
	};
	private mouseX(ev) {
		return (ev.pageX - this.getOffset(this.slider_wrapper).left);
	};
	private mousedown(ev) {
		ev.preventDefault();
		this.mousepressed = true;
		this.mousemove(ev);
	};
	private touchdown(tch) {
		tch.preventDefault();
		if (tch.touches.length === 1) {
			var touch = tch.touches[0] || tch.changedTouches[0];
			this.mousedown($U.PadToMouseEvent(touch));
		}
	};
	private mousemove(ev) {
		ev.preventDefault();
		if (this.mousepressed) {
			ev = ev || window.event;
			var mouse = this.mouseX(ev);
			var oldval = this.value;
			if (mouse < 0)
				mouse = 0;
			else if (mouse > this.sw_width)
				mouse = this.sw_width;
			this.value = this.min + (mouse * (this.max - this.min) / this.sw_width);
			if (this.discrete) {
				this.value = Math.round(this.value);
				mouse = this.sw_width * (this.value - this.min) / (this.max - this.min);
			}
			css(this.indicator,"left", (mouse - this.indicatorwidth / 2) + "px");
			css(this.slider_front,"width", mouse + "px");
			this.refreshValue();
			if ((this.callback) && (oldval !== this.value)) {
				var val = (this.tabvalues) ? this.tabvalues[Math.round(this.value)] : me.getValue();
				this.callback(val);
			}
		}
	};
	private touchmove(tch) {
		tch.preventDefault();
		if (tch.touches.length === 1) {
			var touch = tch.touches[0] || tch.changedTouches[0];
			this.mousemove($U.PadToMouseEvent(touch));
		}
	};
	private mouseup(ev) {
		ev.preventDefault();
		this.mousepressed = false;
	};
	private touchup(tch) {
		tch.preventDefault();
		if (tch.touches.length === 1) {
			var touch = tch.touches[0] || tch.changedTouches[0];
			this.mouseup($U.PadToMouseEvent(touch));
		}
	};
}
