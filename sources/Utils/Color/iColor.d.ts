
interface ColorStringParser {
	hex3(s:string): number[];
	hex6(s:string): number[];
	rgba(s:string): number[];
	rgb(s:string): number[];
}

interface iColor {
	red: number;
	green: number;
	blue: number;
	alpha: number;
	getR(): number;
	getG(): number;
	getB(): number;
	getOpacity(): number;
	getHEX(): string;
	getRGB(): string;
	getRGBA(): string;
	setRGBA(r:number, g:number, b:number, a:number): iColor;
	setRGB(r:number, g:number, b:number): iColor;
	setHEX(r:number, g:number, b:number): iColor;
	setOpacity(alpha:number);
	set(color:string): iColor;
}
