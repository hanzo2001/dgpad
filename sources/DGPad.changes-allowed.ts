let w = <any>window;

declare var filepicker;

let scripts = document.getElementsByTagName("script");
let script = scripts[scripts.length-1];
w.$BODY_SCRIPT = <HTMLScriptElement>script;
/*
 * why is this checked? is there another entrypoint that predefines APP_PATH?
 */
if (!w.$APP_PATH) {
	w.$ECHO_SOURCE = true;
	// overwrite the alert method to silence filepicker error messages?
	w.$ALERT = w.alert;
	w.alert = function () {};
	try {
		// I have no clue what APPLICATION is or how this works. Boolean members?
		w.$APPLICATION = (window.parent && window.parent.$APPLICATION);
		// I still don't know what iOS_APPLICATION is used for
		w.$iOS_APPLICATION = (window.parent && window.parent.$iOS_APPLICATION);
	} catch (e) {}
	w.$STANDARD_KBD = Object.create(null);
	// ??
	w.$STOP_MOUSE_EVENTS = (navigator.userAgent.toLowerCase().indexOf("android") > -1);
	w.$SCALE = 1;
	w.$FPICKERFRAME = null;
	// ?? get the second to last element from the path of the last script tag ??
	w.$APP_PATH = (function(path){return path[path.length-2] + '/';}(script.src.split('/')));
	w.$INCLUDED_FILES = [];
	/**
	 * Loads a js file
	 */
	w.$HEADSCRIPT = function(src:string) {
		var script = document.createElement('script');
		script.src = src;
		script.async = false;
		document.head.appendChild(script);
		return script;
	}
	/**
	 * Loads and registers a js file. Cannot load same file twice
	 */
	w.$INCLUDE = function(src, _external?) {
		if (w.$INCLUDED_FILES.indexOf(src) < 0) {
			w.$HEADSCRIPT(w.$APP_PATH + src);
			w.$INCLUDED_FILES.push(src);
		}
	};
	/**
	 * ?? Loads the Main.js file ??
	 */
	w.$LOADMAIN = function() {
		w.$HEADSCRIPT(w.$APP_PATH + "Main.js");
	}
	/**
	 * A convoluted way of determining the language automagically...
	 * Determine the language through the script tag's' data-lang attribute
	 * Default: the UA determines the language...
	 * I probably should let the user define it, not the agent
	 */
	w.$LOADLANGUAGE = function() {
		let script = w.$HEADSCRIPT(w.$APP_PATH + "NotPacked/lang/LocalStrings.js");
		let lang: string;
		if (w.$BODY_SCRIPT.hasAttribute("data-lang")) {
			lang = w.$BODY_SCRIPT.getAttribute("data-lang").toUpperCase();
		} else {
			lang = (navigator.language||navigator.userLanguage).toUpperCase().split("-")[0];
		}
		w.$HEADSCRIPT(w.$APP_PATH + "NotPacked/lang/LocalStrings_" + lang + ".js");
	};
	/**
	 * Loads the library FilePicker and sets the key
	 * I still need to understand filepicker
	 */
	w.$LOADPICKER = function() {
		let script = w.$HEADSCRIPT("http://api.filepicker.io/v1/filepicker.js");
		script.onload = function() {
			filepicker.setKey('A11o-dWi-S-ePxgyeWpfyz');
		};
	};
	/**
	 * Initializes all canvas in the document that have an ID that starts with 'DGPad'
	 */
	w.$MAIN_INIT = function() {
		let canvas = document.getElementsByTagName("canvas");
		let c: HTMLElement, i=0, s= canvas.length;
		while (i<s) {
			c = canvas[i++];
			let id: string = c.getAttribute('ID');
			// ES6! String.prototype.startsWith
			if (id && id.substr(0,5) === 'DGPad') {w.$U.initCanvas(id);}
		}
	};
	/**
	 * Seems to print js files to console.log
	 */
	w.$ECHOSRC = function() {
		let included = w.$INCLUDED_FILES
		let k=0, i=0, s=included.length;
		let xhr: XMLHttpRequest;
		while (i<s) {
			xhr = new XMLHttpRequest();
			xhr.open("GET",w.$APP_PATH+included[i], true);
			xhr.send();
			//xhr.order = i++;// what is this for??
			// ?? logging info ?? does this really just print out a script file to console.log
			xhr.onload = function(e: Event) {
				k++;
				included[i] = xhr.responseText;
				if (k === included.length) {
					// ?? what is this nonsense for? debugging ??
					included.push("var $MAIN_INIT = " + included.toString());
					included.push("window.onload = function() {\n$MAIN_INIT();\n};");
					console.log(included.join("\n"));
				}
			}
			i++;
		}
	};
	/**
	 * Either fetches a cssRule or attempts to delete one
	 * (ruleName: string, deleteFlag?: string) => boolean | CSSStyleRule
	 * deleteFlag should be an optional bool
	 */
	w.$GETCSS = function(ruleName, deleteFlag?): boolean | CSSStyleRule {
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
						if (cssRule && cssRule.selectorText.toLowerCase() == ruleName) {
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
	};
	/**
	 * Scales the ruleName to the global scale size
	 */
	w.$SCALECSS = function(ruleName: string, propertiesCSV: string) {
		let cssRule = w.$GETCSS(ruleName);
		if (cssRule) {
			let props = propertiesCSV.split(",");
			let i=0, s=props.length;
			while (i<s) {
				let newSize = parseInt(cssRule.style.getPropertyValue(props[i])) * w.$SCALE;
				cssRule.style.setProperty(props[i++],newSize+"px");
			};
		}
	};

	/**
	 * Rewrites the addEventListener method
	 * eliminates mousedown, mouseup and mousemove events
	 * Only for Android app: le java doit gérer les mouse et touch events.
	 */
	(function() {
		if (w.$STOP_MOUSE_EVENTS) {
			let original_addEventListener = Element.prototype.addEventListener;
			Element.prototype.addEventListener = function(type, listener, useCapture) {
				switch (type) {
					case "mousedown": return;
					case "mouseup":   return;
					case "mousemove": return;
					default:
						return original_addEventListener.call(this,type,listener,useCapture);
				}
			};
		}
	}());
	/**
	 * Initializes the style, LANG, MAIN, FilePicker, FPICKERFRAME
	 */
	(function() {
		let style = document.createElement('link');
		style.rel = "stylesheet";
		style.type = "text/css";
		style.href = w.$APP_PATH+"NotPacked/styles.css";
		document.head.appendChild(style);
		/******** Décommenter le jour où on met en place un "scale" : *********
			var img=document.createElement('img');
			img.onerror = function() {
				$SCALECSS(".pluginsListDIV", "width,height,left,top,border-radius");
				$SCALECSS(".toolsListDIV", "width,height,left,top,border-radius");
				$SCALECSS(".macroLIclass", "padding,font-size");
				$SCALECSS(".macroLIclassComment", "margin-top,margin-left,font-size");
				$SCALECSS(".macroPropsDIV", "width,left,height,border-radius");
				$SCALECSS(".macroLabelDiv", "padding");
				$SCALECSS(".macroLabelImage", "width,height");
				$SCALECSS(".macroLabelSpan", "margin-left,font-size");
				$SCALECSS(".macroExecInput", "width,height,font-size");
				$SCALECSS(".macroAddImage", "width,top,right");
				$SCALECSS(".macroPropsNameDIV", "left,top,right,height,border-radius");
				$SCALECSS(".macroPropsNameINPUT", "width,top,left,height,border-radius,font-size");
				$SCALECSS(".macroPropsViewport", "width,top,left,bottom");
				$SCALECSS(".macroPropsInnerDIV", "width,top,left,bottom");
				$SCALECSS(".macroListViewport", "width,top,left,bottom");
				$SCALECSS(".macroLIclassComment", "margin-top,margin-bottom,margin-left,font-size");
				$SCALECSS(".macroLIclass", "padding,font-size");
				$SCALECSS(".macroLIclassSel", "padding,font-size");
			};
			img.src=style.href;
		*/
		w.$LOADLANGUAGE();
		w.$LOADMAIN();
		w.$LOADPICKER();
		let standalone = window.navigator.standalone;
		let userAgent = window.navigator.userAgent.toLowerCase();
		let safari = /safari/.test(userAgent);
		let ios = /iphone|ipod|ipad/.test(userAgent);
		// must read: http://stackoverflow.com/questions/21125337/how-to-detect-if-web-app-running-standalone-on-chrome-mobile
		if (!standalone && !safari) {
			// DGPad s'ouvre dans l'iApp :
			window.open = function(url) {
				w.$FPICKERFRAME = new windowOpenIFrame(url);
			};
		}
	})();

	/**
	 * The following extends the Object constructor!! WHY??? why not global vars like always???
	 * Found reference: Ghost.ts -> paintLines
	 */
	// Est-ce une tablette tactile ? :
	Object.touchpad = false;
	if ((navigator.userAgent.match(/Android/i)) || (navigator.userAgent.match(/iPhone|iPad|iPod/i))) {
		//iOS & android
		Object.touchpad = true;
	} else if (window.navigator.msPointerEnabled) {
		//Win8
		Object.touchpad = true;
	}
	// ES6 functionality, may not be required!!
	String.prototype.startsWith = function(str) {
		return (this.indexOf(str) === 0);
	};
	/**
	 * Initializes the canvas (MAIN_INIT) and checks if it prints the source files
	 */
	window.onload = function() {
		w.$MAIN_INIT();
		if (w.$ECHO_SOURCE) {w.$ECHOSRC();}
	};
}

// Création du canvas associé :
(function() {
	// On crée le canvas :
	let canvas = document.createElement("canvas");
	// Transfert sur le canvas de la largeur et hauteur éventuelle :
	let width = w.$BODY_SCRIPT.getAttribute("data-width");
	let height = w.$BODY_SCRIPT.getAttribute("data-height");
	if (width && height) {
		canvas.setAttribute("width", width);
		canvas.setAttribute("height",height);
	}
	// Transfert sur le canvas du contenu de la figure (base64) :
	let source = w.$BODY_SCRIPT.getAttribute("data-source");
	if (source) {
		canvas.setAttribute("data-source",source);
	}
	// Affichage du tableau de bord :
	let hidectrlpanel = w.$BODY_SCRIPT.getAttribute("data-hidectrlpanel");
	if (hidectrlpanel) {
		canvas.setAttribute("data-hidectrlpanel",hidectrlpanel);
	}
	// Transfert sur le canvas du mode de présentation :
	let presentation = w.$BODY_SCRIPT.getAttribute("data-presentation");
	if (presentation) {
		canvas.setAttribute("data-presentation",presentation);
	}

	let numCanvas = document.getElementsByTagName("canvas").length;
	canvas.setAttribute("id","DGPad"+numCanvas);
	w.$BODY_SCRIPT.parentNode.insertBefore(canvas,w.$BODY_SCRIPT);
})();
