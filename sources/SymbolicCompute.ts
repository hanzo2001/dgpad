/// <reference path="./typings/iSymbolicCompute.d.ts" />

var integerStr = '0|[1-9]\\d*';
var decimalStr = '\\.\\d+';
var exponenStr = '[eE]\\-?\d+';
var floatStr = `${integerStr}(?:${decimalStr}${exponenStr})|(?:${decimalStr}|${exponenStr})`
var numberStr = `(?:${integerStr})|(?:${floatStr})`;

// [start] '0' OR (one of) `1-9` (zero or more) NUM [end] <-- notation for integers
var re_isInteger = new RegExp(`^(?:${integerStr})$`);

// [start] sign? NUM (one of or both) decimals,exponential [end] <-- notation for floats
var re_isFloat = new RegExp(`^(?:${floatStr})$`);

// [start] (one of) `xyzt` [end]
var re_isVar = /^[xyzt]{1}$/;

// '(' { (anything but) '()' } ')' <-- get content of innermost matching parens
var re_getInnerParensContent = /\(([^\(\)]*)\)/;

// GLOBAL 'EX_funcValue(' (capture one or more) NUM ')(' (capture all but parens) ')' <-- $1:digit, $2:any
var re_expressionFunction = /EX_funcValue\((\d+)\)\(([^\)]*)\)/g;

// GLOBAL 'EX_getObj(' (one or more) NUM ')' <-- $1:digit
var re_getObj = /EX_getObj\((\d+)\)/g;

// GLOBAL BOUND number '^' number BOUND <-- power operation
var re_powerExpression = new RegExp(`\b(${numberStr})\^(${numberStr})\b`,'g');

// GLOBAL [start] OR (not) (one of) '^/' number? '*' number? (not) (one of) '^' OR [end]
var re_numStarNum = new RegExp(`(^|[^\\^\\/])(\\b${numberStr}\\b)\\*(\\b${numberStr}\\b)([^\\^]|$)`,'g');

var re_parensContent = /(\([^\(\)]*\))/;
var re_crocheContent = /(\[[^\[\]]*\])/;

function contains(str:string, tokenStr:string): boolean {
	let tokens = tokenStr.split(',');
	let i=0, s=tokens.length;
	while (i<s) {if (str.indexOf(tokens[i++]) !== -1) {return true;}}
	return false;
}

function parseNumber(v:string) {
	return re_isFloat.test(v) ? parseFloat(v) : parseInt(v);
}

function parenthesize(v:string, tokens:string): string {
	return contains(v,tokens) ? `(${v})` : v;
}

var userOperations = {
	plus:     (a, b): string => `${a}+${b}`,
	minus:    (a, b): string => `${a?a:''}-${parenthesize(b,'+,-')}`,
	times:    (a, b): string => `${parenthesize(a,'+,-')}*${parenthesize(b,'+,-,/')}`,
	quotient: (a, b): string => `${parenthesize(a,'+,-')}*${parenthesize(b,'+,-,*,/')}`,
	power:    (a, b): string => `${parenthesize(a,'+,-')}*${parenthesize(b,'+,-,*,/,^')}`,
	default:  (a, f): string => `${f}(${a})`
};
var simplifyOperations = {
	plus: (a, b) => {
		if (a === 0) {return b;}
		if (b === 0) {return a;}
		if (!isNaN(a) && !isNaN(b)) {return a+b;}
		return `plus(${a},${b})`;
	},
	minus: (a, b) => {
		if (b === 0) {return a;}
		if (!isNaN(a) && !isNaN(b)) {return a-b;}
		if (a === b) {return 0;}
		return `minus(${a},${b})`;
	},
	times: (a, b) => {
		if (a === 0 || b === 0) {return 0;}
		if (a === 1) {return b;}
		if (b === 1) {return a;}
		if (!isNaN(a) && !isNaN(b)) {return a*b;}
		if (!isNaN(b) &&  isNaN(a)) {return `times(${a},${b})`;}
		return `times(${a},${b})`;
	},
	quotient: (a, b) => {
		if (a === 0) {return 0;}
		if (b === 1) {return a;}
		if (a === b) {return 1;}
		if (!isNaN(a) && !isNaN(b)) {
			let l = 1e13 * (a / b);
			if (l === Math.round(l)) return a / b;
		}
		if (!isNaN(b) && isNaN(a)) {
			var l = 1e13 * (1 / b);
			if (l === Math.round(l)) return `times(${1/b},${a})`;
			return `times(quotient(1,${b}),${a})`;
		}
		return `quotient(${a},${b})`;
	},
	power: (a, b) => {
		if (a === 0) {return 0;}
		if (b === 1) {return a;}
		if (!isNaN(a) && !isNaN(b)) {return Math.pow(a,b);}
		return `power(${a},${b})`;
	},
};
var derivateOperations = {
	plus: (a, b): string => {
		if (a === 0) {return b;}
		if (b === 0) {return a;}
		return `plus(${a},${b})`;
	},
	minus: (a, b): string => {
		if (b === 0) {return a;}
		return `minus(${a},${b})`;
	},
	times: (a, b, p): string => {
		if (a === 1 && b === 0) {return p[1];}
		if (b === 1 && a === 0) {return p[0];}
		if (a === 1 && b === 1) {return `plus(${p[0]},${p[1]})`;}
		if (a === 0) {return `times(${p[0]},${b})`;}
		if (b === 0) {return `times(${p[1]},${a})`;}
		return `plus(times(${a},${p[1]}),times(${p[0]},${b}))`;
	},
	power: (a, b, p): string => {
		if (a === 1 && b === 0) {return `times(${p[1]},power(${p[0]},minus(${p[1]},1)))`;}
		if (b === 0) {return `times(times(${p[1]},${a}),power(${p[0]},minus(${p[1]},1)))`;}
		return `times(power(${p[0]},${p[1]}),plus(times(${b},log(${p[0]})),times(${p[1]},quotient(${a},${p[0]}))))`;
	},
	quotient: (a, b, p): string => {
		if (a === 1 && b === 0) {return `quotient(1,${p[1]})`;}
		if (a === 0 && b === 1) {return `quotient(minus(0,${p[0]}),power(${p[1]},2))`;}
		if (a === 1 && b === 1) {return `quotient(minus(${p[1]},${p[0]}),power(${p[1]},2))`;}
		if (b === 0) {return `quotient(${a},${p[1]})`;}
		return `quotient(minus(times(${a},${p[1]}),times(${p[0]},${b})),power(${p[1]},2))`;
	},
	cos: (a, b, p): string => `times(minus(0,${a}),sin(${p[0]}))`,
	sin: (a, b, p): string => `times(${a},cos(${p[0]}))`,
	tan: (a, b, p): string => `times(${a},plus(1,power(tan(${p[0]}),2)))`,
	sqrt:(a, b, p): string => `quotient(${a},times(2,sqrt(${p[0]})))`,
	abs: (a, b, p): string => `times(${a},quotient(abs(${p[0]}),${p[0]}))`,
	log: (a, b, p): string => `quotient(${a},${p[0]})`,
	exp: (a, b, p): string => `times(${a},exp(${p[0]}))`,
	asin:(a, b, p): string => `quotient(${a},sqrt(minus(1,power(${p[0]},2))))`,
	acos:(a, b, p): string => `minus(0,quotient(${a},sqrt(minus(1,power(${p[0]},2)))))`,
	atan:(a, b, p): string => `quotient(${a},plus(1,power(${p[0]},2)))`,
};

export class SymbolicCompute implements iSymbolicCompute {
	private Cn;
	private EXPS;
	private static re_cache: RegExp[] = [];
	constructor(_cn) {
		this.Cn = _cn;
		this.EXPS = this.Cn.getInterpreter().getEXPS();
	}
	userCode(_s:string): string {
		var mask = '___MASK___';
		var tab = this.prepareMaskFromCode(mask, _s);
		var simpl = this.userFromCode(tab, mask, tab[tab.length - 1]);
		_s = this.restituteCodeFromMask(tab, mask, simpl);
		_s = _s.replace(re_expressionFunction, function (_, expsKey, param) {
			return this.EXPS[expsKey].getVarName()+(param === ''?'':`(${param})`);
		});
		_s = _s.replace(re_getObj, function (_, expsKey) {
			return this.EXPS[expsKey].getVarName();
		});
		var str;
		do {
			str = _s;
			_s = _s.replace(re_powerExpression, function (_, a, b) {
				a = parseFloat(a);
				b = parseFloat(b);
				return (Math.round(Math.pow(a, b) * 1e13) / 1e13)+'';
			});
			_s = _s.replace(re_numStarNum, function (_, firstChar, a, b, lastChar) {
				a = parseFloat(a);
				b = parseFloat(b);
				return firstChar+(Math.round(a * b * 1e13) / 1e13)+lastChar;
			});
		} while (str !== _s);
		return _s;
	}
	simplify(_s:string): string {
		var mask = '___MASK___';
		var tab = this.prepareMaskFromCode(mask, _s);
		var simpl = this.simplifyFromCode(tab, mask, tab[tab.length - 1]);
		_s = this.restituteCodeFromMask(tab, mask, simpl);
		return _s;
	}
	derivate(_s:string, _v:string): string {
		if (_s === '' || !this.isValidParenthesis(_s)) {return '';}
		var mask = '___MASK___';
		var tab = this.prepareMaskFromCode(mask, _s);
		var der = this.derivateFromCode(tab, mask, tab[tab.length - 1], _v);
		_s = this.restituteCodeFromMask(tab, mask, der);
		_s = this.userCode(this.simplify(_s));
		return _s;
	}
	private isNum(s:string): boolean {
		return re_isInteger.test(s) || re_isFloat.test(s);
	}
/*
	private isVar(s:string): boolean {
		return re_isVar.test(s)
	}
	private contains(a:any, tok:string): boolean {
		let str = ''+a;
		let toks = tok.split(',');
		let i=0, s=toks.length;
		while (i<s) {if (str.indexOf(toks[i++]) !== -1) {return true;}}
		return false;
	}
*/
	private userFromCode(tab:string[], mask:string, lastTab:string): string {
		var st = lastTab.split(mask);
		if (st.length === 1) {return st[0];} // Il s'agit d'une constante
		var parameter = tab[parseInt(st[1])]; // Paramètres : comme '(2,x)' ou '(times___MASK___0,1)'
		if (st[0] === '') {return this.userFromCode(tab, mask, parameter);}// recursive
		var functionName = st[0]; // La fonction : comme 'plus', 'times', 'cos'
		var ps = parameter.split(','); // On transforme les paramètres en tableau
		var values = [];
		let i=0, s=ps.length, v;
		while (i<s) {
			v = this.userFromCode(tab, mask, ps[i]);// recursive
			values[i++] = this.isNum(v) ? parseFloat(v) : v;
		}
		let operation = userOperations[functionName];
		return operation ? operation(values[0],values[1]) : userOperations.default(values[0],functionName);
	}
	private simplifyFromCode(tabs:string[], mask:string, lastTab:string) {
		var st = lastTab.split(mask);
		if (st.length === 1) {return st[0];} // Il s'agit d'une constante
		var param = tabs[parseInt(st[1])]; // Paramètres : comme '(2,x)' ou '(times___MASK___0,1)'
		if (st[0] === '') {return this.simplifyFromCode(tabs, mask, param);}
		var functionName = st[0]; // La fonction : comme 'plus', 'times', 'cos'
		let params = param.split(','); // On transforme les paramètres en tableau
		let values = [];
		var i=0, s=params.length, v;
		while (i<s) {
			v = this.simplifyFromCode(tabs, mask, params[i]);
			values[i++] = this.isNum(v) ? parseFloat(v) : v;
		}
		let fn = simplifyOperations[functionName];
		return fn ? fn(values[0],values[1]) : lastTab;
	}
	private derivateFromCode(tabs, mask, lastTab, _v): string {
		if (lastTab === _v) {return '1';}
		var st = lastTab.split(mask);
		if (st.length === 1) {return '0';} // Il s'agit d'une constante
		var param = tabs[parseInt(st[1])]; // Paramètres : comme '(2,x)' ou '(times___MASK___0,1)'
		if (st[0] === '') {return this.derivateFromCode(tabs, mask, param, _v);}
		var functionName = st[0]; // La fonction : comme 'plus', 'times', 'cos'
		let params = param.split(','); // On transforme les paramètres en tableau
		var allCte = true;
		var dp = <string[]>[];
		let i=0, s=params.length;
		while (i<s) {
			dp[i] = this.derivateFromCode(tabs, mask, params[i], _v);
			allCte = allCte && (dp[i] === '0');
			i++;
		};
		if (allCte) {return '0';}
		let fn = derivateOperations[functionName];
		return fn ? fn(dp[0],dp[1],params) : '0';
	}
	private prepareMaskFromCode(mask:string, str:string): string[] {
		var tab = [];
		while (str.indexOf('(') > -1) {
			str = str.replace(re_getInnerParensContent, function (_, parensContent) {
				tab.push(parensContent);
				return mask+(tab.length - 1);
			});
		}
		tab.push(str);
		return tab;
	}
	private restituteCodeFromMask(tab:string[], mask:string, simpl:string): string {
		let regex = <RegExp>SymbolicCompute.re_cache[mask] || new RegExp(mask+'(\\d+)','g');
		if (!SymbolicCompute.re_cache[mask]) {SymbolicCompute.re_cache[mask] = regex;}
		while (simpl.indexOf(mask) !== -1) {
			simpl = simpl.replace(regex, (m, d) => `(${tab[d]})`);
		}
		return simpl;
	}
	private isValidParenthesis(str:string): RegExp[] {
		var parentheses = 0;
		var crochets = 0;
		var regexes = <RegExp[]>[];
		let i=0, s=str.length;
		while (i<s) {
			let c = str.charAt(i);
			switch (c) {
				case '(': parentheses++; break;
				case '[': crochets++;    break;
				case ')': parentheses--, regexes.push(re_parensContent); break;
				case ']': crochets--,    regexes.push(re_crocheContent); break;
			}
			if (parentheses < 0 || crochets < 0) {return null;}
			i++;
		}
		return (parentheses || crochets) ? null : regexes;
	}
}
