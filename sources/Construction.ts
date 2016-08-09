/// <reference path="./typings/iCanvas.d.ts" />

import {ListObject} from './Objects/ListObject';
import {ExpressionObject} from './Objects/ExpressionObject';
import {CoordsSystem} from './CoordsSystem';
import {SourceWriter} from './SourceWriter';
import {TrackManager} from './TrackManager';

var $U = (<any>window).$U;
var $APP_PATH = (<any>window).$APP_PATH;

export class Construction {
	private canvas: iCanvas;
	private mode3D: boolean;
	private ORG3D;
	private mode;
	private V;
	private AO;
	private AV;
	private serial: number;
	private VARS;
	private DEGmode: boolean;
	private DragOnlyMoveable: boolean;
	private indicatedObjs;
	private selectedObjs;
	private DELTA_PHI: number;
	private PHI: number[];
	private OLD_PHI: number;
	private params;
	private targets;
	private exec;
	private varnames;
	private animations;
	private animations_runable: boolean;
	private animations_id;
	private animations_delay: number;
	private animations_ctrl;
	mouseX;
	mouseY;
	prefs;
	coordsSystem: CoordsSystem;
	paint;
	computeAll;
	constructor(_canvas:iCanvas) {
		this.canvas = _canvas;
		this.mode3D = false;
		this.ORG3D = null;
		this.mode = 1;
		this.V = [];
		this.AO = {};
		this.AV = {};
		this.serial = 1;
		this.VARS = {};
		this.DEGmode = true;
		this.DragOnlyMoveable = true;
		this.indicatedObjs = [];
		this.selectedObjs = [];
		this.DELTA_PHI = 0.2;
		this.PHI = [0, 0];
		this.OLD_PHI = 0;
		this.params = [];
		this.targets = [];
		this.exec = null;
		this.varnames = [];
		this.animations = [];
		this.animations_runable = true;
		this.animations_id = null;
		this.animations_delay = 2;
		this.animations_ctrl = null;
		this.mouseX = this.canvas.mouseX;
		this.mouseY = this.canvas.mouseY;
		this.prefs = this.canvas.prefs;
		this.coordsSystem = new CoordsSystem(this);
		this.paint = this.standardPaint;
		this.computeAll = this.computeAll2D;
	}
	createTurtleExpression(_startpt:string): any {
		let name = "blk_turtle_exp_" + _startpt;
		let o = this.find(name);
		if (!o) {
			o = new ExpressionObject(this, name, "", "", "", "NaN", 50, 50);
			o.setHidden(2);
			this.add(o);
			let listname = "blk_turtle_list_" + _startpt;
			let lst = new ListObject(this, listname, o);
			lst.setSegmentsSize(1);
			lst.setSize(0);
			lst.setNoMouseInside(true);
			this.add(lst);
		};
		return o;
	}
	removeTurtleExpression(_startpt:string) {
		let exp = this.find("blk_turtle_exp_" + _startpt);
		let lst = this.find("blk_turtle_list_" + _startpt);
		if (exp) {
			this.remove(lst);
			this.remove(exp);
		};
	}
	getObjectsFromType(_t:string): any[] {
		let tab = [];
		for (let i = 0; i < this.V.length; i++) {
			if (this.V[i].getCode() === "expression_cursor") {continue;}
			if (this.V[i].isHidden()) {continue;}
			if (_t === "any") tab.push(this.V[i])
			else if (this.V[i].getCode() === _t || this.V[i].getFamilyCode() === _t) {tab.push(this.V[i]);}
		};
		return tab
	}
	isDragOnlyMoveable(): boolean {
		return this.DragOnlyMoveable;
	}
	setDragOnlyMoveable(_d:boolean) {
		this.DragOnlyMoveable = _d
	}
	isDEG(): boolean {
		return this.DEGmode;
	}
	setDEG(_d:boolean) {
		this.DEGmode = _d;
		this.canvas.getInterpreter().setDegreeMode(_d);
	}
	cos(_a:number): number {
		return Math.cos(this.DEGmode ? _a * Math.PI / 180 : _a);
	}
	sin(_a:number): number {
		return Math.sin(this.DEGmode ? _a * Math.PI / 180 : _a);
	}
	tan(_a:number): number {
		return Math.tan(this.DEGmode ? _a * Math.PI / 180 : _a);
	}
	getInterpreter(): Interpreter {
		return this.canvas.getInterpreter();
	}
	getTrackManager(): iTrackManager {
		return this.canvas.trackManager;
	}
	getVarName(_n:string) {
		return this.AV.hasOwnProperty(_n)
			? this.AV[_n]
			: this.getNewVarName(_n);
	}
	isVarName(_n): boolean {
		return this.AV.hasOwnProperty(_n);
	}
	getCanvas() {
		return this.canvas;
	}
	getSerial(): number {
		return this.serial++;
	}
	getBounds() {
		return this.canvas.getBounds();
	}
	getHeight(): number {
		return this.canvas.getBounds().height - this.canvas.prefs.controlpanel.size;
	}
	getWidth(): number {
		return this.canvas.getBounds().width;
	}
	reconstructChilds() {
		for (let i = 0, len = this.V.length; i < len; i++) {
			this.V[i].clearChildList();
		}
		for (let i = 0, len = this.V.length; i < len; i++) {
			this.V[i].setParentList(this.V[i].getParent());
		}
	}
	// mode 1 pour pointeur, 2 pour gomme, 3 pour poubelle, 
	// 4 pour construction de macros, 5 pour execution de macros
	// 6 pour les propriétés, 7 pour le tracé, 9 pour le magnetisme,
	// 11 pour la dépendance :
	setMode(_mode:number) {
		this.mode = _mode;
		this.setObjectsMode(this.mode);
		this.clearMacroMode();
		// this.showAnimations(this.mode<2);
		switch (this.mode) {
			case 0: this.paint = this.standardPaint; break;
			case 1: this.paint = this.standardPaint; break;
			case 2: this.paint = this.standardPaint; break;
			case 3: this.paint = this.deletePaint; break;
			case 4: this.paint = this.macroPaint; break;
			case 5: this.paint = this.macroEXEPaint; break;
			case 6: this.paint = this.standardPaint; break;
			case 7: this.paint = this.standardPaint; break;
			case 8: this.paint = this.standardPaint; break;
			case 9: this.paint = this.magnetPaint; break;
			case 11:this.paint = this.macroPaint; break;
		}
	}
	getMode(): number {
		return this.mode;
	}
	isMode(...args:number[]): boolean {
		let res = false;
		let i=0, s=args.length;
		while (i<s) {res = res || (this.mode === args[i]);}
		return res;
	}
	isConsultOrArrowMode(): boolean {
		return this.mode === 0 || this.mode === 1;
	}
	isConsultMode(): boolean {
		return this.mode === 0;
	}
	isArrowMode(): boolean {
		return this.mode === 1;
	}
	isHideMode(): boolean {
		return this.mode === 2;
	}
	isDeleteMode(): boolean {
		return this.mode === 3;
	}
	isMacroMode(): boolean {
		return this.mode === 4;
	}
	isMacroEXEMode(): boolean {
		return this.mode === 5;
	}
	isPropertiesMode(): boolean {
		return this.mode === 6;
	}
	add(_obj) {
		$U.changed();
		this.AO[_obj.getName()] = _obj;
		this.AV[_obj.getName()] = this.getVarName(_obj.getName());
		this.V.push(_obj);
	}
	// Quand on est sûr que le nom correspond au nom de variable :
	Quickadd(_obj) {
		let n = _obj.getName();
		this.AO[n] = _obj;
		this.AV[n] = n;
		this.VARS[n] = n;
		this.V[this.V.length] = _obj;
	}
	deleteAll() {
		this.mode3D = false;
		this.ORG3D = null;
		this.mode = 1;
		this.V = [];
		this.AO = {};
		this.AV = {};
		this.serial = 1;
		this.VARS = {};
		this.paint = this.standardPaint;
		this.indicatedObjs = [];
		this.selectedObjs = [];
		this.computeAll = this.computeAll2D;
		this.params = [];
		this.varnames = [];
		this.canvas.getInterpreter().BLK_GLOB_DELETE();
	}
	setAllSize(_type, size:number) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setSize(size);
		}
	}
	setAllSegSize(_type, size:number) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type) {
				if ((size === 0) && (this.V[i].getSize() === 0)) {
					this.V[i].setSize(0.1);
				}
				this.V[i].setSegmentsSize(size);
			}
		}
	}
	setAllColor(_type, color:string) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setColor(color);
		}
	}
	setAllOpacity(_type, alpha:number) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setOpacity(alpha);
		}
	}
	setAllLayer(_type, _lay) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setLayer(_lay);
		}
	}
	setAllPtShape(_shape) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === "point")
				this.V[i].setShape(_shape);
		}
	}
	setAllFontSize(_type, size:number) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setFontSize(size);
		}
	}
	setAllPrecision(_type, precision:number) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type) {
				this.V[i].setPrecision(precision);
				if ((_type === "locus") || (_type === "quadric")) {
					this.V[i].compute();
					// this.V[i].computeChilds();
				}
			}
		}
	}
	setAllIncrement(_type, _v) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setIncrement(_v);
		}
	}
	setAllDash(_type, _v) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setDash(_v);
		}
	}
	setAll360(_type, _is360:boolean) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].set360(_is360);
		}
	}
	setAllTrigo(_type, _t) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setTrigo(_t);
		}
	}
	setAllNoMouse(_type, _v) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].getFamilyCode() === _type)
				this.V[i].setNoMouseInside(_v);
		}
	}
	elements() {
		return this.V;
	}
	isEmpty(): boolean {
		return this.V.length === 0;
	}
	// homothétie de centre (_x;_y) et de rapport _h :
	zoom(_x:number, _y:number, _h:number) {
		$U.changed();
		this.coordsSystem.zoom(_x, _y, _h);
	}
	// translation de vecteur (_x;_y) :
	translate(_x:number, _y:number) {
		$U.changed();
		this.coordsSystem.translate(_x, _y);
	}
	translateANDzoom(_xt:number, _yt:number, _xz:number, _yz:number, _h:number) {
		$U.changed();
		this.coordsSystem.translateANDzoom(_xt, _yt, _xz, _yz, _h);
	}
	findCoincidents(_t) {
		if (_t.length < 2) {return null;}
		let c = [_t[0]];
		for (let i = 1, len = _t.length; i < len; i++) {
			if (_t[0].isCoincident(_t[i]))
				c.push(_t[i]);
		}
		return c.length === 1 ? null : c;
	}
	getNames(): string[] {
		return Object.keys(this.AO);
	}
	find(oName:string) {
		return this.AO[oName];
	}
	findVar(vName:string) {
		return this.AO[this.VARS[vName]];
	}
	// Pour l'affichage des indices des noms d'objets :
	getSubName(_n): string {
		let t = _n.toString().split("");
		let n = [];
		let i = t.length - 1;
		while ((i >= 0) && (!isNaN(t[i]))) {
			n.push(String.fromCharCode(8320 + parseInt(t[i])));
			i--;
		}
		n.reverse();
		let s = t.slice(0, i + 1).join("") + n.join("");
		return s;
	}
	getUnusedName(_n:string, _o) {
		switch (_n) {
			case "":
				_n = "_O";
				break;
			// A partir de là, on traite les "mots" réservés :
			// case "x":
			// _n = "_x";
			// break;
			// case "y":
			// _n = "_y";
			// break;
			// case "d":
			// _n = "_d";
			// break;
		}
		_n = _n.replace(/\"/g, "");
		let n = (_n.charAt(0) === "_") ? this.genericName(_n.slice(1), _o) : this.uniqueName(_n, _o);
		if (_o.getName) {
			delete this.AO[_o.getName()];
			delete this.VARS[this.AV[_o.getName()]];
			delete this.AV[_o.getName()];
		}
		this.AO[n] = _o;
		this.AV[n] = this.getVarName(n);
		return n;
	}
	// Crée un nom de variable JS nouveau pour l'objet de nom s (et l'ajoute au catalogue this.VARS) :
	private getNewVarName(s) {
		// console.log("getNewVarName");
		let v = $U.leaveAccents(s);
		if (this.VARS.hasOwnProperty(v)) {
			let b = 1;
			while (this.VARS.hasOwnProperty(v + b)) {b++}
			v = v + b;
		}
		this.VARS[v] = s;
		return v;
	}
	private paintSortFilter(a, b) {
		if (a.getLayer() !== b.getLayer()) {return (a.getLayer() - b.getLayer());}
		let ap = a.isInstanceType("point");
		let bp = b.isInstanceType("point");
		if (ap && bp) {return (a.getPaintOrder() - b.getPaintOrder());}
		if (ap) {return 1;}
		if (bp) {return -1;}
		return (a.getPaintOrder() - b.getPaintOrder());
	}
	private standardPaint(ctx:CanvasRenderingContext2D, coords) {
		// ctx.beginPath();
		this.coordsSystem.paint(ctx);
		// Réalise une copie de l'array V :
		let Objs = this.V.slice(0);
		// Les points doivent être dessinés en dernier :
		Objs.sort(this.paintSortFilter);
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		for (let i = 0, len = Objs.length; i < len; i++) {
			Objs[i].this.paint(ctx);
		}
		this.canvas.magnifyManager.magnifierPaint(coords);
		this.canvas.blocklyManager.paintTurtle();
	}
	private macroPaint(ctx:CanvasRenderingContext2D, coords) {
		// console.log("macropaint");
		this.standardPaint(ctx, coords);
		ctx.globalAlpha = 1;
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		let b = this.canvas.getBounds();
		ctx.fillStyle = "rgba(255,255,255,0.6)";
		ctx.fillRect(0, 0, b.width, b.height);
		let Objs = this.V.slice(0);
		Objs.sort(this.paintSortFilter);
		for (let i = 0, len = Objs.length; i < len; i++) {
			switch (Objs[i].getMacroMode()) {
				case 0:
					// neutre
					break;
				case 1:
					// Intermédiaire
					Objs[i].this.paint(ctx);
					break;
				case 2:
					// Initial
					Objs[i].this.paint(ctx);
					break;
				case 3:
					Objs[i].this.paint(ctx);
					// Final
					break;
			}
		}
	}
	private magnetPaint(ctx:CanvasRenderingContext2D, coords) {
		// this.canvas.magnetManager.paint(ctx);
		this.macroPaint(ctx, coords);
		this.canvas.magnetManager.paint(ctx);
		// this.canvas.magnetManager.paintIcon(ctx);
	}
	private macroEXEPaint(ctx:CanvasRenderingContext2D, coords) {
		this.standardPaint(ctx, coords);
		ctx.globalAlpha = 1;
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		let b = this.canvas.getBounds();
		ctx.fillStyle = "rgba(255,255,255,0.6)";
		ctx.fillRect(0, 0, b.width, b.height);
		let Objs = this.V.slice(0);
		Objs.sort(this.paintSortFilter);
		for (let i = 0, len = Objs.length; i < len; i++) {
			switch (Objs[i].getMacroMode()) {
				case 0:
					// neutre
					break;
				case 4:
					// Initial possible
					Objs[i].paint(ctx);
					break;
				case 5:
					// Initial choisi
					Objs[i].paint(ctx);
					break;
			}
		}
	}
	private deletePaint(ctx:CanvasRenderingContext2D, coords) {
		this.standardPaint(ctx, coords);
		ctx.globalAlpha = 1;
		ctx.shadowColor = '';
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		let b = this.canvas.getBounds();
		ctx.fillStyle = "rgba(50,0,0,0.3)";
		ctx.fillRect(0, 0, b.width, b.height);
	}
	private setObjectsMode(_mode) {
		for (let i = 0, len = this.V.length; i < len; i++) {
			this.V[i].setMode(_mode);
		}
	}
	private slowfind(_oName, _o) {
		let len = this.V.length;
		for (let i = 0; i < len; i++) {
			if (this.V[i] === _o) {continue;}
			if (_oName === this.V[i].getName()) {return this.V[i];}
		}
		return null;
	}
	private uniqueName(_name, _o) {
		let name = _name;
		let basename = _name;
		let num = 0;
		while (this.slowfind(name, _o)) {
			name = basename + num;
			num++;
		}
		return name;
	}
	private genericName(_base:string, _o): string {
		let baseName = "";
		if (_base) {
			baseName = _base;
		} else {
			baseName = "O";
		}
		let num = 1;
		while (this.slowfind(baseName + num, _o)) {num++;}
		return (baseName + num);
	}
	private findFreePointsRecursive(_o) {
		if (_o.Flag) {return;}
		_o.Flag = true;
		if ((_o.getCode() === "point") && (_o.isMoveable())) {_o.Flag2 = true;}
		for (let i = 0, len = _o.getParentLength(); i < len; i++) {
			let t = this.findFreePointsRecursive(_o.getParentAt(i));
		}
	}
	// this.printAV = function() {
	// 	for (let nom_indice in this.AV) {
	// 		console.log(nom_indice + ":" + this.AV[nom_indice].getName());
	// 	}
	// }
	private dependsOnRecursive(o, on): boolean {
		o.Flag = true;
		if (o === on) {return true;}
		let o1 = o.getParent();
		let len = o1.length;
		for (let i = 0; i < len; i++) {
			if ((o1[i] === o) || (o1[i].Flag)) {continue;}
			if (this.dependsOnRecursive(o1[i], on)) {return true;}
		}
		return false;
	}
	private dependsOn(o, on): boolean {
		let len = this.V.length;
		for (let i = 0; i < len; i++) {
			this.V[i].Flag = false;
		}
		return this.dependsOnRecursive(o, on);
	}
	// Cherche les points libres parmi tous les parents
	// d'un objet donné, et renvoie ces parents dans un tableau :
	findFreePoints(_o) {
		if ((_o.getCode() === "point") && (_o.isMoveable()) && (_o.getParentLength() === 1))
			return [_o];
		let len = this.V.length;
		for (let i = 0; i < len; i++) {
			this.V[i].Flag = false;
			this.V[i].Flag2 = false;
		}
		this.findFreePointsRecursive(_o);
		let t = [];
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].Flag2) {
				t.push(this.V[i]);
			}
		}
		return t;
	}
	remove(_o) {
		$U.changed();
		let i = this.V.indexOf(_o);
		if (i !== -1) {
			this.V.splice(i, 1);
			if (_o.getName) {
				delete this.AO[_o.getName()];
				delete this.VARS[this.AV[_o.getName()]];
				delete this.AV[_o.getName()];
			}
		}
		for (let k = 0, len = this.V.length; k < len; k++) {
			this.V[k].deleteChild(_o);
		}
	}
	safelyDelete(_o) {
		_o = (_o.objToDelete) ? _o.objToDelete() : _o;
		let deleteObjs = [];
		let len = this.V.length;
		for (let i = 0; i < len; i++) {
			if (this.dependsOn(this.V[i], _o)) {
				deleteObjs.push(this.V[i]);
			}
		}
		len = deleteObjs.length;
		for (let i = 0; i < len; i++) {
			this.remove(deleteObjs[i]);
		}
		return deleteObjs;
	}
	addIndicated(obj) {
		this.indicatedObjs.push(obj);
	}
	clearIndicated() {
		let len = this.indicatedObjs.length;
		for (let i = 0; i < len; i++) {
			this.indicatedObjs[i].setIndicated(false);
		}
		this.indicatedObjs = [];
	}
	getIndicated() {
		return this.indicatedObjs;
	}
	getFirstIndicatedPoint() {
		let len = this.indicatedObjs.length;
		let P1 = null;
		for (let i = 0; i < len; i++) {
			if (this.indicatedObjs[i].isInstanceType("point")) {
				P1 = this.indicatedObjs[i];
				return P1;
			}
		}
		return null;
	}
	getLastPoint() {
		let len = this.V.length;
		let pts = [];
		for (let i = 0; i < len; i++) {
			if ((this.V[i].isInstanceType("point")) && (this.V[i].getTimeStamp())) {
				pts.push(this.V[i]);
			}
		}
		if (pts.length > 0) {
			pts.sort(this.getLastPoint_sortFilter);
			return pts[0];
		}
		return null;
	}
	getSelected() {
		return this.selectedObjs;
	}
	addSelected(obj) {
		obj.setSelected(true);
		this.selectedObjs.push(obj);
	}
	clearSelected() {
		let len = this.selectedObjs.length;
		for (let i = 0; i < len; i++) {
			this.selectedObjs[i].setSelected(false);
		}
		this.selectedObjs = [];
	}
	getObjectsUnderMouse(ev) {
		let t = [];
		let hmode = this.isHideMode();
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (!this.V[i].isSuperHidden()) {
				if ((hmode && this.V[i].getMode() === 2) || (!this.V[i].isHidden())) {
					if (this.V[i].mouseInside(ev))
						t.push(this.V[i]);
				}
			}
		}
		return t;
	}
	doOrder(_tab) {
		let i=0, s=_tab.length;
		if (!s) {return;}
		while (i<s) {
			_tab[i].Scratch = 0;
			_tab[i].Flag = false;
			_tab[i++].Index = i;
		}
		// Compute tail chain length for all objects recursively :
		i=0;
		while (i<s) {this.countTail(_tab[i++]);}
		_tab.sort(this.doOrderSortFilter);
	}
	orderObjects() {
		this.doOrder(this.V);
		let i=0, s=this.V.length;
		while (i<s) {this.V[i++].orderChildList();}
	}
	// let rawValidate = function(ev) {
	// this.indicatedObjs = [];
	// this.selectedObjs = [];
	// for (let i = 0, len = this.V.length; i < len; i++) {
	// this.V[i].validate(ev);
	// }
	// };
	private getLastPoint_sortFilter(a, b) {
		return b.getTimeStamp() > a.getTimeStamp() ? 1 : -1;
	}
	private doOrderSortFilter(a, b) {
		return a.Scratch === b.Scratch ? a.Index - b.Index : a.Scratch - b.Scratch;
	}
	private countTail(o) {
		if (o.Flag) {return o.Scratch;}
		o.Flag = true;
		let max = 0;
		let objs = o.getParent();
		if (objs.length === 0) {
			o.Scratch = 0;
		} else {
			let i=0, s=objs.length;
			while (i<s) {
				if (objs[i] !== o) {
					let k = this.countTail(objs[i]);
					if (k > max) {max = k;}
				}
				i++;
			}
			o.Scratch = max + 1;
		}
		return o.Scratch;
	}
	private rawValidate(ev) {
		this.indicatedObjs = [];
		this.selectedObjs = [];
		let i=0, s=this.V.length;
		while (i<s) {
			if (this.V[i].setIndicated(this.V[i].validate(ev))) {
				this.indicatedObjs.push(this.V[i]);
			}
			i++;
		}
	}
	private applyValidateFilters(ev) {
		let i = this.indicatedObjs.length;
		if (i > 1) {
			i -= 1;
			while (i > -1) {
				let obj = this.indicatedObjs[i];
				// Si un point figure dans les this.indicatedObjs, on ne garde que 
				// les point indicated :
				if (obj.isInstanceType("point")) {
					let t = [obj];
					for (let j = i - 1; j >= 0; j--) {
						obj = this.indicatedObjs[j];
						if (obj.isInstanceType("point")) {
							t.push(obj);
						}
					}
					this.clearIndicated();
					let k=0, s=t.length;
					while (k<s) {
						t[k].setIndicated(true);
						this.addIndicated(t[k++]);
					}
					break;
				}
				i--;
			}
		}
		// if (ev.type === "mouseup") {
		// 	len = this.indicatedObjs.length;
		// 	for (i = 0; i < len; i++) {
		// 		this.addSelected(this.indicatedObjs[i]);
		// 	}
		// }
	}
	validate(ev) {
		this.rawValidate(ev);
		this.applyValidateFilters(ev);
	}
	// let clearAllIndicated = function() {
	// 	for (let i = 0, len = this.V.length; i < len; i++) {
	// 		this.V[i].setIndicated(false);
	// 	}
	// };
	// this.validate = function(ev) {
	// 	this.indicatedObjs = [];
	// 	this.selectedObjs = [];
	// 	for (let i = 0, len = this.V.length; i < len; i++) {
	// 		if (this.V[i].setIndicated(this.V[i].validate(ev))) {
	// 			if ((this.V[i].isInstanceType("point"))) {
	// 				clearAllIndicated();
	// 				this.indicatedObjs = [this.V[i]];
	// 				this.V[i].setIndicated(true);
	// 				return;
	// 			} else this.indicatedObjs.push(this.V[i]);
	// 		}
	// 	}
	// };
	compute() {
	};
	// Recherche l'origine du repère 3D parmi les 
	// parents du point _P :
	private get3DOriginInParents(_P) {
		if (_P.getFloat()) {return _P;}
		let par = _P.getParent();
		let i=0, s=par.length;
		while (i<s) {return this.get3DOrigin(par[i++]);}
		return null;
	}
	// Retourne l'origine du repère 3D auquel
	// l'objet _P est lié :
	get3DOrigin(_P) {
		if (this.ORG3D) {return this.ORG3D;}
		let Org3D = (_P === null) ? null : this.get3DOriginInParents(_P);
		if (Org3D === null) {
			// Si l'origine n'a pas été trouvée parmi
			// les parents de P, on prend le premier
			// point flottant rencontré dans la construction
			// comme origine du repère 3D :
			let i=0, s=this.V.length;
			while (i<s) {
				if (this.V[i].getFloat()) {return this.V[i];}
				i++;
			}
		}
		return Org3D;
	}
	isOrigin3D(_P) {
		return (_P === this.ORG3D);
	}
	setOrigin3D(_P) {
		if (this.mode3D && this.ORG3D === null) {this.ORG3D = _P;}
	}
	// Methode obsolete, maintenue pour la 
	// compatibilité des figures 3D d'avant
	// le 22 novembre 2013 :
	set3DMode(mode:boolean) {
		this.computeAll = mode ? this.computeAll3D : this.computeAll2D;
	}
	// idem :
	is3DMode() {
		return this.computeAll === this.computeAll3D;
	}
	set3D(mode:boolean) {
		this.computeAll = mode ? this.computeAll3D : this.computeAll2D;
		this.mode3D = mode;
	}
	is3D() {
		return this.mode3D;
	}
	getPhi() {
		return this.PHI;
	}
	getTheta() {
		return this.canvas.getInterpreter().getEX().EX_theta();
	}
	setcompute3D_filter(_proc) {
		this.compute3D_filter = _proc;
	}
	clearcompute3D_filter() {
		this.compute3D_filter = function () {};
	}
	private compute3D_filter() {
	}
	private computeAll3D() {
		let realPhiFunc = this.canvas.getInterpreter().getEX().EX_phi;
		let realphi = realPhiFunc();
		let myphi = realphi + this.DELTA_PHI;
		let myPhiFunc = function () {
			return myphi;
		};
		let len = this.V.length;
		// console.log("********* PREMIER DECALAGE");
		this.canvas.getInterpreter().getEX().EX_phi = myPhiFunc;
		this.PHI = [this.OLD_PHI, realphi + this.DELTA_PHI];
		let i=0, s=this.V.length;
		while (i<s) {this.V[i++].compute();}
		this.compute3D_filter();
		this.canvas.textManager.compute();
		i=0;
		while (i<s) {this.V[i++].storeX();}
		// console.log("********* SECOND DECALAGE");
		this.canvas.getInterpreter().getEX().EX_phi = realPhiFunc;
		this.PHI = [realphi + this.DELTA_PHI, realphi];
		i=0;
		while (i<s) {this.V[i++].compute();}
		this.compute3D_filter();
		this.canvas.textManager.compute();
		i=0;
		while (i<s) {this.V[i++].storeX();}
		this.OLD_PHI = realphi;
	}
	private computeAll2D() {
		let i=0, s=this.V.length;
		while (i<s) {this.V[i++].compute();}
	}
	computeChilds(t) {
		let i=0, k, s=t.length;
		while (i<s) {
			let chlds = t[i++].getChildList(), l=chlds.length;
			k = 0;
			while (k<l) {chlds[k++].Flag = true;}
		}
		i=0;
		while (i<s) {
			let chlds = t[i++].getChildList(), l=chlds.length;
			k = 0;
			while (k<s) {
				if (chlds[k].Flag) {
					chlds[k].compute();
					chlds[k].Flag = false;
				}
				k++;
			}
		}
	}
	computeMagnetObjects() {
		let i=0, s=this.V.length;
		while (i<s) {this.V[i++].computeMagnets();}
	}
	isAxisUsed() {
		for (let i = 0, s = this.V.length; i<s; i++) {
			for (let j = 0, t = this.V[i].getParentLength(); j<t; j++) {
				if (this.V[i].getParentAt(j).getCode().startsWith("axis")) {
					return true;
				}
			}
		}
		return false;
	}
	getSource() {
		let len = this.V.length;
		if (len > 0) {
			this.doOrder(this.V);
			if (this.ORG3D) {
				for (let i = 0; i < len; i++) {
					if (this.V[i] === this.ORG3D) {
						this.V.splice(i, 1);
						this.V.unshift(this.ORG3D);
						break;
					}
				}
			}
			let src = new SourceWriter(this);
			for (let i = 0; i < len; i++) {
				this.V[i].getSource(src);
				this.V[i].getStyle(src);
				this.V[i].getBlock(src);
			}
			let txt = "// Coordinates System :\n";
			txt += this.coordsSystem.getSource();
			txt += "\n\n// Geometry :\n";
			txt += src.getGeom();
			txt += "\n\n// Styles :\n";
			txt += src.getStyle();
			txt += this.coordsSystem.getStyle();
			txt += this.canvas.getStyle();
			if (src.getBlock() !== "") {
				txt += "\n\n// Blockly :\n";
				txt += src.getBlock();
			};
			txt += this.getInterpreter().BLK_GLOB_SRC();
			// if (this.isAxisUsed()) txt+=this.coordsSystem.getStyle();
			return txt;
		}
		return "";
	}
	private tagDepsChain(o, on) {
		if (o === on)
			return true;
		let bool = false;
		for (let i = 0, len = o.getParentLength(); i < len; i++) {
			// Le or est intelligent : si on veut parcourir tout l'arbre
			// il faut forcer l'appel récursif avant le or.
			let t = this.tagDepsChain(o.getParentAt(i), on);
			bool = bool || t;
		}
		o.Flag2 = bool;
		return bool;
	}
	// Trouve la chaine de dépendence depuis un objet enfant
	// jusqu'à un parent donné, et renvoie les objets trouvés
	// dans un tableau :
	findDeps(_obj, _untilObj) {
		// Préparation : tous les objets sont taggés false
		for (let i = 0, len = this.V.length; i < len; i++) {
			this.V[i].Flag = false;
			this.V[i].Flag2 = false;
		}
		this.tagDepsChain(_obj, _untilObj);
		_obj.Flag2 = false;
		let t = [];
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].Flag2) {
				t.push(this.V[i]);
			}
		}
		return t;
	}
	private findPtOn_recursive(_o) {
		if (!_o.Flag2) {
			_o.Flag2 = true;
			_o.Flag = (_o.isPointOn());
			for (let j = 0, l = _o.getParentLength(); j < l; j++) {
				this.findPtOn_recursive(_o.getParentAt(j));
			}
		}
	}
	// Renvoie le premier point sur objet trouvé dans la chaine
	// de dépendance de l'objet obj (le plus proche de obj).
	// Si non trouvé, renvoie null :
	findPtOn(_obj) {
		// Préparation : tous les objets sont taggés false
		for (let i = 0, len = this.V.length; i < len; i++) {
			this.V[i].Flag = false;
			this.V[i].Flag2 = false;
		}
		_obj.Flag2 = false;
		this.findPtOn_recursive(_obj);
		_obj.Flag = false;
		let t = [];
		for (let i = 0, len = this.V.length; i < len; i++) {
			if (this.V[i].Flag) {
				t.push(this.V[i]);
			}
		}
		if (t.length > 0)
			return t[t.length - 1];
		else
			return null;
	}
	private addParameter(_n) {
		this.params.push(_n);
	}
	private removeParameter(_n) {
		this.params.splice(this.params.indexOf(_n), 1);
	}
	private addTarget(_n) {
		this.targets.push(_n);
	}
	private removeTarget(_n) {
		this.targets.splice(this.targets.indexOf(_n), 1);
	}
	clearMacroMode() {
		for (let i = 0, len = this.V.length; i < len; i++) {
			this.V[i].setMacroMode(0);
			this.V[i].setMacroSource(null);
		}
		this.params = [];
		this.targets = [];
	}
	macroConstructionTag(obj) {
		// Si il s'agit du mode construction de macro :
		switch (obj.getMacroMode()) {
			case 0:
				// Objet neutre qui devient initial :
				obj.setMacroMode(2);
				// Rafraîchissement des intermédiaires :
				// checkIntermediates();
				// this.canvas.macrosManager.addConstructionParam(obj.getName());
				this.addParameter(obj);
				this.targets = [];
				this.checkIntermediates();
				break;
			case 1:
				// Intermédiaire qui devient final :
				obj.setMacroMode(3);
				this.addTarget(obj);
				break;
			case 2:
				// Initial qui devient neutre :
				obj.setMacroMode(0);
				this.checkIntermediates();
				this.removeParameter(obj);
				this.targets = [];
				break;
			case 3:
				// Final qui devient intermédiaire :
				obj.setMacroMode(1);
				this.removeTarget(obj);
				break;
		}
		this.computeMacro();
	}
	macroExecutionTag(obj) {
		// Si il s'agit du mode execution de macro :
		switch (obj.getMacroMode()) {
			case 0:
				// Objet neutre reste neutre :
				break;
			case 4:
				// Initial possible qui devient initial choisi :
				obj.setMacroMode(5);
				this.canvas.macrosManager.addParam(obj.getVarName());
				break;
			case 5:
				// Initial choisi qui redevient initial possible :
				obj.setMacroMode(4);
				break;
		}
	}
	private checkIntermediate(obj) {
		if (!obj.Flag) {
			obj.Flag = true;
			// setMacroAutoObject peut déclarer intermédiaire (getMacroMode()===1) des objets,
			// il faut donc en tenir compte :
			if ((obj.getMacroMode() === 2) || (obj.getMacroMode() === 1)) {
				obj.Flag2 = true; // Est un initial, donc à classer dans les intermédiaires
				return; // possibles pour amorcer la recursivité.
			}
			let len = obj.getParentLength();
			if (len === 0) {
				obj.Flag2 = false; // Objet non initial sans dépendence :
				return; // n'est pas un intermédiaire possible.
			}
			obj.Flag2 = true;
			for (let i = 0; i < len; i++) {
				this.checkIntermediate(obj.getParentAt(i));
				obj.Flag2 = obj.Flag2 && obj.getParentAt(i).Flag2;
			}
			if (obj.Flag2)
				obj.setMacroMode(1);
		}
	}
	private checkIntermediates() {
		let len = this.V.length;
		for (let i = 0; i < len; i++) {
			this.V[i].Flag = false;
			this.V[i].Flag2 = false;
			if (this.V[i].getMacroMode() !== 2) {
				this.V[i].setMacroMode(0);
				this.V[i].setMacroSource(null);
			} else {
				this.V[i].setMacroAutoObject();
			}
		}
		for (let i = 0; i < len; i++) {
			this.checkIntermediate(this.V[i]);
		}
	}
	private tagDependencyChain(obj) {
		if (!obj.Flag) {
			obj.Flag = true;
			if (obj.getMacroMode() !== 2) {
				for (let i = 0, len = obj.getParentLength(); i < len; i++) {
					this.tagDependencyChain(obj.getParentAt(i));
				}
			}
		}
	}
	private createVarNames() {
		this.varnames = [];
		for (let i = 0, len = this.params.length; i < len; i++) {
			this.varnames.push(this.params[i].getVarName());
		}
	}
	private paramsSortFilter(a, b) {
		return (this.varnames.indexOf(a) - this.varnames.indexOf(b));
	}
	private computeMacro() {
		let txt = "";
		let src = new SourceWriter(this);
		let p = []; // this.params
		let t = []; // this.targets
		this.doOrder(this.V);
		if (this.targets.length > 0) {
			// S'il y a des finaux :
			// Préparation : tous les objets sont taggés false
			for (let i = 0, len = this.V.length; i < len; i++) {
				this.V[i].Flag = false;
			}
			for (let i = 0, len = this.targets.length; i < len; i++) {
				// On va tagger true la chaine de dépendence
				// jusqu'à rencontrer un initial :
				this.tagDependencyChain(this.targets[i]);
			}
			for (let i = 0, len = this.V.length; i < len; i++) {
				if (this.V[i].Flag) {
					if (this.V[i].getMacroMode() === 2) {
						// S'il s'agit d'un initial :
						p.push(this.V[i].getVarName());
					} else {
						// AU MOINDRE PROBLEME DE MACRO DEPUIS 2/11/2013
						// VOIR ATTENTIVEMENT CE CHANGEMENT :
						if (this.V[i].getMacroMode() === 1)
							this.V[i].getSource(src);
						// AVANT LE 2/11, SANS TEST :
						// this.V[i].getStyle(src);
						if (this.V[i].getMacroMode() === 3) {
							// S'il s'agit d'un final :
							// AJOUTE LE 2/11
							this.V[i].getSource(src);
							this.V[i].getStyle(src);
							t.push(this.V[i].getVarName());
						}
					}
				}
			}
			for (let i = 0, len = this.params.length; i < len; i++) {
				let obj = this.params[i];
				if (obj.isAutoObjectFlags()) {
					if (p.indexOf(obj.getVarName()) === (-1))
						p.push(obj.getVarName());
				}
			}
		} else {
			// S'il n'y a pas de finaux :
			for (let i = 0, len = this.V.length; i < len; i++) {
				if (this.V[i].getMacroMode() === 2) {
					// S'il s'agit d'un initial :
					p.push(this.V[i].getVarName());
				} else if (this.V[i].getMacroMode() === 1) {
					// S'il s'agit d'un intermédiaire :
					this.V[i].getSource(src);
					// this.V[i].getStyle(src);
					if (!this.V[i].isHidden()) {
						this.V[i].getStyle(src);
						t.push(this.V[i].getVarName());
					}
				}
			}
		}
		this.createVarNames();
		p.sort(this.paramsSortFilter);
		txt = "(function(" + p.join(",") + "){\n";
		txt += src.getGeom();
		txt += src.getStyle();
		// if (this.targets.length === 0) {
		// txt += src.getStyle();
		// }
		txt += "return [" + t.join(",") + "];\n";
		txt += "})";
		let f = eval(txt);
		// Retransforme les initiaux et les cibles : on rétablit les
		// vrais noms d'objets à la place des noms de variable :
		for (let i = 0, s = p.length; i < s; i++) {
			// console.log(p[i]);
			p[i] = this.VARS[p[i]];
		}
		for (let i = 0, s = t.length; i < s; i++) {
			t[i] = this.VARS[t[i]];
		}
		this.canvas.macrosManager.refreshConstructionPanel(p, t, f);
		// console.log("*****************");
		// console.log(src.getGeom());
	}
	private clearAnimations() {
		for (let i = 0; i < this.animations.length; i++) {
			let an = this.animations[i];
			if ((this.V.indexOf(an.obj) === -1) || (an.speed === 0)) {
				this.animations.splice(i, 1);
				i--
			}
		};
		if (this.animations.length === 0) {
			clearInterval(this.animations_id);
			this.animations_id = null;
			this.animations = [];
			if ((this.animations_ctrl) && (this.animations_ctrl.parentNode)) {
				document.body.removeChild(this.animations_ctrl);
			}
			this.animations_ctrl = null;
			return true
		}
		return false;
	}
	private loopAnimations() {
		if (this.clearAnimations()) return;
		if (this.animations_runable) {
			for (let i = 0; i < this.animations.length; i++) {
				let an = this.animations[i];
				if (this.V.indexOf(an.obj) !== -1) {
					an.obj.incrementAlpha(an);
					// an.obj.blocks.evaluate("ondrag"); // blockly
					an.obj.compute();
					an.obj.computeChilds();
				} else {
					this.animations.splice(i, 1);
					i--
				}
			}
			this.canvas.paintAnim();
		}
	}
	private animations_sort(a, b) {
		return (b.obj.getChildList().length - a.obj.getChildList().length)
	}
	private showAnim_btn(_showpause) {
		if (this.clearAnimations()) return;
		let img_pause = $APP_PATH + "NotPacked/images/controls/anim_stop.svg";
		let img_start = $APP_PATH + "NotPacked/images/controls/anim_start.svg";
		if (!this.animations_ctrl) {
			let el = $U.createDiv();
			el.stls("background-color:rgba(0,0,0,0);position:absolute;z-index:9000;background-position:center;background-repeat:no-repeat;background-size:100% 100%");
			document.body.appendChild(el);
			this.animations_ctrl = el;
			this.resizeBtn();
		}
		this.animations_ctrl.rmevt();
		if (_showpause) {
			this.animations_ctrl.stl("background-image", "url(" + img_pause + ")");
			this.animations_ctrl.md(function (ev) {
				ev.preventDefault();
				this.showAnimations(false)
			})
		} else {
			this.animations_ctrl.stl("background-image", "url(" + img_start + ")");
			this.animations_ctrl.md(function (ev) {
				ev.preventDefault();
				this.showAnimations(true)
			})
		}
	}
	resizeBtn() {
		if (this.animations_ctrl) {
			let sz = 50;
			let margins = 5;
			let l = margins;
			let t = this.canvas.getHeight() - this.canvas.prefs.controlpanel.size - sz - margins;
			this.animations_ctrl.bnds(l, t, sz, sz);
		}
	}
	showAnimations(_b) {
		this.animations_runable = _b;
		this.showAnim_btn(_b);
		if (_b) {
			let d = new Date();
			let t = d.getTime();
			for (let i = 0; i < this.animations.length; i++) {
				this.animations[i].timestamp = t;
				this.animations[i].loopnum = 0;
				this.animations[i].incsum = 0;
				this.animations[i].currentstamp = t;
				// if (this.animations[i].obj.inithashtab) this.animations[i].obj.inithashtab(this.animations[i].speed);
			}
		}
	}
	findInAnimations(_o) {
		for (let i = 0; i < this.animations.length; i++) {
			if (this.animations[i].obj === _o) return this.animations[i];
		}
		return null;
	}
	private isOnCircle(_o) {
		return ((_o.getCode() === "point") && (_o.getParentLength() === 1) && (_o.getParentAt(0).isInstanceType("circle")))
	}
	getAnimationSpeed(_o) {
		let an = this.findInAnimations(_o);
		if (an) {
			let v = (this.isOnCircle(_o)) ? Math.round(an.speed * 180 / Math.PI) : an.speed;
			return v
		} else return 0;
	}
	setAnimationSpeed(_o, _v) {
		let an0 = this.findInAnimations(_o);
		if (this.isOnCircle(_o)) _v = _v * Math.PI / 180;
		if (an0) {
			an0.speed = _v;
		} else {
			this.animations.push({
				obj: _o,
				speed: _v,
				direction: 1,
				ar: false,
				delay: this.animations_delay,
				timestamp: null
			});
			this.animations.sort(this.animations_sort);
		}
		if (!this.animations_id) {
			this.animations_id = setInterval(this.loopAnimations, this.animations_delay);
		}
		this.showAnimations(true);
	}
	addAnimation(_o, _v, _d, _m) {
		let an0 = this.findInAnimations(_o);
		if (an0) {
			an0.speed = _v;
			an0.direction = _d;
			an0.ar = _m;
			an0.delay = this.animations_delay;
		} else {
			this.animations.push({
				obj: _o,
				speed: _v,
				direction: _d,
				ar: _m,
				delay: this.animations_delay,
				timestamp: null
			});
			this.animations.sort(this.animations_sort);
		}
		if (!this.animations_id) {
			this.animations_id = setInterval(this.loopAnimations, this.animations_delay);
		}
		this.showAnimations(true);
	}
}
