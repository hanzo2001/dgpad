
interface ColorPicker {
	new(owner, left:number, top:number, width:number, height:number);
	setBounds(left:number, top:number, width:number, height:number);
	setHEXcallback(_proc);
	setRGB(_r, _g, _b);
	setHSV(_h, _s, _v);
	setHEX(_hex);
	getHEX(): string;
}
