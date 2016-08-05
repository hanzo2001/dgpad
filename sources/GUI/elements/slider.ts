/// <reference path="../../typings/GUI/islider.d.ts" />

var $U = (<any>window).$U;
var $L = (<any>window).$L;

var css = (e:HTMLElement, p:string, v:string) => e.style.setProperty(p,v);

export class slider implements islider {
	protected owner;
	protected tabvalues: number[];
	protected tablabels: number[];
	protected labelwidth: number;
	protected label: string;
	protected valuewidth: number;
	protected fontsize: number;
	protected valueprecision: number;
	protected sliderheight: number;
	protected indicatorwidth: number;
	protected top: number;
	protected left: number;
	protected width: number;
	protected height: number;
	protected min: number;
	protected max: number;
	protected value: number;
	protected callback: (n:number) => void;
	protected sw_width: number;
	protected discrete: boolean;
	protected mousepressed: boolean;
	protected wrapper: HTMLElement;
	protected label_wrapper: HTMLElement;
	protected slider_wrapper: HTMLElement;
	protected value_wrapper: HTMLElement;
	protected indicator: HTMLElement;
	protected slider_back: HTMLElement;
	protected slider_front: HTMLElement;
	protected windowMouseEvents: {[type:string]:(e:MouseEvent)=>void};
	constructor(owner, left:number, top:number, width:number, height:number, min:number, max:number, value:number, callback:(n:number)=>void) {
		this.tabvalues = null;
		this.tablabels = null;
		this.labelwidth = 0;
		this.label = '';
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
		this.mousepressed = false;
		this.owner = owner;
		var createDiv = () => document.createElement('div');
		this.wrapper = createDiv();
		this.label_wrapper = createDiv();
		this.slider_wrapper = createDiv();
		this.value_wrapper = createDiv();
		this.indicator = createDiv();
		this.slider_back = createDiv();
		this.slider_front = createDiv();
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
	setHeights(sliderheight:number, indicatorwidth:number) {
		this.sliderheight = sliderheight;
		this.indicatorwidth = indicatorwidth;
		this.init();
		this.setBounds(this.left, this.top, this.width, this.height);
	};
	setDiscrete(discrete:boolean) {
		this.discrete = discrete;
	};
	setLabel(label:string, width:number) {
		this.label = label;
		this.labelwidth = width;
		css(this.label_wrapper,'left', '0px');
		css(this.label_wrapper,'top', '0px');
		css(this.label_wrapper,'width', width + 'px');
		css(this.label_wrapper,'height', this.height + 'px');
		css(this.slider_wrapper,'left', width + 'px');
		this.sw_width = (this.width - this.valuewidth - width);
		css(this.slider_wrapper,'width', this.sw_width + 'px');
		css(this.indicator,'left', ((this.value - this.min) * (this.width - this.valuewidth - width) / (this.max - this.min) - this.indicatorwidth / 2) + 'px');
		css(this.slider_front,'width', ((this.value - this.min) * (this.width - this.valuewidth - width) / (this.max - this.min)) + 'px');
		this.label_wrapper.innerHTML = label;
	};
	setValueWidth(v) {
		this.valuewidth = v;
		this.setBounds(this.left, this.top, this.width, this.height);
		this.setLabel(this.label, this.labelwidth);
	};
	setTextColor(color:string) {
		css(this.label_wrapper,'color', color);
		css(this.value_wrapper,'color', color);
	};
	setFontSize(size:number) {
		this.fontsize = size;
		css(this.label_wrapper,'font-size', size + 'px');
		css(this.value_wrapper,'font-size', size + 'px');
	};
	setValuePrecision(precision:number) {
		this.valueprecision = Math.round(1 / precision);
		this.refreshValue();
	};
	setMin(min:number) {
		this.min = min;
		this.refreshValue();
	};
	setMax(max:number) {
		this.max = max;
		this.refreshValue();
	};
	setBackgroundColor(col) {
		css(this.wrapper,'background-color', col);
	};
	getValue(): number {
		return this.tabvalues
			? this.tabvalues[Math.round(this.value)]
			: Math.round(this.value * this.valueprecision) / this.valueprecision;
	};
	getDocObject(): HTMLElement {
		return this.wrapper;
	}
	setValue(value:number) {
		var v = (this.tabvalues) ? this.tabvalues.indexOf(value) : value;
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
	getTabValues(): number[] {
		return this.tabvalues;
	};
	setWindowsEvents() {
		this.slider_wrapper.removeEventListener('touchstart', (e)=>this.touchdown(<TouchEvent>e), false);
		this.slider_wrapper.removeEventListener('touchmove', (e)=>this.touchmove(<TouchEvent>e), false);
		this.slider_wrapper.removeEventListener('mousemove', (e)=>this.mousemove(<MouseEvent>e), false);
		this.owner.removeEventListener('mouseup', (e)=>this.mouseup(e), false);
		this.owner.addEventListener('touchstart', (e)=>this.touchdown(e), false);
		this.owner.addEventListener('touchmove', (e)=>this.touchmove(e), false);
		this.windowMouseEvents = {
			'mousemove': (e) => this.mousemove(e),
			'mouseup':   (e) => this.mouseup(e),
		};
		for (let i in this.windowMouseEvents) {
			window.addEventListener(i,this.windowMouseEvents[i],false);
		}
	};
	removeWindowsEvents() {
		if (this.windowMouseEvents) {
			for (let i in this.windowMouseEvents) {
				window.removeEventListener(i,this.windowMouseEvents[i],false);
			}
			this.windowMouseEvents = null;
		}
	};
	private init() {
		css(this.wrapper,'background-color', 'rgba(0,0,0,1)');
		css(this.wrapper,'position', 'absolute');
		css(this.value_wrapper,'background-color', 'rgba(0,0,0,0)');
		css(this.value_wrapper,'position', 'absolute');
		css(this.value_wrapper,'font-family', 'Helvetica, Arial, sans-serif');
		css(this.value_wrapper,'font-size', this.fontsize + 'px');
		css(this.value_wrapper,'text-align', 'center');
		css(this.value_wrapper,'line-height', this.height + 'px');
		css(this.value_wrapper,'overflow', 'hidden');
		css(this.slider_wrapper,'background-color', 'rgba(0,0,0,0)');
		css(this.slider_wrapper,'position', 'absolute');
		css(this.slider_wrapper,'overflow', 'visible');
		css(this.label_wrapper,'background-color', 'rgba(0,255,0,0)');
		css(this.label_wrapper,'position', 'absolute');
		css(this.label_wrapper,'font-family', 'Helvetica, Arial, sans-serif');
		css(this.label_wrapper,'font-size', this.fontsize + 'px');
		css(this.label_wrapper,'text-align', 'center');
		css(this.label_wrapper,'line-height', this.height + 'px');
		css(this.slider_back,'position', 'absolute');
		css(this.slider_back,'background-image', 'linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)');
		css(this.slider_back,'background-image', '-o-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)');
		css(this.slider_back,'background-image', '-moz-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)');
		css(this.slider_back,'background-image', '-webkit-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)');
		css(this.slider_back,'background-image', '-ms-linear-gradient(top, #A7A7A7 25%, #D0D0D0 50%,#E8E8E8 50%, #FFFFFF 100%)');
		css(this.slider_back,'-moz-border-radius', '6px');
		css(this.slider_back,'-o-border-radius', '6px');
		css(this.slider_back,'-webkit-border-radius', '6px');
		css(this.slider_back,'border-radius', '6px');
		css(this.slider_back,'border', '1px solid #A7A7A7');
		css(this.slider_front,'position', 'absolute');
		css(this.slider_front,'background-image', 'linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)');
		css(this.slider_front,'background-image', '-o-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)');
		css(this.slider_front,'background-image', '-moz-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)');
		css(this.slider_front,'background-image', '-webkit-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)');
		css(this.slider_front,'background-image', '-ms-linear-gradient(top, #92B2E3 25%, #7EA4DD 50%,#497CD3 50%, #1F5CB2 100%)');
		css(this.slider_front,'-moz-border-radius', '6px');
		css(this.slider_front,'-o-border-radius', '6px');
		css(this.slider_front,'-webkit-border-radius', '6px');
		css(this.slider_front,'border-radius', '6px');
		css(this.slider_front,'border', '1px solid #789BBF');
		css(this.indicator,'position', 'absolute');
		css(this.indicator,'background-image', 'linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)');
		css(this.indicator,'background-image', '-o-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)');
		css(this.indicator,'background-image', '-moz-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)');
		css(this.indicator,'background-image', '-webkit-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)');
		css(this.indicator,'background-image', '-ms-linear-gradient(top, #C8C8C8 25%, #F1F1F1 100%)');
		css(this.indicator,'-moz-border-radius', (this.indicatorwidth / 2) + 'px');
		css(this.indicator,'-o-border-radius', (this.indicatorwidth / 2) + 'px');
		css(this.indicator,'-webkit-border-radius', (this.indicatorwidth / 2) + 'px');
		css(this.indicator,'border-radius', (this.indicatorwidth / 2) + 'px');
		css(this.indicator,'border', '1px solid #BEBEBE');
	}
	private refreshValue() {
		this.value_wrapper.innerHTML = (this.tabvalues ? this.tablabels[Math.round(this.value)] : this.getValue())+'';
	};
	private setBounds(l:number, t:number, w:number, h:number) {
		css(this.wrapper,'left', l + 'px');
		css(this.wrapper,'top', t + 'px');
		css(this.wrapper,'width', w + 'px');
		css(this.wrapper,'height', h + 'px');
		css(this.value_wrapper,'left', (w - this.valuewidth) + 'px');
		css(this.value_wrapper,'top', '0px');
		css(this.value_wrapper,'width', this.valuewidth + 'px');
		css(this.value_wrapper,'height', h + 'px');
		css(this.slider_wrapper,'left', '0px');
		css(this.slider_wrapper,'top', '0px');
		this.sw_width = (w - this.valuewidth);
		css(this.slider_wrapper,'width', this.sw_width + 'px');
		css(this.slider_wrapper,'height', h + 'px');
		css(this.slider_back,'top', ((h - this.sliderheight) / 2) + 'px');
		css(this.slider_back,'width', '100%');
		css(this.slider_back,'height', this.sliderheight + 'px');
		css(this.indicator,'top', ((h - this.indicatorwidth) / 2) + 'px');
		css(this.indicator,'width', this.indicatorwidth + 'px');
		css(this.indicator,'height', this.indicatorwidth + 'px');
		//console.log(this.value* (w - this.valuewidth) / (this.max - this.min));
		css(this.indicator,'left', ((this.value - this.min) * (w - this.valuewidth) / (this.max - this.min) - this.indicatorwidth / 2) + 'px');
		css(this.slider_front,'top', ((h - this.sliderheight) / 2) + 'px');
		css(this.slider_front,'width', ((this.value - this.min) * (w - this.valuewidth) / (this.max - this.min)) + 'px');
		css(this.slider_front,'height', this.sliderheight + 'px');
		css(this.slider_front,'left', '0px');
		this.refreshValue();
	}
	private getOffset(obj:HTMLElement): {left:number,top:number} {
		var obj2 = obj;
		var curtop = 0;
		var curleft = 0;
		if (document.getElementById || document.all) {
			do {
				curleft += obj.offsetLeft - obj.scrollLeft;
				curtop += obj.offsetTop - obj.scrollTop;
				obj = <HTMLElement>obj.offsetParent;
				obj2 = <HTMLElement>obj2.parentNode;
				while (obj2 !== obj) {
					curleft -= obj2.scrollLeft;
					curtop -= obj2.scrollTop;
					obj2 = <HTMLElement>obj2.parentNode;
				}
			} while (obj.offsetParent)
		} else if ((<any>document).layers) {
			curtop += obj.y;
			curleft += obj.x;
		}
		//alert('left='+curleft+' top='+curtop);
		return {
			'left': curleft,
			'top': curtop
		};
	};
	private mouseX(event:MouseEvent) {
		return (event.pageX - this.getOffset(this.slider_wrapper).left);
	};
	private mousedown(event:MouseEvent) {
		event.preventDefault();
		this.mousepressed = true;
		this.mousemove(event);
	};
	private touchdown(tch:TouchEvent) {
		tch.preventDefault();
		if (tch.touches.length === 1) {
			var touch = tch.touches[0] || tch.changedTouches[0];
			this.mousedown($U.PadToMouseEvent(touch));
		}
	};
	private mousemove(event:MouseEvent) {
		event.preventDefault();
		if (this.mousepressed) {
			//event = event || window.event;// outdated???
			var mouse = this.mouseX(event);
			var oldval = this.value;
			if (mouse < 0) {
				mouse = 0;
			} else if (mouse > this.sw_width) {
				mouse = this.sw_width;
			}
			this.value = this.min + (mouse * (this.max - this.min) / this.sw_width);
			if (this.discrete) {
				this.value = Math.round(this.value);
				mouse = this.sw_width * (this.value - this.min) / (this.max - this.min);
			}
			css(this.indicator,'left', (mouse - this.indicatorwidth / 2) + 'px');
			css(this.slider_front,'width', mouse + 'px');
			this.refreshValue();
			if ((this.callback) && (oldval !== this.value)) {
				var val = this.tabvalues ? this.tabvalues[Math.round(this.value)] : this.getValue();
				this.callback(val);
			}
		}
	};
	private touchmove(tch:TouchEvent) {
		tch.preventDefault();
		if (tch.touches.length === 1) {
			var touch = tch.touches[0] || tch.changedTouches[0];
			this.mousemove($U.PadToMouseEvent(touch));
		}
	};
	private mouseup(event:MouseEvent) {
		event.preventDefault();
		this.mousepressed = false;
	};
	private touchup(tch:TouchEvent) {
		tch.preventDefault();
		if (tch.touches.length === 1) {
			var touch = tch.touches[0] || tch.changedTouches[0];
			this.mouseup($U.PadToMouseEvent(touch));
		}
	};
}
