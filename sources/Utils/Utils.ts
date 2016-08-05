/// <reference path="../typings/iUtils.d.ts" />

let $L = (<any>window).$L;
let $P = (<any>window).$P;
let $FPICKERFRAME = (<any>window).$FPICKERFRAME;
let $MOBILE_PHONE = (<any>window).$MOBILE_PHONE;
let $CANVAS = (<any>window).$CANVAS;

let doublePI = 2 * Math.PI;
let halfPI = Math.PI / 2;
let AllCanvas = [];
let noop = function() {};
let nullproc = noop;
let charCodeA = 'a'.charCodeAt(0);
let charCodeZ = '0'.charCodeAt(0);

/**
 * Converts any character above code point 0x80 to a \uXXXX representation
 */
function native2ascii(str: string): string {
	let r='', u, i=0, s=str.length;
	while (i<s) {
		r += str.charCodeAt(i) < 0x80
			? str.charAt(i)
			: (u = str.charCodeAt(i).toString(16), '\\u'+'0000'.substr(0,4-u.length)+u);
		i++;
	}
	return r;
};
/**
 * Translates [0-9] string to [a-z] string
 * // Convert numéric string with 0->a, 1->b, 2->c, etc...
 * I don't understand what this is for
 */
function number2letter(n: string): string {
	let r='', i=0, s=n.length;
	while (i<s) {
		r += String.fromCharCode(charCodeA+n.charCodeAt(i++)-charCodeZ);
	}
	return r;
};
let isStr  = function(v): boolean {
	return (typeof v === "string");
};
let isArray= function(v): boolean {
	return (Object.prototype.toString.call(v) === '[object Array]');
};
/**
 * Translates numbers to strings with precision modifier
 */
function parseList(tab: any, prec: number): string {
	if (isArray(tab)) {
		let elements: string[] = [];
		let length = tab.length;
		let maxLength = length < 3 ? length : 3;
		let separator = '[???'+$L.comma+'???'+$L.comma+'???]';
		let element;
		let i=0;
		while (i<maxLength) {
			element = parseArray(tab[i++],prec);
			elements.push(element===separator?'\u2702':element);
		}
		if (length > maxLength) {
			elements.push('... (' + length + ' ' + $L.expression_item + ')')
		}
		return '[' + elements.join(' ' + $L.comma + ' ') + ']';
	} 
	if (isNaN(tab)) {
		return '???';
	}
	return ($L.number(Math.round(tab * prec) / prec));
};
/**
 * called recursively
 */
function parseArray(tab: any, prec: number): string {
	if (isArray(tab)) {
		let elements = [];
		let i=0, s=tab.length;
		while (i<s) {elements.push(parseArray(tab[i], prec));}
		return '['+elements.join($L.comma)+']';
	}
	if (isNaN(tab)) {
		return "???";
	}
	return ($L.number(Math.round(tab * prec) / prec));
};
/**
 * called recursively
 * Probably useless
 */
function parseArrayEnglish(tab: any, prec: number): string {
	if (isArray(tab)) {
		let elements = [];
		let i=0, s=tab.length;
		while (i<s) {elements.push(parseArrayEnglish(tab[i], prec));}
		return '['+elements.join(',')+']';
	}
	if (isNaN(tab)) {
		return "???";
	}
	return (prec ? (Math.round(tab * prec) / prec) : tab);
};
/**
 * Helper method to add value to input[type=text] fields (probably)
 */
function addTextToInput(field: HTMLInputElement, v: string, type: string) {
	switch (type) {
		case 'replace': field.value = v; break;
		case 'add':
			let startPos = field.selectionStart;
			let endPos   = field.selectionEnd;
			field.value = field.value.substring(0, startPos) + v + field.value.substring(endPos, field.value.length);
			field.selectionStart = startPos + v.length;
			field.selectionEnd = startPos + v.length;
			break;
		default: break;
	}
};
/**
 * Deterimine if passed value is a point or behaves like a point
 * this may be completely useless after typescript
 */
function isPoint(v: any): boolean {
	if (!isArray(v)) {return false;}
	if ((isNaN(v[0])) || (isNaN(v[1]))) {return false;}
	if ((v.length === 2) || (v.length === 3)) {return true;}
	return false;
};
/**
 * Just a wrapper around isPoint
 */
function isPointArray(v: any) {
	if (!isArray(v)) {return false;}
	if (!v.length) {return false;}
	let i=0, s=v.length;
	while (i<s) {if (!isPoint(v[i++])) {return false;}}
	return true;
};
/**
 * This function does not do what its name specifies
 */
function isPointArrayWithNaN(v: any) {
	if (!isArray(v)) {return false;}
	if (v.length === 0) {return false;}
	let i=0, s=v.length;
	while (i<s) {if ((!isArray(v[i])) || (v[i].length < 2) || (v[i].length > 3)) {return false;}}
	return true;
};

/**
 * Another thing I don't know what its for
 */
function isVar(str: string, v: string) {
	return (new RegExp('(\\W|^)'+v+'([^\\(]|$)').test(str));
};
/**
 * What is this for?
 * Récupère les variables eventuelles d'une formule
 * sous forme de chaine :
 */
function getVars(str: string): string {
	let vars: string[] = [];
	if (isVar(str, "x")) {vars.push("x");}
	if (isVar(str, "y")) {vars.push("y");}
	if (isVar(str, "z")) {vars.push("z");}
	if (isVar(str, "t")) {vars.push("t");}
	return vars.join(",");
};

/**
 * Performance methods?
 */
let chronoStartTime = null;
function startChrono() {
	var d = new Date();
	chronoStartTime = d.getTime();
};
function getChrono(): number {
	var d = new Date();
	return (d.getTime() - chronoStartTime);
};
function getTime(): number {
	var d = new Date();
	return (d.getTime());
};

/**
 * I need an example for this... it doesn't make sense... returns nothing
 */
function preloadImage(src: string) {
	var img = new Image();
	img.src = src;
};

/**
 * Ln(num) / Ln(10)
 */
function log(n: number): number {
	return Math.log(n) / Math.LN10;
};

/**
 * Distance entre deux points :
 */
function d(p1, p2): number {
	let x = p2.getX() - p1.getX();
	let y = p2.getY() - p1.getY();
	return Math.sqrt(x*x+y*y);
};

/**
 * ? too much math
 * Renvoie l'angle que forme un vecteur (x;y) avec l'horizontale
 * dans l'intervalle [0;2π[ orienté dans le sens trigo :
 */
function angleH(x:number, y:number): number {
	if (y < 0) {return Math.atan2(-y, x);}
	return Math.atan2(-y, x) + doublePI;
};

/**
 * Consider equality for a given epsilon (10^-10)
 * Compare en dessous de la précision du logiciel (1E-10) :
 */
function approximatelyEqual(a:number, b:number): boolean {
	return (Math.abs(a - b) < 1E-10);
};

/**
 * Normal vector
 * Renvoie les coordonnées du vecteur AB normé :
 */
function normalize(xA:number, yA:number, xB:number, yB:number): {x:number, y:number} {
	let l = Math.sqrt((xB - xA) * (xB - xA) + (yB - yA) * (yB - yA));
	return {
		x: (xB - xA) / l,
		y: (yB - yA) / l
	};
};

/**
 * For line objects :
 */
function computeBorderPoints(xA:number, yA:number, dx:number, dy:number, W:number, H:number): number[] {
	// On centre un cercle autour de A d'un rayon supérieur à la diagonale
	// du canvas (W+H). Forcément les point (xmin,ymin) et (xmax,ymax) de
	// ce cercle seront à l'extérieur du canvas
	let l = W + H + Math.abs(xA) + Math.abs(yA);
	return [xA - l * dx, yA - l * dy, xA + l * dx, yA + l * dy];
};

/**
 * For circle objects :
 */
function computeRay(xA:number, yA:number, xB:number, yB:number): number {
	let x = (xB - xA);
	let y = (yB - yA);
	return Math.sqrt(x * x + y * y);
};

/**
 * For circle3 objects :
 */
function computeCenter(xA:number, yA:number, xB:number, yB:number, xC:number, yC:number): number[] {
	let xAC = xC - xA,
			xCB = xB - xC,
			xBA = xA - xB;
	let yAC = yC - yA,
			yCB = yB - yC,
			yBA = yA - yB;
	let d = 2 * (xB * yAC + xC * yBA + xA * yCB);

	let x = (xB * xB * yAC + xC * xC * yBA + xA * xA * yCB - yAC * yBA * yCB) / d;
	let y = (xAC * xBA * xCB - xCB * yA * yA - xAC * yB * yB - xBA * yC * yC) / d;

	return [x, y];
};

function computeArcParams(xA:number, yA:number, xB:number, yB:number, xC:number, yC:number) {
	let xAC = xC - xA,
			xCB = xB - xC,
			xBA = xA - xB;
	let yAC = yC - yA,
			yCB = yB - yC,
			yBA = yA - yB;
	let d = 2 * (xB * yAC + xC * yBA + xA * yCB);

	// Coordonnées du centre du cercle :
	let xO = (xB * xB * yAC + xC * xC * yBA + xA * xA * yCB - yAC * yBA * yCB) / d;
	let yO = (xAC * xBA * xCB - xCB * yA * yA - xAC * yB * yB - xBA * yC * yC) / d;

	let startangle = angleH(xA - xO, yA - yO);
	let endangle = angleH(xC - xO, yC - yO);
	let trigo = (xBA * yCB < yBA * xCB);

	// Calcul de la mesure de l'angle AOC (dans [0;2π]) :
	let AOC = (trigo) ? (endangle - startangle) : (doublePI - endangle + startangle);
	AOC += (~~(AOC < 0) - ~~(AOC > doublePI)) * doublePI;

	return {
			centerX: xO,
			centerY: yO,
			startAngle: startangle,
			endAngle: endangle,
			Trigo: trigo,
			AOC: AOC
	};
};

function computeAngleParams(xA:number, yA:number, xO:number, yO:number, xC:number, yC:number) {
	let xOC = xC - xO,
			xOA = xA - xO;
	let yOC = yC - yO,
			yOA = yA - yO;

	let startangle = angleH(xOA, yOA);
	let endangle = angleH(xOC, yOC);
	let trigo = (xOA * yOC < yOA * xOC);

	let AOC180;

	// Calcul de la mesure de l'angle AOC orienté trigo (dans [0;2π]) :
	let AOC = endangle - startangle;
	AOC += (~~(AOC < 0) - ~~(AOC > doublePI)) * doublePI;

	// Calcul de la mesure de l'angle AOC (dans [0;π]) :
	AOC180 = AOC > Math.PI ? doublePI - AOC : AOC;

	return {
		startAngle: startangle,
		endAngle: endangle,
		Trigo: trigo,
		AOC: AOC,
		AOC180: AOC180
	};
};

/**
 * d est la distance en dessous de laquelle on est jugé "near" :
 */
function isNearToPoint(xA:number, yA:number, xB:number, yB:number, d:number): boolean {
	if (isNaN(xA + yA + xB + yB)) {return false;}
	let xab = xB - xA;
	let yab = yB - yA;
	return ((xab * xab + yab * yab) < (d * d));
};

/**
 * d est la distance en dessous de laquelle on est jugé "near" :
 */
function isNearToCircle(xA:number, yA:number, r:number, xM:number, yM:number, d:number): boolean {
	if (isNaN(xA + yA + r)) {return false;}
	let x = (xM - xA);
	let y = (yM - yA);
	return (Math.abs(x * x + y * y - r * r - d * d) < (2 * d * r));
};


function ptOnArc(xO:number, yO:number, xM:number, yM:number, fromAngle:number, toAngle:number, trigo:boolean) {
	let m = angleH(xM - xO, yM - yO);
	let e_a = (trigo) ? (toAngle - fromAngle) : (doublePI - toAngle + fromAngle);
	if (e_a > doublePI)
			e_a -= doublePI;
	if (e_a < 0)
			e_a += doublePI;
	//        if (!trigo) e_a=-e_a;

	let e_m = (trigo) ? (m - fromAngle) : (doublePI - toAngle + m);
	if (e_m > doublePI)
			e_m -= doublePI;
	if (e_m < 0)
			e_m += doublePI;

	return (e_m < e_a);
};


// d est la distance en dessous de laquelle on est jugé "near" :
function isNearToArc(xO, yO, AOC, fromAngle, toAngle, trigo, r, xM, yM, d) {
	if (isNaN(xO + yO + r))
		return false;

	let x = (xM - xO);
	let y = (yM - yO);
	if (Math.abs(x * x + y * y - r * r - d * d) > (2 * d * r))
		return false;

	let m = angleH(xM - xO, yM - yO);
	let GOM = (trigo) ? m - fromAngle : (doublePI - toAngle + m);
	GOM += (~~(GOM < 0) - ~~(GOM > doublePI)) * doublePI;

	if (GOM > AOC)
		return false;
	return true;
};


// d est la distance en dessous de laquelle on est jugé "near" :
function isNearToLine(xA, yA, dx, dy, xM, yM, d) {
	if (isNaN(xA + yA + dx + dy))
		return false;
	let a = dy * (xM - xA) + dx * (yA - yM);
	let MH2 = (a * a) / (dx * dx + dy * dy);
	return (MH2 < (d * d));
};

// d est la distance en dessous de laquelle on est jugé "near" :
function isNearToSegment(xA, yA, xB, yB, xM, yM, d) {
	if (isNaN(xA + yA + xB + yB))
		return false;
	let a = xM * (yB - yA) + xB * (yA - yM) + xA * (yM - yB);
	let xab = xB - xA;
	let yab = yB - yA;
	let dab = xab * xab + yab * yab;
	if (dab < 1e-13)
		return false;
	let MH2 = (a * a) / dab;
	// Le point est loin de la droite :
	if (MH2 > (d * d))
		return false;
	let MAMB = (xA - xM) * (xB - xM) + (yA - yM) * (yB - yM);
	// Le point dépasse des extrémités du segment :
	if (MAMB > MH2)
		return false;
	return true;
};

// d est la distance en dessous de laquelle on est jugé "near" :
function isNearToRay(xA, yA, xB, yB, xM, yM, d) {
	if (isNaN(xA + yA + xB + yB))
		return false;
	let a = xM * (yB - yA) + xB * (yA - yM) + xA * (yM - yB);
	let xab = xB - xA;
	let yab = yB - yA;
	let dab = xab * xab + yab * yab;
	if (dab < 1e-13)
		return false;
	let MH2 = (a * a) / dab;
	// Le point est loin de la droite :
	if (MH2 > (d * d))
		return false;
	let MAMB = (xA - xM) * (xB - xM) + (yA - yM) * (yB - yM);
	// Le point dépasse des extrémités du segment [AB] :
	if (MAMB > MH2) {
		let MA2 = (xA - xM) * (xA - xM) + (yA - yM) * (yA - yM);
		let MB2 = (xB - xM) * (xB - xM) + (yB - yM) * (yB - yM);
		if (MA2 < MB2) {
			return false;
		}
	}
	return true;
};

function drawPartialLine(ctx, xA, yA, xB, yB, iA, iB) {
	let sStyle = ctx.strokeStyle;
	let d = normalize(xA, yA, xB, yB);
	let spc = $P.size.partiallines;
	let xa = xA - iA * spc * d.x,
			ya = yA - iA * spc * d.y;
	let xb = xB + iB * spc * d.x,
			yb = yB + iB * spc * d.y;
	if (iA) {
		let xinf = xA - 3 * spc * d.x,
				yinf = yA - 3 * spc * d.y;
		let grd1 = ctx.createLinearGradient(xinf, yinf, xa, ya);
		grd1.addColorStop(0, "white");
		grd1.addColorStop(1, sStyle);
		ctx.beginPath();
		ctx.strokeStyle = grd1;
		ctx.moveTo(xinf, yinf);
		ctx.lineTo(xa, ya);
		ctx.closePath();
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.strokeStyle = sStyle;
	ctx.moveTo(xa, ya);
	ctx.lineTo(xb, yb);
	ctx.closePath();
	ctx.stroke();
	if (iB) {
		let xsup = xB + 3 * spc * d.x,
				ysup = yB + 3 * spc * d.y;
		let grd2 = ctx.createLinearGradient(xb, yb, xsup, ysup);
		grd2.addColorStop(0, sStyle);
		grd2.addColorStop(1, "white");
		ctx.beginPath();
		ctx.strokeStyle = grd2;
		ctx.moveTo(xb, yb);
		ctx.lineTo(xsup, ysup);
		ctx.closePath();
		ctx.stroke();
	}
};



function extend(_obj, _superObject) {    
	for (let sProperty in _superObject) {        
		_obj[sProperty] = _superObject[sProperty];    
	}
	return _superObject;
};

//MOUSEEVENT = document.createEvent("MouseEvent");

function PadToMouseEvent(_touch) {
	let ev = document.createEvent("MouseEvent");
	ev.initMouseEvent("mouseup", true, true, window, 1,
		_touch.screenX, _touch.screenY,
		_touch.clientX, _touch.clientY, false,
		false, false, false, 0, null);
	return ev;
};

//PadToMouseEvent = function(_touch) {
//    MOUSEEVENT.initMouseEvent("mouseup", true, true, window, 1,
//            _touch.screenX, _touch.screenY,
//            _touch.clientX, _touch.clientY, false,
//            false, false, false, 0, null);
//    return MOUSEEVENT;
//};

function hexToRGB(h) {
	if (h.charAt(0) === "#") {
		let cut = h.substring(1, 7);
		let r = parseInt(cut.substring(0, 2), 16);
		let g = parseInt(cut.substring(2, 4), 16);
		let b = parseInt(cut.substring(4, 6), 16);
		return {
			"r": r,
			"g": g,
			"b": b
		};
	} else {
		return {
			"r": 0,
			"g": 0,
			"b": 0
		};
	}
};

function hexToHSV(h) {
	let rgb = hexToRGB(h);
	let rr, gg, bb,
			r = rgb.r / 255,
			g = rgb.g / 255,
			b = rgb.b / 255,
			s,
//			h, s,
			v = Math.max(r, g, b),
			diff = v - Math.min(r, g, b),
			diffc = function(c) {
				return (v - c) / 6 / diff + 1 / 2;
			};
	if (diff == 0) {
		h = s = 0;
	} else {
		s = diff / v;
		rr = diffc(r);
		gg = diffc(g);
		bb = diffc(b);

		if (r === v) {
			h = bb - gg;
		} else if (g === v) {
			h = (1 / 3) + rr - bb;
		} else if (b === v) {
			h = (2 / 3) + gg - rr;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}
	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		v: Math.round(v * 100)
	};
}

// Associe une liste de styles (séparés par ;) à un élément DOM :
function STL(_dom, _st) {
	let t = _st.split(";");
	for (let i = 0, len = t.length; i < len; i++) {
		let a = t[i].split(":");
		_dom.style.setProperty(a[0].replace(/^\s+|\s+$/g, ''), a[1].replace(/^\s+|\s+$/g, ''));
	}
};

// Associe une liste d'attributs (séparés par ;) à un élément DOM :
function ATT(_dom, _st) {
	let t = _st.split(";");
	for (let i = 0, len = t.length; i < len; i++) {
		let a = t[i].split(":");
		_dom.setAttribute(a[0].replace(/^\s+|\s+$/g, ''), a[1].replace(/^\s+|\s+$/g, ''));
	}
};

function getElementOffset(obj) {
	let obj2 = obj;
	let curtop = 0;
	let curleft = 0;
	if (document.getElementById || document.all) {
		do {
			curleft += obj.offsetLeft - obj.scrollLeft;
			curtop += obj.offsetTop - obj.scrollTop;
			obj = obj.offsetParent;
			obj2 = obj2.parentNode;
			while (obj2 !== obj) {
				curleft -= obj2.scrollLeft;
				curtop -= obj2.scrollTop;
				obj2 = obj2.parentNode;
			}
		} while (obj.offsetParent)
	} else if ((<any>document).layers) {
		curtop += obj.y;
		curleft += obj.x;
	}
	return {
		"left": curleft,
		"top": curtop
	};
};


// Renvoie "-moz" ou "-webkit" ou "-o" en fonction du navigateur :
function browserCode() {
	if (navigator.appVersion.indexOf("MSIE 10") != -1)
		return "-ms";
	if ('MozBoxSizing' in document.documentElement.style)
		return "-moz";
	if ('WebkitTransform' in document.documentElement.style)
		return "-webkit";
	return "-o";
};

function scolor(h) {
	let c = hexToRGB(h);
	return (c.r + ",," + c.g + ",," + c.b);
};

function loadFile(fileName) {
	let request = new XMLHttpRequest();
	try {
		request.open("GET", fileName, false);
		request.send();
		return request.responseText;
	} catch (e) {
		return "";
	}
};

function leaveAccents(s) {
	let r = s.replace(new RegExp("\\s", 'g'), "");
	// r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
	// r = r.replace(new RegExp("æ", 'g'), "ae");
	// r = r.replace(new RegExp("ç", 'g'), "c");
	// r = r.replace(new RegExp("[èéêë]", 'g'), "e");
	// r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
	// r = r.replace(new RegExp("ñ", 'g'), "n");
	// r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
	// r = r.replace(new RegExp("œ", 'g'), "oe");
	// r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
	// r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
	// r = r.replace(new RegExp("[ÀÁÂÃÄÅ]", 'g'), "A");
	// r = r.replace(new RegExp("Æ", 'g'), "AE");
	// r = r.replace(new RegExp("Ç", 'g'), "C");
	// r = r.replace(new RegExp("[ÈÉÊË]", 'g'), "E");
	// r = r.replace(new RegExp("[ÌÍÎÏ]", 'g'), "I");
	// r = r.replace(new RegExp("Ñ", 'g'), "N");
	// r = r.replace(new RegExp("[ÒÓÔÕÖ]", 'g'), "O");
	// r = r.replace(new RegExp("Œ", 'g'), "OE");
	// r = r.replace(new RegExp("[ÙÚÛÜ]", 'g'), "U");
	// r = r.replace(new RegExp("[ÝŸ]", 'g'), "Y");
	// r = r.replace(new RegExp("\\W", 'g'), "");
	r = r.replace(new RegExp("[^àáâãäåæçèéêëìíîïñòóôõöœùúûüýÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖŒÙÚÛÜÝŸΆΈ-ώἀ-ῼa-zA-Z0-9_]", 'g'), "");
	return r;
};

//leaveAccents = function(s, _uppercase) {
//    let r = s.toLowerCase();
//    r = r.replace(new RegExp("\\s", 'g'), "");
//    r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
//    r = r.replace(new RegExp("æ", 'g'), "ae");
//    r = r.replace(new RegExp("ç", 'g'), "c");
//    r = r.replace(new RegExp("[èéêë]", 'g'), "e");
//    r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
//    r = r.replace(new RegExp("ñ", 'g'), "n");
//    r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
//    r = r.replace(new RegExp("œ", 'g'), "oe");
//    r = r.replace(new RegExp("[ùúûü]", 'g'), "u");
//    r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
//    r = r.replace(new RegExp("\\W", 'g'), "");
//    if (_uppercase)
//        r = r.toUpperCase();
//    return r;
//};

function utf8_encode(string) {
	let utftext = "";
	for (let n = 0; n < string.length; n++) {
		let c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if ((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
};

function utf8_decode(utftext) {
	let string = "";
	let i = 0;
	let c1, c2, c3;
	let c = c1 = c2 = 0;
	while (i < utftext.length) {
		c = utftext.charCodeAt(i);
		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		} else if ((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i + 1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		} else {
			c2 = utftext.charCodeAt(i + 1);
			c3 = utftext.charCodeAt(i + 2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}
	}
	return string;
};


// source : https://developer.mozilla.org/fr/docs/D%C3%A9coder_encoder_en_base64
function base64_encode(_data) {
	return window.btoa(unescape(encodeURIComponent(_data)));
};

function base64_decode(_data) {
	return decodeURIComponent(escape(window.atob(_data)));
};

// base64_encode = function(_data) {
//     let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//     let o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
//         ac = 0,
//         enc = "",
//         tmp_arr = [];

//     if (!_data) {
//         return _data;
//     }

//     do { // pack three octets into four hexets
//         o1 = _data.charCodeAt(i++);
//         o2 = _data.charCodeAt(i++);
//         o3 = _data.charCodeAt(i++);
//         bits = o1 << 16 | o2 << 8 | o3;
//         h1 = bits >> 18 & 0x3f;
//         h2 = bits >> 12 & 0x3f;
//         h3 = bits >> 6 & 0x3f;
//         h4 = bits & 0x3f;
//         // use hexets to index into b64, and append result to encoded string
//         tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
//     } while (i < _data.length);
//     enc = tmp_arr.join('');
//     let r = _data.length % 3;
//     return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
// };


// base64_decode = function(_data) {
//     let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
//     let o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
//         ac = 0,
//         dec = "",
//         tmp_arr = [];
//     if (!_data) {
//         return _data;
//     }
//     _data += '';
//     do { // unpack four hexets into three octets using index points in b64
//         h1 = b64.indexOf(_data.charAt(i++));
//         h2 = b64.indexOf(_data.charAt(i++));
//         h3 = b64.indexOf(_data.charAt(i++));
//         h4 = b64.indexOf(_data.charAt(i++));
//         bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
//         o1 = bits >> 16 & 0xff;
//         o2 = bits >> 8 & 0xff;
//         o3 = bits & 0xff;
//         if (h3 === 64) {
//             tmp_arr[ac++] = String.fromCharCode(o1);
//         } else if (h4 === 64) {
//             tmp_arr[ac++] = String.fromCharCode(o1, o2);
//         } else {
//             tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
//         }
//     } while (i < _data.length);
//     dec = tmp_arr.join('');
//     dec = utf8_decode(dec);
//     return dec;
// };

// For mouse wheel :
function extractDelta(e) {
	let n = null;
	if (e.wheelDelta) {n = e.wheelDelta;}
	else if (e.detail){n = e.detail * -40;}
	else if (e.originalEvent && e.originalEvent.wheelDelta) {n = e.originalEvent.wheelDelta;}
	return isNaN(n) ? 0 : n;
};

function isFullLocalStorage() {
	let n = 0;
	for (let i = $P.localstorage.max; i > 0; i--) {
		let c = JSON.parse(localStorage.getItem($P.localstorage.base + i));
		if (c && c.lock) {n++;}
	}
	return (n >= ($P.localstorage.max - 1));
};

function addDomUtils(el): ExpandoDOMElement {
	el.event_proc = <CommonEvent[]>[];
	el.stl = function(_p, _v) {el.style.setProperty(_p, _v);};
	el.att = function(_a, _v) {el[_a] = _v;};
	el.stls = function(_st) {
		let t = _st.split(";");
		for (let i = 0, len = t.length; i < len; i++) {
			let a = t[i].split(":");
			el.stl(a[0].replace(/^\s+|\s+$/g, ''), a[1].replace(/^\s+|\s+$/g, ''));
		}
	};
	el.bnds = function(l, t, w, h) {
		el.stls("left:" + l + "px;top:" + t + "px;width:" + w + "px;height:" + h + "px");
	};
	el.center = function(w, h) {
		let winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		el.bnds((winW - w) / 2, (winH - h) / 2, w, h);
	};
	el.add = function(_ch) {
		el.appendChild(_ch);
	};
	el.rmv = function(_ch) {
		el.removeChild(_ch);
	};
	el.md = function(_p) {
		el.addEventListener('touchstart', _p, false);
		el.addEventListener('mousedown', _p, false);
		el.event_proc.push(_p);
	};
	el.mm = function(_p) {
		el.addEventListener('touchmove', _p, false);
		el.addEventListener('mousemove', _p, false);
		el.event_proc.push(_p);
	};
	el.mu = function(_p) {
		el.addEventListener('touchend', _p, false);
		el.addEventListener('mouseup', _p, false);
		el.event_proc.push(_p);
	};
	el.kd = function(_p) {
		el.addEventListener('keydown', _p, false);
		el.event_proc.push(_p);
	};
	el.ku = function(_p) {
		el.addEventListener('keyup', _p, false);
		el.event_proc.push(_p);
	};
	el.rmevt = function() {
		for (let i = 0; i < el.event_proc.length; i++) {
			el.removeEventListener('touchstart', el.event_proc[i], false);
			el.removeEventListener('mousedown', el.event_proc[i], false);
			el.removeEventListener('touchmove', el.event_proc[i], false);
			el.removeEventListener('mousemove', el.event_proc[i], false);
			el.removeEventListener('touchend', el.event_proc[i], false);
			el.removeEventListener('mouseup', el.event_proc[i], false);
			el.removeEventListener('keydown', el.event_proc[i], false);
			el.removeEventListener('keyup', el.event_proc[i], false);
		}
		el.event_proc = [];
	};
	return el;
}

function createDiv(_otherType?) {
	let el = document.createElement((_otherType === undefined) ? "div" : _otherType);
	return addDomUtils(el);
};

function prompt(_mess, _default, _type, _proc, _w, _h, _inp_w) {
	let w = _w ? _w : 350;
	let h = _h ? _h : 165;
	let t = 40;
	let msg_height = 50; // Message height
	let msg_width = 300; // Message width
	let msg_top = 0; // Distance from message to top
	let inp_height = 36; // Input height
	let inp_width = _inp_w ? _inp_w : 300; // Input width
	let inp_top = 55; // Distance from input to top
	let ok_top = 120; // Ok btn top
	let ok_width = 80; // Ok btn width
	let ok_height = 30; // Ok btn height
	let ok_right = 23; // Ok btn right margin
	let cancel_left = 23; // Cancel btn left margin

	let scrn = createDiv();
	let wp = createDiv();
	let msg = createDiv();
	let inw = createDiv(); // Input wrapper div
	let inp = null; // Real input
	let ok = createDiv();
	let cancel = createDiv();

	scrn.stls("position:absolute;z-index:10000;overflow:hidden;background-color:rgba(50,50,50,0.7)");
	wp.stls("position:absolute;border-radius:5px;font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-weight: 300;letter-spacing: 1.2px;overflow:hidden;border: 1px solid #b4b4b4;transition:transform 0.2s linear;transform:translate(0px,-200px);background-color:rgba(255,255,255,1)");
	msg.stls("position:relative;text-align:center;display:table-cell;vertical-align:bottom;color:#797979;font-size:16px;white-space: pre-wrap;margin:0px;overflow:hidden");
	inw.stls("position:absolute;border: 0px;border: 1px solid #555");
	ok.stls("position:absolute;text-align:center;vertical-align:middle;background-color:#8CD4F5;color:white;border:none;box-shadow:none;font-size:17px;font-weight:500;-webkit-border-radius:4px;border-radius:5px;cursor: pointer");
	cancel.stls("position:absolute;text-align:center;vertical-align:middle;background-color:#C1C1C1;color:white;border:none;box-shadow:none;font-size:17px;font-weight:500;-webkit-border-radius:4px;border-radius:5px;cursor: pointer");
	inw.stl("line-height", inp_height + "px");
	let winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	let winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	scrn.bnds(0, 0, winW, winH);
	wp.bnds((winW - w) / 2, t, w, h);
	msg.bnds((w - msg_width) / 2, msg_top, msg_width, msg_height);
	msg.innerHTML = _mess;
	inw.bnds((w - inp_width) / 2, inp_top, inp_width, inp_height);
	ok.bnds(w - ok_width - ok_right, ok_top, ok_width, ok_height);
	ok.innerHTML = $L.blockly.prompt_ok;
	ok.stl("line-height", ok_height + "px");
	cancel.bnds(cancel_left, ok_top, ok_width, ok_height);
	cancel.innerHTML = $L.blockly.prompt_cancel;
	cancel.stl("line-height", ok_height + "px");

	let valid = function(ev?) {
		ev.preventDefault();
		scrn.innerHTML = "";
		if (inp.value !== "")
				_proc(_default, inp.value);
		window.document.body.removeChild(scrn);
	};
	let fixOkColor = function() {
		if (inp.value === "") ok.stl("background-color", "#8CD4F5")
		else ok.stl("background-color", "#4BB6DB")
	};
	scrn.kd(function(ev) {
		if (ev.keyCode === 13) {valid();}
	});
	scrn.ku(function(ev) {
		fixOkColor()
	});
	scrn.md(function(ev) {
		ev.stopPropagation();
	});
	ok.mu(valid);
	ok.mm(function(ev) {
		ok.stl("background-color", "#1EAAD0");
		ev.stopPropagation();
	});
	cancel.mm(function(ev) {
		cancel.stl("background-color", "#b9b9b9");
		ev.stopPropagation();
	});
	cancel.mu(function() {
		window.document.body.removeChild(scrn);
	});
	wp.mm(function() {
		fixOkColor();
		cancel.stl("background-color", "#C1C1C1");
	});
	wp.add(msg);
	wp.add(inw);
	wp.add(ok);
	wp.add(cancel);
	scrn.add(wp);
	window.document.body.appendChild(scrn);
	setTimeout(function() {
		wp.stls("transform:translate(0px,0px)");
	}, 1);
	setTimeout(function() {
		// Tout ceci pour changer le clavier iOS : sans correcteur ortho, sans capitales en standard, etc...
		inw.innerHTML = '<input type="' + _type + '" id="dgpad_prompt_area" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">';
		inp = addDomUtils(document.getElementById("dgpad_prompt_area"));
		inp.stls("position:absolute;padding:0px;margin:0px;-webkit-appearance: none;border-radius: 0;-webkit-user-select: text;user-select: text;overflow: hidden;font-weight: 600;border: 0px solid #555;font-size: 24px;text-align: center;white-space: pre-wrap;margin: 0px;vertical-align:middle;color: rgb(50,50,50);outline:none");
		inp.bnds(0, 0, inp_width, inp_height);
		inp.value = _default;
		inp.onfocus = function(e) {
			e.preventDefault();
			setTimeout(function() {
				inp.setSelectionRange(0, 9999);
			}, 0)
		};
		if (!(<any>Object).touchpad) inp.focus();
	}, 200);
}


function clearOneLocalStorage() {
	// On parcours le localstorage tant qu'on rencontre un élément verrouillé :
	let m = localStorage.length;
	let c = JSON.parse(localStorage.getItem($P.localstorage.base + m));
	while ((m > 0) && (!c || c.lock)) {
		m--;
		c = JSON.parse(localStorage.getItem($P.localstorage.base + m));
	}

	if (m === 0) {
		// Si tous les éléments sont verrouillés, on supprime le dernier verrouillé :
		localStorage.removeItem($P.localstorage.base + localStorage.length);
	} else {
		// Sinon, on supprime l'élement m :
		localStorage.removeItem($P.localstorage.base + m);
	}
};


function shiftLocalStorages() {
	for (let i = localStorage.length + 1; i > 1; i--) {
		let k0 = $P.localstorage.base + i;
		let k1 = $P.localstorage.base + (i - 1);
		if (localStorage.getItem(k1)) {
			let c1 = JSON.parse(localStorage.getItem(k1));
			localStorage.setItem(k0, JSON.stringify(c1));
			localStorage.removeItem(k1);
		}
	}
};

function setFilePickerDefaultBox(_s) {
	localStorage.setItem("FilePickerDefaultBox", _s);
};

function getFilePickerDefaultBox() {
	let box = localStorage.getItem("FilePickerDefaultBox");
	if (box)
		return box;
	else
		return "";
};

function set$FPICKERFRAME(_p) {
	$FPICKERFRAME = _p
}

function get$FPICKERFRAME() {
	return $FPICKERFRAME
}

function timer(_proc, _delay, _param) {
	let delay = _delay,
			proc = _proc,
			param = _param,
			runnable = true,
			id = NaN;
	let myproc = function(_p) {
			runnable = false;
			proc(_p);
	};
	this.start = function() {
		if (runnable)
			id = setTimeout(myproc, delay, param);
	};
	this.isRunnable = function() {
		return runnable;
	};
	this.getProc = function() {
		return proc;
	};
	this.getParam = function() {
		return param;
	};
	this.getID = function() {
		return id;
	};
	this.clear = function() {
		clearTimeout(id);
	};
	this.setDelay = function(_d) {
		clearTimeout(id);
		delay = _d;
		this.start();
	};
};

function timers(_dlay) {
	let currentDelay = 0,
		delay = _dlay,
		tab = [];
	this.push = function(_proc, _param) {
		currentDelay += delay;
		tab.push(new timer(_proc, currentDelay, _param));
	};
	this.start = function() {
		for (let i = 0; i < tab.length; i++) {
			tab[i].start();
		}
	};
	this.stop = function() {
		for (let i = 0; i < tab.length; i++) {
			tab[i].clear();
		}
	};
	this.restart = function() {
		this.setDelay(delay)
	};
	this.getIDs = function() {
		let t = [];
		for (let i = 0; i < tab.length; i++) {
			t.push(tab[i].getID());
		}
		return t;
	};
	this.clear = function() {
		for (let i = 0; i < tab.length; i++) {
			tab[i].clear();
		}
		currentDelay = 0;
		tab = [];
	};
	this.setDelay = function(_d) {
		delay = parseInt(_d);
		currentDelay = 0;
		let newtab = [];
		for (let i = 0; i < tab.length; i++) {
			tab[i].clear();
			if (tab[i].isRunnable())
				newtab.push(tab[i]);
		}
		tab = [];
		for (let i = 0; i < newtab.length; i++) {
			currentDelay += delay;
			tab.push(new timer(newtab[i].getProc(), currentDelay, newtab[i].getParam()));
		}
		this.start();
	};
};

function TimeOut(_delay, _function) {
	let time = 0;
	let delay = _delay;
	let func = _function;
	let tOut = null;

	this.startChrono = function() {
		this.stopChrono();
		time = Date.now();
		tOut = setTimeout(func, delay);
	};
	this.stopChrono = function() {
		if (tOut !== null) {
			clearTimeout(tOut);
			tOut = null;
		}
		time = 0;
	};
	this.isTimeout = function() {
		return ((Date.now() - time) > delay);
	};
};


let isMobile = {
	android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	blackberry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	ios: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	mobilePhone: function() {
		return $MOBILE_PHONE;
	},
    //    mobilePhone: function() {
    //        return true;
    //    },
    //    mobilePhone: function() {
    //        return (function(a) {
    //            if (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
    //                return true;
    //            else
    //                return false;
    //        })(navigator.userAgent || navigator.vendor || window.opera);
    //    },
	any: function() {
		return (isMobile.android() || isMobile.blackberry() || isMobile.ios() || isMobile.opera() || isMobile.windows());
	}
};


function isOldAndroid() {
	let ua = navigator.userAgent;
	return ((ua.indexOf("Android") >= 0) && (parseFloat(ua.slice(ua.indexOf("Android") + 8)) < 4.4));
};

let isBrowser = {
	firefox: function() {
		return (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1);
	}
};

function scaleViewportOnMobile() {
	if (isMobile.mobilePhone()) {
		let viewport = document.getElementById('wholeViewport');
		viewport.setAttribute("content", "width=device-width, maximum-scale=1.0, initial-scale=0.65 ,user-scalable=no");
	}
};

function initEvents(ZC, cTag) {
	cTag.canvas = ZC;
	$CANVAS = ZC;
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

// This function is called each time something happend in construction.
// (add, remove, drag, zoom, etc...). This is usefull for python wrapped
// webview :
function changed() {
	window.status = "changed"
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
};

export var Utils = {
	doublePI,
	halfPI,
	AllCanvas,
	noop,
	nullproc,
	isStr,
	isArray,
	isPoint,
	isPointArray,
	isPointArrayWithNaN,
	isVar,
	native2ascii,
	number2letter,
	parseList,
	parseArray,
	parseArrayEnglish,
	addTextToInput,
	getVars,
	startChrono,
	getChrono,
	getTime,
	preloadImage,
	log,
	d,
	angleH,
	approximatelyEqual,
	normalize,
	computeBorderPoints,
	computeRay,
	computeCenter,
	computeArcParams,
	computeAngleParams,
	isNearToPoint,
	isNearToCircle,
	isNearToArc,
	isNearToLine,
	isNearToSegment,
	isNearToRay,
	ptOnArc,
	drawPartialLine,
	extend,
	PadToMouseEvent,
	hexToRGB,
	hexToHSV,
	STL,
	ATT,
	getElementOffset,
	browserCode,
	scolor,
	loadFile,
	leaveAccents,
	utf8_encode,
	utf8_decode,
	base64_encode,
	base64_decode,
	extractDelta,
	isFullLocalStorage,
	addDomUtils,
	createDiv,
	prompt,
	clearOneLocalStorage,
	shiftLocalStorages,
	setFilePickerDefaultBox,
	getFilePickerDefaultBox,
	set$FPICKERFRAME,
	get$FPICKERFRAME,
	timer,
	timers,
	TimeOut,
	isMobile,
	isOldAndroid,
	isBrowser,
	scaleViewportOnMobile,
	initEvents,
	changed,
	initCanvas,
};

(<any>window).$U = Utils;
