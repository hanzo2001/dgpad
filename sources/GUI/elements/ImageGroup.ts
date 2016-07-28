type SideEffect = () => void;
type iStyleHash = {[name:string]: string}
type ImageBg = {on:string, off:string};
type WrapperOptions = {
	imgnum:number,
	imgsize:number,
	height:number,
	hspace:number,
	margin:number,
	bg:string
};
type ImageWrapper = {
	on: boolean;
	num: number;
	div: HTMLElement;
	bg: ImageBg;
	toggle: SideEffect;
}

let noop = function () {};
let dataId = 'wrpsIndex';

export class ImageGroup {
	protected owner: HTMLElement;
	protected top: number;
	protected left: number;
	protected width: number;
	protected height: number;
	protected imgsize: number;
	protected margin: number;
	protected hspace: number;
	protected imgnum: number;
	protected bgimageOff: string;
	protected bgimageOn: string;
	protected selected: ImageWrapper;
	protected group: HTMLElement;
	protected wrappers: ImageWrapper[];
	protected callback: (num:number)=>void;
	constructor(owner:HTMLElement, left:number, top:number, width:number, height:number, bgOff:string, bgOn:string, callback?:(num:number)=>void) {
		this.owner  = owner;
		this.top    = top;
		this.left   = left;
		this.width  = width;
		this.height = height;
		this.imgsize= 32;
		this.margin = 5;
		this.hspace = 20;
		this.imgnum = 0;
		this.bgimageOff = bgOff;
		this.bgimageOn  = bgOn;
		this.callback = callback;
		this.selected = null;
		this.wrappers = [];
		this.group    = document.createElement("div");
		ImageGroup.setStyle(this.group,{
			position: 'absolute',
			top:    left+'px',
			left:   top+'px',
			width:  width+'px',
			height: height+'px',
			'background-color': 'rgba(0,0,0,0)'
		});
		this.owner.appendChild(this.group);
	}
	setImageSize(n: number) {
		this.imgsize = n;
	}
	setMargin(n: number) {
		this.margin = n;
	}
	setHspace(n: number) {
		this.hspace = n;
	}
	select(n: number) {
		let i=0, s=this.wrappers.length;
		let wrapper = this.wrappers[n] || null;
		if (wrapper) {
			if (this.selected) {this.selected.toggle();}
			wrapper.toggle();
			this.selected = wrapper;
		}
	}
	deselectAll() {
		if (this.selected) {this.selected.toggle();}
		this.selected = null;
	}
	addImage(src, noBackground) {
		let image = ImageGroup.createWrappedImage(src,this.imgsize);
		let div = ImageGroup.createDivWrapper({
			imgnum: this.imgnum++,
			imgsize:this.imgsize,
			height: this.height,
			hspace: this.hspace,
			margin: this.margin,
			bg: noBackground ? this.bgimageOff : null
		});
		let wrapper = ImageGroup.wrapperFactory(this.imgnum,div,{on:this.bgimageOn,off:this.bgimageOff});
		let index = this.wrappers.push(wrapper);
		div.dataset[dataId] = index+'';
		div.addEventListener('touchstart',this.mousedown,false);
		div.addEventListener('mousedown', this.mousedown,false);
		div.appendChild(image);
		this.group.appendChild(div);
	}
	private mousedown(event: Event) {
		let div = <HTMLElement>(<any>this);
		event.preventDefault();
		if (this.selected) {this.selected.toggle();}
		let wrapper = this.wrappers[div.dataset[dataId]];
		wrapper.toggle();
		this.selected = wrapper;
		if (this.callback) {this.callback(this.selected.num);}
	}
	private static createDivWrapper(o: WrapperOptions): HTMLElement {
		let div = document.createElement('div');
		ImageGroup.setStyle(div,{
			position: 'absolute',
			left: (o.margin+(o.hspace+o.imgsize)*o.imgnum)+'px',
			top: ((o.height-o.imgsize) / 2)+'px',
			width: o.imgsize+'px',
			height: o.imgsize+'px'
		});
		if (o.bg) {
			ImageGroup.setStyle(div,{
				'background-color' : 'rgba(0,0,0,0)',
				'background-size'  : '100%',
				'background-repeat': 'no-repeat',
				'background-image' : 'url("'+o.bg+'")',
			});
		}
		return div;
	}
	private static createWrappedImage(src: string, imgsize: number): HTMLImageElement {
		let image = new Image();
		image.src = src;
		ImageGroup.setStyle(image,{
			position: 'absolute',
			left: '0px',
			top:  '0px',
			width: imgsize+'px',
			height:imgsize+'px'
		});
		return image;
	}
	private static wrapperFactory(num:number, div:HTMLElement, bg:ImageBg): ImageWrapper {
		return <ImageWrapper>{
			bg,
			div,
			on: false,
			toggle : function () {
				if (this.bg) {
					let bg = this.on ? this.bg.off : this.bg.on;
					ImageGroup.setStyle(this.div,{'background-image':'url("'+bg+'")'});
					this.on = !this.on;
				}
			}
		};
	}
	private static setStyle(e: HTMLElement, o: iStyleHash) {
		for (let i in o) {e.style.setProperty(i,o[i]);}
	}
}
