//import {ControlPanel} from './ControlPanel';
//import {PointConstructor} from './PointConstructor';
var $P = (<any>window).$P;
var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $BODY_SCRIPT = (<any>window).$BODY_SCRIPT;
var $IPADOPENFILE = (<any>window).$IPADOPENFILE;
var $APP_PATH = (<any>window).$APP_PATH;
var $DGPAD_FIGURE = (<any>window).$DGPAD_FIGURE;
var ControlPanel;
var PointConstructor;

export class Canvas {
	private ID: string;
	private docObject: HTMLElement;
	private bounds = null;
	private iPadDidFirstEnterBackground = true;
	private width = 0;
	private height = 0;
	private mainpanel;
	private context;
	private mousedown = false;
	private PC;
	private OC;
	private draggedObject = null;
	private pressedFilter = null;
	private movedFilter = null;
	private releasedFilter = null;
	private actualCoords = {
			x: NaN,
			y: NaN
	};
	private dragCoords = null;
	private pressedCoords = null;
	private longPressTimeout = 0;
	private zoomGesture = null;
	private previewEvent = null;
	private interpreter = null;
	private prefs = null;
	private createSandbox = null;
	private namesManager;
	private macrosManager;
	private textManager;
	constructor(_id) {
		this.ID = _id;
		this.docObject = document.getElementById(_id);
		this.bounds = null;
		this.iPadDidFirstEnterBackground = true;
		this.prefs = $P.clone();
		this.width = 0;
		this.height = 0;
		this.docObject.style.backgroundColor = this.prefs.background.color;
		initBounds();
		this.mainpanel = new ControlPanel(this);
		this.context = getNewContext();
		this.mousedown = false;
		this.PC = new PointConstructor();
		this.OC = this.PC;
		this.draggedObject = null;
		this.pressedFilter = null;
		this.movedFilter = null;
		this.releasedFilter = null;
		this.actualCoords = {
				x: NaN,
				y: NaN
		};
		this.dragCoords = null;
		this.pressedCoords = null;
		this.longPressTimeout = 0;
		this.zoomGesture = null;
		this.previewEvent = null;
		this.interpreter = null;
		$IPADOPENFILE = function(_s) {
			setTimeout(function() {this.OpenFile("", $U.base64_decode(_s));}, 1);
			return "file_opened";
		};
		this.createSandbox = (function() {
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
			el.onload = function() {
				this.interpreter = new window.frames[ID].Interpreter(window,this);
				this.interpreter.owner = el.contentWindow;
				this.interpreter.copyNameSpace();
				this.interpreter.setCaller(this.blocklyManager); // For print purpose
				var request = new XMLHttpRequest();
				request.open("GET", $APP_PATH + "NotPacked/plug-ins.js", true);
				request.send();
				request.onload = function(e) {
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
				}.bind(this);
				//            // Chargement des plug-ins :
				//            interpreter.LoadPlugins($U.loadFile($APP_PATH + "NotPacked/plug-ins.js"));
				//
				//            // Si le canvas a une figure attachée (base64) :
				//            if (docObject.hasAttribute("data-source")) {
				//                this.OpenFile("", $U.base64_decode(docObject.getAttribute("data-source")));
				//            } else {
				//                // Si une figure a été postée sur index.php, on l'ouvre :
				//                try {
				//                    this.OpenFile("", $U.base64_decode($DGPAD_FIGURE));
				//                } catch (e) {
				//                }
				//            }
			}.bind(this);
			//        this.sandboxFrame=el;
		}.call(this));
	}
	refreshKeyboard() {
		if (this.namesManager.isVisible()) {
			this.namesManager.refresh();
		}
	}
	getID() {
		return this.ID;
	}
	getDocObject() {
		return this.docObject;
	}
	getSource() {
		return (this.macrosManager.getSource() + Cn.getSource() + this.textManager.getSource())
	}
	getHTML(hide_ctrl_panel) {
		var _w = width;
		var _h = height;
		var _src = this.getSource();
		_src = $U.base64_encode(_src);
		var d = new Date();
		var _frm = "dgpad_frame_" + d.getTime();
		var s = '<form action="http://www.dgpad.net/index.php" target="' + _frm + '" method="post" width="' + _w + '" height="' + (_h + 40) + '">';
		s += '<input type="hidden" name="file_content" value="' + _src + '">';
		if (hide_ctrl_panel)
				s += '<input type="hidden" name="hide_ctrlpanel" value="true">';
		s += '<div style="text-align:center;position:relative;width:' + _w + 'px;height:' + _h + 'px;background-color:rgba(200,200,200,1)">';
		s += '<div style="height:40px;line-height:40px;vertical-align: baseline;">';
		s += '<input type="submit" value="' + $L.export_button + '" style="display: inline-block;zoom: 1;*display: inline;vertical-align: baseline;margin: 0 2px;outline: none;cursor: pointer;text-align: center;text-decoration: none;font: 14px/100% Arial, Helvetica, sans-serif;padding: .5em 2em .55em;text-shadow: 0 1px 1px rgba(0,0,0,.3);-webkit-border-radius: .5em;-moz-border-radius: .5em;border-radius: .5em;-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);-moz-box-shadow: 0 1px 2px rgba(0,0,0,.2);box-shadow: 0 1px 2px rgba(0,0,0,.2);color: #d7d7d7;border: solid 1px #333;background: #333;background: -webkit-gradient(linear, left top, left bottom, from(#666), to(#000));background: -moz-linear-gradient(top,  #666,  #000);">';
		s += '</div>';
		s += '<iframe name="' + _frm + '" width="' + _w + '" height="' + _h + '" src="about:blank" scrolling="no" frameborder="no"></iframe>';
		s += '</div>';
		s += '</form>';
		return s;
	}
	getHTMLJS(hide_ctrl_panel) {
		var _w = width;
		var _h = height;
		var _src = this.getSource();
		_src = $U.base64_encode(_src);
		var d = new Date();
		var _frm = "dgpad_frame_" + d.getTime();
		var s = '<form action="http://www.dgpad.net/index.php" target="' + _frm + '" method="post" width="' + _w + '" height="' + _h + '">';
		s += '<input type="hidden" name="file_content" value="' + _src + '">';
		if (hide_ctrl_panel)
				s += '<input type="hidden" name="hide_ctrlpanel" value="true">';
		s += '<iframe name="' + _frm + '" width="' + _w + '" height="' + _h + '" src="about:blank" scrolling="no" frameborder="no" oNlOAd="if (!this.parentNode.num) {this.parentNode.submit();this.parentNode.num=true}"></iframe>';
		s += '</form>';
		return s;
	}
	load64(_str) {
		this.getConstruction().deleteAll();
		this.macrosManager.clearTools();
		this.textManager.clear();
		this.trackManager.clear();
		this.Interpret($U.base64_decode(_str));
		this.forceArrowBtn();
	}
	saveToLocalStorage(is_iPad) {
		if (Cn.isEmpty())
				return;
		var t = {};
		var now = new Date();
		t.date = now.toLocaleString();
		t.width = width;
		t.height = height;
		t.lock = false;
		t.src = $U.base64_encode(this.getSource());
		//        docObject.style.visibility = "hidden";
		var buff = document.createElement("canvas");
		buff.setAttribute("width", $P.localstorage.iconwidth);
		buff.setAttribute("height", $P.localstorage.iconwidth);
		buff.style.setProperty("image-rendering", "-moz-crisp-edges");
		buff.style.setProperty("image-rendering", "-webkit-optimize-contrast");
		var scale = 1.5 * $P.localstorage.iconwidth / Math.max(width, height);
		Cn.zoom(width / 2, height / 2, scale);
		Cn.computeAll();
		this.paint();
		var w = width / 1.5;
		var h = height / 1.5;
		var d = $P.localstorage.iconwidth;
		var ctx = buff.getContext('2d');
		ctx.imageSmoothingEnabled = true;
		ctx.mozImageSmoothingEnabled = true;
		ctx.drawImage(docObject, (d - w) / 2, (d - h) / 2, w, h);
		t.img = buff.toDataURL();
		Cn.zoom(width / 2, height / 2, 1 / scale);
		if ((is_iPad) && (!iPadDidFirstEnterBackground)) {
				localStorage.setItem($P.localstorage.base + "1", JSON.stringify(t));
		} else {
				var storageError = false;
				do {
						storageError = false;
						try {
								$U.shiftLocalStorages();
								localStorage.setItem($P.localstorage.base + "1", JSON.stringify(t));
						} catch (err) {
								if (err.name === "QuotaExceededError") {
										$U.clearOneLocalStorage();
										storageError = true;
								} else {
										localStorage.setItem($P.localstorage.base + "1", JSON.stringify(t));
								}
						}
				} while (storageError);
		}
	}
// Utilisé pour régler un bug d'Android (voir méthode resizeWindow) :
var cloneCanvas = function() {
		var parent = docObject.parentNode;
		var newcanvas = document.createElement('canvas');
		parent.insertBefore(newcanvas, docObject);
		parent.removeChild(docObject);
		newcanvas.setAttribute("id", ID);
		docObject = newcanvas;
		$U.initEvents(me, docObject);
		initBounds();
		context = getNewContext();
	}
var setFullScreen = function() {
		var cl, ct, cw, ch;
		var ww = window.innerWidth;
		var wh = window.innerHeight - 1;
		cw = ww - 2 * this.prefs.size.marginwidth;
		ch = wh - 2 * this.prefs.size.marginheight;
		ct = (wh - ch) / 2;
		cl = (ww - cw) / 2;
		docObject.style.position = "fixed";
		docObject.setAttribute("width", cw);
		docObject.setAttribute("height", ch);
		docObject.style.top = ct + "px";
		docObject.style.left = cl + "px";
		docObject.style.width = cw + "px";
		docObject.style.height = ch + "px";
		width = docObject.clientWidth;
		height = docObject.clientHeight;
		bounds = {
				"left": cl,
				"top": ct,
				"width": cw,
				"height": ch
		};
		if (Object.touchpad) {
				window.scrollTo(0, 0);
		}
	}
// Appelée lorsqu'on change la taille de la fenêtre (ordinateur)
// ou bien lorsqu'on change d'orientation sur une tablette :
var resizeWindow = function() {
		setFullScreen();
		this.trackManager.resize();
		if (mainpanel) {
				docObject.parentNode.removeChild(mainpanel.getDocObject());
				mainpanel = null;
		}
		mainpanel = new ControlPanel(me);
		this.setMode(1);
		if (Cn) Cn.resizeBtn();
		if ($U.isMobile.android()) {
				// Un bug hallucinant du navigateur standard d'Androïd rendant inutilisable
				// le clearRect après avoir fait un resize (changement d'orientation).
				// La seule possibilité est de cloner l'élément canvas du DOM, ainsi
				// que faire un paint lancé par un timer. Le délire :
				//            console.log("ANDROID. width=" + width + " height=" + height);
				cloneCanvas();
				setTimeout(function() {
						this.paint();
				}, 1);
		} else {
				this.paint();
		}
	}
var initBounds = function() {
		if (docObject.hasAttribute("data-hidectrlpanel")) {
				if (docObject.getAttribute("data-hidectrlpanel") === "true") {
						this.prefs.controlpanel.size = 0;
				}
		}
		if ((docObject.hasAttribute("width")) && (docObject.hasAttribute("height"))) {
				var cl, ct, cw, ch;
				var off = $U.getElementOffset(docObject);
				cl = off.left;
				ct = off.top;
				cw = 1 * docObject.getAttribute("width");
				ch = 1 * docObject.getAttribute("height");
				width = cw;
				height = ch;
				docObject.style.top = ct + "px";
				docObject.style.left = cl + "px";
				bounds = {
						"left": cl,
						"top": ct,
						"width": cw,
						"height": ch
				};
		} else {
				setFullScreen();
				window.document.body.style.setProperty("overflow", "hidden");
				if (!Object.touchpad) {
						window.onresize = resizeWindow;
						window.onbeforeunload = function() {
								this.saveToLocalStorage();
						};
				} else {
						if ($U.isMobile.android()) {
								// Encore une subtilité du navigateur d'Android :
								// l'évenement onorientationchange est lancé avant
								// que la taille de la fenêtre soit changée (resize event).
								// Du coup il faut attendre l'évenement resize qui
								// n'aura un effet que si on est passé précédement par
								// onorientationchange. 
								window.onorientationchange = function() {
										var or = true;
										window.onresize = function() {
												if (or)
														resizeWindow();
												or = false;
										};
								};
						} else
								window.onorientationchange = resizeWindow;
						window.onunload = function() {
								this.saveToLocalStorage();
						};
						// Seulement utilisée par l'application iPad (stockage de la figure dans
						// l'historique à chaque fois que DGPad est désactivé (passe en background) :
						window.$IPADUNLOAD = function() {
								this.quit(true);
								iPadDidFirstEnterBackground = false;
								docObject.style.visibility = "visible";
								// On inverse l'homothétie effectuée dans this.quit() pour rétablir la 
								// figure dans ses dimensions d'origine :
								// var scale = Math.max(width, height) / (1.5 * $P.localstorage.iconwidth);
								// Cn.zoom(width / 2, height / 2, scale);
								Cn.computeAll();
								this.paint();
						};
				}
		}
	}
	getBounds() {
		return bounds;
	}
//    var img = "url('" + this.prefs.background.image + "'),";
//    img += $U.browserCode();
//    img += this.prefs.background.gradient;
//    docObject.style.backgroundImage = img;
//    docObject.style.backgroundRepeat = this.prefs.background.repeat;
//    docObject.style.backgroundPosition = this.prefs.background.position;
	setUndoBtn(_active) {
		mainpanel.setUndoBtn(_active);
	}
	setRedoBtn(_active) {
		mainpanel.setRedoBtn(_active);
	}
	forceArrowBtn() {
		mainpanel.forceArrowBtn();
	}
	selectArrowBtn() {
		mainpanel.selectArrowBtn();
	}
	selectPropBtn() {
		mainpanel.selectPropBtn();
	}
	selectCalcBtn() {
		mainpanel.selectCalcBtn();
	}
	deselectAll() {
		mainpanel.deselectAll();
	}
	selectNameBtn(_b) {
		mainpanel.selectNameBtn(_b);
	}
	ctrl_show(_bool) {
		if (_bool) {
				if (mainpanel) {
						docObject.parentNode.removeChild(mainpanel.getDocObject());
						mainpanel = null;
				}
				mainpanel = new ControlPanel(me);
		} else {
				mainpanel.hide();
		}
		this.paint();
	}
var initContext = function(cx) {
		//        cx.imageSmoothingEnabled = true;
		//        cx.mozImageSmoothingEnabled = true;
		//        cx.webkitImageSmoothingEnabled=true;
		// setLineDash (pointillés) n'est aujourd'hui reconnu que par
		// Chrome. Rajoute cette fonctionnalité pour Firefox et Safari :
		if (!cx.setLineDash) {
				cx.setLineDash = function(_tab) {
						cx.mozDash = _tab;
						cx.webkitLineDash = _tab;
				};
		}
		cx.rect(0, 0, width, height);
		cx.clip();
	}
var getNewContext = function() {
		var cx = docObject.getContext('2d');
		initContext(cx);
		return cx;
	}
	getContext() {
		return context;
	}
	exportPNG() {
		var buff = document.createElement("canvas");
		buff.setAttribute("width", width);
		buff.setAttribute("height", height);
		buff.style.setProperty("image-rendering", "-moz-crisp-edges");
		buff.style.setProperty("image-rendering", "-webkit-optimize-contrast");
		Cn.computeAll();
		this.paint();
		var ctx = buff.getContext('2d');
		ctx.imageSmoothingEnabled = true;
		ctx.mozImageSmoothingEnabled = true;
		ctx.fillStyle = docObject.style.backgroundColor;
		ctx.fillRect(0, 0, width, height);
		ctx.drawImage(docObject, 0, 0, width, height);
		return buff.toDataURL();
	}
	exportSVG() {
		for (var i = 0; i < 2; i++) {
				context = new SVGCanvas(ID);
				if (!context.setLineDash) {
						context.setLineDash = function(_tab) {
								context.mozDash = _tab;
								context.webkitLineDash = _tab;
						};
				}
				Cn.clearIndicated();
				Cn.clearSelected();
				Cn.paint(context);
		}
		var svg = context.toDataURL("image/svg+xml");
		context = getNewContext();
		resizeWindow();
		return svg;
	}
	loadZipPackage(_onload) {
		if (typeof window.JSZipUtils == 'undefined') {
				var parent = document.getElementsByTagName("head")[0];
				var script0 = document.createElement("script");
				script0.type = "text/javascript";
				script0.src = $APP_PATH + "NotPacked/thirdParty/jszip-utils.js";
				var script1 = document.createElement("script");
				script1.type = "text/javascript";
				script1.src = $APP_PATH + "NotPacked/thirdParty/jszip.min.js";
				script1.onload = _onload;
				parent.appendChild(script0);
				parent.appendChild(script1);
		} else
				_onload();
	}
	getiBookPlugin(_hide_control_panel, _fname, _callback) {
		var _w = width;
		var _h = height;
		var _f = (_fname == "") ? "ibook.wdgt" : _fname;
		var d = new Date();
		var _id = "net.dgpad.fig" + d.getTime();
		var _src = this.getSource();
		_src = $U.base64_encode(_src);
		var _hide = _hide_control_panel;
		var html = "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<title></title>\n\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n\t\t<link rel=\"icon\" type=\"image/png\" href=\"favicon.png\" />\n\t\t<link rel=\"apple-touch-icon\" href=\"scripts/NotPacked/images/icon.png\"/>\n\t\t<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n\t\t<meta   id=\"wholeViewport\" name=\"viewport\" content=\"width=device-width, maximum-scale=1.0, initial-scale=1 ,user-scalable=no\">\n\t\t<script>\n\t\t\tvar $MOBILE_PHONE;\n\t\t\tif (navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)) {\n\t\t\t\tif (((screen.width >= 480) && (screen.height >= 800)) || ((screen.width >= 800) && (screen.height >= 480)) || navigator.userAgent.match(/ipad/gi)) {\n\t\t\t\t\t$MOBILE_PHONE = false;//tablette\n\t\t\t\t} else {\n\t\t\t\t\t$MOBILE_PHONE = true;//mobile\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\t$MOBILE_PHONE = false;//Desktop\n\t\t\t}\n\t\t\tif ($MOBILE_PHONE) {\n\t\t\t\tdocument.getElementById('wholeViewport').setAttribute(\"content\", \"width=device-width, maximum-scale=0.7, initial-scale=0.7 ,user-scalable=no\");\n\t\t\t}\n\t\t</script>\n\t</head>\n\t<body style=\"-ms-touch-action: none;\">\n\t\t<script src=\"scripts/DGPad.js\" data-source=\"" + _src + "\" data-hidectrlpanel=\"" + _hide + "\"></script>\n\t</body> \n</html>\n";
		var plist = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n<plist version=\"1.0\">\n<dict>\n\t<key>CFBundleDisplayName</key>\n\t<string>DGPad</string>\n\t<key>CFBundleIdentifier</key>\n\t<string>" + _id + "</string>\n\t<key>MainHTML</key>\n\t<string>index.html</string>\n\t<key>Width</key>\n\t<integer>" + _w + "</integer>\n\t<key>Height</key>\n\t<integer>" + _h + "</integer>\n</dict>\n</plist>\n";
		var png = this.exportPNG();
		JSZipUtils.getBinaryContent($APP_PATH + "NotPacked/scripts.zip", function(err, data) {
				if (!err) {
						var zip = new JSZip();
						var plugin = zip.folder(_f).load(data);
						plugin.file("index.html", html);
						plugin.file("Info.plist", plist);
						plugin.file("Default.png", png.substr(png.indexOf(',') + 1), {
								base64: true
						});
						var content = zip.generate({
								type: "blob"
						});
						_callback(content);
				}
		});
	}
//    var gDrive = new GoogleFiles(docObject);
//    this.upload = function(fname, source) {
//
//        gDrive.upload("essai.js", Cn.getSource());
//    }
	getWidth() {
		return width;
	}
	getHeight() {
		return height;
	}
	mouseX(ev) {
		return (ev.pageX - bounds.left);
	}
	mouseY(ev) {
		return (ev.pageY - bounds.top);
	}
	mouse(ev) {
		return new VirtualPointObject(this.mouseX(ev), this.mouseY(ev));
	}
var Cn = new Construction(me);
	getConstruction() {
		return Cn;
	}
// Managers :
this.undoManager = new UndoManager(me);
this.undoManager.setBtns();
this.propertiesManager = new PropertiesManager(me);
this.macrosManager = new MacrosManager(me);
this.deleteAll = new DeleteAll(me);
this.coincidenceManager = new CoincidenceManager(me);
this.eraserPanel = new EraserManager(me);
this.trackManager = new TrackManager(me);
this.calcManager = new CalcManager(me);
this.magnetManager = new MagnetManager(me);
this.magnifyManager = new MagnifierManager(me);
this.demoModeManager = new DemoModeManager(me);
this.textManager = new TextManager(me);
this.dependsManager = new DependsManager(me);
this.namesManager = new NamesManager(me);
this.blocklyManager = new BlocklyManager(me);
this.longpressManager = new LongpressManager(me);
	addText(_m, _l, _t, _w, _h, _stl) {
		this.textManager.addTeXElement(_m, _l, _t, _w, _h, _stl);
	}
var closeTools = function() {
		toolsManager.closeTools();
		this.setPointConstructor();
		this.clearFilters();
		Cn.clearSelected();
	}
// mode 0 pour consultation, 1 pour pointeur, 2 pour gomme, 3 pour poubelle, 
// 4 pour construction de macros, 5 pour execution de macros
// 6 pour les propriétés, 7 pour le tracé, 8 pour la calculatrice,
// 9 pour le magnétisme, 10 pour le TeX, 11 pour les dépendances :
	setMode(_mode) {
		closeTools();
		this.magnifyManager.show();
		if ((_mode === 0)) {
				this.deselectAll();
				this.magnifyManager.hide();
		}
		if (_mode === 2) {
				this.eraserPanel.showPanel();
		} else {
				this.eraserPanel.hidePanel();
		}
		if (_mode === 3) {
				this.deleteAll.show();
		} else {
				this.deleteAll.hide();
		}
		if ((_mode === 4) || (_mode === 5)) {
				this.macrosManager.showPanel();
		} else {
				this.macrosManager.hidePanel();
		}
		if (_mode === 6) {
				this.propertiesManager.showPanel();
		} else {
				this.propertiesManager.hidePanel();
		}
		if (_mode === 7) {
				handPath.start();
		} else {
				this.clearFilters();
		}
		if (_mode === 8) {
				this.calcManager.showPanel();
		} else {
				this.calcManager.hidePanel();
		}
		if (_mode === 9) {
				mainpanel.deselectPointer();
		} else {
				this.magnetManager.quit();
		}
		if (_mode === 10) {
				this.textManager.showPanel();
		} else {
				this.textManager.hidePanel();
		}
		if (_mode === 11) {
				mainpanel.deselectPointer();
		} else {
				this.dependsManager.quit();
		}
		Cn.setMode(_mode);
	}
	getMode() {
		return Cn.getMode();
	}
var myTimeOut = new $U.TimeOut(this.prefs.precision.timeout, function() {
		if (Cn.getIndicated().length === 1) {
				if (Cn.getMode() === 1) {
						this.selectPropBtn(true);
						this.propertiesManager.edit(Cn.getIndicated()[0]);
				}
		}
});
	stopChrono() {
		myTimeOut.stopChrono();
	}
var handPath = new Ghost(me);
var toolsManager = new ToolsManager(me);
	addTool(_oc) {
		toolsManager.addTool(_oc);
	}
	getConstructor(_code) {
		return toolsManager.getConstructor(_code);
	}
	initTools(ev, obj) {
		var inter = document.activeElement.getAttribute("interactiveinput");
		if (inter !== null) {
				$U.addTextToInput(document.activeElement, obj.getName(), inter);
				return;
		};
		if ((obj.getCode() === "blockly_button") && (obj.insideButton(ev))) {
				obj.run();
				return;
		};
		if (this.namesManager.replaceName(obj)) return;
		if (this.blocklyManager.tryEdit(obj)) return;
		switch (Cn.getMode()) {
				case 0:
						// Outil de consultation :
						break;
				case 1:
						// Outil curseur-création :
						toolsManager.showTools(ev);
						break;
				case 2:
						// Outil gomme :
						if (!obj.isSuperHidden()) {
								obj.setHidden(!obj.isHidden());
								obj.setSelected(false);
								obj.setIndicated(false);
								this.paint(ev);
						}
						break;
				case 3:
						// Outil poubelle :
						if (!obj.isHidden()) {
								this.undoManager.deleteObjs(Cn.safelyDelete(obj));
								this.refreshKeyboard();
								this.paint(ev);
						}
						break;
				case 4:
						// Outil construction de macro :
						if (!obj.isHidden()) {
								Cn.macroConstructionTag(obj);
								this.paint(ev);
						}
						break;
				case 5:
						// Outil execution de macro :
						if (!obj.isHidden()) {
								Cn.macroExecutionTag(obj);
								this.paint(ev);
						}
						break;
				case 6:
						// Outil propriétés des objets :
						this.propertiesManager.edit(obj);
						this.paint(ev);
						break;
				case 8:
						// Outil propriétés des objets :
						this.calcManager.edit(obj);
						this.paint(ev);
						break;
				case 9:
						// Outil magnétisme :
						this.magnetManager.add(obj);
						this.paint(ev);
						break;
				case 10:
						// Outil TEX :
						this.textManager.addName(obj.getName());
						this.paint(ev);
						break;
				case 11:
						// Outil depends :
						this.dependsManager.add(obj);
						this.paint(ev);
						break;
		}
	}
	setObjectConstructor(_oc) {
		OC = _oc;
	}
	isObjectConstructor(_oc) {
		return (OC === _oc);
	}
	setPointConstructor() {
		OC = PC;
	}
	getPointConstructor() {
		return PC;
	}
	isToolVisible() {
		return toolsManager.isVisible();
	}
	setBackground(bk) {
		this.prefs.background.color = bk;
		docObject.style.setProperty("background-color", bk);
	}
	getBackground() {
		return (this.prefs.background.color);
	}
var clearBackFirefox = function() {
		docObject.width = docObject.width;
		//        context.clearRect(0, 0, width, height);
	}
var clearBackOther = function() {
		//        docObject.width = docObject.width;
		context.clearRect(0, 0, width, height);
	}
this.clearBackground = ($U.isBrowser.firefox()) ? clearBackFirefox : clearBackOther;
//    this.clearBackground = clearBackOther;
	showCS(_v) {
		Cn.coordsSystem.showCS(_v);
		this.paint();
	}
	isCS() {
		return Cn.coordsSystem.isCS();
	}
var moveableSortFilter = function(a, b) {
		var ap = a.isInstanceType("area");
		var bp = b.isInstanceType("area");
		if (ap)
				return 1;
		else if (bp)
				return -1;
		else
				return 1;
	}
// Trie les indicateds pour éviter la prédominance des
// polygone lorsqu'on clique :
var cleanInds = function() {
		var inds = Cn.getIndicated();
		// On trie en laissant les polygones en fin de liste :
		inds.sort(moveableSortFilter);
		// Si le premier indiqué n'est pas un polygone et que
		// le dernier indiqué en est un, on vire tous les polygones :
		if ((inds.length > 1) && (inds[0].getCode() !== "area") && (inds[inds.length - 1].getCode() === "area")) {
				while (inds[inds.length - 1].getCode() === "area") {
						inds[inds.length - 1].setIndicated(false);
						inds.splice(inds.length - 1, 1);
				}
		}
	}
	selectMoveable(ev) {
		cleanInds();
		var inds = Cn.getIndicated();
		var len = inds.length;
		for (var i = 0; i < len; i++) {
				if ((inds[i].isMoveable()) && (inds[i].getCode() === "point") && (inds[i].getParentLength() === 1)) {
						var obj = inds[i];
						//                Cn.clearIndicated();
						//                obj.setIndicated(true);
						//                Cn.addIndicated(obj);
						obj.startDrag(this.mouseX(ev), this.mouseY(ev));
						return obj;
				}
		}
		for (var i = 0; i < len; i++) {
				if (inds[i].isMoveable()) {
						inds[i].startDrag(this.mouseX(ev), this.mouseY(ev));
						return inds[i];
				}
		}
		if (len > 0) {
				inds[0].startDrag(this.mouseX(ev), this.mouseY(ev));
				return inds[0];
		}
		return null;
	}
	setPressedFilter(_func) {
		pressedFilter = _func;
	}
	setMovedFilter(_func) {
		movedFilter = _func;
	}
	setReleasedFilter(_func) {
		releasedFilter = _func;
	}
	clearFilters() {
		pressedFilter = null;
		movedFilter = null;
		releasedFilter = null;
	}
var isClick = function(ev) {
		var x0 = this.mouseX(ev);
		var y0 = this.mouseY(ev);
		var prec2 = this.prefs.precision.caress;
		prec2 *= prec2;
		return ((pressedCoords) && ($U.getTime() - pressedCoords.t) < 800) && (((pressedCoords.x - x0) * (pressedCoords.x - x0) + (pressedCoords.y - y0) * (pressedCoords.y - y0)) < prec2);
	}
var longPress = function(ev) {
		this.longpressManager.show(ev);
	}
// Mouse Events :
	mousePressed(ev) {
		ev.preventDefault();
		if (pressedFilter) {
				pressedFilter(ev);
				return;
		}
		if (this.longpressManager.isVisible()) return;
		if (this.coincidenceManager.isVisible()) return;
		// if (this.blocklyManager.isSettingsVisible()) return;
		draggedObject = null;
		dragCoords = null;
		actualCoords.x = this.mouseX(ev);
		actualCoords.y = this.mouseY(ev);
		//        $ALERT("x="+actualCoords.x+" y="+actualCoords.y);
		pressedCoords = {
				x: actualCoords.x,
				y: actualCoords.y,
				t: $U.getTime()
		};
		//        actualCoords
		// Si on a cliqué à côté des outils :
		if (toolsManager.isVisible()) {
				closeTools();
				Cn.validate(ev);
				this.paint(ev);
				// Fait en sorte que le mousereleased ne crée pas un point :
				pressedCoords = {
						x: NaN,
						y: NaN
				};
				return;
		}
		// S'il s'agit d'un click droit :
		if (ev.which === 2 || ev.which === 3) {
				dragCoords = {
						x: actualCoords.x,
						y: actualCoords.y
				};
				return;
		}
		mousedown = true;
		Cn.validate(ev);
		draggedObject = this.selectMoveable(ev);
		if (draggedObject === null && Cn.getMode() === 1) {
				// Si on a tapé/cliqué "dans le vide" et qu'aucun objet
				// n'est sous le doigt/souris (pour le longpress menu) :
				longPressTimeout = setTimeout(function() {
						longPress(ev);
				}, 500);
		}
		if (draggedObject === null && Cn.getMode() === 0) {
				// Si on a tapé/cliqué "dans le vide" et qu'aucun objet
				// n'est sous le doigt/souris (pour le translate en mode présentation) :
				dragCoords = {
						x: actualCoords.x,
						y: actualCoords.y
				};
				return;
		}
		if (draggedObject) draggedObject.blocks.evaluate("onmousedown"); // blockly
		this.paint(ev);
	}
	translate(x, y) {
		Cn.translate(x, y);
		Cn.computeAll();
		// this.blocklyManager.computeTurtle();
		this.paint();
	}
	mouseMoved(ev) {
		ev.preventDefault();
		clearTimeout(longPressTimeout);
		actualCoords.x = this.mouseX(ev);
		actualCoords.y = this.mouseY(ev);
		if (dragCoords) {
				// S'il s'agit d'un click droit glissé :
				this.translate(actualCoords.x - dragCoords.x, actualCoords.y - dragCoords.y);
				dragCoords.x = actualCoords.x;
				dragCoords.y = actualCoords.y;
				return;
		}
		if (movedFilter) {
				movedFilter(ev);
				return;
		}
		if (mousedown) {
				if (draggedObject) {
						if (!isClick(ev))
								pressedCoords = {
										x: NaN,
										y: NaN,
										t: 0
								};
						draggedObject.dragTo(actualCoords.x, actualCoords.y);
						this.textManager.evaluateStrings();
						draggedObject.blocks.evaluate("ondrag"); // blockly
						actualCoords.x = NaN;
						actualCoords.y = NaN;
				} else {
						Cn.validate(ev);
				}
		} else {
				Cn.validate(ev);
		}
		// If a tool is selected :
		OC.selectInitialObjects(me);
		this.paint(ev, actualCoords);
	}
	mouseReleased(ev) {
		ev.preventDefault();
		clearTimeout(longPressTimeout);
		actualCoords.x = NaN;
		actualCoords.y = NaN;
		if (releasedFilter) {
				releasedFilter(ev);
				return;
		}
		mousedown = false;
		dragCoords = null;
		if (draggedObject) {
				if (isClick(ev)) {
						// Si on a cliqué sur l'objet :
						if ((!this.coincidenceManager.checkCoincidences(ev))) {
								// Et s'il n'y a pas ambiguité, on lance les outils
								// contextuels :
								if (Cn.getIndicated().length > 1) {
										Cn.addSelected(Cn.getIndicated()[0]);
										Cn.addSelected(Cn.getIndicated()[1]);
								} else {
										Cn.addSelected(draggedObject);
								}
								this.paint(ev);
								this.initTools(ev, draggedObject);
						}
				} else {
						draggedObject.blocks.evaluate("onmouseup"); // blockly
				}
				//            this.textManager.evaluateStrings(true);
				draggedObject = null;
		} else {
				Cn.validate(ev);
				cleanInds();
				var sels = Cn.getIndicated();
				if (isClick(ev)) {
						if (sels.length === 0) {
								if (Cn.isMode(1, 5, 7, 8)) {
										// On est dans le mode arrow, tracé ou execution de macro :
										// On a cliqué dans le vide, on crée un point à la volée :
										OC.selectCreatePoint(me, ev);
										var o = OC.createObj(me, ev);
										Cn.validate(ev);
										Cn.clearSelected();
										if (Cn.isMode(5)) {
												this.macrosManager.refreshMacro();
												Cn.macroExecutionTag(o);
										}
										this.paint(ev);
								}
						} else {
								// Si on a cliqué sur un objet :
								if ((!this.coincidenceManager.checkCoincidences(ev))) {
										// Et s'il n'y a pas ambiguité, on lance les outils
										// contextuels :
										Cn.addSelected(sels[0]);
										if (sels.length > 1)
												Cn.addSelected(sels[1]);
										//                        Cn.addSelected(sels[0]);
										this.paint(ev);
										this.initTools(ev, sels[0]);
								}
						}
				} else {
						// Sinon, il s'agit d'une caresse :
						if (sels.length > 0) {
								// On a caressé un objet (point sur) ou deux objets (intersection)
								// On crée un point à la volée (dans le mode arrow, tracé ou execution de macro) :
								if (Cn.isMode(1, 5, 7, 8)) {
										OC.setInitialObjects(sels);
										OC.selectCreatePoint(me, ev);
										var o = OC.createObj(me, ev);
										OC.setInitialObjects([]);
										Cn.validate(ev);
										Cn.clearSelected();
										if (Cn.isMode(5)) {
												this.macrosManager.refreshMacro();
												Cn.macroExecutionTag(o);
										}
										this.paint(ev);
								} else if (Cn.isMode(2, 3, 4, 6, 9)) {
										this.initTools(ev, sels[0]);
								}
						}
				}
		}
		if (!toolsManager.isVisible()) {
				Cn.clearIndicated();
				Cn.clearSelected();
				this.clearBackground();
				Cn.paint(context);
		}
	}
	mouseClicked(ev) {};
	mouseWheel(ev) {
		ev.preventDefault();
		var zoom = 1 + $U.extractDelta(ev) / 2000;
		Cn.zoom(this.mouseX(ev), this.mouseY(ev), zoom);
		Cn.validate(ev);
		Cn.computeAll();
		this.paint(ev);
	}
// Lorsque le navigateur mobile ne connaît pas les évenements "gesture"
var touchToMouse = function(_tch, _proc) {
		_tch.preventDefault();
		if (_tch.touches.length < 2) {
				if (zoomGesture) {
						// On vient probablement de passer de 2 doigts à 1 doigt :
						zoomGesture = null;
						pressedCoords = {
								x: NaN,
								y: NaN
						};
				} else {
						// Il s'agit d'un mono-doigt :
						_proc($U.PadToMouseEvent(_tch.changedTouches[0]));
				}
		} else {
				clearTimeout(longPressTimeout);
				var t0 = _tch.touches[0];
				var t1 = _tch.touches[1];
				var x0 = this.mouseX(t0),
						y0 = this.mouseY(t0);
				var x1 = this.mouseX(t1),
						y1 = this.mouseY(t1);
				var x = (x0 + x1) / 2;
				var y = (y0 + y1) / 2;
				var dis = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
				if (zoomGesture) {
						Cn.translateANDzoom(x - zoomGesture.x, y - zoomGesture.y, x, y, dis / zoomGesture.d);
						zoomGesture.x = x;
						zoomGesture.y = y;
						zoomGesture.d = dis;
						Cn.computeAll();
						this.paint();
				} else {
						zoomGesture = {
								x: x,
								y: y,
								d: dis
						};
						pressedCoords = {
								x: NaN,
								y: NaN
						};
				}
		}
		// Une nuit de boulot avant de comprendre qu'il faut décommenter 
		// cette ligne pour que le mode demo fonctionne sur tablette :
		//        _tch.stopPropagation();
	}
// TouchEvents :
	touchStart(tch) {
		touchToMouse(tch, this.mousePressed);
	}
	touchMoved(tch) {
		touchToMouse(tch, this.mouseMoved);
	}
	touchEnd(tch) {
		touchToMouse(tch, this.mouseReleased);
		zoomGesture = null;
	}
//    this.gestureStart = function(tch) {
//        tch.preventDefault();
//        zoomGesture = {x: this.mouseX(tch), y: this.mouseY(tch), d: 1};
//    };
//
//    this.gestureChanged = function(tch) {
//        tch.preventDefault();
//        var zoom = 1 + (tch.scale - zoomGesture.d);
//        zoomGesture.d = tch.scale;
//        Cn.translate(this.mouseX(tch) - zoomGesture.x, this.mouseY(tch) - zoomGesture.y);
//        zoomGesture.x = this.mouseX(tch);
//        zoomGesture.y = this.mouseY(tch);
//        Cn.zoom(this.mouseX(tch), this.mouseY(tch), zoom);
//        Cn.computeAll();
//        this.paint(tch);
//    };
//
//    this.gestureEnd = function(tch) {
//        zoomGesture = null;
//        pressedCoords = {x: NaN, y: NaN};
//        draggedObject = null;
//    };
	dragOver(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		ev.dataTransfer.dropEffect = 'copy';
		return false;
	}
	drop(ev) {
		ev.stopPropagation();
		ev.preventDefault();
		var f = ev.dataTransfer.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
				this.OpenFile("", e.target.result);
		};
		reader.readAsText(f);
	}
// only for computers :
	keydown(ev) {
		// $ALERT("yes");
		if (this.getMode() === 1) {
				if (ev.metaKey)
						return;
				var key = ev.keyCode || ev.charCode;
				var pt = Cn.getLastPoint();
				var d = new Date();
				var key = ev.keyCode || ev.charCode;
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
				ev.preventDefault();
				return false;
		}
	}
// only for computers :
	keypress(ev) {
		if (this.getMode() === 1) {
				if (ev.metaKey)
						return;
				ev.preventDefault();
				var key = ev.keyCode || ev.charCode;
				var pt = Cn.getLastPoint();
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
		context.globalAlpha = 1;
		this.clearBackground();
		if (OC && (OC.getC(0)) && previewEvent) {
				OC.preview(previewEvent, me);
		}
		handPath.paint(context);
		Cn.paint(context);
		this.trackManager.draw();
	}
	paint(ev, coords) {
		context.globalAlpha = 1;
		this.clearBackground();
		if (OC && (OC.getC(0))) {
				previewEvent = ev;
				OC.preview(ev, me);
		} else previewEvent = null;
		handPath.paint(context);
		Cn.paint(context, coords);
		this.trackManager.draw();
	}
	addObject(o) {
		this.undoManager.record(o, true);
		o.newTimeStamp();
		Cn.add(o);
	}
//    this.sandboxFrame=null;
/* Les variables globales sont en fait des propriétés
	de l'objet window. Interpréter un script utilisateur risque
	d'ajouter des globales susceptibles de mettre la 
	pagaille dans l'objet window dans lesquel s'execute
	DGPad. Pour éviter cela, on execute les scripts (lecture
	de fichier aussi) dans un bac à sable : une iframe invisible.
	*/

//var createSandbox = function() {
//        var el = document.createElement("iframe");
//        el.setAttribute('name', ID);
////        el.setAttribute('width', 100);
////        el.setAttribute('height', 100);
//        el.style.setProperty("position", "absolute");
//        el.style.setProperty("left", "0px");
//        el.style.setProperty("top", "0px");
//        el.style.setProperty("width", "0px");
//        el.style.setProperty("height", "0px");
////        el.setAttribute('style', 'hidden');
//        el.setAttribute('frameborder', 0);
//        el.setAttribute('marginheight', 0);
//        el.setAttribute('marginwidth', 0);
//        el.setAttribute('scrolling', 'no');
//        // Trouver éventuellement un paramètre de langue dans le script du body :
//        var lang = ($BODY_SCRIPT.hasAttribute("data-lang")) ? "?lang=" + $BODY_SCRIPT.getAttribute("data-lang").toUpperCase() : "";
//        el.setAttribute('src', $APP_PATH + 'NotPacked/Sandbox/sandbox.html' + lang);
//        document.body.appendChild(el);
//        el.onload = function() {
//            interpreter = new window.frames[ID].Interpreter(window, me);
//            interpreter.owner = el.contentWindow;
//            interpreter.copyNameSpace();
//            // Chargement des plug-ins :
//            interpreter.LoadPlugins($U.loadFile($APP_PATH + "NotPacked/plug-ins.js"));
//
//            // Si le canvas a une figure attachée (base64) :
//            if (docObject.hasAttribute("data-source")) {
//                this.OpenFile("", $U.base64_decode(docObject.getAttribute("data-source")));
//            } else {
//                // Si une figure a été postée sur index.php, on l'ouvre :
//                try {
//                    this.OpenFile("", $U.base64_decode($DGPAD_FIGURE));
//                } catch (e) {
//                }
//            }
//
//
//        };
////        this.sandboxFrame=el;
//    }();
// Intepréteur de scripts lancé par un bouton :
	InterpretScript(_o, s) {
		interpreter.setCaller(_o);
		interpreter.Interpret(s);
	}
	Interpret(s) {
		interpreter.Interpret(s);
	}
	getExpression(s) {
		return new Expression(me, s);
	}
	InterpretExpression(s) {
		var ex = new Expression(me, s);
		return ex.value();
	}
	InterpretMacro(s) {
		interpreter.InterpretMacro(s);
	}
	getInterpreter() {
		return interpreter;
	}
	getCn() {
		return Cn;
	}
	OpenFile(_fname, _src) {
		// Pour assurer la compatibilité avec les anciennes figures
		// on se met en radians (old style). Si une figure est en degrés
		// elle s'ouvrira en mode degré.
		if (_src === "") Cn.setDEG(true)
		else Cn.setDEG(false);
		iPadDidFirstEnterBackground = true;
		Cn.deleteAll();
		this.macrosManager.clearTools();
		this.textManager.clear();
		this.trackManager.clear();
		interpreter.Interpret(_src);
		// Mode construction si la figure est vide,
		// mode consultation sinon :
		this.setMode((_src === "") ? 1 : 0);
		this.undoManager.clear();
		Cn.clearIndicated();
		Cn.clearSelected();
		Cn.computeAll();
		this.paint();
	}
// Uniquement pour l'iApp DGPad s'executant en local
// dans iOS (ouverture des fichiers par "ouvrir dans..."
// à partir d'autres applications) :
	getStyle() {
		var t = "SetGeneralStyle(\"";
		t += "background-color:" + this.getBackground();
		if (Cn.isDEG()) t += ";degree:true";
		if (Cn.isDragOnlyMoveable()) t += ";dragmoveable:true";
		t += "\");\n";
		return t;
	}
}
