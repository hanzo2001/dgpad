/// <reference path="../../typings/iBlockly.d.ts" />
/// <reference path="../../typings/iCanvas.d.ts" />

import {MathExt as Math} from './MathExtension';
import {Expr} from './Expr';

type ParsedSource = {
	header: string,
	lines: string[],
	num: number,
};

var isStr = v => typeof v === "string";
var isArray = Array.isArray;

export class Interpreter {
	$macros;
	$macroFinals;
	$macromode: boolean;
	$caller;
	$progressBar;
	$initProgress: (source:string) => ParsedSource;
	namespace;
	blockly_namespace;
	W: Window;
	$U: any;
	Z: iCanvas;
	C: iConstruction;
	E: MouseEvent;
	EX;
	EXPS;
	private TURTLE_VARS;
	constructor(window:Window, canvas:iCanvas) {
		this.$macros = null;
		this.$macroFinals = null;
		this.$macromode = false;
		this.$caller = null; // Objet qui appelle le script par bouton
		this.$progressBar = null;
		this.namespace = {};
		this.blockly_namespace = {}; // Globales Blockly
		this.W = window;
		this.$U = (<any>window).$U;
		this.Z = canvas;
		this.C = canvas.getConstruction();
		// fix this later: initialize some other way
		//this.E = document.createEvent("MouseEvent");
		//this.E.initMouseEvent("mousemove", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		this.E = new MouseEvent('mousemove',{
			cancelable: true,
			view: window,
			detail: 1,
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: null
		})
		this.$initProgress = function(source:string): ParsedSource {
			if (source) {
				var i = source.indexOf("// Geometry :");
				if (i !== -1) {
					var mcrs = source.substring(0, i);
					var geom = source.substring(i);
					var stls = '';
					var j = geom.indexOf("// Styles :");
					if (j !== -1) {
						stls = geom.substring(j);
						geom = geom.substring(0, j);
					}
					var nLines = geom.match(/\n/g).length;
					// Si la partie géométrie du source contient moins de 300 lignes
					// on ne coupe pas le source, et on le renvoie :
					if (nLines < 300) {
						return {
							header: source,
							lines: [],
							num: 0
						};
					}
					// On découpe la partie géométrie par paquets de 10 instructions :
					let lines = geom.replace(/(([^\n]*\n){10})/g, "$1@@@@@@").split("@@@@@@");
					// On ajoute les styles :
					lines.push(stls);
					this.$progressBar = new this.W.progressBar(this.Z);
					return {
						header: mcrs,
						lines: lines,
						num: 0
					};
				}
			}
			return {
				header: source,
				lines: [],
				num: 0
			};
		};
		this.TURTLE_VARS = {
			U: [1, 0, 0],
			V: [0, 1, 0],
			W: [0, 0, 1],
			LAST: null,
			D3: false,
			PENUP: false,
			TAB: [],
			NAME: null
		};
		this.EXPS = []; // Tableau de stockage des objets impliqués dans les expressions élémentaires
		this.EX = new Expr(this.C,this.C.coordsSystem,this.EXPS);
		this.setDegreeMode(this.C.isDEG());
		/*
		this.EX = {}; // Expressions
		var COORDS_X0 = this.C.coordsSystem.getX0;
		var COORDS_Y0 = this.C.coordsSystem.getY0;
		this.EX.EX_d = function(a:number[], b:number[]): number {
			if (isArray(a) && isArray(b) && a.length === b.length) {
				let x = b[0] - a[0];
				let y = b[1] - a[1];
				let z = b[2] - a[2];
				if (a.length === 2) {return Math.sqrt(x*x + y*y);}
				if (a.length === 3) {return Math.sqrt(x*x + y*y + z*z);}
			}
			return NaN;
		}
		// Abscisse d'un point :
		this.EX.EX_x = function(a:number[]): number {
			return isArray(a) && a.length > 0 ? a[0] : NaN;
		}
		// Ordonnée d'un point
		this.EX.EX_y = function(a:number[]): number {
			return isArray(a) && a.length > 1 ? a[1] : NaN;
		}
		this.EX.EX_windoww = function() {
			return this.C.coordsSystem.l(this.C.getWidth());
		}
		this.EX.EX_windowh = function() {
			return this.C.coordsSystem.l(this.C.getHeight());
		}
		this.EX.EX_windowcx = function() {
			return this.C.coordsSystem.x(this.C.getWidth() / 2);
		}
		this.EX.EX_windowcy = function() {
			return this.C.coordsSystem.y(this.C.getHeight() / 2);
		}
		this.EX.EX_pixel = function() {
			return this.C.coordsSystem.getUnit();
		}
		this.EX.EX_phi = function() {
			return COORDS_X0() * Math.coef3D;
		}
		this.EX.EX_theta = function() {
			return COORDS_Y0() * Math.coef3D;
		}
		this.EX.EX_restrictPhi = function(_t) {
			if (_t.length === 2)
				this.C.coordsSystem.restrictPhi([_t[0] / 0.015 + 0.000001, _t[1] / 0.015 - 0.000001]);
			else
				this.C.coordsSystem.restrictPhi([]);
			return _t;
		}
		this.EX.EX_restrictTheta = function(_t) {
			if (_t.length === 2)
					this.C.coordsSystem.restrictTheta([_t[0] / 0.015 + 0.000001, _t[1] / 0.015 - 0.000001]);
			else
					this.C.coordsSystem.restrictTheta([]);
			return _t;
		}
		this.EX.EX_point3D = function(_o, _v) {
			var fi = this.EX_phi();
			var th = this.EX_theta();
			var cfi = Math.cos(fi),
					sfi = Math.sin(fi);
			var cth = Math.cos(th),
					sth = Math.sin(th);
			return [_o[0] + _v[0] * (sfi) + _v[1] * (cfi), _o[1] + _v[0] * (-cfi * sth) + _v[1] * (sfi * sth) + _v[2] * (cth)];
		}
		//    EX.EX_windoww=9;
		// Uniquement à usage interne. L'utilisateur écrit f3(2), et
		// l'interpréteur transforme en EX_funcValue(f3)(2) :
		EX.EX_funcValue = function(_e) {
			return EXPS[_e].getValue;
		}
		EX.EX_getObj = function(_e) {
			return EXPS[_e];
		}
		*/
	}
	setDegreeMode(deg:boolean) {
		Math.deg = !!deg;
	}
	BLK_GLOB_TAB() {
		let e, list = [];
		for (e in this.blockly_namespace) {list.push(e);}
		return list
	}
	BLK_GLOB_RENAME(old, newNS) {
		if (old === '') {
			this.blockly_namespace[newNS] = 0;
		} else if (this.blockly_namespace.hasOwnProperty(old)) {
			this.blockly_namespace[newNS] = this.blockly_namespace[old];
			delete this.blockly_namespace[old];
		}
	}
	BLK_GLOB_SRC() {
		if (Object.keys(this.blockly_namespace).length === 0) {return '';}
		var txt = "\n\n// Blockly Globals :\n";
		txt += "BLK_GLOB_SET(" + JSON.stringify(this.blockly_namespace) + ");\n";
		return txt;
	}
	BLK_GLOB_DELETE() {
		this.blockly_namespace = {};
	}
	BLK_GLOB_SET(source) {
		this.blockly_namespace = source;
	}
	setCaller(blocklyManager:iBlocklyManager) {
		this.$caller = blocklyManager;
	}
	removeMouseEvents() {
		var canvas = this.Z.getDocObject();
		canvas.removeEventListener('mousemove',this.Z.mouseMoved,   false);
		canvas.removeEventListener('mousedown',this.Z.mousePressed, false);
		canvas.removeEventListener('mouseup',  this.Z.mouseReleased,false);
	}
	addMouseEvents() {
		var canvas = this.Z.getDocObject();
		canvas.addEventListener('mousemove',this.Z.mouseMoved, false);
		canvas.addEventListener('mousedown',this.Z.mousePressed, false);
		canvas.addEventListener('mouseup',  this.Z.mouseReleased, false);
	}
	Interpret(_s:string) {
		this.clearNameSpace();
		var code = this.$initProgress(_s);
		this.$macros = null;
		// Eval is evil ? :
		try {
			eval(code.header);
			if (this.$progressBar) {
				this.removeMouseEvents();
				// set interval is evil !! ??
				var interval = setInterval(() => {
					if (code.num === code.lines.length) {
						clearInterval(interval);
						this.$progressBar.hide();
						this.$progressBar = null;
						this.clearNameSpace();
						this.addMouseEvents();
						this.Z.setMode(1);
						this.C.validate(this.E);
						this.C.computeAll();
						this.C.clearIndicated();
						this.C.clearSelected();
						this.Z.paint(this.E);
						return;
					}
					eval(code.lines[code.num]);
					this.$progressBar.move(code.num / code.lines.length);
					code.num = code.num + 1;
				}, 10);
			}
			// Récupération éventuelle des macros :
			if (this.$macros) {
				for (let i in this.$macros) {
					if (this.$macros.hasOwnProperty(i)) {
						this.Z.macrosManager.addTool(this.$macros[i].name, this.$macros[i].parameters, this.$macros[i].exec);
					}
				}
			}
		} catch (err) {
			alert(err.message);
		}
		if (!this.$progressBar) {
			this.C.validate(this.E);
			this.C.computeAll();
			this.Z.paint(this.E);
			this.clearNameSpace();
		}
	}
	LoadPlugins(plugins:string) {
		this.clearNameSpace();
		this.$macros = null;
		// Eval is evil ? :
		try {
			eval(plugins);
			// Récupération éventuelle des plugins :
			if (this.$macros) {
				for (let i in this.$macros) {
					if (this.$macros.hasOwnProperty(i)) {
						let macro = this.$macros[i];
						this.Z.macrosManager.addPlugin(macro.name, macro.params, macro.exec);
					}
				}
			}
		} catch (err) {
			alert(err.message);
		}
		this.clearNameSpace();
	}
	InterpretMacro(source:string) {
		// console.log("source :"+_s);
		this.clearNameSpace();
		this.$macromode = true;
		this.$macroFinals = [];
		let i, t;
		try {
			// avant l'évaluation, on réalise une copie de tous les paramètres
			// éventuels de la fonction/macro. Cela necessite une recherche
			// regexp des paramètres et le placement des affectations
			// à l'intérieur du block fonction. Ceci est uniquement utile
			// pour le parsevariable (voir methode me.p)
			var match = source.match(/(myexecutefunc=)function.*\((.*)\).*{([\s\S]*)/m);
			// var match = source.match(/([\s\S]*)function.*\((.*)\).*{([\s\S]*)/m);
			var s = match[1] + "function(" + match[2] + "){";
			var params = match[2].replace(/\s*/g, "").split(",");
			i=0, t=params.length;
			while (i<t) {
				if (params[i] !== '') {s += `\n$locvar_${params[i]}=${params[i]};`;}
				i++;
			}
			s += match[3];
			// Eval is evil ? :
			// console.log(s);
			eval(s);
			i=0, t=this.$macroFinals.length;
			while (i<t) {this.f(this.$macroFinals[i++]).setHidden(false);}
		} catch (err) {
			alert(err.message);
		}
		// me.C.setDeps();
		this.$macromode = false;
		this.$macroFinals = null;
		this.C.validate(this.E);
		this.C.computeAll();
		this.Z.paint(this.E);
		this.clearNameSpace();
	}
	// Trouve et renvoie l'objet nommé _s :
	f(_s) {
		return this.C.find(_s);
	}
	fv(_s) {
		return this.C.findVar(_s);
	}
	construct<T>(constructor:(...any)=>void, args:any[]): T {
		function F() {
			constructor.apply(this, args);
		}
		F.prototype = constructor.prototype;
		return new F();
	}
	/**
	 * Create a new ConstructionObject and return its name
	 */
	o(...args:any[]): string {
		// the first argument is a string that maps to a globally set variable which is a constructor
		var Co = <(...any)=>void>(<any>this.W)[args[0]];
		// the first argument is the `Construction` instance
		args.unshift(this.C);
		var o = this.construct(Co, args);
		if (this.$macromode) {o.setHidden(2);}
		// me.Z.addObject(o);
		this.C.add(o);
		return o.getName();
	}
	/**
	 * Test if the amount of arguments is less than expected
	 */
	t(expectedArgsNumber:number): boolean {
		return this.t.caller.arguments.length < expectedArgsNumber;
	}
	/**
	 * Change the arguments of a function by adding a generic name
	 */
	a(code) {
		// Fonction appelante :
		var myFunc = this.a.caller;
		var args = myFunc.arguments;
		// Ajoute un nom générique en début d'arguments :
		Array.prototype.unshift.call(args, '_'+code);
		// Appelle la fonction avec le bon nombre d'arguments :
		return myFunc.apply(this, args);
	}
	// Ajoute les arguments passés à la fin des arguments d'une fonction appelante :
	/**
	 * Append the passed arguments to the calling function
	 */
	b() {
		// Fonction appelante :
		var myFunc = this.b.caller;
		var args = myFunc.arguments;
		for (var i = 0, len = arguments.length; i < len; i++) {
			Array.prototype.push.call(args, arguments[i]);
		}
		// Appelle la fonction avec le bon nombre d'arguments :
		return myFunc.apply(this, args);
	}
	// parseVariable :
	p(s:string): string {
		if (s.charAt(0) === "_") {
			var n = s.substring(1);
			return window[n] === undefined
				? window["$locvar_" + n]
				: window[n];
		}
		return s;
	}
	CreateFunctionFromExpression(_s, _v) {
		// if (_s === "") _s = "NaN";
		var t = _s.split(";");
		t[t.length - 1] = "return (" + t[t.length - 1] + ");";
		var s = t.join(";");
		var f = null;
		// Si f renvoie "undefined" c'est qu'il y a une erreur de
		// référence : par exemple x(A) où A n'existe pas dans la
		// figure. Dans tous les autres cas d'erreur, f renvoie NaN.
		try {
			f = eval(`function (${_v}){try{with(Math){with(EX){${s}}}}catch(e){return undefined;}}`);
		} catch (e) {
			f = eval('(function(){return NaN})');
		}
		return f;
	}
	getEXPS() {
		return this.EXPS;
	}
	ExpressionInit(_o, _s) {
		// ******* SPARADRAP : je ne comprends pas pourquoi des EX_funcValue(5)
		// traînent dans le source utilisateur de certaines expressions (de dérivées).
		// On nettoie donc tout ça pour remplacer par le nom actuel
		_s = _s.replace(/EX_funcValue\((\d+)\)/g, function(m, g) {
			var ex = this.EXPS[parseInt(g)];
			return ex.getName();
		});
		var s = _s;
		// console.log("ExpressionInit !!! : "+s);
		// Sauvegarde des toutes les parties texte de l'expression :
		var txts = [];
		var maskTxts = "___TEXTES___";
		var stt = s;
		var s2 = s.replace(/(\"[^\"]*\")/g, function(m, t) {
			txts.push(t);
			return (maskTxts + (txts.length - 1));
		});
		s2 = functionReplace(s2);
		s2 = EXinit("EX_funcValue")(_o, s2);
		s2 = EXinit("EX_getObj")(_o, s2);
		// Remplacement des fonctions personnelles x,y,etc... 
		// par une notation interne EX_x,EX_y,etc... :
		for (var f in EX) {
			var myF = f.split("_")[1];
			s2 = s2.replace(new RegExp("(\\W|^)\\s*" + myF + "\\s*\\(", "g"), "$1" + f + "(");
		}
		// s3 contient une forme intermédiaire de l'expression. Il s'agit d'une chaine du type
		// "EX_y(EX_funcValue(0)__())+x^2" lorsque l'utilisateur a entré "y(P1)+x^2".
		// Cette chaine correspond au paramètre "pseudo" de l'objet renvoyé, qui sera
		// utilisé pour délivrer le source de l'expression :
		var s3 = s2.replace(new RegExp(maskTxts + "(\\d+)", "g"), (_, d) => txts[_d]);
		if (isValidParenthesis(s2)) {
			// On ne touche que la dernière partie de la suite
			// d'instruction (après le dernier ";") :
			var allExp = s2.split(";");
			var _s2 = allExp[allExp.length - 1];
			_s2 = addTimesSymbol(_s2);
			_s2 = _s2.replace(/\u03C0/g, "PI");
			_s2 = _s2.replace(/\bi\b/g, "[0,1]");
			_s2 = operatorReplace(_s2);
			allExp[allExp.length - 1] = _s2;
			s2 = allExp.join(";");
		}
		// nécessaire pour rétablir le code functionReplace qui évite
		// la multiplication entre les parenthèses d'un calcul d'image :
		s2 = s2.replace(/\)__\(/g, ")(");
		// Remplacement des ".dx." , ".dy." etc... par ".dx()." , ".dy()." etc...
		var reg = new RegExp("\\.d([xyzt]{1})\\.");
		while (reg.test(s2))
			s2 = s2.replace(reg, ".d$1().");
		s2 = s2.replace(/\.d([xyzt]{1})\s*$/, ".d$1()");
		// Restitution de tous les textes :
		s2 = s2.replace(new RegExp(maskTxts + "(\\d+)", "g"), function(m, _d) {
			return txts[_d];
		});
		// if ((s2 !== "") && ((isValidParenthesis(s2)))) {
		//     console.log("***user result = " + s);
		//     console.log("pseudo result = " + s3);
		//     console.log("main result = " + s2);
		//     // console.log("name : " + _o.getName());
		// }
		return {
			user: s,
			pseudo: s3,
			js: s2,
			jsbackup: s2
		};
	}
	// Renvoie le source de l'expression. Principalement,
	// il s'agit de remplacer la représentation numérique 
	// interne par le nom actuel des objets.
	ExpressionSrc(_s:string) {
		var s = _s;
		while (s.indexOf("EX_funcValue") !== -1) {
			s = s.replace(/EX_funcValue\((\d+)\)__\(([^\)]*)\)/, function(_m, _d1, _d2) {
				var _n = this.EXPS[_d1].getVarName();
				if (_d2 !== "")
					_n += "(" + _d2 + ")";
				return _n;
			});
		}
		while (s.indexOf("EX_getObj") !== -1) {
			s = s.replace(/EX_getObj\((\d+)\)./, function(_m, _d1) {
				var _n = this.EXPS[_d1].getVarName() + ".";
				return _n;
			});
		}
		s = s.replace(/EX_/g, "");
		s = s.replace(/\"/g, "\\\"");
		return s;
	}
	getEX(): Expr {
		return this.EX;
	}
	getMath(): iMathExtension {
		return Math;
	}
	// Copie le namespace de cette iframe onload (voir canvas) :
	copyNameSpace() {
		for (var key in window) {
			this.namespace[key] = key;
		}
	}
	private GetCanvas(): iCanvas {
		return this.Z;
	}
	// Blockly part :
	private GLOBAL_SET(k, v) {
		this.blockly_namespace[k] = v;
	}
	private GLOBAL_GET(k, _?) {
		return this.blockly_namespace[k];
	}
	private GLOBAL_INC(k, v) {
		var V = v === undefined ? 1 : v;
		this.blockly_namespace[k] = Math.plus(this.blockly_namespace[k], V);
	}
	private SET_EXP(_e, _m) {
		var o = this.f(_e);
		o.setExpression(JSON.stringify(_m).replace(/null/g, 'NaN'));
	}
	private BLK_STL(_n, _cmd, _tab) {
			var o = this.f(_n);
			o[_cmd].apply(o, _tab);
	}
	private clearNameSpace() {
		for (let k in window) {
			if (!this.namespace.hasOwnProperty(k)) {
				window[k] = null;
				delete window[k];
			}
		}
	}
	// UNIQUEMENT POUR LA TORTUE :
	private TURTLE_INIT(_name, _pt) {
		var t = this.TURTLE_VARS;
		t.U = [1, 0, 0];
		t.V = [0, 1, 0];
		t.W = [0, 0, 1];
		t.LAST = _pt;
		t.D3 = (_pt.length === 3);
		t.PENUP = false;
		t.TAB = [
			[10, 0, 0, 1], // Taille du crayon
			[12, 0, 0, 1e-13], // Taille des points
			[2, 0, 0, 55], // Couleur choisie
			_pt
		];
		t.NAME = _name;
		this.Z.blocklyManager.resetTurtle(t.NAME);
	}
	private TURTLE_RESULT() {
		return this.TURTLE_VARS.TAB;
	}
	private TURTLE_POS() {
		return this.TURTLE_VARS.LAST
	}
	private TURTLE_GET(_n:string, _i) {
		var o = this.f("blk_turtle_list_" + _n);
		return o.getPtNum(_i);
	}
	private TURTLE_LENGTH(_n:string, _i) {
		var o = this.f("blk_turtle_list_" + _n);
		return o.getPtLength();
	}
	private TURTLE_RESET() {
		var t = this.TURTLE_VARS;
		t.U = [1, 0, 0];
		t.V = [0, 1, 0];
		t.W = [0, 0, 1];
		this.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
	}
	private TURTLE_PRINT(_t:number) {
		var t = this.TURTLE_VARS;
		// _t = "'" + _t + "'";
		t.TAB.push([20, 0, _t, t.U]);
	}
	private TURTLE_FONT(_f, _s, _stl, _al) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([21, 0, 0, [_f, _s, _stl, _al]]);
		t.TAB.push(last);
	}
	private TURTLE_MV(_val, _px) {
		var value = (_px) ? Math.quotient(_val, this.C.coordsSystem.getUnit()) : _val;
		var t = this.TURTLE_VARS;
		var dir = t.U.slice();
		if (!t.D3) dir.pop();
		t.LAST = Math.plus(t.LAST, Math.times(value, dir));
		if (t.PENUP) t.TAB.push([NaN, NaN, NaN]);
		t.TAB.push(t.LAST);
		this.Z.blocklyManager.changeTurtlePT(t.NAME, t.LAST);
	}
	private TURTLE_TURN(_angle:number) {
		var c = Math.cos(_angle);
		var s = Math.sin(_angle);
		var t = this.TURTLE_VARS;
		var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
		var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
		t.U = up;
		t.V = vp;
		this.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
	}
	private TURTLE_ROTATE(_angle:number, _istop:boolean) {
		var c = Math.cos(_angle);
		var s = Math.sin(_angle);
		var t = this.TURTLE_VARS;
		if (_istop) {
			var up = [c * t.U[0] + s * t.W[0], c * t.U[1] + s * t.W[1], c * t.U[2] + s * t.W[2]];
			var wp = [c * t.W[0] - s * t.U[0], c * t.W[1] - s * t.U[1], c * t.W[2] - s * t.U[2]];
			t.U = up;
			t.W = wp;
		} else {
			var vp = [c * t.V[0] + s * t.W[0], c * t.V[1] + s * t.W[1], c * t.V[2] + s * t.W[2]];
			var wp = [c * t.W[0] - s * t.V[0], c * t.W[1] - s * t.V[1], c * t.W[2] - s * t.V[2]];
			t.V = vp;
			t.W = wp;
		};
		this.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
	}
	private TURTLE_UP(_isup:boolean) {
		this.TURTLE_VARS.PENUP = _isup;
	}
	private TURTLE_COLOUR(_n) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([2, 0, 0, _n]);
		t.TAB.push(last);
	}
	private TURTLE_COLOUR_INCREMENT(_w) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([3, 0, 0, _w]);
		t.TAB.push(last);
	}
	private TURTLE_FILL(_op) {
		var t = this.TURTLE_VARS;
		t.TAB.push([4, 0, 0, _op]);
	}
	private TURTLE_WIDTH(_w) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([10, 0, 0, _w]);
		t.TAB.push(last);
	}
	private TURTLE_POINTS_WIDTH(_w) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([12, 0, 0, _w]);
		t.TAB.push(last);
	}
	private TURTLE_WIDTH_INCREMENT(_w) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([11, 0, 0, _w]);
		t.TAB.push(last);
	}
	private TURTLE_POINTS_WIDTH_INCREMENT(_w) {
		var t = this.TURTLE_VARS;
		var last = t.TAB.pop();
		t.TAB.push([13, 0, 0, _w]);
		t.TAB.push(last);
	}
	private TURTLE_ROTATE_PT(_pt) {
		var c, s;
		var t = this.TURTLE_VARS;
		var last = t.LAST.slice();
		var p = Math.minus(_pt, last); // translation
		if (t.D3) {
			// Changement de repère :
			var pp = [p[0] * t.U[0] + p[1] * t.U[1] + p[2] * t.U[2], p[0] * t.V[0] + p[1] * t.V[1] + p[2] * t.V[2], p[0] * t.W[0] + p[1] * t.W[1] + p[2] * t.W[2]];
			var d1 = Math.sqrt(pp[0] * pp[0] + pp[1] * pp[1]);
			if (d1 > 1e-13) {
				c = pp[0] / d1; // cosinus
				s = pp[1] / d1; // sinus
				var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
				var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
				t.U = up;
				t.V = vp;
			}
			var d3D = Math.sqrt(pp[0] * pp[0] + pp[1] * pp[1] + pp[2] * pp[2]);
			c = d1 / d3D;
			s = pp[2] / d3D;
			up = [c * t.U[0] + s * t.W[0], c * t.U[1] + s * t.W[1], c * t.U[2] + s * t.W[2]];
			var wp = [c * t.W[0] - s * t.U[0], c * t.W[1] - s * t.U[1], c * t.W[2] - s * t.U[2]];
			t.U = up;
			t.W = wp;
		} else {
			// Changement de repère :
			var pp = [p[0] * t.U[0] + p[1] * t.U[1], p[0] * t.V[0] + p[1] * t.V[1]];
			var d1 = Math.sqrt(pp[0] * pp[0] + pp[1] * pp[1]);
			c = pp[0] / d1; // cosinus
			s = pp[1] / d1; // sinus
			var up = [c * t.U[0] + s * t.V[0], c * t.U[1] + s * t.V[1], c * t.U[2] + s * t.V[2]];
			var vp = [c * t.V[0] - s * t.U[0], c * t.V[1] - s * t.U[1], c * t.V[2] - s * t.U[2]];
			t.U = up;
			t.V = vp;
		}
		this.Z.blocklyManager.changeTurtleUVW(t.NAME, t.U, t.V, t.W);
	}
	private TURTLE_JOIN_PT(_pt) {
		this.TURTLE_ROTATE_PT(_pt);
		this.TURTLE_MV(Math.distance(this.TURTLE_VARS.LAST, _pt), false);
	}
	// Methode obsolete, maintenue pour la 
	// compatibilité des figures 3D d'avant
	// le 22 novembre 2013 :
	private Set3DConstruction(_b) {
		return this.C.set3DMode(_b);
	}
	private Set3D(_b) {
		this.C.set3D(_b);
	}
	private Text(_m, _l, _t, _w, _h, _stl) {
		this.Z.addText(_m, _l, _t, _w, _h, _stl);
	}
	private Input(_q, _i) {
		if (!_i) {_i = "";}
		return prompt(_q, _i);
	}
	private Print(_m) {
		if (this.$caller) {this.$caller.print(JSON.stringify(_m));}
		return null;
	}
	private Println(_m) {
		if (this.$caller) {this.$caller.print(JSON.stringify(_m) + "\n");}
		return null;
	}
	private GetExpressionValue(_e, _x, _y, _z, _t) {
		var o = this.f(_e);
		return (o ? JSON.parse(this.$U.parseArrayEnglish(o.getValue(_x, _y, _z, _t))) : NaN);
	}
	private SetExpressionValue(_e, _m) {
		var o = this.f(_e);
		o.setExp(JSON.stringify(_m).replace(/null/g, "NaN"));
	}
	private Find(_n) {
		var o = this.f(_n);
		return (o ? o : parent.document.getElementById(_n));
	}
	private RefreshInputs() {
		this.Z.textManager.refreshInputs();
	}
	private Timer(_dlay) {
		return new this.$U.timers(_dlay)
	}
	private Coords(_n) {
		var o = this.f(_n);
		if (o.is3D()) {
			this.C.setcompute3D_filter(o.coords3D);
			this.C.computeAll();
			this.C.clearcompute3D_filter();
			return o.getOldcoords();
		} else {
			return o.coords2D();
		}
	}
	private Point(_n, _x, _y) {
		if (this.t(3)) {return this.a("P");}
		if (isStr(_x))  {
			var o = this.f(this.o("PointObject", _n, 0, 0));
			o.setEXY(_x);
			return o.getName();
		}
		var px = this.C.coordsSystem.px(_x);
		var py = this.C.coordsSystem.py(_y);
		return this.o("PointObject", _n, px, py);
	}
	private PointOn(_n, _a, _alpha) {
		if (this.t(3)) {return this.a("P");}
		var on = this.f(_a);
		var o = this.f(this.o("PointObject", _n, 0, 0));
		o.addParent(on);
		o.setAlpha(_alpha);
		on.projectAlpha(o);
		o.setFillStyle();
		return o.getName();
	}
	// Attention danger ! je viens de supprimer ces deux
	// méthode en espérant qu'elles n'ont jamais été utilisées.
	// Le nom interférait avec le scope et appeler des objets
	// X ou Y pouvait provoquer des bloquages...
	//    var X = function(_P) {
	//        return this.C.coordsSystem.x(this.f(_P).getX());
	//    }
	//    var Y = function(_P) {
	//        return this.C.coordsSystem.y(this.f(_P).getY());
	//    }
	private Move(_P, _x, _y) {
		var o = this.f(_P);
		if (isStr(_x))  {
			o.setEXY(_x);
			return;
		}
		o.setXY(this.C.coordsSystem.px(_x), this.C.coordsSystem.py(_y));
		setTimeout(function() {
			this.C.compute();
			this.Z.paint();
		}, 1);
	}
	private InteractiveInput(_m, _type) {
		throw {
			name: "System Error",
			level: "Show Stopper",
			message: "Error detected. Please contact the system administrator.",
			htmlMessage: "Error detected. Please contact the <a href=\"mailto:sysadmin@acme-widgets.com\">system administrator</a>.",
			toString: function() {return this.name + ": " + this.message;}
		};
	}
	private OrderedIntersection(_n, _a, _b, _order, _away) {
		if (this.t(2)) {return this.a("P");}
		if (this.t(3)) {return this.b();}
		if (this.t(4)) {return this.a("P");}
		var c1 = this.f(_a);
		var c2 = this.f(_b);
		var o = this.f(this.o("PointObject", _n, 0, 0));
		o.addParent(c1);
		o.addParent(c2);
		o.setOrder(_order);
		if (_away !== undefined) {o.setAway(this.f(_away));}
		o.setFillStyle();
		return o.getName();
	}
	private SetCoords(_x0, _y0, _u, _md3D) {
		this.C.coordsSystem.setCoords(_x0, _y0, _u, _md3D);
	}
	private Circle(_n, _a, _b) {
		if (this.t(3)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("CircleObject", _n, A, B);
	}
	private Circle1(_n, _a, _r) {
		if (this.t(3)) {return this.a("C");}
		var A = this.f(_a);
		if (isStr(_r)) {
			var o = this.f(this.o("Circle1Object", _n, A, 0));
			o.setRX(_r);
			return o.getName();
		}
		var r = this.C.coordsSystem.lx(_r);
		return this.o("Circle1Object", _n, A, r);
	}
	private FixedAngle(_n, _a, _b, _ex, _trig) {
		if (this.t(5)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var o = this.f(this.o("FixedAngleObject", _n, A, B, _trig));
		o.setExp(_ex);
		return o.getName();
	}
	private Circle3(_n, _a, _b, _m) {
		if (this.t(4)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var M = this.f(_m);
		return this.o("Circle3Object", _n, A, B, M);
	}
	private Circle3pts(_n, _a, _b, _c) {
		if (this.t(4)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var C = this.f(_c);
		return this.o("Circle3ptsObject", _n, A, B, C);
	}
	private Circle3pts3D(_n, _a, _b, _c) {
		if (this.t(4)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var C = this.f(_c);
		return this.o("Circle3ptsObject_3D", _n, A, B, C);
	}
	private Center(_n, _c) {
		if (this.t(2)) {return this.a("P");}
		var C = this.f(_c);
		C.getP1().setName(_n);
		if (this.$macromode) {C.getP1().setHidden(1);}
		return C.getP1().getName();
	}
	private Arc3pts(_n, _a, _b, _c) {
		if (this.t(4)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var C = this.f(_c);
		return this.o("Arc3ptsObject", _n, A, B, C);
	}
	private Quadric(_n, _a, _b, _c, _d, _e) {
		if (this.t(6)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var C = this.f(_c);
		var D = this.f(_d);
		var E = this.f(_e);
		return this.o("QuadricObject", _n, A, B, C, D, E);
	}
	private Angle(_n, _a, _b, _c) {
		if (this.t(4)) {return this.a("C");}
		var A = this.f(_a);
		var B = this.f(_b);
		var C = this.f(_c);
		return this.o("AngleObject", _n, A, B, C);
	}
	// var Angle180 = function (_a, _o, _c) {}
	// var Angle360 = function (_a, _o, _c) {
	// 	console.log("Angle360");
	// 	var A = this.f(_a);
	// 	var O = this.f(_o);
	// 	var C = this.f(_c);
	// 	var xOA = A.getX() - O.getX(), yOA = A.getY() - O.getY();
	// 	var xOC = C.getX() - O.getX(), yOC = C.getY() - O.getY();
	// 	var start = Math.angleH(xOA, yOA);
	// 	var end = Math.angleH(xOC, yOC);
	// 	return (end - start)
	// }
	private X_axis(_n) {
		var n = this.o("OXObject", _n);
		this.C.coordsSystem.setOX(this.C.find(n));
		return n;
	}
	private Y_axis(_n) {
		var n = this.o("OYObject", _n);
		this.C.coordsSystem.setOY(this.C.find(n));
		return n;
	}
	private Line(_n, _a, _b) {
		if (this.t(3)) {return this.a("L");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("TwoPointsLineObject", _n, A, B);
	}
	private Ray(_n, _a, _b) {
		if (this.t(3)) {return this.a("R");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("RayObject", _n, A, B);
	}
	private Segment(_n, _a, _b) {
		if (this.t(3)) {return this.a("S");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("SegmentObject", _n, A, B);
	}
	private Vector(_n, _a, _b) {
		if (this.t(3)) {return this.a("V");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("VectorObject", _n, A, B);
	}
	private First(_n, _s) {
		if (this.t(2)) {return this.a("P");}
		var S = this.f(_s);
		return S.getP1().getName();
	}
	private Second(_n, _s) {
		if (this.t(2)) {return this.a("P");}
		var S = this.f(_s);
		return S.getP2().getName();
	}
	private DefinitionPoint(_n, _s, _i) {
		if (this.t(3)) {return this.a("P");}
		var S = this.f(_s);
		return S.getPt(_i).getName();
	}
	private Parallel(_n, _l, _p) {
		if (this.t(3)) {return this.a("Par");}
		var L = this.f(_l);
		var P = this.f(_p);
		return this.o("ParallelLineObject", _n, L, P);
	}
	private Perpendicular(_n, _l, _p) {
		if (this.t(3)) {return this.a("Perp");}
		var L = this.f(_l);
		var P = this.f(_p);
		return this.o("PlumbObject", _n, L, P);
	}
	private MidPoint(_n, _a, _b) {
		if (this.t(3)) {return this.a("M");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("MidPointObject", _n, A, B);
	}
	private Symmetry(_n, _a, _b) {
		if (this.t(3)) {return this.a("M");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("SymcObject", _n, A, B);
	}
	private Reflection(_n, _l, _p) {
		if (this.t(3)) {return this.a("M");}
		var L = this.f(_l);
		var P = this.f(_p);
		return this.o("SymaObject", _n, L, P);
	}
	private PerpendicularBisector(_n, _a, _b) {
		if (this.t(3)) {return this.a("L");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("PerpBisectorObject", _n, A, B);
	}
	private AngleBisector(_n, _a, _b, _c) {
		if (this.t(4)) {return this.a("L");}
		var A = this.f(_a);
		var B = this.f(_b);
		var C = this.f(_c);
		return this.o("AngleBisectorObject", _n, A, B, C);
	}
	private Polygon(_n, _pts) {
		if (this.t(2)) {return this.a("A");}
		// console.log(_pts);
		var pts = _pts.split(",");
		for (var i = 0; i < pts.length; i++) {
				// console.log((this.p(pts[i])));
				pts[i] = this.f(this.p(pts[i]));
		}
		pts.push(pts[0]);
		return this.o("AreaObject", _n, pts);
	}
	private Locus(_n, _a, _b) {
		if (this.t(3)) {return this.a("Locus");}
		var A = this.f(_a);
		var B = this.f(_b);
		return this.o("LocusObject", _n, A, B);
	}
	private Curvus(_n, _a, _b, _t) {
		if (this.t(4)) {return this.a("f");}
		return this.o("CurvusObject", _n, _a, _b, _t);
	}
	private CartesianFunction(_n, _a, _b, _t) {
		if (this.t(4)) {return this.a("f");}
		return this.o("CurvusObject", _n, _a, _b, _t);
	}
	private ParametricFunction(_n, _a, _b, _t1, _t2) {
		if (this.t(5)) {return this.a("f");}
		return this.o("CurvusObject", _n, _a, _b, _t1, _t2);
	}
	private BlocklyButton(_n, _m, _x, _y) {
		if (this.t(4)) {return this.a("blk_btn");}
		var px = this.C.coordsSystem.px(_x);
		var py = this.C.coordsSystem.py(_y);
		return this.o("BlocklyButtonObject", _n, _m, px, py);
	}
	private Expression(_n, _t, _min, _max, _e, _x, _y) {
		if (this.t(5)) {return this.a("E");}
		var px = this.C.coordsSystem.px(_x);
		var py = this.C.coordsSystem.py(_y);
		return this.o("ExpressionObject", _n, _t, _min, _max, _e, px, py);
	}
	private ExpressionOn(_n, _t, _min, _max, _e, _a, _alpha) {
		if (this.t(5)) {return this.a("E");}
		var on = this.f(_a);
		var ex = this.f(this.o("ExpressionObject", _n, _t, _min, _max, _e, 0, 0));
		ex.attachTo(on);
		ex.setAlpha(_alpha);
		on.projectAlpha(ex);
		return ex.getName();
	}
	private List(_n, _exp) {
		if (this.t(2)) {return this.a("List");}
		var _E = this.f(_exp);
		return this.o("ListObject", _n, _E);
	}
	private parseBoolean(val) {
		return !!JSON.parse(String(val).toLowerCase());
	}
	private BLK(_n, _s) {
		var o = this.f(_n);
		// console.log(_s);
		o.blocks.setSource(_s);
	}
	private STL(_n, _s) {
		var o = this.f(_n);
		_s = _s.split(";");
		for (var i = 0, len = _s.length; i < len; i++) {
			var e = _s[i].split(":");
			e[1] = this.p(e[1]);
			switch (e[0]) {
				case  "c": o.setColor(e[1]); break; // Color
				case  "h": o.setHidden(e[1]); break; // Hidden
				case  "o": o.setOpacity(parseFloat(e[1])); break; // Opacity
				case  "s": o.setSize(parseFloat(e[1])); break; // Size
				case "sn": o.setShowName(e[1]); break; // Show name
				case  "f": o.setFontSize(parseInt(e[1])); break; // Font size
				case  "l": o.setLayer(parseInt(e[1])); break; // Layer
				case  "p": o.setPrecision(e[1]); break; // Précision numérique
				case "sp": o.setShape(parseInt(e[1])); break; // Forme des points
				case  "i": o.setIncrement(parseFloat(e[1])); break; // Incrément
				case "sb": o.setOnBoundary(e[1]); break; // Sur le contour d'un polygone
				case "dh": o.setDash(this.parseBoolean(e[1])); break; // Pointillés
				case"nmi": o.setNoMouseInside(this.parseBoolean(e[1])); break; // No Mouse Inside (Inerte)
				case "np": o.setNamePosition(e[1]); break; // Position du nom des objets
				case "am": o.set360(this.parseBoolean(e[1])); break; // Angle mode : 360° or not
				case "tk": e[1] && setTimeout(() => this.Z.trackManager.add(o, true), 1); break; // Trace de l'objet
				case "fl": e[1] && (o.setFloat(true), o.free = () => false); break; // Objet flottant
				case"cPT": this.STL(o.getcPTName(), this.$U.base64_decode(e[1])); break; // Point d'un curseur d'expression
				case "cL": o.setCursorLength(parseInt(e[1])); break; // Point d'un curseur d'expression
				case "sg": o.setSegmentsSize(e[1]); break; // With segments (for list objects)
				case "ar": o.setArrow(JSON.parse(e[1])); break; // Flèches pour les listes
				case"arc": o.setArcRay(JSON.parse(e[1])); break; // Rayon des arcs pour les angles
				case "mg": // Magnétisme des objets
					var t = eval("[" + e[1] + "]");
					for (var k = 0; k < t.length; k++) {t[k][0] = this.C.find(t[k][0]);};
					o.setMagnets(t);
					break;
				case "an": // Animations
					var t = eval("[" + e[1] + "]");
					this.C.addAnimation(o, t[0][0], t[0][1], t[0][2]);
					break;
				case "dp": // Dépendance des objets
					var t = e[1].substring(1, e[1].length - 1).split(",");
					for (var k = 0; k < t.length; k++) {
						try {
							t[k] = eval(t[k]);
							t[k] = this.C.find(t[k]);
						} catch (e) {
							try {
								t[k] = eval("$locvar_" + t[k]);
								t[k] = this.C.find(t[k]);
							} catch (e) {
								console.log("Polygon dependance error !");
							}
						}
					}
					o.setDragPoints(t);
					break;
			}
		}
	}
	private SetGeneralStyle(str:string) {
		let a = str.split(";");
		for (var i = 0, len = a.length; i < len; i++) {
			var e = a[i].split(":");
			switch (e[0]) {
				case "background-color": this.Z.setBackground(e[1]); break;
				case "degree": this.C.setDEG(e[1] === "true"); break;
				case "dragmoveable": this.C.setDragOnlyMoveable(e[1] === "true"); break;
			}
		}
	}
	private SetCoordsStyle(str:string) {
		let a = str.split(";");
		var cs = this.C.coordsSystem;
		for (var i = 0, len = a.length; i < len; i++) {
			var e = a[i].split(":");
			switch (e[0]) {
				case "is3D":      this.C.set3DMode(e[1] === "true"); break; // Obsolète
				case "3Dmode":    this.C.set3D(e[1] === "true"); break;
				case "isAxis":    cs.showCS(e[1] === "true"); break;
				case "isGrid":    cs.showGrid(e[1] === "true"); break;
				case "isOx":      cs.showOx(e[1] === "true"); break;
				case "isOy":      cs.showOy(e[1] === "true"); break;
				case "isLockOx":  cs.setlockOx(e[1] === "true"); break;
				case "isLockOy":  cs.setlockOy(e[1] === "true"); break;
				case "centerZoom":cs.setCenterZoom(e[1] === "true"); break;
				case "fontSize":  cs.setFontSize(parseInt(e[1])); break;
				case "axisWidth": cs.setAxisWidth(parseFloat(e[1])); break;
				case "gridWidth": cs.setGridWidth(parseFloat(e[1])); break;
				case "color":     cs.setColor(e[1]); break;
			}
		}
	}
	private pushEXP(_o) {
		var i = this.EXPS.indexOf(_o);
		if (i === -1) {
				this.EXPS.push(_o);
				return (this.EXPS.length - 1);
		}
		return i;
	}
	private getEXP(_i) {
		return this.EXPS[_i];
	}
	private isValidParenthesis(_s) {
		var parentheses = 0;
		var crochets = 0;
		var REGsequence = [];
		for (var i = 0, len = _s.length; i < len; i++) {
			if (_s.charAt(i) === "(") {parentheses++;}
			if (_s.charAt(i) === "[") {crochets++;}
			else {
				if (_s.charAt(i) === ")") {REGsequence.push(/(\([^\(\)]*\))/), parentheses--;}
				if (_s.charAt(i) === "]") {REGsequence.push(/(\[[^\[\]]*\])/), crochets--;}
			}
			if ((parentheses < 0) || (crochets < 0)) {return null;}
		}
		if ((parentheses === 0) && (crochets === 0)) {return REGsequence;}
		return null;
	}
	private transformOpposite(_st) {
		// if (!isValidParenthesis(_st)) return _st;
		// var allExp = _st.split(";");
		// var _s = allExp[allExp.length - 1];
		_st = _st.replace(/\-([\d\.]+)/g, (_, d) => `+(-${d}")`);
		return _st;
	}
	private operatorReplace(_st) {
		var regs = this.isValidParenthesis(_st);
		if (regs) {
			// Remplacement des signes "-" par "0-"
			// devant certains caractères spéciaux :
			_st = _st.replace(/^\s*-/g, "0-");
			_st = _st.replace(/\(\s*-/g, "(0-");
			_st = _st.replace(/\[\s*-/g, "[0-");
			_st = _st.replace(/,\s*-/g, ",0-");
			_st = _st.replace(/\?\s*-/g, "?0-");
			_st = _st.replace(/:\s*-/g, ":0-");
			var tab = [];
			var mask = "___mainMask___";
			for (var i = 0; i < regs.length; i++) {
				_st = _st.replace(regs[i], function(m, t) {
					tab.push(t);
					return (mask + (tab.length - 1));
				});
			}
			// Ce qui reste de la chaine est mis en mask pour initialiser
			// le replace recursif :
			tab.push(_st);
			_st = mask + (tab.length - 1);
			var tabOp = [];
			var maskOp = "___joker_replaceOp___";
			// Toutes les expressions dans tab commencent et terminent
			// par des parenthèses, mais sans aucune parenthèse intérieure.
			// On peut donc appliquer des règles de priorité simples
			// (ça tombe bien, les parcours regex se font de gauche à droite !) :
			for (var i = 0, len = tab.length; i < len; i++) {
				tab[i] = this.replaceOp(tab[i], "\\^", tabOp, maskOp);
				tab[i] = this.replaceOp(tab[i], "\\*|\\/", tabOp, maskOp);
				tab[i] = this.replaceOp(tab[i], "\\+|\\-", tabOp, maskOp);
				while (tab[i].indexOf(maskOp) > -1) {
					// On remplace le joker par sa vraie valeur, et dans le
					// même temps on remplace le caret par la fonction pow :
					tab[i] = tab[i].replace(new RegExp(maskOp + "(\\d+)", "g"), function(m, d) {
						return tabOp[d];
					});
				}
				// console.log("***tab[" + i + "]=" + tab[i]);
			}
			while (_st.indexOf(mask) > -1) {
				// On remplace le joker par sa vraie valeur, et dans le
				// même temps on remplace l'opérateur par la fonction correspondante :
				_st = _st.replace(new RegExp(mask + "(\\d+)", "g"), function(m, d) {
					return tab[d];
				});
			}
			return _st;
		}
	}
	private replaceOp(_s, _op, _atom, _mask) {
		var ops = {
			"^": "power",
			"*": "times",
			"/": "quotient",
			"+": "plus",
			"-": "minus"
		};
		var s0 = "";
		var s1 = _s;
		while ((s0 !== s1)) {
			s0 = s1;
			s1 = s1.replace(new RegExp("([a-zA-Z0-9_.]*)(" + _op + ")([a-zA-Z0-9_.]*)", ""), function(_m, _d1, _o, _d2) {
				_atom.push(ops[_o] + "(" + _d1 + "," + _d2 + ")");
				return (_mask + (_atom.length - 1));
			});
		}
		return s1;
	}
	private addTimesSymbol(_s) {
		// PI a pour valeur unicode : \u03C0
		_s = _s.replace(/Angle360/g, "Angle360_"); // avoid conflict with 3(x+2) rule
		_s = _s.replace(/Angle180/g, "Angle180_"); // avoid conflict with 3(x+2) rule
		_s = _s.replace(/(^|[^A-Za-z])(\d+|\u03C0+)\s*([A-Za-z]+|\u03C0+)/g, "$1$2*$3"); // Du type 2x -> 2*x
		_s = _s.replace(/\)\s*\(/g, ")*("); // Du type (x+1)(x+2) -> (x+1)*(x+2)
		_s = _s.replace(/(\d+|\u03C0)\s*\(/g, "$1*("); // Du type 3(x+2) -> 3*(x+2)
		_s = _s.replace(/\)\s*([A-Za-z]+)/g, ")*$1"); // Du type (x+2)sin(a) -> (x+2)*sin(a)
		_s = _s.replace(/\b([xyzt]{1})([xyzt]{1})\b/g, "$1*$2"); // Du type xy -> x*y
		_s = _s.replace(/Angle180_/g, "Angle180");
		_s = _s.replace(/Angle360_/g, "Angle360");
		return _s;
	}
	private functionReplace(_s) {
		var tabExpr = [];
		var maskExpr = "___EXPR___";
		if (!this.isValidParenthesis(_s)) {return _s;}
		// Remplacement des expressions sans variable : E1 -> ___EXPR___n
		// et mise du contenu en mémoire tabExpr[n]="funcValue(E1)()"
		// _s = _s.replace(/\b(\w+)\b([^\(]|$)/g, function(m, _n, _e) {
		_s = _s.replace(/([àáâãäåæçèéêëìíîïñòóôõöœùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖŒÙÚÛÜÝŸΆΈ-ώἀ-ῼa-zA-Z0-9_]+)([^\(]|$)/g, function(m, _n, _e) {
			var o = (window[_n] === undefined) ? this.fv(window["$locvar_" + _n]) : this.fv(window[_n]);
			if (o === undefined) {o = this.fv(_n);}
			if (o === undefined) {return (_n + _e);}
			//            console.log("trouvé !!!");
			//            if ((o === undefined) || (o.getCode() !== "expression")) return (_n + _e);
			if ("." === _e.charAt(0))
				tabExpr.push("getObj(" + _n + ")");
			else
				tabExpr.push("funcValue(" + _n + ")__()");
			return (maskExpr + (tabExpr.length - 1) + _e);
		});
		// Remplacement des fonctions d'une variable : f1(<param>) -> funcValue(f1)(<param>)
		// Voir explications dans caretReplace :
		var tabFunc = [];
		var maskFunc = "___FUNC___";
		while (_s.indexOf("(") > -1) {
			_s = _s.replace(/(\([^\(\)]*\))/g, function(m, t) {
				tabFunc.push(t);
				return (maskFunc + (tabFunc.length - 1));
			});
		}
		tabFunc.push(_s);
		_s = maskFunc + (tabFunc.length - 1);
		while (_s.indexOf(maskFunc) > -1) {
			_s = _s.replace(new RegExp("(\\w+)" + maskFunc + "(\\d+)", "g"), function(m, _n, _d) {
				var o = (window[_n] === undefined) ? this.fv(window["$locvar_" + _n]) : this.fv(window[_n]);
				if (o === undefined) {o = this.fv(_n);}
				if (o === undefined) {return _n + maskFunc + _d;}
				//                if ((o === undefined) || ((o.getCode() !== "function") && (o.getCode() !== "expression"))) return _n + maskFunc + _d;
				return "funcValue(" + _n + ")__" + maskFunc + _d;
			});
			_s = _s.replace(new RegExp(maskFunc + "(\\d+)", "g"), function(m, _d) {
				return tabFunc[_d];
			});
		}
		// Rétablissement des expressions sans variable : ___EXPR___n -> funcValue(E1)()
		_s = _s.replace(new RegExp(maskExpr + "(\\d+)", "g"), function(m, _d) {
			return tabExpr[_d];
		});
		return _s;
	}
	// parseExpression dans le contexte de cette window :
	private pe(_o, _n) {
		// console.log("name="+_o.getName()+"  n="+_n);
		_n = _n.replace(/\s/g, "");
		if ((_o.getName) && (_o.getName() === _n)) {
			// console.log("name=" + _o.getName() + "  n=" + _n);
			return this.pushEXP(_o);
		} else {
			var o = (window[_n] === undefined) ? this.fv(window["$locvar_" + _n]) : this.fv(window[_n]);
			if (o === undefined) {o = this.fv(_n);}
			if (o === undefined) {return _n;}
			if ((_o) && (_o.getParent) && (_o.getParent().indexOf(o) === -1)) {_o.addParent(o);}
			return this.pushEXP(o);
		}
	}
	private EXinit(_c) {
		var _n = this.EX[_c].length; // nombre de paramètres de la fonction
		var c = _c.split("_")[1];
		var r = "\\b" + c + "\\b\\(([^\\)]*)";
		for (var i = 1; i < _n; i++) {r += ",([^\\)]*)";}
		r += "\\)";
		var rg = new RegExp(r, "g");
		return function(_o, _s) {
			return _s.replace(rg, function(m) {
				var res = _c + "(" + this.pe(_o, arguments[1]);
				for (var i = 2; i < (_n + 1); i++) {
					res += "," + this.pe(_o, arguments[i]);
				}
				res += ")";
				return res;
			});
		};
	}
	private isArray(_a) {
		return (Object.prototype.toString.call(_a) === '[object Array]');
	}
}
