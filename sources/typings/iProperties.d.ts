/// <reference path="../typings/GUI/iPanel.d.ts" />

interface iPropertiesPanel extends iPanel {
	getCS();
	setMagnifierMode(_val);
	getMagnifierMode();
	setDragOnlyMoveable(_val);
	isDragOnlyMoveable();
	setDegree(_val);
	getDegree();
	setDemoMode(_val);
	getDemoMode();
	getBackgroundColor();
	setBackgroundColor(val);
	showProperties(_obj);
	compute();
	repaint();
	getAnimationSpeed(_o);
	setAnimationSpeed(_o, _v);
	setAllSize(_type, size:number);
	setAllSegSize(_type, size:number);
	setAllColor(_type, size);
	setAllOpacity(_type, size:number);
	setAllLayer(_type, size:number);
	setAllPtShape(_shape);
	setAllFontSize(_type, size:number);
	setAllPrecision(_type, size:number);
	setAllIncrement(_type, size:number);
	setAllDash(_type, size:number);
	setAll360(_type, _360);
	setAllTrigo(_type, _t);
	setAllNoMouse(_type, size:number);
	setTrack(_o, _val);
	setAllTrack(_type, _val);
}
