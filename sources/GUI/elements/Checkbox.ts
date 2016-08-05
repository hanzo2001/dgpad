
type Bounds = {
	top:string,
	left:string,
	width:string,
	height:string,
};

function css(e:HTMLElement, p:string, v:string) {
	e.style.setProperty(p,v);
}

let dataId = 'chkBoxId';

export class Checkbox {
	protected value: boolean;
	protected boxwidth: number;
	protected box: HTMLElement;
	protected tick: HTMLElement;
	protected label: HTMLElement;
	protected wrapper: HTMLElement;
	protected checkbox: HTMLElement;
	protected callback: (toggle:boolean) => void;
	private static checkboxes: Checkbox[] = [];
	constructor(owner:HTMLElement, left:number, top:number, width:number, height:number, value:boolean, label:string, callback:(toggle:boolean)=>void) {
		this.boxwidth = 16;
		this.value = value;
		this.callback = callback;
		this.box     = Checkbox.boxFactory();
		this.tick    = Checkbox.tickFactory();
		this.label   = Checkbox.labelFactory(height);
		this.wrapper = Checkbox.wrapperFactory();
		this.checkbox= Checkbox.checkboxFactory();
		Checkbox.setBounds(this.wrapper,<Bounds>{
			top:    top+'px',
			left:   left+'px',
			width:  width+'px',
			height: height+'px',
		});
		Checkbox.setBounds(this.box,<Bounds>{
			top:    0+'px',
			left:   0+'px',
			width:  width+'px',
			height: height+'px',
		});
		Checkbox.setBounds(this.label,<Bounds>{
			top:    0+'px',
			left:   height+'px',
			width:  (width - height)+'px',
			height: height+'px',
		});
		Checkbox.setBounds(this.checkbox,<Bounds>{
			top:    ((height - this.boxwidth) / 2)+'px',
			left:   ((height - this.boxwidth) / 2)+'px',
			width:  this.boxwidth+'px',
			height: this.boxwidth+'px',
		});
		Checkbox.setBounds(this.tick,<Bounds>{
			top:      0+'',
			left:   0.4+'rem',
			width:  1.4+'rem',
			height: 0.6+'rem',
		});
		this.setText(label);
		this.setValue(this.value);
		let index = Checkbox.checkboxes.push(this) - 1;
		this.wrapper.dataset[dataId] = index+'';
		this.wrapper.addEventListener('touchstart', this.mousedown, false);
		this.wrapper.addEventListener('mousedown', this.mousedown, false);
		this.checkbox.appendChild(this.tick);
		this.box.appendChild(this.checkbox);
		this.wrapper.appendChild(this.box);
		this.wrapper.appendChild(this.label);
		owner.appendChild(this.wrapper);
	}
	setTextColor(color:string) {
		css(this.label,'color',color);
	}
	setTextFontSize(px:number) {
		css(this.label,'font-size',px+'px');
	}
	setText(text:string) {
		this.label.innerHTML = text;
	}
	getValue() {
		return this.value;
	}
	setValue(toggle:boolean) {
		this.value = toggle;
		if (toggle) {
			css(this.tick,'-webkit-transform', 'rotateZ(-40deg) skewX(-30deg) scale(1)');
			css(this.tick,'-moz-transform', 'rotate(-40deg) skewX(-30deg) scale(1)');
			css(this.tick,'-o-transform', 'rotate(-40deg) skewX(-30deg) scale(1)');
			css(this.tick,'transform', 'rotate(-40deg) skewX(-30deg) scale(1)');
		} else {
			css(this.tick,'-webkit-transform', 'rotateZ(-40deg) skewX(-30deg) scale(0)');
			css(this.tick,'-moz-transform', 'rotate(-40deg) skewX(-30deg) scale(0)');
			css(this.tick,'-o-transform', 'rotate(-40deg) skewX(-30deg) scale(0)');
			css(this.tick,'transform', 'rotate(-40deg) skewX(-30deg) scale(0)');
		}
	}

	private mousedown(event: Event) {
		event.preventDefault();
		let div = <HTMLElement>(<any>this);
		let cb = Checkbox.checkboxes[div.dataset[dataId]];
		cb.setValue(!cb.value);
		if (cb.callback) {cb.callback(cb.value);}
	}
	private static wrapperFactory() {
		let div = document.createElement('div');
		css(div,'background-color', 'rgba(0,0,0,0)');
		return div;
	}
	private static boxFactory() {
		let div = document.createElement('div');
		css(div,'background-color', 'rgba(255,0,0,0)');
		css(div,'overflow', 'visible');
		return div;
	}
	private static labelFactory(height:number) {
		let div = document.createElement('div');
		css(div,'background-color', 'rgba(0,255,0,0)');
		css(div,'font-family', 'Helvetica, Arial, sans-serif');
		css(div,'font-size', '13px');
		css(div,'text-align', 'left');
		css(div,'line-height', height + 'px');
		css(div,'white-space', 'nowrap');
		css(div,'overflow', 'hidden');
		return div;
	}
	private static checkboxFactory() {
		let div = document.createElement('div');
		css(div,'background-color', 'rgba(255,255,255,1)');
		css(div,'background', '-webkit-linear-gradient(top, rgba(255,255,255,.6), rgba(255,255,255,.9))');
		css(div,'background', '-moz-linear-gradient(top, rgba(255,255,255,.6), rgba(255,255,255,.9))');
		css(div,'background', '-o-linear-gradient(top, rgba(255,255,255,.6), rgba(255,255,255,.9))');
		css(div,'background', '-ms-linear-gradient(top, rgba(255,255,255,.6), rgba(255,255,255,.9))');
		css(div,'-webkit-box-shadow', 'inset .1rem .1rem .2rem rgba(0,0,0,.3), inset 0 0 0 .1rem rgba(0,0,0,.1)');
		css(div,'-moz-box-shadow', 'inset .1rem .1rem .2rem rgba(0,0,0,.3), inset 0 0 0 .1rem rgba(0,0,0,.1)');
		css(div,'-o-box-shadow', 'inset 1px 1px 2px rgba(0,0,0,.3), inset 0 0 0 1px rgba(0,0,0,.1)');
		css(div,'-o-box-shadow', 'inset .1rem .1rem .2rem rgba(0,0,0,.3), inset 0 0 0 .1rem rgba(0,0,0,.1)');
		css(div,'box-shadow', 'inset 1px 1px 2px rgba(0,0,0,.2), inset 0 0 0 1px rgba(0,0,0,.1)');
		css(div,'box-shadow', 'inset .1rem .1rem .2rem rgba(0,0,0,.3), inset 0 0 0 .1rem rgba(0,0,0,.1)');
		css(div,'-webkit-border-radius', '.3rem');
		css(div,'-moz-border-radius', '.3rem');
		css(div,'-o-border-radius', '3px');
		css(div,'-o-border-radius', '.3rem');
		css(div,'border-radius', '3px');
		css(div,'border-radius', '.3rem');
		return div;
	}
	private static tickFactory() {
		let div = document.createElement('div');
		css(div,'border-style', 'solid');
		css(div,'border-color', '#01C30C');
		css(div,'border-width', '0 0 .2rem .3rem');
		css(div,'-webkit-box-shadow', '-.1rem .1rem .1rem 0 rgba(0,0,0,.4)');
		css(div,'-moz-box-shadow', '-.1rem .1rem .1rem 0 rgba(0,0,0,.4)');
		css(div,'-o-box-shadow', '-1px 1px 1px 0 rgba(0,0,0,.4)');
		css(div,'-o-box-shadow', '-.1rem .1rem .1rem 0 rgba(0,0,0,.4)');
		css(div,'box-shadow', '-1px 1px 1px 0 rgba(0,0,0,.4)');
		css(div,'box-shadow', '-.1rem .1rem .1rem 0 rgba(0,0,0,.4)');
		css(div,'-webkit-transform', 'rotateZ(-40deg) skewX(-30deg) scale(1)');
		css(div,'-moz-transform', 'rotate(-40deg) skewX(-30deg) scale(1)');
		css(div,'-o-transform', 'rotate(-40deg) skewX(-30deg) scale(1)');
		css(div,'transform', 'rotate(-40deg) skewX(-30deg) scale(1)');
		css(div,'-webkit-transform-origin', '0 100%');
		css(div,'-moz-transform-origin', '0 100%');
		css(div,'-o-transform-origin', '0 100%');
		css(div,'transform-origin', '0 100%');
		return div;
	}
	private static setBounds(div:HTMLElement, o:Bounds) {
		css(div,'position','absolute');
		css(div,'top',   o.top);
		css(div,'left',  o.left);
		css(div,'width', o.width);
		css(div,'height',o.height);
	}
}
