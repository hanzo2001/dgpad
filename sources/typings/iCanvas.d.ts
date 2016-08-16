/// <reference path="./GUI/iBasicGUIElement.d.ts" />
/// <reference path="./iConstruction.d.ts" />
/// <reference path="./iCalc.d.ts" />
/// <reference path="./iMagnifier.d.ts" />
/// <reference path="./iMagnets.d.ts" />
/// <reference path="./iNames.d.ts" />
/// <reference path="./iEraser.d.ts" />
/// <reference path="./iDeleteAll.d.ts" />
/// <reference path="./iUndo.d.ts" />
/// <reference path="./iLongPress.d.ts" />
/// <reference path="./iText.d.ts" />
/// <reference path="./iGhost.d.ts" />
/// <reference path="./iMacros.d.ts" />
/// <reference path="./iCoincedences.d.ts" />
/// <reference path="./GUI/iControlPanel.d.ts" />
/// <reference path="./iDepends.d.ts" />
/// <reference path="./iProperties.d.ts" />
/// <reference path="./Objects/iVirtualPointObject.d.ts" />
/// <reference path="./iTools.d.ts" />
/// <reference path="./iTrack.d.ts" />
/// <reference path="./Constructors/iPointConstructor.d.ts" />
/// <reference path="./iExpression.d.ts" />
/// <reference path="./iBlockly.d.ts" />

interface iCanvas extends iElementContainer {
	mainpanel: iControlPanel;
	bounds: any;
	prefs: any;// clone of $P
	undoManager: iUndoManager;
	propertiesManager: iPropertiesManager;
	macrosManager: iMacrosManager;
	deleteAll: iDeleteAll;
	coincidenceManager: iCoincidenceManager;
	eraserPanel: iEraserManager;
	trackManager: iTrackManager;
	calcManager: iCalcManager;
	magnetManager: iMagnetManager;
	magnifyManager: iMagnifierManager;
	demoModeManager: iDemoModeManager;
	textManager: iTextManager;
	dependsManager: iDependsManager;
	namesManager: iNamesManager;
	blocklyManager: iBlocklyManager;
	longpressManager: iLongpressManager;
	clearBackground: () => void;

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
	selectNameBtn(_b:boolean);
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
	mouse(ev:any): iVirtualPointObject;
	getConstruction(): iConstruction;
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
	getConstructor(code:string);
	initTools(ev:any, obj:any);
	setObjectConstructor(_oc);// sets OC
	isObjectConstructor(_oc): boolean;
	setPointConstructor();// sets PC into OC
	getPointConstructor(): iPointConstructor;// returns PC
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
	getExpression(s): iExpression;
	InterpretExpression(s:any): any;
	InterpretMacro(s:any);
	getInterpreter(): any;
	getCn(): any;
	OpenFile(_fname, _src);
	getStyle(): string;
}
