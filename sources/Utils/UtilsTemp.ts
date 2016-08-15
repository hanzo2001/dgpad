let w = <any>window;

declare var filepicker;

function getText(url:string, fn:(xhr:XMLHttpRequest)=>void) {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 && fn(xhr);
	};
	xhr.open('get',url,true);
	xhr.send();
}

function loadScriptTag(src:string, onload?:(e)=>void): HTMLScriptElement {
	var script = document.createElement('script');
	script.src = src;
	script.async = false;
	document.head.appendChild(script);
	return script;
}

function includeScript(src:string) {
	if (loadedScripts.indexOf(src) < 0) {
		loadScriptTag(applicationPath+src);
		loadedScripts.push(src);
	}
}

function loadLanguage(lang:string) {
	let dir = applicationPath+'NotPacked/lang/';
	loadScriptTag(dir+'LocalStrings.js');
	lang && loadScriptTag(dir+`LocalStrings_${lang.toUpperCase()}.js`);
}

function loadPicker(url:string, key:string) {
	loadScriptTag(url, ()=>filepicker.setKey(key));
}

function crawlForCanvas() {
	let canvas = document.getElementsByTagName("canvas");
	let c: HTMLElement, i=0, s=canvas.length;
	while (i<s) {
		c = canvas[i++];
		let id = c.id;
		// for every canvas with an ID starting with DGPad, initiate the canvas
		if (id && id.substr(0,5) === 'DGPad') {w.$U.initCanvas(id);}
	}
}

function echoSource() {
	let included = loadedScripts
	let k=0, i=0, s=loadedScripts.length;
	let xhr: XMLHttpRequest;
	let loader = function loader(xhr:XMLHttpRequest){
		console.log(xhr.responseText);
		loadedScripts[++i] && setTimeout(getText, 100, applicationPath+loadedScripts[i], loader);
	}
	getText(applicationPath+loadedScripts[i],loader);
}

function getCSS(ruleName:string, deleteFlag?:string): boolean | CSSStyleRule {
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

function scaleCSS(ruleName: string, propertiesCSV: string) {
	let cssRule = <CSSStyleRule>getCSS(ruleName);
	if (cssRule) {
		let props = propertiesCSV.split(",");
		let i=0, s=props.length;
		while (i<s) {
			let newSize = parseInt(cssRule.style.getPropertyValue(props[i])) * cssScale;
			cssRule.style.setProperty(props[i++],newSize+"px");
		};
	}
}

function modded_addEventListener(type:string, listener:(e:Event)=>void, useCapture?:boolean) {
	switch (type) {
		case 'mousedown':
		case 'mouseup':
		case 'mousemove':
			return;
		default:
			return original_addEventListener.call(this,type,listener,useCapture);
	}
}

function initEvents(ZC, cTag) {
	cTag.canvas = ZC;
	//$CANVAS = ZC;
	cTag.oncontextmenu = function() {
		return false;
	};
	cTag.addEventListener('touchmove', ZC.touchMoved, false);
	cTag.addEventListener('touchstart', ZC.touchStart, false);
	cTag.addEventListener('touchend', ZC.touchEnd, false);
	cTag.addEventListener('touchcancel', ZC.touchEnd, false);
	cTag.addEventListener('mousemove', ZC.mouseMoved, false);
	cTag.addEventListener('mousedown', ZC.mousePressed, false);
	cTag.addEventListener('mouseup', ZC.mouseReleased, false);

	cTag.addEventListener('click', ZC.mouseClicked, false);
	let mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
	cTag.addEventListener(mousewheelevt, ZC.mouseWheel, false);
	cTag.addEventListener('dragover', ZC.dragOver, false);
	cTag.addEventListener('drop', ZC.drop, false);
	// if (!Object.touchpad) {
	//     window.addEventListener("keypress", ZC.keypress, false);
	//     window.addEventListener("keydown", ZC.keydown, false);
	// }
}

function initCanvas(_id) {
	let ZC = new Canvas(_id);
	AllCanvas.push(ZC);
	let cTag = document.getElementById(_id);

	initEvents(ZC, cTag);

	Event.prototype.cursor = "default";
	Event.prototype.getCursor = function() {
		return (this.cursor);
	};
	Event.prototype.setCursor = function(cur) {
		this.cursor = cur;
	};

	if (cTag.hasAttribute("data-presentation")) {
		ZC.demoModeManager.setDemoMode(cTag.getAttribute("data-presentation").toLowerCase() === "true");
	};

	ZC.addTool(new PointConstructor());
	ZC.addTool(new SegmentConstructor());
	ZC.addTool(new LineConstructor());
	ZC.addTool(new RayConstructor());
	ZC.addTool(new MidPointConstructor());
	ZC.addTool(new CircleConstructor());
	ZC.addTool(new Circle1Constructor());
	ZC.addTool(new Circle3Constructor());
	ZC.addTool(new ParallelConstructor());
	ZC.addTool(new PlumbConstructor());
	ZC.addTool(new AreaConstructor());
	ZC.addTool(new PerpBisectorConstructor());
	ZC.addTool(new SymcConstructor());
	ZC.addTool(new SymaConstructor());
	ZC.addTool(new Circle3ptsConstructor());
	ZC.addTool(new Arc3ptsConstructor());
	ZC.addTool(new AngleBisectorConstructor());
	ZC.addTool(new LocusConstructor());
	ZC.addTool(new AngleConstructor());
	ZC.addTool(new FixedAngleConstructor());
	ZC.addTool(new NameMover());
	ZC.addTool(new CallProperty());
	ZC.addTool(new ObjectMover());
	ZC.addTool(new CallCalc());
	ZC.addTool(new FloatingObjectConstructor());
	ZC.addTool(new CallMagnet());
	ZC.addTool(new CallDepends());
	ZC.addTool(new CallList());
	ZC.addTool(new CallTrash());
	ZC.addTool(new AnchorConstructor());
	ZC.addTool(new NoAnchorConstructor());
	ZC.addTool(new VectorConstructor());
	ZC.addTool(new SpringConstructor());
	ZC.addTool(new BlocklyConstructor());
	ZC.addTool(new DGScriptNameConstructor());
	ZC.clearBackground();
	// ZC.blocklyManager.show();

	// new Names_panel(window.document.body,ZC.getConstruction().getNames);

	//    let eee=new SymbolicCompute();
	////    let sss=eee.simplify("times(3,pow(x,minus(3,1)))");
	//    let sss=eee.simplify("power(x,minus(3,1))");
	//    console.log(sss);
}

let AllCanvas = [];
let debugSource = false;
let touchpadFlag = false;
let style = document.createElement('link');
let canvas = document.createElement("canvas");
let scripts = document.getElementsByTagName('script');
let numCanvas = document.getElementsByTagName("canvas").length;
let lastScript = scripts[scripts.length-1];
let lastScriptData = {
	lang: lastScript.dataset['lang'] || (navigator.language||navigator.userLanguage).split("-")[0],
	width: ~~lastScript.dataset['width'],
	height: ~~lastScript.dataset['height'],
	source: lastScript.dataset['source'],
	presentation: lastScript.dataset['presentation'],
	hidectrlpanel: lastScript.dataset['hidectrlpanel']
};
let applicationPath: string = ((p) => {p.pop();return p.join('/')+'/'})(lastScript.src.split('/'));
let loadedScripts: string[] = [];
let cssScale: number;
let original_addEventListener = Element.prototype.addEventListener;
let original_windowOpen = window.open;
let filepickerUrl = 'http://api.filepicker.io/v1/filepicker.js';
let filepickerKey = 'A11o-dWi-S-ePxgyeWpfyz';
let standalone = window.navigator.standalone;
let userAgent = window.navigator.userAgent.toLowerCase();
let blockMouseEvents = navigator.userAgent.toLowerCase().indexOf('android') > -1;
let safari = /safari/.test(userAgent);
let ios = /iphone|ipod|ipad/.test(userAgent);
let filePickerFrame = null;

if (blockMouseEvents) {
	Element.prototype.addEventListener = modded_addEventListener;
}

if (!(<any>String.prototype).startsWith) {
	(<any>String.prototype).startsWith = function(str) {return (this.indexOf(str) === 0);};
}

try {
	// I have no clue what APPLICATION is or how this works. Boolean members?
	w.$APPLICATION = (window.parent && window.parent.$APPLICATION);
	// I still don't know what iOS_APPLICATION is used for
	w.$iOS_APPLICATION = (window.parent && window.parent.$iOS_APPLICATION);
} catch (e) {}

style.rel = 'stylesheet';
style.href = applicationPath+'NotPacked/styles.css';
document.head.appendChild(style);
loadLanguage(lastScriptData.lang);
includeScript('Main.js');
loadPicker(filepickerUrl,filepickerKey);
if (!standalone && !safari) {
	window.open = (url) => {
		// depends on `ControlPanel/windowOpenIFrame.ts`
		filePickerFrame = new windowOpenIFrame(url);
		return window;
	};
}
if ((navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPhone|iPad|iPod/i))) {//iOS & android
	touchpadFlag = true;
} else if (window.navigator.msPointerEnabled) {//Win8
	touchpadFlag = true;
}
if (lastScriptData.width && lastScriptData.height) {
	canvas.width = lastScriptData.width;
	canvas.height = lastScriptData.height;
}
if (lastScriptData.source) {canvas.dataset['source'] = lastScriptData.source;}
if (lastScriptData.hidectrlpanel) {canvas.dataset['hidectrlpanel'] = lastScriptData.hidectrlpanel;}
if (lastScriptData.presentation) {canvas.dataset['presentation'] = lastScriptData.presentation;}
canvas.id = 'DGPad'+numCanvas;
lastScript.parentNode.insertBefore(canvas,lastScript);

window.addEventListener('load',function() {
	crawlForCanvas();
	debugSource && echoSource();
},false);

w.$BODY_SCRIPT = lastScript;
w.$ECHO_SOURCE = debugSource;
w.$ALERT = w.alert;
w.alert = function () {};
w.$STANDARD_KBD = Object.create(null);
w.$STOP_MOUSE_EVENTS = blockMouseEvents;
w.$SCALE = cssScale;
w.$FPICKERFRAME = filePickerFrame;
w.$APP_PATH = applicationPath;
w.$INCLUDED_FILES = loadedScripts;
w.$HEADSCRIPT = loadScriptTag;
w.$INCLUDE = includeScript;
w.$LOADLANGUAGE = loadLanguage;
w.$LOADPICKER = loadPicker;
w.$MAIN_INIT = crawlForCanvas;
w.$ECHOSRC = echoSource;
w.$GETCSS = getCSS;
w.$SCALECSS = scaleCSS;
w.$TOUCHPAD = touchpadFlag;
w.$APPLICATION = false;
w.$iOS_APPLICATION = false;