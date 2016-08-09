
type OXObject = {};
type OYObject = {};

interface iCoordsSystem {
	paint: (ctx:CanvasRenderingContext2D) => void;
	getX0(): number;
	getY0(): number;
	// Pour la restriction 3D de l'angle theta :
	restrictTheta(t:number[]);
	// Pour la restriction 3D de l'angle phi :
	restrictPhi(t:number[]);
	getUnit(): number;
	zoom(_xz:number, _yz:number, _h:number);
	translate(_xt:number, _yt:number);
	translateANDzoom(_xt:number, _yt:number, _xz:number, _yz:number, _h:number);
	// Translate length in pixel to this coords system :
	l(_l:number): number;
	// Le contraire :
	lx(_l:number): number;
	// Translate area in square pixel to this coords system :
	a(_a:number): number;
	// Translate canvas coords to this coords system :
	x(_px:number): number;
	y(_py:number): number;
	xy(_t:any[]): any[];
	// Translate this coords system to canvas coords :
	px(_x:number): number;
	py(_y:number): number;
	setCoords(_x:number, _y:number, _u:number, _md3D:boolean);
	paintGrid(ctx:CanvasRenderingContext2D);
	paintOx(ctx:CanvasRenderingContext2D);
	paintOy(ctx:CanvasRenderingContext2D);
	paintAll(ctx:CanvasRenderingContext2D);
	setOX(_ox:OXObject);
	setOY(_oy:OYObject);
	showCS(_v:boolean);
	isCS(): boolean;
	showGrid(_v:boolean);
	isGrid(): boolean;
	showOx(_v:boolean);
	isOx(): boolean;
	showOy(_v:boolean);
	isOy(): boolean;
	setColor(_c:string);
	getColor(): string;
	getFontSize(): number;
	setFontSize(_s:number);
	getAxisWidth(): number;
	setAxisWidth(_s:number);
	getGridWidth(): number;
	setGridWidth(_s:number);
	setlockOx(_l:boolean);
	islockOx(): boolean;
	setlockOy(_l:boolean);
	islockOy(): boolean;
	setCenterZoom(_b:boolean);
	isCenterZoom(): boolean;
	getSource(): string;
	getStyle(): string;
}
