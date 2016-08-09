/// <reference path="./GUI/iPanel.d.ts" />

interface iTextPanel extends iElementContainer {
	addTeXObject();
	edit(txt:iTextObject);
	addName(name:string);
}

interface iTextObject extends iPanel {
	parseExpressions();
	exec(index:number);
	print(txt:string);
	refreshInputs();
	noedit();
	setEditFocus();
	doedit();
	edit();
	compute();
	evaluateString();
	getColor(): string;
	setColor(color:string);
	getOpacity(): number;
	setOpacity(opacity:number);
	getBorderSize(): number;
	setBorderSize(size:number);
	getBorderRadius(): number;
	setBorderRadius(radius:number);
	setNumPrec(pow:number);
	getNumPrec(): number;
	addName(name:string);
	setStyles(styles:string);
	getStyles(): string;
	setText(txt:string);
	getRawText(): string;
	getText(): string;
	init();
}

interface iTextManager {
	compute();
	refreshInputs();
	evaluateStrings();
	executeScript(index:number, srcIndex:number);
	getPosition(txt:iTextObject);
	edit(txt:iTextObject);
	deleteTeX(txt:iTextObject);
	addName(name:string);
	addTeXElement(str:string, left, top, width, height, styles?:string);
	add(txt:iTextObject);
	addText(str:string, left, top, width, height, styles?:string);
	elements();
	getSource();
	clear();
	showPanel();
	hidePanel();
}
