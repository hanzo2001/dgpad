/// <reference path="../typings/iCanvas.d.ts" />

import {VerticalBorderPanel} from '../GUI/panels/VerticalBorderPanel';
import {props_namePanel} from './props_namePanel';
import {props_colorPanel} from './props_colorPanel';
import {props_gridPanel} from './props_gridPanel';
import {props_messagePanel} from './props_messagePanel';

var $U = (<any>window).$U;

export class PropertiesPanel extends VerticalBorderPanel {
	private Cn;
	private props_name: props_namePanel;
	private props_color: props_colorPanel;
	private props_grid: props_gridPanel;
	private props_message: props_messagePanel;
	constructor(_canvas:iCanvas) {
		super(_canvas, 240, false);
		this.canvas = _canvas;
		this.Cn = this.canvas.getConstruction();
		$U.extend(this, new VerticalBorderPanel(this.canvas, 240, false));
		this.setBounds(this.getBounds().left + 15, -5, 0, 0); // Le fond n'est pas affiché
		this.show();
		this.props_name = new props_namePanel(this);
		this.props_color = new props_colorPanel(this);
		this.props_grid = new props_gridPanel(this);
		this.props_message = new props_messagePanel(this);
		// Une ineptie necessaire parce que sinon le clavier virtuel
		// de l'ipad change la position du panneau de propriété :
		if (Object.touchpad) { window.scrollTo(0, 0); }
		this.props_message.show();
	}
	getCS() {
		return this.Cn.coordsSystem;
	}
	setMagnifierMode(_val) {
		this.canvas.magnifyManager.setMagnifierMode(_val);
	}
	getMagnifierMode() {
		return this.canvas.magnifyManager.getMagnifierMode();
	}
	setDragOnlyMoveable(_val) {
		this.Cn.setDragOnlyMoveable(_val);
	}
	isDragOnlyMoveable() {
		return this.Cn.isDragOnlyMoveable();
	}
	setDegree(_val) {
		this.Cn.setDEG(_val);
		this.Cn.computeAll();
		this.canvas.paint();
	}
	getDegree() {
		return this.Cn.isDEG();
	}
	setDemoMode(_val) {
		this.canvas.demoModeManager.setDemoMode(_val);
	}
	getDemoMode() {
		return this.canvas.demoModeManager.getDemoMode();
	}
	getBackgroundColor() {
		return this.canvas.getBackground();
	}
	setBackgroundColor(val) {
		return this.canvas.setBackground(val);
	}
	showProperties(_obj) {
		if ($U.isMobile.mobilePhone()) {
			this.props_color.clearContent();
			this.props_message.clearContent();
		}
		this.props_message.close();
		if (_obj.getCode().startsWith('axis')) {
			if ($U.isMobile.mobilePhone()) {this.props_color.clearContent();}
			this.props_color.close();
			this.props_name.close();
			this.props_grid.show();
			this.props_grid.set();
		} else {
			this.props_grid.close();
			_obj.getCode() === 'expression_cursor'
				? this.props_name.close()
				: this.props_name.set(_obj);
			this.props_color.set(_obj);
			// Une ineptie necessaire parce que sinon le clavier virtuel
			// de l'ipad change la position du panneau de propriété :
			if (Object.touchpad) {window.scrollTo(0, 0);}
		}
	}
	compute() {
		this.Cn.computeAll();
	}
	repaint() {
		this.canvas.paint();
	}
	getAnimationSpeed(_o) {
		return this.Cn.getAnimationSpeed(_o)
	}
	setAnimationSpeed(_o, _v) {
		this.Cn.setAnimationSpeed(_o, _v);
	}
	setAllSize(_type, size:number) {
		this.Cn.setAllSize(_type, size);
	}
	setAllSegSize(_type, size:number) {
		this.Cn.setAllSegSize(_type, size);
	}
	setAllColor(_type, size) {
		this.Cn.setAllColor(_type, size);
	}
	setAllOpacity(_type, size:number) {
		this.Cn.setAllOpacity(_type, size);
	}
	setAllLayer(_type, size:number) {
		this.Cn.setAllLayer(_type, size);
	}
	setAllPtShape(_shape) {
		this.Cn.setAllPtShape(_shape);
	}
	setAllFontSize(_type, size:number) {
		this.Cn.setAllFontSize(_type, size);
	}
	setAllPrecision(_type, size:number) {
		this.Cn.setAllPrecision(_type, size);
	}
	setAllIncrement(_type, size:number) {
		this.Cn.setAllIncrement(_type, size);
	}
	setAllDash(_type, size:number) {
		this.Cn.setAllDash(_type, size);
	}
	setAll360(_type, _360) {
		this.Cn.setAll360(_type, _360);
	}
	setAllTrigo(_type, _t) {
		this.Cn.setAllTrigo(_type, _t);
	}
	setAllNoMouse(_type, size:number) {
		this.Cn.setAllNoMouse(_type, size);
	}
	setTrack(_o, _val) {
		_val ? this.canvas.trackManager.add(_o) : this.canvas.trackManager.remove(_o);
	}
	setAllTrack(_type, _val) {
		this.canvas.trackManager.setAllTrack(_type, _val);
	}
}
