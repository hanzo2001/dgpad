/// <reference path="../typings/Objects/iConstructionObject.d.ts" />

import {Color} from '../Utils/Color';
import {BlocklyObjects} from './BlocklyObjects';

var $U = (<any>window).$U;

var noop = function () {};

/**
 * duck typing: getSegmentsSize is not defined anywhere but might be tagged on at some point
 */

export class ConstructionObject implements iConstructionObject {
	protected Cn: iConstruction;
	private name;
	private subname;
	private showname: boolean;
	private indicated: boolean;
	private selected: boolean;
	private hidden: number;
	private color: Color;
	private fillcolor: Color;
	private selectedcolor: string;
	private indicatedcolor: string;
	private fontsize: number;
	private dash: number[];
	private track: boolean;
	private size: number;
	private realsize: number;
	private oversize: number;
	private magnifyfactor: number;
	private selectedfactor: number;
	private onbounds: boolean;
	private precision: number;
	private serial: number;
	private layer: number;
	private paintorder: number;
	private floatObj: boolean;
	private magnets; 
	private blocklies;
	private parentList;
	private childList;
	private is_3D: boolean;
	private dragPoints;
	private dragCoords;
	private freeDragPts;
	private PtsChilds;
	private timestamp: number;
	private mode: number;
	private macroMode: number;
	private editMode: number;
	private valid_normal;
	private valid_gomme;
	private validTab;
	private paint_normal;
	private paint_gomme;
	private paintTab;
	private objModeTab_normal;
	private objModeTab_final;
	private objModeTab_initial;
	private objModeTab_intermediate;
	private objModeTab_edit;
	private objModeTab_noedit;
	private objModeTab;
	private objMode;
	paint;
	paintName_exe;
	paintLength_exe;
	validate;
	Flag: boolean;
	Flag2: boolean;
	Scratch: number;
	blocks: BlocklyObjects;
	//dragTo;
	ORGMOUSEINSIDE;
	mouseX;
	mouseY;
	prefs;
	getWidth;
	getHeight;
	//getSegmentsSize;
	is360;
	getArcRay;
	dragTo: (x, y) => void;
	constructor(_construction:iConstruction, _name:string) {
		this.Cn = _construction;
		this.name = this.Cn.getUnusedName(_name, this);
		this.subname = this.Cn.getSubName(this.name);
		this.showname = false;
		this.indicated = false;
		this.selected = false;
		this.hidden = 0; // 0:normal ; 1:this.hidden ; 2:super this.hidden
		this.color = new Color();
		this.fillcolor = new Color();
		this.selectedcolor = '';
		this.indicatedcolor = '';
		this.fontsize = 0;
		this.dash = [];
		this.track = false; // Pour la trace de l'objets
		this.size = 0;
		this.realsize = 0;
		this.oversize = 0;
		this.magnifyfactor = 0;
		this.selectedfactor = 0;
		this.onbounds = false; // Pour les points sur polygones
		this.precision = 1;
		this.serial = this.Cn.getSerial(); // numéro d'ordre dans la construction
		this.layer = 0; // niveau de calque
		this.paintorder = this.serial; // numéro d'ordre dans la construction (le plus grand recouvre le plus petit)
		this.floatObj = false; // Pour les points flottants
		this.magnets = []; // Tableau multidimentionnel des objets magnétiques 
		this.blocklies = {}; // Objet contenant tous les programmes graphiques liés à l'objet
		this.parentList = []; // Tableau des objets parents
		this.childList = []; // Tableau des objets enfants
		this.is_3D = false;
		this.dragPoints = null;
		this.dragCoords;
		this.freeDragPts;
		this.PtsChilds;
		this.timestamp = 0;
		this.mode = 1;
		this.macroMode = 0;
		this.editMode = 0;
		let proto = ConstructionObject.prototype;
		this.valid_normal = [
			proto.valid_show_normal,
			proto.valid_hidden_normal,
			proto.valid_hidden_normal,
		];
		this.valid_gomme = [
			proto.valid_show_normal,
			proto.valid_show_normal,
			proto.valid_hidden_normal
		];
		this.validTab = this.valid_normal;
		this.paint_normal = [
			proto.paint_show_normal,
			proto.paint_hidden_normal,
			proto.paint_hidden_normal
		];
		this.paint_gomme = [
			proto.paint_show_normal,
			proto.paint_hidden_gomme,
			proto.paint_hidden_normal
		];
		this.paintTab = this.paint_normal;
		this.objModeTab_normal = [
			proto.objMode_normal,
			proto.objMode_indicated,
			proto.objMode_selected
		];
		this.objModeTab_final = [
			proto.objMode_normal_final,
			proto.objMode_indicated_final,
			proto.objMode_selected_final
		];
		this.objModeTab_initial = [
			proto.objMode_normal_initial,
			proto.objMode_indicated_initial,
			proto.objMode_selected_initial
		];
		this.objModeTab_intermediate = [
			proto.objMode_normal_intermediate,
			proto.objMode_indicated_intermediate,
			proto.objMode_selected_intermediate
		];
		this.objModeTab_edit = [
			proto.objMode_normal_edit,
			proto.objMode_indicated_edit,
			proto.objMode_selected_edit
		];
		this.objModeTab_noedit = [
			proto.objMode_normal_noedit,
			proto.objMode_indicated_noedit,
			proto.objMode_selected_noedit
		];
		this.objModeTab = this.objModeTab_normal;
		this.objMode = this.objMode_normal;
		this.paint = this.paintTab[this.hidden];
		this.paintName_exe = $U.noop;
		this.paintLength_exe = $U.noop;
		this.validate = this.validTab[this.hidden];
		this.Flag = false; // For various construction process
		this.Flag2 = false; // For various construction process
		this.Scratch = 0; // For various construction process
		this.blocks = new BlocklyObjects(this, this.Cn);
		this.dragTo = this.Cn.is3D() ? this.dragTo3D : this.dragTo2D;
		this.ORGMOUSEINSIDE = null;
		this.mouseX = this.Cn.mouseX;
		this.mouseY = this.Cn.mouseY;
		this.prefs = this.Cn.prefs;
		this.getWidth = this.Cn.getWidth;
		this.getHeight = this.Cn.getHeight;
		//this.getSegmentsSize = null;
		this.is360 = null;
		this.getArcRay = null;
	}
	setExpression(v) {}
	getRoot(): iConstructionObject {
		return this;
	}
	newTimeStamp() {
		var d = new Date()
		this.timestamp = d.getTime();
	}
	setTimeStamp(_millis:number) {
		this.timestamp = _millis;
	}
	getTimeStamp(): number {
		return this.timestamp;
	}
	isAnimationPossible(): boolean {
		return false;
	}
	initDragPoints() {
		if (this.dragPoints === null) {this.dragPoints = this.Cn.findFreePoints(this);}
	}
	getDragPoints() {
		return this.dragPoints;
	}
	add_removeDragPoint(_o) {
		var i = this.dragPoints.indexOf(_o);
		if (i > -1)
			this.dragPoints.splice(i, 1, _o);// this seems wrong in the original1!?
		else
			this.dragPoints.push(_o);
	}
	setDragPoints(_d) {
		this.dragPoints = _d;
	}
	private PtsChildSortFilter(a, b): number {
		return b.getChildLength() - a.getChildLength();
	}
	startDrag(_x, _y) {
		if ((this.Cn.isDragOnlyMoveable()) && (!this.isMoveable())) return;
		$U.changed();
		this.PtsChilds = [];
		this.dragCoords = [];
		this.dragTo = (this.Cn.is3D()) ? this.dragTo3D : this.dragTo2D;
		this.freeDragPts = (this.dragPoints === null) ? this.Cn.findFreePoints(this) : this.dragPoints;
		if (this.freeDragPts.length > 0) {
			for (var k = 0, len = this.freeDragPts.length; k < len; k++) {
				this.PtsChilds = this.PtsChilds.concat(this.freeDragPts[k].getChildList());
				this.dragCoords.push({
					x: _x,
					y: _y
				});
			}
			var t;
			for (var i = 0, len2 = this.PtsChilds.length; i < len2; i++) {
				t = this.PtsChilds.indexOf(this.PtsChilds[i], i + 1);
				if (t != -1) {
					this.PtsChilds.splice(t, 1);
					i--;
				}
			}
			this.PtsChilds.sort(this.PtsChildSortFilter);
		} else {
			this.dragCoords.push({
				x: _x,
				y: _y
			});
		}
	}
	compute_dragPoints(_x, _y) {
		var oldX, oldY;
		if (this.freeDragPts.length > 0) {
			for (var i = 0, len = this.freeDragPts.length; i < len; i++) {
				oldX = this.freeDragPts[i].getX();
				oldY = this.freeDragPts[i].getY();
				this.freeDragPts[i].computeIncrement(oldX + _x - this.dragCoords[i].x, oldY + _y - this.dragCoords[i].y);
				this.dragCoords[i].x += this.freeDragPts[i].getX() - oldX;
				this.dragCoords[i].y += this.freeDragPts[i].getY() - oldY;
				oldX = this.freeDragPts[i].getX();
				oldY = this.freeDragPts[i].getY();
				if (this.freeDragPts[i].getParentLength() === 1) {
					this.freeDragPts[i].getParentAt(0).project(this.freeDragPts[i]);
					this.freeDragPts[i].getParentAt(0).setAlpha(this.freeDragPts[i]);
					this.freeDragPts[i].compute();
				}
				this.Cn.computeMagnetObjects();
				this.freeDragPts[i].checkMagnets();
				this.dragCoords[i].x += this.freeDragPts[i].getX() - oldX;
				this.dragCoords[i].y += this.freeDragPts[i].getY() - oldY;
				// this.freeDragPts[i].blockDrag(this.freeDragPts[i].getX(), this.freeDragPts[i].getY());
			}
		} else {
			this.Cn.translate(_x - this.dragCoords[0].x, _y - this.dragCoords[0].y);
			this.dragCoords[0].x = _x;
			this.dragCoords[0].y = _y;
			this.Cn.computeAll();
		}
		// if (this.ondrag) this.ondrag.value();
		// console.log(this.getName());
	}
	dragTo2D(_x, _y) {
		if ((this.Cn.isDragOnlyMoveable()) && (!this.isMoveable())) return;
		this.compute_dragPoints(_x, _y);
		for (var i = 0, len = this.PtsChilds.length; i < len; i++) {
			this.PtsChilds[i].compute();
		}
	}
	dragTo3D(_x, _y) {
		this.dragTo2D(_x, _y);
		this.Cn.computeMagnetObjects();
		this.checkMagnets();
		this.Cn.computeAll();
		this.Cn.computeAll();
	}
	is3D(): boolean {
		return this.is_3D;
	}
	set3D(_b: boolean) {
		this.is_3D = _b;
	}
	private addAsChild(_child, _parent) {
		if (!_parent.addChild ||
			(_child.isChild(_parent)) ||
			(_child === _parent) ||
			(_parent.isChild(_child)))
			return;
		// console.log('parent :' + _parent.getName() + '  enfant :' + _child.getName());
		_parent.addChild(_child);
		// On ajoute tous les enfants de _child à la liste des enfants de _parent :
		for (var i = 0, len = _child.getChildLength(); i < len; i++) {
			this.addAsChild(_child.getChildAt(i), _parent);
		}
		// On ajoute _child à la liste des enfants de tous les parents de _parent :
		for (var i = 0, len = _parent.getParentLength(); i < len; i++) {
			this.addAsChild(_child, _parent.getParentAt(i));
		}
	}
	isChild(_o) {
		return (_o.getChildList().indexOf(this) !== -1);
	}
	logChildList() {
		console.log('******************');
		for (var i = 0; i < this.childList.length; i++) {
			console.log('this.childList[' + i + '] = ' + this.childList[i].getName());
		}
	}
	orderChildList() {
		this.childList.sort(this.PtsChildSortFilter);
	}
	getChildList() {
		return this.childList;
	}
	getChildLength(): number {
		return this.childList.length;
	}
	addChild(_o) {
		// console.log('addChild : '+_o.getName());
		if (this.childList.indexOf(_o) === -1) {this.childList.push(_o);}
	}
	getChildAt(_i) {
		return this.childList[_i];
	}
	clearChildList() {
		this.childList.length = 0;
	}
	deleteChild(_o) {
		var i = this.childList.indexOf(_o);
		if (i !== -1) {this.childList.splice(i, 1);}
	}
	computeChilds() {
		// console.log(this.getName());
		// if (this.childList.length) console.log('****** '+this.childList.length);
		for (var i = 0; i < this.childList.length; i++) {
			// console.log(this.childList[i].getName());
			this.childList[i].compute();
		}
	}
	refreshChildsNames() {
		// console.log('refreshChildsNames ='+this.childList.length);
		this.Cn.doOrder(this.childList);
		for (var i = 0; i < this.childList.length; i++) {
			this.childList[i].refreshNames();
		}
	}
	refreshNames() {}
	setParentList(_p) {
		this.parentList = _p;
		// console.log(this.getName() + ' : ' + this.parentList);
		for (var i = 0, len = this.parentList.length; i < len; i++) {
			this.addAsChild(this, this.parentList[i]);
			this.is_3D = (this.is_3D) || (this.parentList[i].is3D());
		}
		if (this.parentList.length === 0 && this.getCode() === 'point')
			this.is_3D = false;
	}
	setParent(...args) {
		//this.parentList = Array.prototype.slice.call(arguments, 0);
		this.parentList = args;
		// console.log(this.getName() + ' : ' + this.parentList);
		// console.log(this.parentList.length+' nom:'+this.getName());
		for (var i = 0, len = this.parentList.length; i < len; i++) {
			// console.log('this='+this.getName()+'  parent='+this.parentList[i].getName());
			this.addAsChild(this, this.parentList[i]);
			this.is_3D = (this.is_3D) || (this.parentList[i].is3D());
		}
		if (this.parentList.length === 0 && this.getCode() === 'point') {this.is_3D = false;}
	}
	addParent(_o) {
		// Pour éviter les références circulaires : si this
		// est un parent de _o, _o ne peut pas être un parent
		// de this :
		if (this.isParent(_o)) {return;}
		this.parentList.push(_o);
		this.addAsChild(this, _o);
		this.is_3D = this.is_3D || _o.is3D();
	}
	getParent() {
		return this.parentList;
	}
	isParent(_o): boolean {
		return _o.getParent().indexOf(this) !== -1;
	}
	getParentLength(): number {
		return this.parentList.length;
	}
	getParentAt(_i) {
		return this.parentList[_i];
	}
	deleteParent(_o) {
		var i = this.parentList.indexOf(_o);
		if (i !== -1) {
			this.parentList.splice(i, 1);
		}
	}
	redefine(_a?, _b?) {}
	setMagnets(_tab) {
		this.magnets = _tab;
	}
	getMagnet(_o) {
		for (var i = 0; i < this.magnets.length; i++) {
			if (this.magnets[i][0] === _o)
				return this.magnets[i];
		}
		return null;
	}
	addMagnet(_o, _n) {
		var m = this.getMagnet(_o);
		if (m === null) {
			m = [_o, _n];
			this.magnets.push(m);
		}
		return m;
	}
	removeMagnet(_o) {
		var m = this.getMagnet(_o);
		if (m !== null) {
			this.magnets.splice(this.magnets.indexOf(m), 1);
		}
	}
	getMagnets() {
		return this.magnets;
	}
	checkMagnets() {}
	computeMagnets() {}
	setOnBoundary(_b:boolean) {
		this.onbounds = _b;
	}
	getOnBoundary(): boolean {
		return this.onbounds;
	}
	setBoundaryMode(P) {}
	storeX() {}
	setE1(_t) {}
	setE2(_t) {}
	setT(_t) {}
	setMin(_t) {}
	setMax(_t) {}
	getValue(a, b, c, d): any {
		return NaN;
	}
	setDeps() {}
	getCoordsSystem(): iCoordsSystem {
		return this.Cn.coordsSystem;
	}
	isCoincident(v): boolean {
		return false;
	}
	getUnit(): number {
		return this.Cn.coordsSystem.getUnit();
	}
	setDash(_d: boolean) {
		this.dash = _d ? this.Cn.prefs.size.dash : [];
	}
	isDash(): boolean {
		return this.dash.length !== 0;
	}
	setIncrement(v) {}
	getIncrement(): number {
		return 0;
	}
	getSerial(): number {
		return this.serial;
	}
	getPaintOrder(): number {
		return this.paintorder;
	}
	// -1 pour pas d'affichage, 0,1,2,3,4,... pour indiquer le nombre de chiffres après la virgule
	setPrecision(_prec:number) {
		if (_prec > -1) {
			this.precision = Math.pow(10, _prec);
			this.paintLength_exe = this.paintLength;
		} else {
			this.precision = -1;
			this.paintLength_exe = noop;
		}
	}
	getPrecision(): number {
		return this.precision;
	}
	getRealPrecision(): number {
		return Math.round($U.log(this.precision));
	}
	getLayer(): number {
		return this.layer;
	}
	setLayer(_l) {
		this.layer = _l;
		this.paintorder = this.serial + 100000 * this.layer;
	}
	getFontSize(): number {
		return this.fontsize;
	}
	setFontSize(_s) {
		this.fontsize = _s;
	}
	getCn(): iConstruction {
		return this.Cn;
	}
	setName(_n) {
		this.name = this.Cn.getUnusedName(_n, this);
		this.subname = this.Cn.getSubName(this.name);
	}
	getName() {
		return this.name;
	}
	getSubName() {
		return this.subname;
	}
	getVarName() {
		return this.Cn.getVarName(this.name);
	}
	setShowName(_bool:boolean) {
		this.showname = _bool;
		this.paintName_exe = (_bool) ? this.paintName : noop;
	}
	getShowName(): boolean {
		return this.showname;
	}
	setNamePosition(v) {}
	getNamePosition() {
		return null;
	}
	setShape(v) {}
	getShape(): number {
		return -1;
	}
	setIndicated(_ind) {
		this.indicated = _ind;
		this.objMode = this.objModeTab[1 * _ind];
		return _ind; // Optionnel : voir la methode this.validate de Construction.js
	}
	isIndicated(): boolean {
		return this.indicated;
	}
	setSelected(_sel:any) {// what's going on here??
		this.selected = _sel;// should this be a number?
		this.objMode = this.objModeTab[2 * _sel];// something weird is going on here?
	}
	isSelected(): boolean {
		return this.selected;
	}
	setHidden(_sel:number) {
		_sel = Math.abs(_sel * 1);// reassining input?
		this.hidden = (isNaN(_sel)) ? 1 : parseInt(_sel+'') % 3;// something weird is going on here
		this.paint = this.paintTab[this.hidden];
		this.validate = this.validTab[this.hidden];
	}
	isHidden() {
		return this.hidden;
	}
	isSuperHidden(): boolean {
		return this.hidden === 2;
	}
	setColor(_col:string) {
		this.color.set(_col);
		this.fillcolor.setRGBA(this.color.getR(), this.color.getG(), this.color.getB(), this.fillcolor.getOpacity());
	}
	getColor(): Color {
		return this.color;
	}
	setRGBColor(r:number, g:number, b:number) {
		var c = 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
		this.setColor(c);
	}
	isFilledObject(): boolean {
		return false;
	}
	getOpacity(): number {
		return this.fillcolor.getOpacity();
	}
	setOpacity(_f) {
		this.fillcolor.setOpacity(_f);
	}
	getOversize(): number {
		return this.oversize;
	}
	getRealsize(): number {
		return this.realsize;
	}
	getSize(): number {
		return this.size;
	}
	setSize(_s) {
		this.size = _s;
	}
	setMode(_mode:number) {
		this.mode = _mode;
		switch (this.mode) {
			case 0:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
			case 1:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
			case 2:
				this.paintTab = this.paint_gomme;
				this.validTab = this.valid_gomme;
				break;
			case 3:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
			case 4:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
			case 5:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
			case 6:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
			case 9:
				this.paintTab = this.paint_normal;
				this.validTab = this.valid_normal;
				break;
		}
		this.paint = this.paintTab[this.hidden];
		this.validate = this.validTab[this.hidden];
	}
	getMode(): number {
		return this.mode;
	}
	setMacroMode(_mode:number) {
		this.macroMode = _mode;
		switch (this.macroMode) {
			case 0:
				this.objModeTab = this.objModeTab_normal;
				break;
			case 1:
				this.objModeTab = this.objModeTab_intermediate;
				break;
			case 2:
				this.objModeTab = this.objModeTab_initial;
				break;
			case 3:
				this.objModeTab = this.objModeTab_final;
				break;
			case 4:
				this.objModeTab = this.objModeTab_normal;
				break;
			case 5:
				this.objModeTab = this.objModeTab_initial;
				break;
		}
		this.objMode = this.objModeTab[0];
	}
	getMacroMode(): number {
		return this.macroMode;
	}
	setMacroAutoObject() {}
	setMacroSource(v) {}
	isAutoObjectFlags(): boolean {
		return false;
	}
	setEditMode(_mode:number) {
		this.editMode = _mode;
		switch (this.editMode) {
			case 0:
				this.objModeTab = this.objModeTab_noedit;
				break;
			case 1:
				this.objModeTab = this.objModeTab_edit;
				break;
		}
		this.objMode = this.objModeTab[0];
	}
	getEditMode(): number {
		return this.editMode;
	}
	checkIfValid(_C) { }
	getCode(): string {
		return '';
	}
	getFamilyCode(): string {
		return '';
	}
	isInstanceType(_c): boolean {
		return false;
	}
	isMoveable(): boolean {
		return false;
	}
	free(): boolean {
		return this.getParentLength() === 0;
	}
	setFloat(_f) {
		this.floatObj = _f;
		if (_f) {this.Cn.setOrigin3D(this);}
	}
	getFloat() {
		return this.floatObj;
	}
	isPointOn(): boolean {
		return false;
	}
	getAssociatedTools(): string {
		var at = '@callproperty';
		if (this.isMoveable())
			at += ',@objectmover';
		return at;
	}
	paintObject(ctx:CanvasRenderingContext2D) {}
	paintName(ctx:CanvasRenderingContext2D) {}
	paintLength(ctx:CanvasRenderingContext2D) {}
	private valid_show_normal(ev): boolean {
		return this.mouseInside(ev);
	}
	private valid_hidden_normal(ev): boolean {
		return false;
	}
	private paint_show_normal(ctx:CanvasRenderingContext2D) {
		this.initContext(ctx);
		this.paintObject(ctx);
		this.paintName_exe(ctx);
		this.paintLength_exe(ctx);
	}
	private paint_hidden_normal(ctx:CanvasRenderingContext2D) {}
	private paint_hidden_gomme(ctx:CanvasRenderingContext2D) {
		this.initContext(ctx);
		this.hiddenContext(ctx);
		this.paintObject(ctx);
		this.paintName_exe(ctx);
		this.paintLength_exe(ctx);
	}
	startTrack() {
		this.track = true;
		this.beginTrack();
	}
	clearTrack() {
		this.track = false;
	}
	isTrack() {
		return this.track;
	}
	beginTrack() { };
	drawTrack(_ctx) { };
	compute() { };
	mouseInside(ev) {
		return false;
	}
	MOUSEINSIDE(ev) {
		if (this.Cn.getMode() === 6 && this.ORGMOUSEINSIDE)
			// Si on est en this.mode propriétés
			return this.ORGMOUSEINSIDE(ev);
		else
			return false;
	}
	noMouseInside() {
		if (this.ORGMOUSEINSIDE === null) {
			this.ORGMOUSEINSIDE = this.mouseInside;
			this.mouseInside = this.MOUSEINSIDE;
		}
	}
	doMouseInside() {
		if (this.ORGMOUSEINSIDE !== null) {
			this.mouseInside = this.ORGMOUSEINSIDE;
			this.ORGMOUSEINSIDE = null;
		}
	}
	setNoMouseInside(_mi) {
		if (_mi) {
			this.noMouseInside();
		} else {
			this.doMouseInside();
		}
	}
	isNoMouseInside() {
		return (this.ORGMOUSEINSIDE !== null)
	}
	intersect(_C, _P) {}
	projectXY(_x, _y) {}
	project(p) {}
	projectAlpha(p) {}
	setAlpha(p) {}
	projectMagnetAlpha(p) {
		this.projectAlpha(p);
	}
	setMagnetAlpha(p) {
		this.setAlpha(p);
	}
	setDefaults(_code) {
		if (this.prefs.color.hasOwnProperty(_code))
			this.setColor(this.prefs.color[_code]);
		else
			this.setColor(this.prefs.color['line']);

		if (this.prefs.size.hasOwnProperty(_code))
			this.size = this.prefs.size[_code];
		else
			this.size = this.prefs.size['line'];

		if (this.prefs.precision.hasOwnProperty(_code))
			this.setPrecision(this.prefs.precision[_code]);

		if (this.prefs.fontsize.hasOwnProperty(_code))
			this.fontsize = this.prefs.fontsize[_code];
		else
			this.fontsize = this.prefs.fontsize['point'];

		if (this.prefs.precision.over.hasOwnProperty(_code))
			this.oversize = this.prefs.precision.over[_code];
		else
			this.oversize = this.prefs.precision.over['line'];

		if (this.prefs.magnifyfactor.hasOwnProperty(_code))
			this.magnifyfactor = this.prefs.magnifyfactor[_code];
		else
			this.magnifyfactor = this.prefs.magnifyfactor['line'];

		if (this.prefs.selectedfactor.hasOwnProperty(_code))
			this.selectedfactor = this.prefs.selectedfactor[_code];
		else
			this.selectedfactor = this.prefs.selectedfactor['line'];

		this.selectedcolor = this.prefs.color.selected;
		this.indicatedcolor = this.prefs.color.hilite;
		if (Object.touchpad) {
			if (this.prefs.sizefactor.hasOwnProperty(_code))
				this.size *= this.prefs.sizefactor[_code];
			else
				this.size *= this.prefs.size.touchfactor;

			if (this.prefs.oversizefactor.hasOwnProperty(_code))
				this.oversize *= this.prefs.oversizefactor[_code];
			else
				this.oversize *= this.prefs.precision.over.touchfactor;


		}
	}
	private objMode_normal(ctx) {
		this.realsize = this.size;
		ctx.strokeStyle = this.color.getRGBA();
		ctx.fillStyle = this.fillcolor.getRGBA();
	}
	private objMode_indicated(ctx) {
		this.realsize = this.size * this.magnifyfactor;
		ctx.strokeStyle = this.indicatedcolor;
		ctx.fillStyle = this.fillcolor.getRGBA();
	}
	private objMode_selected(ctx) {
		this.realsize = this.size * this.selectedfactor;
		ctx.strokeStyle = this.selectedcolor;
		ctx.fillStyle = this.fillcolor.getRGBA();
	}
	private objMode_normal_final(ctx) {
		this.realsize = this.size;
		ctx.strokeStyle = 'rgb(210,0,0)';
		ctx.fillStyle = 'rgba(210,0,0,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_indicated_final(ctx) {
		this.realsize = this.size * this.magnifyfactor;
		ctx.strokeStyle = this.indicatedcolor;
		ctx.fillStyle = 'rgba(210,0,0,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_selected_final(ctx) {
		this.realsize = this.size * this.selectedfactor;
		ctx.strokeStyle = this.selectedcolor;
		ctx.fillStyle = 'rgba(210,0,0,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_normal_initial(ctx) {
		this.realsize = this.size * 1.5;
		ctx.strokeStyle = 'rgb(95,132,0)';
		ctx.fillStyle = 'rgba(95,132,0,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_indicated_initial(ctx) {
		this.realsize = this.size * 1.5 * this.magnifyfactor;
		ctx.strokeStyle = this.indicatedcolor;
		ctx.fillStyle = 'rgba(95,132,0,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_selected_initial(ctx) {
		this.realsize = this.size * 1.5 * this.selectedfactor;
		ctx.strokeStyle = this.selectedcolor;
		ctx.fillStyle = 'rgba(95,132,0,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_normal_intermediate(ctx) {
		this.realsize = this.size;
		ctx.strokeStyle = '#333333';
		ctx.fillStyle = 'rgba(51,51,51,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_indicated_intermediate(ctx) {
		this.realsize = this.size * this.magnifyfactor;
		ctx.strokeStyle = this.indicatedcolor;
		ctx.fillStyle = 'rgba(51,51,51,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_selected_intermediate(ctx) {
		this.realsize = this.size * this.selectedfactor;
		ctx.strokeStyle = this.selectedcolor;
		ctx.fillStyle = 'rgba(51,51,51,' + this.fillcolor.getOpacity() + ')';
	}
	private objMode_normal_edit(ctx) {
		ctx.shadowColor = 'darkred';
		this.objMode_normal(ctx);
	}
	private objMode_indicated_edit(ctx) {
		ctx.shadowColor = 'darkred';
		this.objMode_indicated(ctx);
	}
	private objMode_selected_edit(ctx) {
		ctx.shadowColor = 'darkred';
		this.objMode_selected(ctx);
	}
	private objMode_normal_noedit(ctx) {
		ctx.shadowColor = 'gray';
		this.objMode_normal(ctx);
	}
	private objMode_indicated_noedit(ctx) {
		ctx.shadowColor = 'gray';
		this.objMode_indicated(ctx);
	}
	private objMode_selected_noedit(ctx) {
		ctx.shadowColor = 'gray';
		this.objMode_selected(ctx);
	}
	private initContext(ctx) {
		this.objMode(ctx);
		ctx.font = this.fontsize + 'px ' + this.Cn.prefs.font;
		ctx.globalAlpha = 1;
		ctx.lineWidth = this.realsize;
		ctx.setLineDash(this.dash);
	}
	private hiddenContext(ctx) {
		ctx.globalAlpha = 0.7;
		ctx.strokeStyle = '#AAAAAA';
		ctx.setLineDash(this.dash);
	}
	getArrow() {
		return null;
	}
	getSource(src) { };
	getStyleString() {
		var s = 'c:' + this.color.getHEX();
		if (this.hidden)
			s += ';h:' + this.hidden;
		if (this.fillcolor.getOpacity())
			s += ';o:' + this.fillcolor.getOpacity();
		s += ';s:' + this.size;
		if (this.showname)
			s += ';sn:' + this.showname;
		if (this.layer)
			s += ';l:' + this.layer;
		s += ';f:' + this.fontsize;
		if (this.precision > -1)
			s += ';p:' + this.getRealPrecision();
		if (this.getIncrement())
			s += ';i:' + this.getIncrement();
		if (this.onbounds)
			s += ';sb:' + this.onbounds;
		if (this.getShape() > 0)
			s += ';sp:' + this.getShape();
		if (this.isDash())
			s += ';dh:' + this.isDash();
		if (this.getArrow())
			s += ';ar:' + JSON.stringify(this.getArrow());
		if (this.isNoMouseInside())
			s += ';nmi:' + this.isNoMouseInside();
		if (this.getNamePosition())
			s += ';np:' + this.getNamePosition();
		if (this.isTrack())
			s += ';tk:' + this.isTrack();
		if (this.getFloat())
			s += ';fl:' + this.getFloat();
		if (this.getSegmentsSize)
			// S'il s'agit d'un objet de type liste :
			s += ';sg:' + this.getSegmentsSize();
		if ((this.is360) && (this.is360()))
			// Il s'agit d'un angle ou d'un angle fixe :
			s += ';am:' + this.is360();
		if ((this.getArcRay) && (this.getArcRay() != 30))
			s += ';arc:' + this.getArcRay();
		if (this.magnets.length) {
			var t = [];
			for (var k = 0; k < this.magnets.length; k++) {
				t.push([this.magnets[k][0].getVarName(), this.magnets[k][1]]);
			}
			s += ';mg:[' + t.join('],[') + ']';
		}
		if (this.dragPoints !== null) {
			var t = [];
			for (var k = 0; k < this.dragPoints.length; k++) {
				t.push(this.dragPoints[k].getVarName());
			}
			s += ';dp:[' + t.join(',') + ']';
		}
		var an = this.Cn.findInAnimations(this);
		if (an) {
			s += ';an:[' + an.speed + ',' + an.direction + ',' + an.ar + ']';
		}
		return s;
	}
	getStyle(src) {
		src.styleWrite(true, this.name, 'STL', this.getStyleString());
	}
	getBlock(src) {
		if (!this.blocks.isEmpty()) {src.blockWrite(this.name, this.blocks.getSource(), 'BLK');}
	}
}
