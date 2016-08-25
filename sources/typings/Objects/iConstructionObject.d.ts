/// <reference path="../iBlockly.d.ts" />
/// <reference path="../../Utils/Color/iColor.d.ts" />

interface iConstructionObject {
	Flag: boolean; // For various construction process
	Flag2: boolean; // For various construction process
	Scratch: number; // For various construction process
	blocks: iBlocklyObjects;
	paintName_exe: ()=>void;
	paintLength_exe: ()=>void;
	validate: any;
	paint: any;
	ORGMOUSEINSIDE: (ev:MouseEvent)=>void;
	mouseX: number;
	mouseY: number;
	prefs: any;
	getWidth: number;
	getHeight: number;
	dragTo: (_x:number, _y:number)=>void;
	setExpression(v);
	getRoot(): iConstructionObject;
	newTimeStamp();
	setTimeStamp(_millis:number);
	getTimeStamp(): number;
	isAnimationPossible(): boolean;
	initDragPoints();
	getDragPoints(): any;
	add_removeDragPoint(_o:any);
	setDragPoints(_d:any);
	startDrag(_x:number, _y:number);
	compute_dragPoints(_x:number, _y:number);
	dragTo2D(_x:number, _y:number);
	dragTo3D(_x:number, _y:number);
	is3D(): boolean;
	set3D(_b:boolean);
	isChild(_o:any): boolean;
	logChildList();
	orderChildList();
	getChildList(): any;
	getChildLength(): number;
	addChild(_o:any);
	getChildAt(_i:number): any;
	clearChildList();
	deleteChild(_o:any);
	computeChilds();
	refreshChildsNames();
	// Uniquement pour les objets contenant une expression
	// Il s'agit de rafraîchir les noms utilisés dans l'expression :
	refreshNames();
	setParentList(_p:any);
	setParent();
	// Appelé notamment par la methode "pe" (parse expression)
	// de l'Interpreter javascript :
	addParent(_o:any);
	getParent(): any;
	isParent(_o): boolean;
	getParentLength(): number;
	getParentAt(_i:number): any;
	deleteParent(_o:any);
	redefine();
	setMagnets(_tab:any);
	getMagnet(_o:any): any;
	addMagnet(_o:any, _n:any): any;
	removeMagnet(_o:any);
	getMagnets(): any;
	checkMagnets();
	computeMagnets();
	// Pour les points sur polygones ;
	setOnBoundary(_b:any);
	getOnBoundary(): any;
	// Pour les polygones ;
	setBoundaryMode(P:any);
	// Pour la 3D :
	storeX();
	// Série de 5 méthodes à surcharger, pour les objets pouvant
	// être édité avec la "calculatrice" (point, cercle, expression, fonction, etc...) :
	setE1(_t:any);
	setE2(_t:any);
	setT(_t:any);
	setMin(_t:any);
	setMax(_t:any);
	//getValue(): any;
	setDeps();
	getCoordsSystem(): any;
	isCoincident(v?:any): boolean;
	getUnit(): any;
	setDash(_d:boolean);
	isDash(): boolean;
	setIncrement(v);
	getIncrement(): number;
	getSerial(): any;
	getPaintOrder(): any;
	// -1 pour pas d'affichage, 0,1,2,3,4,... pour indiquer le nombre de chiffres après la virgule
	setPrecision(_prec:number);
	getPrecision(): number;
	getRealPrecision(): number;
	getLayer(): any;
	setLayer(_l:any);
	getFontSize(): number;
	setFontSize(_s:number);
	// Getters et Setters :
	getCn(): any;
	setName(_n:string);
	getName(): string;
	getSubName(): string;
	getVarName(): string;
	setShowName(_bool:boolean);
	getShowName(): boolean;
	setNamePosition(v);
	getNamePosition(): any;
	// Seulement pour les points :
	setShape(shape:number);
	getShape(): number;
	setIndicated(_ind:any): any;
	isIndicated(): any;
	setSelected(_sel);// this needs to be reviewed
	isSelected():boolean|number;
	setHidden(_sel:number);
	isHidden(): number;
	isSuperHidden(): boolean;
	setColor(_col:string);
	getColor(): iColor;
	setRGBColor(r:number, g:number, b:number);
	isFilledObject(): boolean;
	getOpacity(): number;
	setOpacity(_f:number);
	getOversize(): number;
	getRealsize(): number;
	getSize(): number;
	setSize(_s:number);
	// mode 1 pour pointeur, 2 pour gomme, 3 pour poubelle, 
	// 4 pour construction de macros, 5 pour execution de macros
	// 6 pour les propriétés , 9 pour le magnétisme :
	setMode(_mode:number);
	getMode():number;
	setMacroMode(_mode:number);
	getMacroMode():number;
	// Seulement pour les macros : pour un cercle initial par exemple
	// va placer le centre parmi les intermédiaires, et provoquer
	// dans le source de la macro l'instruction P=Center au lieu de P=Point.
	// Pour un segment initial, P=First et P=Second au lieu de P=Point
	setMacroAutoObject();
	// Surchargé dans l'objet Point :
	setMacroSource(v);
	// For macro process only :
	isAutoObjectFlags(): boolean;
	// Seulement pour le mode édition : 0 signifie neutre, 1 objet édité
	setEditMode(_mode:number);
	getEditMode():number;
	checkIfValid(_C:any);
	getCode():string;
	getFamilyCode():string;
	isInstanceType(_c):boolean;
	isMoveable():boolean;
	free():boolean;
	setFloat(_f:any);
	getFloat():any;
	isPointOn():boolean;
	getAssociatedTools():string;
	paintObject(ctx:CanvasRenderingContext2D);
	paintName(ctx:CanvasRenderingContext2D);
	paintLength(ctx:CanvasRenderingContext2D);
	// Pour les traces, ne pas surcharger ces trois méthodes :
	startTrack();
	clearTrack();
	isTrack():boolean;
	// Mais surcharger celles-ci :
	beginTrack();
	drawTrack(_ctx:CanvasRenderingContext2D);
	compute();
	mouseInside(ev:MouseEvent);
	MOUSEINSIDE(ev): boolean;
	noMouseInside();
	doMouseInside();
	setNoMouseInside(_mi:boolean);
	isNoMouseInside():boolean;
	intersect(_C, _P);
	projectXY(_x:number, _y:number);
	project(p:any);
	projectAlpha(p:any);
	setAlpha(p:any);
	projectMagnetAlpha(p:any);
	setMagnetAlpha(p:any);
	// Hallucinants pointeurs javascript :
	setDefaults(_code:string);
	getArrow(): any;
	getSource(src:any);
	getStyleString():string;
	getStyle(src:any);
	getBlock(src:any);
}
