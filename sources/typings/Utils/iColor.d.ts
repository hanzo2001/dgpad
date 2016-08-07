
interface iColor {
	getHEX(): string;
	getRGB(): string;
	getRGBA(): string;
	getR(): number;
	getG(): number;
	getB(): number;
	getOpacity(): number;
	setOpacity(alpha:number);
	setRGBA(r:number, g:number, b:number, a:number);
	set(color:string);
}
