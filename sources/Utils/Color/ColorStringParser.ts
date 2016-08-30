/// <reference path="./iColor.d.ts" />

let col = '(0|[12]?\d{1,2})';
let alpha = '([01]|0\.\d+)';
let hex = '([\da-f])';
let Hex = '([\da-f]{2})';
let re_hex = new RegExp(`^#${hex+hex+hex}$`,'i');
let re_Hex = new RegExp(`^#${Hex+Hex+Hex}$`,'i');
let re_rgb = new RegExp(`^rgb\(${[col, col, col].join(',')}\)$`,'i');
let re_rgba= new RegExp(`^rgba\(${[col, col, col, alpha].join(',')}\)$`,'i');

let strTo8bit = function (s: string) {
	let n = parseInt(s);
	if (n > 255) {while (n>255) {n-=256;}}
	return n;
};

export var ColorStringParser:ColorStringParser = {
	hex3: function(s:string): number[] {
		let cache = re_hex.exec(s);
		return cache ? [
			parseInt(cache[1],16),
			parseInt(cache[2],16),
			parseInt(cache[3],16)
		] : null;
	},
	hex6: function(s:string): number[] {
		let cache = re_Hex.exec(s);
		return cache ? [
			parseInt(cache[1],16) * 17,
			parseInt(cache[2],16) * 17,
			parseInt(cache[3],16) * 17
		] : null;
	},
	rgb: function(s:string): number[] {
		let strings = <string[]>re_rgb.exec(s);
		let cache: number[] = null;
		return strings ? strings.slice(0).map(strTo8bit) : null;
	},
	rgba: function(s:string): number[] {
		let strings = re_rgba.exec(s);
		if (!strings) {return null;}
		let alpha = parseFloat(strings.pop());
		let cache = <number[]>strings.map(strTo8bit);
		cache.push(alpha);
		return cache;
	}
}
