/// <reference path="./GUI/iBasicGUIElement.d.ts" />

type ControlPanel = {};
type Construction = {};
type PropertiesManager = {};
type MacrosManager = {};
type DeleteAll = {};
type CoincidenceManager = {};
type EraserManager = {};
type TrackManager = {};
type CalcManager = {};
type MagnetManager = {};
type MagnifierManager = {};
type DemoModeManager = {};
type DependsManager = {};
type NamesManager = {};
type BlocklyManager = {};
type LongpressManager = {};
type PointConstructor = {};
type Ghost = {};
type ToolsManager = {};
type VirtualPointObject = {};
type Expression = {};

interface iCanvas extends iElementContainer {
	mainpanel: ControlPanel;
	bounds: any;
	prefs: any;// clone of $P
	undoManager: UndoManager;
	propertiesManager: PropertiesManager;
	macrosManager: MacrosManager;
	deleteAll: DeleteAll;
	coincidenceManager: CoincidenceManager;
	eraserPanel: EraserManager;
	trackManager: TrackManager;
	calcManager: CalcManager;
	magnetManager: MagnetManager;
	magnifyManager: MagnifierManager;
	demoModeManager: DemoModeManager;
	textManager: iTextManager;
	dependsManager: DependsManager;
	namesManager: NamesManager;
	blocklyManager: BlocklyManager;
	longpressManager: LongpressManager;
	clearBackground: ()=>void;

	/*protected*/ context: CanvasRenderingContext2D;

	refreshKeyboard();
	getID(): string;
	getSource(): string;
	getHTML(hide_ctrl_panel:boolean): string;
	getHTMLJS(hide_ctrl_panel:boolean): string;
	load64(_str:string);
	saveToLocalStorage(is_iPad?:boolean);
	// Utilisé pour régler un bug d'Android (voir méthode resizeWindow) :
	// Appelée lorsqu'on change la taille de la fenêtre (ordinateur)
	// ou bien lorsqu'on change d'orientation sur une tablette :
	getBounds(): any;// var bounds
	setUndoBtn(_active);
	setRedoBtn(_active);
	forceArrowBtn();
	selectArrowBtn();
	selectPropBtn();
	selectCalcBtn();
	deselectAll();
	selectNameBtn(_b:string);
	ctrl_show(_bool:boolean);
	// Managers :
	getContext(): CanvasRenderingContext2D;
	exportPNG(): string;
	exportSVG(): string;
	loadZipPackage(_onload:()=>void);
	getiBookPlugin(_hide_control_panel:boolean, _fname:string, _callback);// _callback((new JSZip()).generate())
	getWidth(): number;
	getHeight(): number;
	mouseX(ev:any): number;
	mouseY(ev:any): number;
	mouse(ev:any): VirtualPointObject;
	getConstruction();
	addText(_m, _l, _t, _w, _h, _stl);// textManager.addTeXElement(_m, _l, _t, _w, _h, _stl);
	// 0 pour consultation
	// 1 pour pointeur
	// 2 pour gomme
	// 3 pour poubelle, 
	// 4 pour construction de macros
	// 5 pour execution de macros
	// 6 pour les propriétés
	// 7 pour le tracé
	// 8 pour la calculatrice,
	// 9 pour le magnétisme
	//10 pour le TeX
	//11 pour les dépendances
	setMode(_mode:number);
	getMode(): number;
	stopChrono();
	addTool(_oc);// toolsManager.addTool(_oc);
	getConstructor(_code: number);
	initTools(ev:any, obj:any);
	setObjectConstructor(_oc);// sets OC
	isObjectConstructor(_oc): boolean;
	setPointConstructor();// sets PC into OC
	getPointConstructor(): any;// returns PC
	isToolVisible(): boolean;
	setBackground(bk:string);
	getBackground(): string;
	showCS(_v);// Cn.coordsSystem.showCS(_v);
	isCS(): boolean;
	selectMoveable(ev:any): any;
	setPressedFilter(_func:(ev:any)=>void);
	setMovedFilter(_func:(ev:any)=>void);
	setReleasedFilter(_func:(ev:any)=>void);
	clearFilters();
	// Mouse Events :
	mousePressed(ev:any);
	translate(x:number, y:number);
	mouseMoved(ev:any);
	mouseReleased(ev:any);
	mouseClicked(ev:any);
	mouseWheel(ev:any);
	// TouchEvents :
	touchStart(tch:any);
	touchMoved(tch:any);
	touchEnd(tch:any);
	dragOver(ev:any);
	drop(ev:any);
	// only for computers :
	keydown(ev:any): boolean;
	// only for computers :
	keypress(ev:KeyboardEvent);
	// Only for animations :
	paintAnim();
	paint(event?:Event, coords?:any);//canvas.actualCoords
	addObject(o:any);
	InterpretScript(_o:any, s:any);
	Interpret(s:any);
	getExpression(s): Expression;
	InterpretExpression(s:any): any;
	InterpretMacro(s:any);
	getInterpreter(): any;
	getCn(): any;
	OpenFile(_fname, _src);
	getStyle(): string;
	/*protected*/ cloneCanvas();
	/*protected*/ setFullScreen();
	/*protected*/ resizeWindow();
	/*protected*/ initBounds();
	/*protected*/ initContext(cx:CanvasRenderingContext2D);
	/*protected*/ getNewContext(): CanvasRenderingContext2D;
	/*protected*/ closeTools();
	// Lorsque le navigateur mobile ne connaît pas les évenements "gesture"
	/* Les variables globales sont en fait des propriétés
		de l'objet window. Interpréter un script utilisateur risque
		d'ajouter des globales susceptibles de mettre la 
		pagaille dans l'objet window dans lesquel s'execute
		DGPad. Pour éviter cela, on execute les scripts (lecture
		de fichier aussi) dans un bac à sable : une iframe invisible.
		*/
	///*protected*/ createSandbox(){}();
}

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

interface iUndoManager {
	clear();
	record(target, add:boolean);
	undo();
	redo();
	beginAdd();
	endAdd();
	deleteObjs(_t);
	swap(withTarget);
	setBtns();
}
