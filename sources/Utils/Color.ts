import {ColorStringParser as Parser} from "./Utils/ColorStringParser";

export class Color {
	protected r: number = 0;
	protected g: number = 0;
	protected b: number = 0;
	protected a: number = 0;
	protected hex: string = '';
	protected rgb: string = '';
	protected rgba:string = '';
	getHEX() {
		return this.hex;
	}
	getRGB() {
		return this.rgb;
	}
	getRGBA() {
		return this.rgba;
	}
	getR() {
		return this.r;
	}
	getG() {
		return this.g;
	}
	getB() {
		return this.b;
	}
	getOpacity() {
		return this.a;
	}
	setOpacity(alpha:number) {
		this.setRGBA(this.r,this.g,this.b,alpha);
	}
	setRGBA(r:number, g:number, b:number, a:number) {
		let rgba = "rgba("+[r,g,b,a].join(',')+")";
		let cache = Parser.rgba(rgba);
		if (!cache) {throw Error(rgba+' is not supported...');}
		this.setCache(cache);
	}
	set(color:string) {
		var cache: number[] = null;
		color = color.replace(/\s+/g,'');
		cache = Parser.hex3(color);
		if (!cache) {cache = Parser.hex6(color);}
		if (!cache) {cache = Parser.rgba(color);}
		if (!cache) {cache = Parser.rgb(color);}
		if (!cache) {throw Error(color+' is not supported...');}
		this.setCache(cache);
	}
	protected setCache(cache: number[]) {
		// Performs RGB->RGBA conversion by default
		!cache[3] && (cache[3] = 1);
		[this.r,this.g,this.b,this.a] = cache;
		this.hex = '#'+((this.r << 16) | (this.g << 8) | (this.b)).toString(16);
		this.rgb = 'rgba('+[this.r,this.g,this.b].join(',')+')';
		this.rgba = 'rgba('+[this.r,this.g,this.b,this.a].join(',')+')';
	}
}
