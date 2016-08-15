/// <reference path="./typings/iApplication.d.ts" />

declare var filepicker;

type ScriptData = {
	lang: string,
	width: number,
	height: number,
	source: string,
	presentation: string,
	hidectrlpanel: string
};

export class Application {
	private static original_addEventListener: (type:string, fn:(e:MSGestureEvent)=>void, capture?:boolean) => void;
	private static original_windowOpen: (url:string) => Window;
	private numCanvas: number;
	private lastScript: HTMLScriptElement;
	private lastScriptData: ScriptData;
	private loadedScripts: string[];
	private blockMouseEvents: boolean;
	applicationCanvas: Canvas[] = [];
	debugSource: boolean;
	touchpadFlag: boolean;
	canvas: HTMLCanvasElement;
	scripts: NodeListOf<HTMLScriptElement>;
	applicationPath: string;
	cssScale: number;
	filepickerUrl: string;
	filepickerKey: string;
	standalone: boolean;
	userAgent: string;
	safari: boolean;
	ios: boolean;
	filePickerFrame;
	application: boolean;
	ios_application: boolean;
	constructor() {
		this.application = false;
		this.ios_application = false;
		this.debugSource = false;
		this.touchpadFlag = false;
		this.canvas = document.createElement("canvas");
		this.scripts = document.getElementsByTagName('script');
		this.numCanvas = document.getElementsByTagName("canvas").length;
		this.lastScript = this.scripts[this.scripts.length-1];
		this.lastScriptData = {
			lang: this.lastScript.dataset['lang'] || (navigator.language||navigator.userLanguage).split("-")[0],
			width: ~~this.lastScript.dataset['width'],
			height: ~~this.lastScript.dataset['height'],
			source: this.lastScript.dataset['source'],
			presentation: this.lastScript.dataset['presentation'],
			hidectrlpanel: this.lastScript.dataset['hidectrlpanel']
		};
		this.applicationPath = ((p) => {p.pop();return p.join('/')+'/'})(this.lastScript.src.split('/'));
		this.loadedScripts = [];
		this.cssScale = 1;
		Application.original_addEventListener = Element.prototype.addEventListener;
		Application.original_windowOpen = window.open;
		this.filepickerUrl = 'http://api.filepicker.io/v1/filepicker.js';
		this.filepickerKey = 'A11o-dWi-S-ePxgyeWpfyz';
		this.standalone = (<any>window.navigator).standalone || false;
		this.userAgent = window.navigator.userAgent.toLowerCase();
		this.blockMouseEvents = navigator.userAgent.toLowerCase().indexOf('android') > -1;
		this.safari = /safari/.test(this.userAgent);
		this.ios = /iphone|ipod|ipad/.test(this.userAgent);
		this.filePickerFrame = null;

		if (this.blockMouseEvents) {
			Element.prototype.addEventListener = Application.modded_addEventListener;
		}
		if (!String.prototype.startsWith) {
			String.prototype.startsWith = function(str) {return (this.indexOf(str) === 0);};
		}
		Event.prototype.cursor = "default";
		Event.prototype.getCursor = function() {return (this.cursor);};
		Event.prototype.setCursor = function(cursor:string) {this.cursor = cursor;};
		if (!this.standalone && !this.safari) {
			window.open = (url) => {
				this.filePickerFrame = new windowOpenIFrame(url);// depends on `ControlPanel/windowOpenIFrame.ts`
				return window;
			};
		}

		let style = document.createElement('link');
		style.rel = 'stylesheet';
		style.href = this.applicationPath+'NotPacked/styles.css';
		document.head.appendChild(style);

		let dir = this.applicationPath+'NotPacked/lang/';
		let lang = this.lastScriptData.lang;
		Application.loadScriptTag(dir+'LocalStrings.js');
		lang && Application.loadScriptTag(dir+`LocalStrings_${lang.toUpperCase()}.js`);

		this.includeScript('Main.js');

		Application.loadScriptTag(this.filepickerUrl, ()=>filepicker.setKey(this.filepickerKey));
		if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {//iOS & android
			this.touchpadFlag = true;
		} else if (window.navigator.msPointerEnabled) {//Win8
			this.touchpadFlag = true;
		}
		if (this.lastScriptData.width && this.lastScriptData.height) {
			this.canvas.width = this.lastScriptData.width;
			this.canvas.height = this.lastScriptData.height;
		}
		if (this.lastScriptData.source) {this.canvas.dataset['source'] = this.lastScriptData.source;}
		if (this.lastScriptData.hidectrlpanel) {this.canvas.dataset['hidectrlpanel'] = this.lastScriptData.hidectrlpanel;}
		if (this.lastScriptData.presentation) {this.canvas.dataset['presentation'] = this.lastScriptData.presentation;}
		this.canvas.id = 'DGPad'+this.numCanvas;
		this.lastScript.parentNode.insertBefore(this.canvas,this.lastScript);
		let w = <any>window;
		w.$BODY_SCRIPT = this.lastScript;
		w.$ECHO_SOURCE = this.debugSource;
		w.$ALERT = w.alert;
		w.alert = function () {};
		w.$STANDARD_KBD = Object.create(null);
		w.$STOP_MOUSE_EVENTS = this.blockMouseEvents;
		w.$SCALE = this.cssScale;
		w.$FPICKERFRAME = this.filePickerFrame;
		w.$APP_PATH = this.applicationPath;
		w.$INCLUDED_FILES = this.loadedScripts;
		w.$HEADSCRIPT = Application.loadScriptTag;
		w.$INCLUDE = this.includeScript;
		w.$LOADLANGUAGE = this.loadLanguage;
		//w.$LOADPICKER = this.loadPicker;
		w.$MAIN_INIT = this.crawlForCanvas;
		w.$ECHOSRC = this.echoSource;
		w.$GETCSS = this.getCSS;
		w.$SCALECSS = this.scaleCSS;
		w.$TOUCHPAD = this.touchpadFlag;
		w.$APPLICATION = false;
		w.$iOS_APPLICATION = false;
	}

	initCanvas(id:string) {
		let canvas = new Canvas(id);
		this.applicationCanvas.push(canvas);
		let e = document.getElementById(id);
		e.oncontextmenu = () => false;
		let wheelevent = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
		e.addEventListener(wheelevent,   (e) => canvas.mouseWheel(e), false);
		e.addEventListener('touchmove',  (e) => canvas.touchMoved(e), false);
		e.addEventListener('touchstart', (e) => canvas.touchStart(e), false);
		e.addEventListener('touchend',   (e) => canvas.touchEnd(e), false);
		e.addEventListener('touchcancel',(e) => canvas.touchEnd(e), false);
		e.addEventListener('mousemove',  (e) => canvas.mouseMoved(e), false);
		e.addEventListener('mousedown',  (e) => canvas.mousePressed(e), false);
		e.addEventListener('mouseup',    (e) => canvas.mouseReleased(e), false);
		e.addEventListener('click',      (e) => canvas.mouseClicked(e), false);
		e.addEventListener('dragover',   (e) => canvas.dragOver(e), false);
		e.addEventListener('drop',       (e) => canvas.drop(e), false);
		// if (!this.touchpadFlag) {
		//	window.addEventListener("keypress", (e) => canvas.keypress(e), false);
		//	window.addEventListener("keydown",  (e) => canvas.keydown(e), false);
		// }
		if (this.lastScriptData.presentation) {
			canvas.demoModeManager.setDemoMode(this.lastScriptData.presentation.toLowerCase() === "true");
		};
		/*
		canvas.addTool(new PointConstructor());
		canvas.addTool(new SegmentConstructor());
		canvas.addTool(new LineConstructor());
		canvas.addTool(new RayConstructor());
		canvas.addTool(new MidPointConstructor());
		canvas.addTool(new CircleConstructor());
		canvas.addTool(new Circle1Constructor());
		canvas.addTool(new Circle3Constructor());
		canvas.addTool(new ParallelConstructor());
		canvas.addTool(new PlumbConstructor());
		canvas.addTool(new AreaConstructor());
		canvas.addTool(new PerpBisectorConstructor());
		canvas.addTool(new SymcConstructor());
		canvas.addTool(new SymaConstructor());
		canvas.addTool(new Circle3ptsConstructor());
		canvas.addTool(new Arc3ptsConstructor());
		canvas.addTool(new AngleBisectorConstructor());
		canvas.addTool(new LocusConstructor());
		canvas.addTool(new AngleConstructor());
		canvas.addTool(new FixedAngleConstructor());
		canvas.addTool(new NameMover());
		canvas.addTool(new CallProperty());
		canvas.addTool(new ObjectMover());
		canvas.addTool(new CallCalc());
		canvas.addTool(new FloatingObjectConstructor());
		canvas.addTool(new CallMagnet());
		canvas.addTool(new CallDepends());
		canvas.addTool(new CallList());
		canvas.addTool(new CallTrash());
		canvas.addTool(new AnchorConstructor());
		canvas.addTool(new NoAnchorConstructor());
		canvas.addTool(new VectorConstructor());
		canvas.addTool(new SpringConstructor());
		canvas.addTool(new BlocklyConstructor());
		canvas.addTool(new DGScriptNameConstructor());
		//*/
		canvas.clearBackground();
		// canvas.blocklyManager.show();
		// new Names_panel(window.document.body,canvas.getConstruction().getNames);
	}

	static loadScriptTag(src:string, onload?:(e)=>void): HTMLScriptElement {
		var script = document.createElement('script');
		script.src = src;
		script.async = false;
		document.head.appendChild(script);
		return script;
	}
	static get(url:string, fn:(xhr:XMLHttpRequest)=>void) {
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && fn(xhr);
		};
		xhr.open('get',url,true);
		xhr.send();
	}
	private includeScript(src:string) {
		if (this.loadedScripts.indexOf(src) < 0) {
			Application.loadScriptTag(this.applicationPath+src);
			this.loadedScripts.push(src);
		}
	}
	private loadLanguage(lang:string) {
		let dir = this.applicationPath+'NotPacked/lang/';
		Application.loadScriptTag(dir+'LocalStrings.js');
		lang && Application.loadScriptTag(dir+`LocalStrings_${lang.toUpperCase()}.js`);
	}
	private crawlForCanvas() {
		let canvas = document.getElementsByTagName("canvas");
		let i=0, s=canvas.length;
		while (i<s) {
			let id = this.canvas[i++].id;
			// for every canvas with an ID starting with DGPad, initiate the canvas
			if (id && id.substr(0,5) === 'DGPad') {this.initCanvas(id);}
		}
		this.numCanvas = s;
	}
	private echoSource() {
		let i=0;
		function loader(xhr:XMLHttpRequest) {
			console.log(xhr.responseText);
			this.loadedScripts[++i] && setTimeout(Application.get, 100, this.applicationPath+this.loadedScripts[i], loader);
		}
		Application.get(this.applicationPath+this.loadedScripts[i],loader);
	}
	private getCSS(ruleName:string, deleteFlag?:string): boolean | CSSStyleRule {
		ruleName = ruleName.toLowerCase();
		if (document.styleSheets) {
			let k: number, i=0, s=document.styleSheets.length;
			let styleSheet: CSSStyleSheet;
			var cssRule: CSSStyleRule;
			if (deleteFlag === 'delete') {
				while (i<s) {
					k = 0;
					cssRule = null;
					styleSheet = <CSSStyleSheet>document.styleSheets[i];
					do {
						cssRule = <CSSStyleRule>(styleSheet.cssRules ? styleSheet.cssRules[k] : styleSheet.rules[k]);
						if (cssRule && cssRule.selectorText.toLowerCase() === ruleName) {
							styleSheet.cssRules ? styleSheet.deleteRule(k) : styleSheet.removeRule(k);
							return true;
						}
						k++;
					} while (cssRule);
					return false;
				}
			}
			while (i<s) {
				k = 0;
				cssRule = null;
				styleSheet = <CSSStyleSheet>document.styleSheets[i];
				do {
					cssRule = <CSSStyleRule>(styleSheet.cssRules ? styleSheet.cssRules[k] : styleSheet.rules[k]);
					if (cssRule && cssRule.selectorText.toLowerCase() == ruleName) {return cssRule;}
					k++;
				} while (cssRule);
				return null;
			}
		}
		return false;
	}
	private scaleCSS(ruleName: string, propertiesCSV: string) {
		let cssRule = <CSSStyleRule>this.getCSS(ruleName);
		if (cssRule) {
			let props = propertiesCSV.split(",");
			let i=0, s=props.length;
			while (i<s) {
				let newSize = parseInt(cssRule.style.getPropertyValue(props[i])) * this.cssScale;
				cssRule.style.setProperty(props[i++],newSize+"px");
			};
		}
	}
	private static modded_addEventListener(type:string, listener:(e:Event)=>void, useCapture?:boolean) {
		switch (type) {
			case 'mousedown':
			case 'mouseup':
			case 'mousemove':
				return;
			default:
				return this.original_addEventListener.call(this,type,listener,useCapture);
		}
	}
}