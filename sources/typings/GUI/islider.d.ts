
interface islider {
	setHeights(sliderheight:number, indicatorwidth:number);
	setDiscrete(discrete:boolean);
	setLabel(label:string, width:number);
	setValueWidth(v);
	setTextColor(color:string);
	setFontSize(size:number);
	setValuePrecision(precision:number);
	setMin(min:number);
	setMax(max:number);
	setBackgroundColor(col);
	getValue(): number
	getDocObject(): HTMLElement
	setValue(value:number);
	setTabValues(t);
	getTabValues(): number[]
	setWindowsEvents();
	removeWindowsEvents();
}
