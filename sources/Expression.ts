/// <reference path="./typings/iExpression.d.ts" />

import {SymbolicCompute} from './SymbolicCompute';

var $U = (<any>window).$U;

// '.d' (one of) `xyzt` '(' (something but paren) ')' <-- $1 example: .dx(anything)
var re_derivativeVar = /(\.d[xyzt])\([^\)]+\)$/;

// GLOBAL '\"'
var re_escapedDQuote = /\\\"/g;

// [start] 'EX_getObj(' NUM ').d' (one of) `xyzt` '()' [end] <-- $1 example: .dx()
var re_derivativeExpObjFunc = /^EX_getObj\(\d+\)(\.d[xyzt]\(\))+$/;

// [start] 'EX_getObj(' NUM ').d' (zero or more) (one of) `xyzt` '()' ... [end] <-- $1, $2
var re_derivativeExpObjDef = /^EX_getObj\(\d+\)(\.d[xyzt]\(\))*(\.d[xyzt]\([^\)]+\))+$/;

// GLOBAL '"' (anything but dquote) '"' <-- $1 example: "", "anything"
var re_dquotedStr = /\"([^\"]*)\"/g;

export class Expression implements iExpression {
	private static ALL: Expression[] = [];
	private static NaNstr = NaN.toString();
	private obj;
	private src;
	private Cn;
	private interpreter;
	private symbolic: iSymbolicCompute;
	private DX: Expression;
	private DY: Expression;
	private DZ: Expression;
	private DT: Expression;
	private DXYZT: Expression;
	private init;
	private lastInstruction: string;
	private vnames: string;
	private f;
	private VALUE;
	private isFuncCall: boolean;
	constructor(_obj, _src) {
		this.obj = _obj;
		this.src = _src;
		this.Cn = this.obj.getCn();
		this.interpreter = this.Cn.getInterpreter();
		this.symbolic = new SymbolicCompute(this.Cn);
		this.DX = null;
		this.DY = null;
		this.DZ = null;
		this.DT = null;
		this.DXYZT = null; // Chaîne représentant la dérivée suivant x ou y ou etc...
		//this.init, this.lastInstruction, this.vnames, this.f, this.VALUE;
		this.isFuncCall = false; // Y-a-t-il un appel à des fonctions utilisateurs dans l'expression ?
		this.setText(_src);
		Expression.ALL.push(this);
	}
	setText(_src:string) {
		// console.log('avant : '+this.obj.getName());
		this.init = this.interpreter.ExpressionInit(this.obj, _src);
		this.parseInit();
		if (this.obj.blocks) {this.obj.blocks.evaluate('onchange');}
		// console.log('après : '+this.obj.getName());
	}
	setDxyzt() {
		var st = this.init.jsbackup;
		st = st.replace(re_derivativeVar, '$1()');
		this.DXYZT = new Expression(this.obj, st);
	}
	getDxyzt() {
		return this.DXYZT.value().get();
	}
	getVars(): string {
		return this.vnames;
	}
	// Appelée uniquement lors d'une modification de l'expression par
	// l'utilisateur :
	compute() {
		// Si il s'agit d'une expressions sans variable, on précalcule.
		// Ceci est notamment très utile pour les expressions contenant
		// un programme avec de grosses boucles qui au final délivrent un tableau :
		this.VALUE = this.vnames === '' ? this.f() : null;
		if (this.isFuncCall) { this.parseInit(); }
		this.DX = null;
		this.DY = null;
		this.DZ = null;
		this.DT = null;
	}
	// Pour Blockly :
	forcevalue(x, y, z, t) {
		return this.f(x, y, z, t);
	}
	value(x?, y?, z?, t?) {
		if (this.VALUE) {return this.VALUE;}
		if (this.vnames === '') {return (this.VALUE = this.f());}
		return this.f(x, y, z, t);
	}
	dx(x, y, z, t) {
		if (this.DX === null) {
			this.DX = new Expression(this.obj, this.symbolic.derivate(this.init.js, 'x'));
		}
		if (arguments.length === 0) {return this.DX;}
		return this.DX.value(x, y, z, t);
	}
	dy(x, y, z, t) {
		if (this.DY === null) {
			this.DY = new Expression(this.obj, this.symbolic.derivate(this.init.js, 'y'));
		}
		if (arguments.length === 0) {return this.DY;}
		return this.DY.value(x, y, z, t);
	}
	dz(x, y, z, t) {
		if (this.DZ === null) {
			this.DZ = new Expression(this.obj, this.symbolic.derivate(this.init.js, 'z'));
		}
		if (arguments.length === 0) {return this.DZ;}
		return this.DZ.value(x, y, z, t);
	}
	dt(x, y, z, t) {
		if (this.DT === null) {
			this.DT = new Expression(this.obj, this.symbolic.derivate(this.init.js, 't'));
		}
		if (arguments.length === 0) {return this.DT;}
		return this.DT.value(x, y, z, t);
	}
	// Methode appelée pour la réinitialisation des parents (voir ExpressionObject) :
	refresh() {
		var src = this.getSource().replace(re_escapedDQuote, '"');
		this.setText(src);
	}
	// Methode appelée lorsqu'on change le nom d'un objet (dans le panneau de prop.)
	// et que cet objet est impliqué dans l'expression :
	refreshNames() {
		this.refresh();
		this.compute();
	}
	// setValue pour les curseurs d'expressions :
	setValue(_val) {
		if (this.VALUE !== _val) {
			this.init = this.interpreter.ExpressionInit(this.obj, _val + '');
			this.lastInstruction = _val + '';
			this.vnames = '';
			this.f = this.interpreter.CreateFunctionFromExpression(this.init.js, this.vnames);
			this.VALUE = _val;
			if (this.obj.blocks) this.obj.blocks.evaluate('onchange');
		}
	}
	isText(): boolean {
		return this.lastInstruction.indexOf('"') !== -1;
	}
	isFunc(): boolean {
		return this.vnames !== '';
	}
	isDxyztFunc(): boolean {
		return re_derivativeExpObjFunc.test(this.init.jsbackup);
	}
	isDxyztDef(): boolean {
		return re_derivativeExpObjDef.test(this.init.jsbackup);
	}
	isEmpty(): boolean {
		return this.init.user === '';
	}
	isNum(): boolean {
		return this.vnames === '' && !isNaN(this.f());
	}
	isArray(): boolean {
		return $U.isArray(this.f(1, 1, 1, 1));
	}
	is3DArray(): boolean {
		var t = this.f(1, 1, 1, 1);
		if ($U.isArray(t)) {
			for (var k = 0; k < t.length; k++) {
				if (t[k].length !== 3) {return false;}
			}
			return true;
		}
		return false;
	}
	getPointList() {
		var val = this.getValidValue();
		var tab = [];
		if (!$U.isPointArrayWithNaN(val)) {return tab;}
		let i=0, s=val.length;
		while (i<s) {
			tab.push(this.obj.getVarName()+`[${i++}]`);
		}
		return tab;
	}
	// Pas fier du tout de ceci :
	getValidValue() {
		if (this.VALUE) {return this.VALUE;}
		let NaNstr = Expression.NaNstr;
		for (var i = 0; i < 100; i++) {
			var x = Math.random() * 100 - 50;
			var y = Math.random() * 100 - 50;
			var z = Math.random() * 100 - 50;
			var t = Math.random() * 100 - 50;
			var res = this.f(x, y, z, t);
			if (res !== undefined && res.toString() !== NaNstr) {return res;}
		}
		return null;
	}
	fix() {
		// console.log('FIX : '+this.f(1, 2, 3, 4));
		if (this.f(1, 2, 3, 4) === undefined) {
			this.setText(this.src);
			// this.init = this.interpreter.ExpressionInit(this.obj, _s + '');
			// this.f = this.interpreter.CreateFunctionFromExpression(this.init.js, this.vnames);
		}
	}
	get() {
		return this.init.user;
	}
	js() {
		return this.init.js;
	}
	getUnicodeSource() {
		var s = this.interpreter.ExpressionSrc(this.init.pseudo);
		s = s.replace(re_dquotedStr, (_, t) => `"${$U.native2ascii(t)}"`);
		return s;
	}
	getSource() {
		return this.interpreter.ExpressionSrc(this.init.pseudo);
	}
	private isvar(_v:string) {
		return new RegExp('(?:\\W|^)\\b'+_v+'\\b(?:[^\\(]|$)').test(this.lastInstruction);
	}
	private parseInit() {
		// Remplacement dans le init.js de toute partie d'expression contenant des dx par la dérivée :
		this.init.js = this.init.jsbackup.replace(/(EX_getObj\(\d+\))((\.d[xyzt]{1}\(\))*)((\.d[xyzt]{1})\(([xyzt]{1}(,[xyzt]{1})*)\))+/g, function (_m, _e1, _e2, _e3, _e4, _e5, _e6) {
			if (_e2 === undefined) {_e2 = '';}
			var ex = new Expression(this.obj, '' + _e1 + _e2 + _e5 + '()');
			return ex.value().js();
		});

		// Remplacement de tous les appels à des expressions (par exemple E1(x)) par le source de ces expressions
		// ******** Il manque la composition : à travailler ci-dessous 
		this.init.js = this.init.js.replace(/((EX_funcValue\((\d+)\))\(([xyzt](,[xyzt])*)\))/g, function (m, e1, e2, e3, e4, e5) {
			var ex = this.interpreter.getEXPS()[parseInt(e3)];
			if (e4 !== ex.getE1().getVars())
				return e1;
			var ex2 = new Expression(this.obj, ex.getE1().get());
			return ex2.js();
		});

		this.isFuncCall = (this.init.js !== this.init.jsbackup);

		// Si la chaine contient des dx (exemple : E1.dx.dy(x,y,z)), on réactualise les variables
		// comme étant celles de l'expression ciblée (E1 dans l'exemple) :
		this.init.user = this.init.user.replace(/((\w+).d[xyzt](.d[xyzt])*)\(([xyzt]*(,[xyzt])*)\)/g, function (m, g1, g2, g3, g4, g5) {
			var ex = this.Cn.find(g2);
			if ((ex) && (ex.getE1)) {
				return g1 + '(' + ex.getE1().getVars() + ')';
			} else {
				return g1 + '(' + g4 + ')';
			}
		});

		// Si la chaine contient des dx (exemple : EX_getObj(0).dx().dy(x,y,z)), on réactualise les variables
		// comme étant celles de l'expression ciblée (EX_getObj(0) dans l'exemple) :
		this.init.pseudo = this.init.pseudo.replace(/((EX_getObj\(\d+\))((\.d[xyzt]\(\))*)(\.d[xyzt]))\(([xyzt]*(,[xyzt])*)\)/g, function (m, g1, g2, g3, g4, g5, g6) {
			var expr = new Expression(this.obj, '' + g2);
			var ex = this.expr.value();
			if ((ex) && (ex.getE1)) {
				return g1 + '(' + ex.getE1().getVars() + ')';
			} else {
				return g1 + '(' + g6 + ')';
			}
		});
		// console.log('this.init.js='+this.init.js+'  this.init.pseudo='+this.init.pseudo);
		this.lastInstruction = (function () {
			var t = this.init.js.split(';');
			return t[t.length - 1];
		})();
		this.vnames = (function () {
			var vn = [];
			if (this.isvar('x')) {vn.push('x');}
			if (this.isvar('y')) {vn.push('y');}
			if (this.isvar('z')) {vn.push('z');}
			if (this.isvar('t')) {vn.push('t');}
			return vn.join(',');
		}.call(this));
		this.f = this.interpreter.CreateFunctionFromExpression(this.init.js, this.vnames);
		this.VALUE = null;
	}
	static fixAll() {
		// A chaque fois qu'un objet est rajouté à la figure (ObjectConstructor)
		// On parcours toutes les expressions de la figure pour chercher celle
		// provoquant une erreur de référence : on essaie alors de les reconstruire :
		let i=0, s=Expression.ALL.length;
		while (i<s) {Expression.ALL[i++].fix();}
	}
	static delete(expression:Expression) {
		// Méthode de classe devant être appelée chaque fois qu'on veut supprimer
		// une expression. Elle devrait théoriquement être appelée aussi chaque 
		// fois qu'on veut en créer une nouvelle qui en écrase une autre :
		if (expression) {
			var i = Expression.ALL.indexOf(expression);
			if (i > -1) {
				Expression.ALL.splice(i, 1);
			}
		}
	}
}
