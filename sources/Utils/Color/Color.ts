/// <reference path="./iColor.d.ts" />

import {ColorStringParser as Parser} from "./ColorStringParser";

export class Color implements iColor {
	protected r: number = 0;
	protected g: number = 0;
	protected b: number = 0;
	protected a: number = 0;
	protected hex: string = '';
	protected rgb: string = '';
	protected rgba:string = '';
	constructor() {
		this.setRGBA(0, 0, 0, 1);
	}
	get red(): number {
		return this.r;
	}
	get green(): number {
		return this.g;
	}
	get blue(): number {
		return this.b;
	}
	get alpha(): number {
		return this.a;
	}
	getHEX(): string {
		return this.hex;
	}
	getRGB(): string {
		return this.rgb;
	}
	getRGBA(): string {
		return this.rgba;
	}
	getR(): number {
		return this.r;
	}
	getG(): number {
		return this.g;
	}
	getB(): number {
		return this.b;
	}
	getOpacity(): number {
		return this.a;
	}
	setOpacity(alpha:number) {
		return this.setRGBA(this.r, this.g, this.b, alpha);
	}
	setRGBA(r:number, g:number, b:number, a:number): Color {
		let rgba = [r, g, b, a].join(',');
		rgba = `rgba(${rgba})`;
		let cache = Parser.rgba(rgba);
		if (!cache) {throw Error(`'${rgba}' is not supported...`);}
		return this.setCache(cache);
	}
	setRGB(r:number, g:number, b:number): Color {
		return this.setRGBA(r, g, b, 1);
	}
	setHEX(r:number, g:number, b:number): Color {
		if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {throw `color data ${r}, ${g}, ${b} is out of bounds (0-255)`;}
		return this.setCache([~~r, ~~g, ~~b, 1]);
	}
	set(color:string): Color {
		var cache: number[] = null;
		color = color.replace(/\s+/g,'');
		cache = Parser.hex3(color);
		if (!cache) {cache = Parser.hex6(color);}
		if (!cache) {cache = Parser.rgba(color);}
		if (!cache) {cache = Parser.rgb(color);}
		if (!cache) {throw Error(`'${color}' is not supported...`);}
		return this.setCache(cache);
	}
	protected setCache(cache:number[]): Color {
		// Performs RGB->RGBA conversion by default
		var r, g, b, a;
		cache[3] === undefined && (cache[3] = 1);
		[this.r,this.g,this.b,this.a] = cache;
		[r,g,b,a] = cache;
		this.hex = '#'+((r << 16)|(g << 8)|(b)).toString(16);
		this.rgb = 'rgba('+[r,g,b].join(',')+')';
		this.rgba = 'rgba('+[r,g,b,a].join(',')+')';
		return this;
	}
}
