/// <reference path="./typings/iCanvas.d.ts" />

import {ElementContainer} from './GUI/elements/ElementContainer';
import {Construction} from './Construction';
import {Expression} from './Expression';
import {ControlPanel} from './ControlPanel/ControlPanel';
import {ToolsManager} from './Tools/ToolsManager';
import {TextManager} from './Text/TextManager';
import {UndoManager} from './Undo/UndoManager';
import {NamesManager} from './Names/NamesManager';
import {EraserManager} from './Eraser/EraserManager';
import {MagnetManager} from './Magnets/MagnetManager';
import {CoincidenceManager} from './Coincidence/CoincidenceManager';
import {PropertiesManager} from './Properties/PropertiesManager';
import {CalcManager} from './Calc/CalcManager';
import {MagnifierManager} from './Magnifier/MagnifierManager';
import {DemoModeManager} from './Magnifier/DemoModeManager';
import {MacrosManager} from './Macros/MacrosManager';
import {LongpressManager} from './Longpress/LongpressManager';
import {DependsManager} from './Depends/DependsManager';
import {TrackManager} from './TrackManager';
import {DeleteAll} from './DeleteAll';
import {Ghost} from './Ghost/Ghost';
import {VirtualPointObject} from './Objects/VirtualPointObject';
import {PointConstructor} from './Constructors/PointConstructor';

type SVGCanvas = {};
type BlocklyManager = {};

var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $P = (<any>window).$P;
var $APP_PATH = (<any>window).$APP_PATH;
var $BODY_SCRIPT = (<any>window).$BODY_SCRIPT;
var $DGPAD_FIGURE = (<any>window).$DGPAD_FIGURE;
var JSZipUtils = (<any>window).JSZipUtils;

type CSSStyleHash = {[k:string]:string|string[]};
type HTMLAtts = {[k:string]:string|number|CSSStyleHash};

function cssStr(style:CSSStyleHash): string {
	let r = '';
	for (let i in style) {
		if (typeof style[i] === 'string') {
			r += i+':'+style[i];
		} else {
			for (let j=0, s=style[i].length; j<s; j++) {
				r += i+':'+style[i][j];
			}
		}
	}
	return r;
}

function mlStr(tag:string, atts?:HTMLAtts, txt?:string): string {
	let r = '<'+tag;
	if (atts) for (let i in atts) {
		r += ' '+i+'="'+(i==='style'?cssStr(<CSSStyleHash>atts[i]):atts[i])+'"';
	}
	if (txt === void 0) {
		r += ' /';
	} else {
		r += txt+'</'+tag;
	}
	return r+'>';
}

class Canvas extends ElementContainer implements iCanvas {
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
	textManager: TextManager;
	dependsManager: DependsManager;
	namesManager: NamesManager;
	blocklyManager: BlocklyManager;
	longpressManager: LongpressManager;
	clearBackground: ()=>void;

	private ID: string;
	private width: number;
	private height: number;
	private iPadDidFirstEnterBackground: boolean;
	private mousedown: boolean;
	private Cn: Construction;
	private context: CanvasRenderingContext2D;
	private OC: PointConstructor;//ObjectConstructor?
	private PC: PointConstructor;
	private myTimeOut: any;
	private handPath: Ghost;
	private toolsManager: ToolsManager;
	private draggedObject: any;
	private pressedFilter: any;
	private movedFilter: any;
	private releasedFilter: any;
	private actualCoords: {x:number, y:number};
	private dragCoords: any;
	private pressedCoords: any;
	private longPressTimeout: number;
	private zoomGesture: any;
	private previewEvent: any;
	private interpreter: any;
	constructor(id) {
		super();
    this.ID = id;
    this.docObject = <HTMLCanvasElement>document.getElementById(id);
    this.bounds = null;
    this.iPadDidFirstEnterBackground = true;
    this.width = 0;
    this.height = 0;
		this.prefs = $P.clone();
    this.initBounds();
		this.docObject.style.backgroundColor = this.prefs.background.color;
		// var img = "url('" + me.prefs.background.image + "'),";
		// img += $U.browserCode();
		// img += me.prefs.background.gradient;
		// docObject.style.backgroundImage = img;
		// docObject.style.backgroundRepeat = me.prefs.background.repeat;
		// docObject.style.backgroundPosition = me.prefs.background.position;
		this.mainpanel = new ControlPanel(this);
    this.context = this.getNewContext();
		this.mousedown = false;
		this.Cn = new Construction(this);
		// Managers :
		this.undoManager = new UndoManager(this);
		this.undoManager.setBtns();
		this.propertiesManager = new PropertiesManager(this);
		this.macrosManager = new MacrosManager(this);
		this.deleteAll = new DeleteAll(this);
		this.coincidenceManager = new CoincidenceManager(this);
		this.eraserPanel = new EraserManager(this);
		this.trackManager = new TrackManager(this);
		this.calcManager = new CalcManager(this);
		this.magnetManager = new MagnetManager(this);
		this.magnifyManager = new MagnifierManager(this);
		this.demoModeManager = new DemoModeManager(this);
		this.textManager = new TextManager(this);
		this.dependsManager = new DependsManager(this);
		this.namesManager = new NamesManager(this);
		this.blocklyManager = new BlocklyManager(this);
		this.longpressManager = new LongpressManager(this);
    this.PC = new PointConstructor();
    this.OC = this.PC;
		this.myTimeOut = new $U.TimeOut(this.prefs.precision.timeout, () => {
			if (this.Cn.getIndicated().length === 1) {
				if (this.Cn.getMode() === 1) {
					this.selectPropBtn();
					this.propertiesManager.edit(this.Cn.getIndicated()[0]);
				}
			}
		});
		this.handPath = new Ghost(this);
		this.toolsManager = new ToolsManager(this);
		this.clearBackground = $U.isBrowser.firefox() ? this.clearBackFirefox : this.clearBackOther;
		this.draggedObject = null;
		this.pressedFilter = null;
		this.movedFilter = null;
		this.releasedFilter = null;
		this.actualCoords = {x: NaN, y: NaN};
		this.dragCoords = null;
		this.pressedCoords = null;
		this.longPressTimeout = 0;
		this.zoomGesture = null;
		this.previewEvent = null;
		this.interpreter = null;

		var createSandbox = (() => {
			var el = document.createElement("iframe");
			el.setAttribute('name', this.ID);
			el.setAttribute('width', '0');
			el.setAttribute('height', '0');
			el.setAttribute('style', 'hidden');
			el.setAttribute('frameborder', '0');
			el.setAttribute('marginheight', '0');
			el.setAttribute('marginwidth', '0');
			el.setAttribute('scrolling', 'no');
			// Trouver éventuellement un paramètre de langue dans le script du body :
			var lang = ($BODY_SCRIPT.hasAttribute("data-lang")) ? "?lang=" + $BODY_SCRIPT.getAttribute("data-lang").toUpperCase() : "";
			el.setAttribute('src', $APP_PATH + 'NotPacked/Sandbox/sandbox.html' + lang);
			document.body.appendChild(el);
			el.onload = () => {
				this.interpreter = new window.frames[this.ID].Interpreter(window, this);
				this.interpreter.owner = el.contentWindow;
				this.interpreter.copyNameSpace();
				this.interpreter.setCaller(this.blocklyManager); // For print purpose
				var request = new XMLHttpRequest();
				request.open("GET", $APP_PATH + "NotPacked/plug-ins.js", true);
				request.send();
				request.onload = (e) => {
					this.interpreter.LoadPlugins(request.responseText);
					// Si le canvas a une figure attachée (base64) :
					if (this.docObject.hasAttribute("data-source")) {
						this.OpenFile("", $U.base64_decode(this.docObject.getAttribute("data-source")));
					} else {
						// Si une figure a été postée sur index.php, on l'ouvre :
						try {
							this.OpenFile("", $U.base64_decode($DGPAD_FIGURE));
						} catch (e) {}
					}
				}
			};
		})();
		// Uniquement pour l'iApp DGPad s'executant en local
		// dans iOS (ouverture des fichiers par "ouvrir dans..."
		// à partir d'autres applications) :
		(<any>window).$IPADOPENFILE = function(_s) {
			setTimeout(() => {this.OpenFile("", $U.base64_decode(_s));}, 1);
			return "file_opened";
		};
	}
	refreshKeyboard() {
		if (this.namesManager.isVisible()) {this.namesManager.refresh();}
	}
	getID(): string {
		return this.ID;
	}
	getSource(): string {
		return (this.macrosManager.getSource() + this.Cn.getSource() + this.textManager.getSource())
	}
	getHTML(hide_ctrl_panel:boolean): string {
		let s:string;
		let w = this.width;
		let h = this.height;
		let d = new Date();
		let frm = 'dgpad_frame_'+d.getTime();
		let src = this.getSource();
		let cls = 'canvas-getHTML';// dont forget!! load the styles
		let url = 'http://www.dgpad.net/index.php';
		src = $U.base64_encode(src);
		s = mlStr('input',{type:'submit',value: $L.export_button});
		s = mlStr('div',null,s);
		s+= mlStr('iframe',{name:frm,width:w,height:h,src:'about:blank',scrolling:'no',frameborder:'no'},'');
		s = mlStr('div',{style:{width:w+'px',height:h+'px'}},s);
		s+= mlStr('input',{type:'hidden',name:'file_content',value:src});
		if (hide_ctrl_panel) {s += mlStr('input',{type:'hidden',name:'hide_ctrlpanel',value:'true'});}
		s = mlStr('form',{class:cls,method:'post',action:url,target:frm,width:w,height:h+40},s);
		return s;
	}
	getHTMLJS(hide_ctrl_panel:boolean): string {
		let s: string;
		let w = this.width;
		let h = this.height;
		let d = new Date();
		let url = 'http://www.dgpad.net/index.php';
		let frm = "dgpad_frame_" + d.getTime();
		let src = this.getSource();
		let evn = 'if(!this.parentNode.num){this.parentNode.submit();this.parentNode.num=true}';// strange! [oNlOAd]
		src = $U.base64_encode(src);
		s = mlStr('input',{type:'hidden',name:'file_content',value:src});
		if (hide_ctrl_panel) {s += mlStr('input',{type:'hidden',name:'hide_ctrlpanel',value:'true'})}
		s+= mlStr('iframe',{name:frm,src:'about:blank',scrolling:'no',frameborder:'no',oNlOAd:evn,width:w,height:h});
		s = mlStr('form',{method:'post',action:url,target:frm,width:w,height:h},s);
		return s;
	}
	load64(_str:string) {
		this.getConstruction().deleteAll();
		this.macrosManager.clearTools();
		this.textManager.clear();
		this.trackManager.clear();
		this.Interpret($U.base64_decode(_str));
		this.forceArrowBtn();
	}
	saveToLocalStorage(is_iPad?:boolean) {
		if (this.Cn.isEmpty()) {return;}
		var t:any = {};
		var now = new Date();
		t.date = now.toLocaleString();
		t.width = this.width;
		t.height= this.height;
		t.lock = false;
		t.src = $U.base64_encode(this.getSource());
		//docObject.style.visibility = "hidden";
		var buff = <HTMLCanvasElement>document.createElement("canvas");
		buff.setAttribute("width", $P.localstorage.iconwidth);
		buff.setAttribute("height", $P.localstorage.iconwidth);
		buff.style.setProperty("image-rendering", "-moz-crisp-edges");
		buff.style.setProperty("image-rendering", "-webkit-optimize-contrast");
		var scale = 1.5 * $P.localstorage.iconwidth / Math.max(this.width, this.height);
		this.Cn.zoom(this.width / 2, this.height / 2, scale);
		this.Cn.computeAll();
		this.paint();
		var w = this.width / 1.5;
		var h = this.height / 1.5;
		var d = $P.localstorage.iconwidth;
		var ctx = buff.getContext('2d');
		ctx.imageSmoothingEnabled = true;
		ctx.mozImageSmoothingEnabled = true;
		ctx.drawImage(<HTMLCanvasElement>this.docObject, (d - w) / 2, (d - h) / 2, w, h);
		t.img = buff.toDataURL();
		this.Cn.zoom(this.width / 2, this.height / 2, 1 / scale);
		var stringified = JSON.stringify(t);
		if ((is_iPad) && (!this.iPadDidFirstEnterBackground)) {
			localStorage.setItem($P.localstorage.base + "1", stringified);
		} else {
			var storageError = false;
			do {
				storageError = false;
				try {
					$U.shiftLocalStorages();
					localStorage.setItem($P.localstorage.base + "1", stringified);
				} catch (err) {
					if (err.name === "QuotaExceededError") {
						$U.clearOneLocalStorage();
						storageError = true;
					} else {
						localStorage.setItem($P.localstorage.base + "1", stringified);
					}
				}
			} while (storageError);
		}
	}
	// Utilisé pour régler un bug d'Android (voir méthode resizeWindow) :
	// Appelée lorsqu'on change la taille de la fenêtre (ordinateur)
	// ou bien lorsqu'on change d'orientation sur une tablette :
	getBounds() {
		return this.bounds;
	}
	setUndoBtn(active) {
		this.mainpanel.setUndoBtn(active);
	}
	setRedoBtn(active) {
		this.mainpanel.setRedoBtn(active);
	}
	forceArrowBtn() {
		this.mainpanel.forceArrowBtn();
	}
	selectArrowBtn() {
		this.mainpanel.selectArrowBtn();
	}
	selectPropBtn() {
		this.mainpanel.selectPropBtn();
	}
	selectCalcBtn() {
		this.mainpanel.selectCalcBtn();
	}
	deselectAll() {
		this.mainpanel.deselectAll();
	}
	selectNameBtn(b:string) {
		this.mainpanel.selectNameBtn(b);
	}
	ctrl_show(bool:boolean) {
		if (bool) {
			if (this.mainpanel) {
				this.docObject.parentNode.removeChild(this.mainpanel.getDocObject());
				this.mainpanel = null;
			}
			this.mainpanel = new ControlPanel(this);
		} else {
			this.mainpanel.hide();
		}
		this.paint();
	}
	getContext(): CanvasRenderingContext2D {
		return this.context;
	}
	exportPNG(): string {
		var buff = document.createElement("canvas");
		buff.setAttribute("width", this.width+'');
		buff.setAttribute("height", this.height+'');
		buff.style.setProperty("image-rendering", "-moz-crisp-edges");
		buff.style.setProperty("image-rendering", "-webkit-optimize-contrast");
		this.Cn.computeAll();
		this.paint();
		var ctx = buff.getContext('2d');
		ctx.imageSmoothingEnabled = true;
		ctx.mozImageSmoothingEnabled = true;
		ctx.fillStyle = this.docObject.style.backgroundColor;
		ctx.fillRect(0, 0, this.width, this.height);
		ctx.drawImage(<HTMLCanvasElement>this.docObject, 0, 0, this.width, this.height);
		return buff.toDataURL();
	}
	exportSVG(): string {
		for (var i = 0; i < 2; i++) {
			this.context = new SVGCanvas(this.ID);
			if (!this.context.setLineDash) {
				this.context.setLineDash = function(_tab) {
					this.context.mozDash = _tab;
					this.context.webkitLineDash = _tab;
				};
			}
			this.Cn.clearIndicated();
			this.Cn.clearSelected();
			this.Cn.paint(this.context);
		}
		var svg = this.context.canvas.toDataURL("image/svg+xml");
		this.context = this.getNewContext();
		this.resizeWindow();
		return svg;
	}
	loadZipPackage(onload:()=>void) {
		if (JSZipUtils) {
			onload();
		} else {
			var parent = document.getElementsByTagName("head")[0];
			var script0 = document.createElement("script");
			script0.type = "text/javascript";
			script0.src = $APP_PATH + "NotPacked/thirdParty/jszip-utils.js";
			var script1 = document.createElement("script");
			script1.type = "text/javascript";
			script1.src = $APP_PATH + "NotPacked/thirdParty/jszip.min.js";
			script1.onload = onload;
			parent.appendChild(script0);
			parent.appendChild(script1);
		}
	}
	getiBookPlugin(_hide_control_panel:boolean, fname:string, _callback) /* _callback((new JSZip()).generate())*/ {
		var w = this.width;
		var h = this.height;
		var f = fname === '' ? 'ibook.wdgt' : fname;
		var d = new Date();
		var id = "net.dgpad.fig" + d.getTime();
		var src = this.getSource();
		src = $U.base64_encode(src);
		var hide = _hide_control_panel;
		var html = `<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="icon" type="image/png" href="favicon.png" />
		<link rel="apple-touch-icon" href="scripts/NotPacked/images/icon.png"/>
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta   id="wholeViewport" name="viewport" content="width=device-width, maximum-scale=1.0, initial-scale=1 ,user-scalable=no">
		<script>
			var $MOBILE_PHONE;
			if (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {
				if (((screen.width >= 480) && (screen.height >= 800)) || ((screen.width >= 800) && (screen.height >= 480)) || navigator.userAgent.match(/ipad/gi)) {
					$MOBILE_PHONE = false;//tablette
				} else {
					$MOBILE_PHONE = true;//mobile
				}
			} else {
				$MOBILE_PHONE = false;//Desktop
			}
			if ($MOBILE_PHONE) {
				document.getElementById('wholeViewport').setAttribute("content", "width=device-width, maximum-scale=0.7, initial-scale=0.7 ,user-scalable=no");
			}
		</script>
	</head>
	<body style="-ms-touch-action: none;">
		<script src="scripts/DGPad.js" data-source="${src}" data-hidectrlpanel="${hide}"></script>
	</body>
</html>`;
		var plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>CFBundleDisplayName</key>
		<string>DGPad</string>
		<key>CFBundleIdentifier</key>
		<string>${id}</string>
		<key>MainHTML</key>
		<string>index.html</string>
		<key>Width</key>
		<integer>${w}</integer>
		<key>Height</key>
		<integer>${h}</integer>
	</dict>
</plist>`;
		var png = this.exportPNG();
		JSZipUtils.getBinaryContent($APP_PATH + "NotPacked/scripts.zip", function(err, data) {
			if (!err) {
				var zip = new JSZip();
				var plugin = zip.folder(f).load(data);
				plugin.file("index.html", html);
				plugin.file("Info.plist", plist);
				plugin.file("Default.png", png.substr(png.indexOf(',') + 1), {base64: true});
				var content = zip.generate({type: "blob"});
				_callback(content);
			}
		});
	}
	//    var gDrive = new GoogleFiles(docObject);
	//    me.upload = function(fname, source) {
	//
	//        gDrive.upload("essai.js", Cn.getSource());
	//    }
	getWidth(): number {
		return this.width;
	}
	getHeight(): number {
		return this.height;
	}
	mouseX(event:MouseEvent): number {
		return (event.pageX - this.bounds.left);
	}
	mouseY(event:MouseEvent): number {
		return (event.pageY - this.bounds.top);
	}
	mouse(event:MouseEvent): VirtualPointObject {
		return new VirtualPointObject(this.mouseX(event), this.mouseY(event));
	}
	getConstruction(): any {
		return this.Cn;
	}
	addText(_m, left, top, width, height, _stl) /* textManager.addTeXElement(_m, _l, _t, _w, _h, _stl);*/ {
		this.textManager.addTeXElement(_m, left, top, width, height, _stl);
	}
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
	setMode(mode:number) {
		this.closeTools();
		this.magnifyManager.show();
		if ((mode === 0)) {
			this.deselectAll();
			this.magnifyManager.hide();
		}
		if (mode === 2) {
			this.eraserPanel.showPanel();
		} else {
			this.eraserPanel.hidePanel();
		}
		if (mode === 3) {
			this.deleteAll.show();
		} else {
			this.deleteAll.hide();
		}
		if ((mode === 4) || (mode === 5)) {
			this.macrosManager.showPanel();
		} else {
			this.macrosManager.hidePanel();
		}
		if (mode === 6) {
			this.propertiesManager.showPanel();
		} else {
			this.propertiesManager.hidePanel();
		}
		if (mode === 7) {
			this.handPath.start();
		} else {
			this.clearFilters();
		}
		if (mode === 8) {
			this.calcManager.showPanel();
		} else {
			this.calcManager.hidePanel();
		}
		if (mode === 9) {
			this.mainpanel.deselectPointer();
		} else {
			this.magnetManager.quit();
		}
		if (mode === 10) {
			this.textManager.showPanel();
		} else {
			this.textManager.hidePanel();
		}
		if (mode === 11) {
			this.mainpanel.deselectPointer();
		} else {
			this.dependsManager.quit();
		}
		this.Cn.setMode(mode);
	}
	getMode(): number {
		return this.Cn.getMode();
	}
	stopChrono() {
		this.myTimeOut.stopChrono();
	}
	addTool(_oc) /* toolsManager.addTool(_oc); */ {
		this.toolsManager.addTool(_oc);
	}
	getConstructor(code:string) {
		return this.toolsManager.getConstructor(code);
	}
	initTools(event:any, obj:any) {
		var inter = document.activeElement.getAttribute("interactiveinput");
		if (inter !== null) {
			$U.addTextToInput(document.activeElement, obj.getName(), inter);
			return;
		};
		if ((obj.getCode() === "blockly_button") && (obj.insideButton(event))) {
			obj.run();
			return;
		};
		if (this.namesManager.replaceName(obj)) return;
		if (this.blocklyManager.tryEdit(obj)) return;
		switch (this.Cn.getMode()) {
			case 0:
				// Outil de consultation :
				break;
			case 1:
				// Outil curseur-création :
				this.toolsManager.showTools(event);
				break;
			case 2:
				// Outil gomme :
				if (!obj.isSuperHidden()) {
					obj.setHidden(!obj.isHidden());
					obj.setSelected(false);
					obj.setIndicated(false);
					this.paint(event);
				}
				break;
			case 3:
				// Outil poubelle :
				if (!obj.isHidden()) {
					this.undoManager.deleteObjs(this.Cn.safelyDelete(obj));
					this.refreshKeyboard();
					this.paint(event);
				}
				break;
			case 4:
				// Outil construction de macro :
				if (!obj.isHidden()) {
					this.Cn.macroConstructionTag(obj);
					this.paint(event);
				}
				break;
			case 5:
				// Outil execution de macro :
				if (!obj.isHidden()) {
					this.Cn.macroExecutionTag(obj);
					this.paint(event);
				}
				break;
			case 6:
				// Outil propriétés des objets :
				this.propertiesManager.edit(obj);
				this.paint(event);
				break;
			case 8:
				// Outil propriétés des objets :
				this.calcManager.edit(obj);
				this.paint(event);
				break;
			case 9:
				// Outil magnétisme :
				this.magnetManager.add(obj);
				this.paint(event);
				break;
			case 10:
				// Outil TEX :
				this.textManager.addName(obj.getName());
				this.paint(event);
				break;
			case 11:
				// Outil depends :
				this.dependsManager.add(obj);
				this.paint(event);
				break;
		}
	}
	setObjectConstructor(oc) {
		this.OC = oc;
	}
	isObjectConstructor(oc): boolean {
		return this.OC === oc
	}
	setPointConstructor() {
		this.OC = this.PC;
	}
	getPointConstructor(): any {
		return this.PC;
	}
	isToolVisible(): boolean {
		return this.toolsManager.isVisible();
	}
	setBackground(bk:string) {
		this.prefs.background.color = bk;
		this.docObject.style.setProperty("background-color", bk);
	}
	getBackground(): string {
		return (this.prefs.background.color);
	}
	showCS(_v) {
		this.Cn.coordsSystem.showCS(_v);
		this.paint();
	}
	isCS(): boolean {
		return this.Cn.coordsSystem.isCS();
	}
	selectMoveable(event:MouseEvent): any {
		this.cleanInds();
		var inds = this.Cn.getIndicated();
		var len = inds.length;
		for (var i = 0; i < len; i++) {
			if ((inds[i].isMoveable()) && (inds[i].getCode() === "point") && (inds[i].getParentLength() === 1)) {
				var obj = inds[i];
				// Cn.clearIndicated();
				// obj.setIndicated(true);
				// Cn.addIndicated(obj);
				obj.startDrag(this.mouseX(event), this.mouseY(event));
				return obj;
			}
		}
		for (var i = 0; i < len; i++) {
			if (inds[i].isMoveable()) {
				inds[i].startDrag(this.mouseX(event), this.mouseY(event));
				return inds[i];
			}
		}
		if (len > 0) {
			inds[0].startDrag(this.mouseX(event), this.mouseY(event));
			return inds[0];
		}
		return null;
	}
	setPressedFilter(func:(event:MouseEvent)=>void) {
		this.pressedFilter = func;
	}
	setMovedFilter(func:(event:MouseEvent)=>void) {
		this.movedFilter = func;
	}
	setReleasedFilter(func:(event:MouseEvent)=>void) {
		this.releasedFilter = func;
	}
	clearFilters() {
		this.pressedFilter = null;
		this.movedFilter = null;
		this.releasedFilter = null;
	}
	// Mouse Events :
	mousePressed(event:MouseEvent) {
		event.preventDefault();
		if (this.pressedFilter) {
			this.pressedFilter(event);
			return;
		}
		if (this.longpressManager.isVisible()) return;
		if (this.coincidenceManager.isVisible()) return;
		// if (this.blocklyManager.isSettingsVisible()) return;
		this.draggedObject = null;
		this.dragCoords = null;
		this.actualCoords.x = this.mouseX(event);
		this.actualCoords.y = this.mouseY(event);
		// $ALERT("x="+actualCoords.x+" y="+actualCoords.y);
		this.pressedCoords = {
			x: this.actualCoords.x,
			y: this.actualCoords.y,
			t: $U.getTime()
		};
		// actualCoords
		// Si on a cliqué à côté des outils :
		if (this.toolsManager.isVisible()) {
			this.closeTools();
			this.Cn.validate(event);
			this.paint(event);
			// Fait en sorte que le mousereleased ne crée pas un point :
			this.pressedCoords = {
				x: NaN,
				y: NaN
			};
			return;
		}
		// S'il s'agit d'un click droit :
		if (event.which === 2 || event.which === 3) {
			this.dragCoords = {
				x: this.actualCoords.x,
				y: this.actualCoords.y
			};
			return;
		}
		this.mousedown = true;
		this.Cn.validate(event);
		this.draggedObject = this.selectMoveable(event);
		if (this.draggedObject === null && this.Cn.getMode() === 1) {
			// Si on a tapé/cliqué "dans le vide" et qu'aucun objet
			// n'est sous le doigt/souris (pour le longpress menu) :
			this.longPressTimeout = setTimeout(() => {this.longPress(event);}, 500);
		}
		if (this.draggedObject === null && this.Cn.getMode() === 0) {
			// Si on a tapé/cliqué "dans le vide" et qu'aucun objet
			// n'est sous le doigt/souris (pour le translate en mode présentation) :
			this.dragCoords = {
				x: this.actualCoords.x,
				y: this.actualCoords.y
			};
			return;
		}
		if (this.draggedObject) {this.draggedObject.blocks.evaluate("onmousedown");}
		this.paint(event);
	}
	translate(x:number, y:number) {
		this.Cn.translate(x, y);
		this.Cn.computeAll();
		// me.blocklyManager.computeTurtle();
		this.paint();
	}
	mouseMoved(event:MouseEvent) {
		event.preventDefault();
		clearTimeout(this.longPressTimeout);
		this.actualCoords.x = this.mouseX(event);
		this.actualCoords.y = this.mouseY(event);
		if (this.dragCoords) {
			// S'il s'agit d'un click droit glissé :
			this.translate(this.actualCoords.x - this.dragCoords.x, this.actualCoords.y - this.dragCoords.y);
			this.dragCoords.x = this.actualCoords.x;
			this.dragCoords.y = this.actualCoords.y;
			return;
		}
		if (this.movedFilter) {
			this.movedFilter(event);
			return;
		}
		if (this.mousedown) {
			if (this.draggedObject) {
				if (!this.isClick(event)) {this.pressedCoords = {x: NaN, y: NaN, t: 0};}
				this.draggedObject.dragTo(this.actualCoords.x, this.actualCoords.y);
				this.textManager.evaluateStrings();
				this.draggedObject.blocks.evaluate("ondrag"); // blockly
				this.actualCoords.x = NaN;
				this.actualCoords.y = NaN;
			} else {
				this.Cn.validate(event);
			}
		} else {
			this.Cn.validate(event);
		}
		// If a tool is selected :
		this.OC.selectInitialObjects(this);
		this.paint(event, this.actualCoords);
	}
	mouseReleased(event:MouseEvent) {
		event.preventDefault();
		clearTimeout(this.longPressTimeout);
		this.actualCoords.x = NaN;
		this.actualCoords.y = NaN;
		if (this.releasedFilter) {
			this.releasedFilter(event);
			return;
		}
		this.mousedown = false;
		this.dragCoords = null;
		if (this.draggedObject) {
			if (this.isClick(event)) {
				// Si on a cliqué sur l'objet :
				if ((!this.coincidenceManager.checkCoincidences(event))) {
					// Et s'il n'y a pas ambiguité, on lance les outils
					// contextuels :
					if (this.Cn.getIndicated().length > 1) {
						this.Cn.addSelected(this.Cn.getIndicated()[0]);
						this.Cn.addSelected(this.Cn.getIndicated()[1]);
					} else {
						this.Cn.addSelected(this.draggedObject);
					}
					this.paint(event);
					this.initTools(event, this.draggedObject);
				}
			} else {
				this.draggedObject.blocks.evaluate("onmouseup"); // blockly
			}
			// this.textManager.evaluateStrings(true);
			this.draggedObject = null;
		} else {
			this.Cn.validate(event);
			this.cleanInds();
			var sels = this.Cn.getIndicated();
			if (this.isClick(event)) {
				if (sels.length === 0) {
					if (this.Cn.isMode(1, 5, 7, 8)) {
						// On est dans le mode arrow, tracé ou execution de macro :
						// On a cliqué dans le vide, on crée un point à la volée :
						this.OC.selectCreatePoint(this, event);
						var o = this.OC.createObj(this, event);
						this.Cn.validate(event);
						this.Cn.clearSelected();
						if (this.Cn.isMode(5)) {
							this.macrosManager.refreshMacro();
							this.Cn.macroExecutionTag(o);
						}
						this.paint(event);
					}
				} else {
					// Si on a cliqué sur un objet :
					if ((!this.coincidenceManager.checkCoincidences(event))) {
						// Et s'il n'y a pas ambiguité, on lance les outils
						// contextuels :
						this.Cn.addSelected(sels[0]);
						if (sels.length > 1) {this.Cn.addSelected(sels[1]);}
						// Cn.addSelected(sels[0]);
						this.paint(event);
						this.initTools(event, sels[0]);
					}
				}
			} else {
				// Sinon, il s'agit d'une caresse :
				if (sels.length > 0) {
					// On a caressé un objet (point sur) ou deux objets (intersection)
					// On crée un point à la volée (dans le mode arrow, tracé ou execution de macro) :
					if (this.Cn.isMode(1, 5, 7, 8)) {
						this.OC.setInitialObjects(sels);
						this.OC.selectCreatePoint(this, event);
						var o = this.OC.createObj(this, event);
						this.OC.setInitialObjects([]);
						this.Cn.validate(event);
						this.Cn.clearSelected();
						if (this.Cn.isMode(5)) {
							this.macrosManager.refreshMacro();
							this.Cn.macroExecutionTag(o);
						}
						this.paint(event);
					} else if (this.Cn.isMode(2, 3, 4, 6, 9)) {
						this.initTools(event, sels[0]);
					}
				}
			}
		}
		if (!this.toolsManager.isVisible()) {
			this.Cn.clearIndicated();
			this.Cn.clearSelected();
			this.clearBackground();
			this.Cn.paint(this.context);
		}
	}
	mouseClicked(event:MouseEvent) {
	}
	mouseWheel(event:MouseEvent) {
		event.preventDefault();
		var zoom = 1 + $U.extractDelta(event) / 2000;
		this.Cn.zoom(this.mouseX(event), this.mouseY(event), zoom);
		this.Cn.validate(event);
		this.Cn.computeAll();
		this.paint(event);
	}
	// TouchEvents :
	touchStart(event:TouchEvent) {
		this.touchToMouse(event, this.mousePressed);
	}
	touchMoved(event:TouchEvent) {
		this.touchToMouse(event, this.mouseMoved);
	}
	touchEnd(event:TouchEvent) {
		this.touchToMouse(event, this.mouseReleased);
		this.zoomGesture = null;
	}
	dragOver(event:DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		event.dataTransfer.dropEffect = 'copy';
		return false;
	}
	drop(event:DragEvent) {
		event.stopPropagation();
		event.preventDefault();
		var f = event.dataTransfer.files[0];
		var reader = new FileReader();
		reader.onload = (e) => {this.OpenFile("", e.target.result);};
		reader.readAsText(f);
	}
	// only for computers :
	keydown(event:KeyboardEvent): boolean {
		// $ALERT("yes");
		if (this.getMode() === 1) {
			if (event.metaKey) {return;}
			var key = event.keyCode || event.charCode;
			var pt = this.Cn.getLastPoint();
			var d = new Date();
			var key = event.keyCode || event.charCode;
			switch (key) {
				case 8: //DEL
					if ((pt) && (pt.getShowName()) && (d.getTime() - pt.getTimeStamp() < $P.precision.edit_timeout)) {
						pt.setName(pt.getName().slice(0, -1));
						pt.refreshChildsNames();
						this.paint();
					}
					break;
				case 91: //COMMAND (apple)
					return false;
				default:
					return true;
			}
			event.preventDefault();
			return false;
		}
	}
	keypress(event:KeyboardEvent) {
		if (this.getMode() === 1) {
			if (event.metaKey) {return;}
			event.preventDefault();
			var key = event.keyCode || event.charCode;
			var pt = this.Cn.getLastPoint();
			var d = new Date();
			if ((pt) && (d.getTime() - pt.getTimeStamp() < $P.precision.edit_timeout)) {
				var car = String.fromCharCode(key);
				var nme = (pt.getShowName()) ? pt.getName() + car : car;
				pt.setName(nme);
				pt.setShowName(true);
				pt.refreshChildsNames();
				this.paint();
			}
		}
	}
	// Only for animations :
	paintAnim() {
		this.context.globalAlpha = 1;
		this.clearBackground();
		if (this.OC && (this.OC.getC(0)) && this.previewEvent) {
			this.OC.preview(this.previewEvent,this);
		}
		this.handPath.paint(this.context);
		this.Cn.paint(this.context);
		this.trackManager.draw();
	}
	paint(event?:Event, coords?:any) {
		this.context.globalAlpha = 1;
		this.clearBackground();
		if (this.OC && (this.OC.getC(0))) {
			this.previewEvent = event;
			this.OC.preview(event,this);
		} else {
			this.previewEvent = null;
		}
		this.handPath.paint(this.context);
		this.Cn.paint(this.context, coords);
		this.trackManager.draw();
	}
	addObject(o:any) {
		this.undoManager.record(o, true);
		o.newTimeStamp();
		this.Cn.add(o);
	}
	InterpretScript(_o:any, s:any) {
		this.interpreter.setCaller(_o);
		this.interpreter.Interpret(s);
	}
	Interpret(s:any) {
		this.interpreter.Interpret(s);
	}
	getExpression(s): Expression {
		return new Expression(this, s);
	}
	InterpretExpression(s:any): any {
		var ex = new Expression(this, s);
		return ex.value();
	}
	InterpretMacro(s:any) {
		this.interpreter.InterpretMacro(s);
	}
	getInterpreter(): any {
		return this.interpreter;
	}
	getCn(): any {
		return this.Cn;
	}
	OpenFile(_fname, _src) {
		// Pour assurer la compatibilité avec les anciennes figures
		// on se met en radians (old style). Si une figure est en degrés
		// elle s'ouvrira en mode degré.
		this.Cn.setDEG(_src === "")
		this.iPadDidFirstEnterBackground = true;
		this.Cn.deleteAll();
		this.macrosManager.clearTools();
		this.textManager.clear();
		this.trackManager.clear();
		this.interpreter.Interpret(_src);
		// Mode construction si la figure est vide,
		// mode consultation sinon :
		this.setMode((_src === "") ? 1 : 0);
		this.undoManager.clear();
		this.Cn.clearIndicated();
		this.Cn.clearSelected();
		this.Cn.computeAll();
		this.paint();
	}
	getStyle(): string {
		var t = "SetGeneralStyle(\"";
		t += "background-color:" + this.getBackground();
		if (this.Cn.isDEG()) t += ";degree:true";
		if (this.Cn.isDragOnlyMoveable()) t += ";dragmoveable:true";
		t += "\");\n";
		return t;
	}
	private cloneCanvas() {
		var parent = this.docObject.parentNode;
		var newcanvas = document.createElement('canvas');
		parent.insertBefore(newcanvas, this.docObject);
		parent.removeChild(this.docObject);
		newcanvas.setAttribute("id", this.ID);
		this.docObject = newcanvas;
		$U.initEvents(this, this.docObject);
		this.initBounds();
		this.context = this.getNewContext();
	}
	private setFullScreen() {
		var ww = window.innerWidth;
		var wh = window.innerHeight - 1;
		var cw = ww - 2 * this.prefs.size.marginwidth;
		var ch = wh - 2 * this.prefs.size.marginheight;
		var ct = (wh - ch) / 2;
		var cl = (ww - cw) / 2;
		this.docObject.style.position = "fixed";
		this.docObject.setAttribute("width", cw+'');
		this.docObject.setAttribute("height", ch+'');
		this.docObject.style.top = ct + "px";
		this.docObject.style.left = cl + "px";
		this.docObject.style.width = cw + "px";
		this.docObject.style.height = ch + "px";
		this.width =  this.docObject.clientWidth;
		this.height = this.docObject.clientHeight;
		this.bounds = {
			left: cl,
			top: ct,
			width: cw,
			height: ch
		};
		if (Object.touchpad) {window.scrollTo(0, 0);}
	}
	private resizeWindow() {
		this.setFullScreen();
		this.trackManager.resize();
		if (this.mainpanel) {
			this.docObject.parentNode.removeChild(this.mainpanel.getDocObject());
			this.mainpanel = null;
		}
		this.mainpanel = new ControlPanel(this);
		this.setMode(1);
		if (this.Cn) {this.Cn.resizeBtn();}
		if ($U.isMobile.android()) {
			// Un bug hallucinant du navigateur standard d'Androïd rendant inutilisable
			// le clearRect après avoir fait un resize (changement d'orientation).
			// La seule possibilité est de cloner l'élément canvas du DOM, ainsi
			// que faire un paint lancé par un timer. Le délire :
			//            console.log("ANDROID. width=" + width + " height=" + height);
			this.cloneCanvas();
			setTimeout(() => {this.paint();}, 1);
		} else {
			this.paint();
		}
	}
	private initBounds() {
		if (this.docObject.hasAttribute("data-hidectrlpanel")) {
			if (this.docObject.getAttribute("data-hidectrlpanel") === "true") {
				this.prefs.controlpanel.size = 0;
			}
		}
		if (this.docObject.hasAttribute("width") && this.docObject.hasAttribute("height")) {
			var off = $U.getElementOffset(this.docObject);
			var cl = off.left;
			var ct = off.top;
			var cw = 1 * ~~this.docObject.getAttribute("width");
			var ch = 1 * ~~this.docObject.getAttribute("height");
			this.width = cw;
			this.height = ch;
			this.docObject.style.top = ct + "px";
			this.docObject.style.left = cl + "px";
			this.bounds = {
				top: ct,
				left: cl,
				width: cw,
				height: ch
			};
		} else {
			this.setFullScreen();
			window.document.body.style.setProperty("overflow", "hidden");
			if (!Object.touchpad) {
				window.onresize = this.resizeWindow;
				window.onbeforeunload = () => {this.saveToLocalStorage();};
			} else {
				if ($U.isMobile.android()) {
					// Encore une subtilité du navigateur d'Android :
					// l'évenement onorientationchange est lancé avant
					// que la taille de la fenêtre soit changée (resize event).
					// Du coup il faut attendre l'évenement resize qui
					// n'aura un effet que si on est passé précédement par
					// onorientationchange. 
					window.onorientationchange = () => {
						var or = true;
						window.onresize = () => {
							if (or) {this.resizeWindow();}
							or = false;
						};
					};
				} else {
					window.onorientationchange = this.resizeWindow;
				}
				window.onunload = () => this.saveToLocalStorage();
				// Seulement utilisée par l'application iPad (stockage de la figure dans
				// l'historique à chaque fois que DGPad est désactivé (passe en background) :
				(<any>window).$IPADUNLOAD = () => {
					this.quit(true);
					this.iPadDidFirstEnterBackground = false;
					this.docObject.style.visibility = "visible";
					// On inverse l'homothétie effectuée dans me.quit() pour rétablir la 
					// figure dans ses dimensions d'origine :
					// var scale = Math.max(width, height) / (1.5 * $P.localstorage.iconwidth);
					// Cn.zoom(width / 2, height / 2, scale);
					this.Cn.computeAll();
					this.paint();
				};
			}
		}
	}
	private initContext(ctx:CanvasRenderingContext2D) {
		// cx.imageSmoothingEnabled = true;
		// cx.mozImageSmoothingEnabled = true;
		// cx.webkitImageSmoothingEnabled=true;
		// setLineDash (pointillés) n'est aujourd'hui reconnu que par
		// Chrome. Rajoute cette fonctionnalité pour Firefox et Safari :
		if (!ctx.setLineDash) {
			ctx.setLineDash = function(tab) {
				ctx.mozDash = tab;
				ctx.webkitLineDash = tab;
			};
		}
		ctx.rect(0, 0, this.width, this.height);
		ctx.clip();
	}
	private getNewContext(): CanvasRenderingContext2D {
		var ctx = (<HTMLCanvasElement>this.docObject).getContext('2d');
		this.initContext(ctx);
		return ctx;
	}
	private closeTools() {
		this.toolsManager.closeTools();
		this.setPointConstructor();
		this.clearFilters();
		this.Cn.clearSelected();
	}
	private clearBackFirefox() {
		this.docObject.width = this.docObject.width;// huh???
		// context.clearRect(0, 0, width, height);
	}
	private clearBackOther() {
		// docObject.width = docObject.width;
		this.context.clearRect(0, 0, this.width, this.height);
	}
	private moveableSortFilter(a, b): number {
		var ap = a.isInstanceType("area");
		var bp = b.isInstanceType("area");
		if (ap) {return 1;}
		if (bp) {return -1;}
		return 1;
	}
	// Trie les indicateds pour éviter la prédominance des
	// polygone lorsqu'on clique :
	private cleanInds() {
		var inds = this.Cn.getIndicated();
		// On trie en laissant les polygones en fin de liste :
		inds.sort(this.moveableSortFilter);
		// Si le premier indiqué n'est pas un polygone et que
		// le dernier indiqué en est un, on vire tous les polygones :
		if ((inds.length > 1) && (inds[0].getCode() !== "area") && (inds[inds.length - 1].getCode() === "area")) {
			while (inds[inds.length - 1].getCode() === "area") {
				inds[inds.length - 1].setIndicated(false);
				inds.splice(inds.length - 1, 1);
			}
		}
	}
	private isClick(event:any): boolean {
		var x0 = this.mouseX(event);
		var y0 = this.mouseY(event);
		var prec2 = this.prefs.precision.caress;
		prec2 *= prec2;
		return ((this.pressedCoords) && ($U.getTime() - this.pressedCoords.t) < 800) && (((this.pressedCoords.x - x0) * (this.pressedCoords.x - x0) + (this.pressedCoords.y - y0) * (this.pressedCoords.y - y0)) < prec2);
	}
	private longPress(event:any) {
		this.longpressManager.show(event);
	}
	// Lorsque le navigateur mobile ne connaît pas les évenements "gesture"
	private touchToMouse(event:TouchEvent, _proc:(ptme:any)=>void) {
		event.preventDefault();
		if (event.touches.length < 2) {
			if (this.zoomGesture) {
				// On vient probablement de passer de 2 doigts à 1 doigt :
				this.zoomGesture = null;
				this.pressedCoords = {x: NaN, y: NaN};
			} else {
				// Il s'agit d'un mono-doigt :
				_proc($U.PadToMouseEvent(event.changedTouches[0]));
			}
		} else {
			clearTimeout(this.longPressTimeout);
			var t0 = event.touches[0];
			var t1 = event.touches[1];
			var x0 = this.mouseX(<any>t0);
			var y0 = this.mouseY(<any>t0);
			var x1 = this.mouseX(<any>t1);
			var y1 = this.mouseY(<any>t1);
			var x = (x0 + x1) / 2;
			var y = (y0 + y1) / 2;
			var dis = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
			if (this.zoomGesture) {
				this.Cn.translateANDzoom(x - this.zoomGesture.x, y - this.zoomGesture.y, x, y, dis / this.zoomGesture.d);
				this.zoomGesture.x = x;
				this.zoomGesture.y = y;
				this.zoomGesture.d = dis;
				this.Cn.computeAll();
				this.paint();
			} else {
				this.zoomGesture = {x: x, y: y, d: dis};
				this.pressedCoords = {x: NaN, y: NaN};
			}
		}
	}
}
