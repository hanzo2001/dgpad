
type OXObject = {};
type OYObject = {};

interface CoordsSystem {
	constructor(_C:any);
	/*protected*/ Cn: any;
	/*protected*/ P: any;// Preferences object $P
	/*protected*/ OX: OXObject;
	/*protected*/ OY: OYObject;
	/*protected*/ Unit: number; // x and y Axis units, in pixels
	/*protected*/ x0: number; // x origin coord, in canvas coord system
	/*protected*/ y0: number; // y origin coord, in canvas coord system
	/*protected*/ lockOx: boolean; // Dit si l'axe Ox doit être fixe (ne peut pas se déplacer verticalement) ou non
	/*protected*/ lockOy: boolean;
	/*protected*/ centerZoom: boolean;
	// Curieusement, sur webkit le lineTo du context n'accepte pas de paramètre x ou y 
	// supérieur à 2147483583. La valeur ci-dessous est la moitié de ce nombre :
	/*protected*/ maxInt: number;
	// Pour la restriction 3D :
	/*protected*/ theta: number[];
	/*protected*/ phi: number[];
	paint_Grid: (ctx:CanvasRenderingContext2D)=>void;
	paint_Ox: (ctx:CanvasRenderingContext2D)=>void;
	paint_Oy: (ctx:CanvasRenderingContext2D)=>void;
	paint: ()=>void;

	getX0(): number;
	getY0(): number;
	// Pour la restriction 3D de l'angle theta :
	restrictTheta(t:number);
	// Pour la restriction 3D de l'angle phi :
	restrictPhi(t:number);
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
	getFontSize(): string;
	setFontSize(_s:string);
	getAxisWidth(): string;
	setAxisWidth(_s:string);
	getGridWidth(): string;
	setGridWidth(_s:string);
	setlockOx(_l:boolean);
	islockOx(): boolean;
	setlockOy(_l:boolean);
	islockOy(): boolean;
	setCenterZoom(_b:boolean);
	isCenterZoom(): boolean;
	getSource(): string;
	getStyle(): string;
	/*protected*/ _restrict3D();
	/*protected*/ _paintOx(ctx:CanvasRenderingContext2D);
	/*protected*/ _paintOy(ctx:CanvasRenderingContext2D);
	/*protected*/ _paintGridx(ctx:CanvasRenderingContext2D);
	/*protected*/ _paintGridy(ctx:CanvasRenderingContext2D);
	/*protected*/ _paintGradx(ctx:CanvasRenderingContext2D);
	/*protected*/ _paintGrady(ctx:CanvasRenderingContext2D);
}
