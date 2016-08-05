/// <reference path="../typings/iProperties.d.ts" />

import {props_panel} from './props_panel';
import {Checkbox} from '../GUI/elements/Checkbox';
import {slider} from '../GUI/elements/slider';
import {Label} from '../GUI/elements/Label';

var ColorPicker = (<any>window).ColorPicker;
var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class props_gridPanel extends props_panel {
	constructor(owner:iPropertiesPanel) {
		super(owner);
		//$U.extend(this, new props_panel(_owner));
		var CS = this.owner.getCS();
		var ch = 120; // Color picker height
		this.setAttr("className", $U.isMobile.mobilePhone() ? "props_gridDIV_Mobile" : "props_gridDIV");
		this.transition("translate_x", 0.2, 200);
		var title = new Label(this);
		title.setText($L.props_grid_title);
		title.setStyle("color", "#252525");
		title.setBounds(0, 10, 220, 20);
		var HEXcallback = (_c) => {
				CS.setColor(_c);
				this.repaint();
		}
		if (!$U.isMobile.mobilePhone()) {
				var cp = new ColorPicker(this.getDocObject(), 10, 40, 200, ch);
				cp.setHEXcallback(HEXcallback);
				ch += 50;
		} else
				ch = 40;
		var FONTcallback = (_s) => {
				CS.setFontSize(_s);
				this.repaint();
		}
		var sFont = new slider(this.getDocObject(), 10, ch, 200, 40, 6, 60, CS.getFontSize(), FONTcallback);
		sFont.setValueWidth(40);
		sFont.setLabel($L.props_font, 110);
		sFont.setTextColor("#252525");
		sFont.setValuePrecision(1);
		sFont.setBackgroundColor("rgba(0,0,0,0)");
		ch += 40;
		var AXIScallback = (_s) => {
				CS.setAxisWidth(_s);
				this.repaint();
		}
		var sAxis = new slider(this.getDocObject(), 10, ch, 200, 40, 0.5, 10, CS.getAxisWidth(), AXIScallback);
		sAxis.setValueWidth(40);
		sAxis.setLabel($L.props_axis_size, 110);
		sAxis.setTextColor("#252525");
		sAxis.setValuePrecision(0.5);
		sAxis.setBackgroundColor("rgba(0,0,0,0)");
		ch += 40;
		var GRIDcallback = (_s) => {
				CS.setGridWidth(_s);
				this.repaint();
		}
		var sAxis = new slider(this.getDocObject(), 10, ch, 200, 40, 0.1, 2, CS.getGridWidth(), GRIDcallback);
		sAxis.setValueWidth(40);
		sAxis.setLabel($L.props_grid_size, 110);
		sAxis.setTextColor("#252525");
		sAxis.setValuePrecision(0.1);
		sAxis.setBackgroundColor("rgba(0,0,0,0)");
		ch += 50;
		var SHGRIDcallback = (_s) => {
				CS.showGrid(_s);
				this.repaint();
		}
		var cbshowCS = new Checkbox(this.getDocObject(), 10, ch, 200, 30, CS.isGrid(), $L.props_grid_show, SHGRIDcallback);
		cbshowCS.setTextColor("#252525");
		ch += 30;
		var OXcallback = (_s) => {
				CS.showOx(_s);
				this.repaint();
		}
		var cbshowOX = new Checkbox(this.getDocObject(), 10, ch, 200, 30, CS.isOx(), $L.props_ox_show, OXcallback);
		cbshowOX.setTextColor("#252525");
		ch += 30;
		var OYcallback = (_s) => {
				CS.showOy(_s);
				this.repaint();
		}
		var cbshowOY = new Checkbox(this.getDocObject(), 10, ch, 200, 30, CS.isOy(), $L.props_oy_show, OYcallback);
		cbshowOY.setTextColor("#252525");
		ch += 30;
		var LockXcallback = (_s) => {
				CS.setlockOx(_s);
				this.repaint();
		}
		var cblockX = new Checkbox(this.getDocObject(), 10, ch, 200, 30, CS.islockOx(), $L.props_ox_lock, LockXcallback);
		cblockX.setTextColor("#252525");
		ch += 30;
		var LockYcallback = (_s) => {
				CS.setlockOy(_s);
				this.repaint();
		}
		var cblockY = new Checkbox(this.getDocObject(), 10, ch, 200, 30, CS.islockOy(), $L.props_oy_lock, LockYcallback);
		cblockY.setTextColor("#252525");
		ch += 30;
		var CenterZcallback = function(_s) {
				CS.setCenterZoom(_s);
				this.repaint();
		};
		var cbcenterzoom = new Checkbox(this.getDocObject(), 10, ch, 200, 30, CS.isCenterZoom(), $L.props_center_zoom, CenterZcallback);
		cbcenterzoom.setTextColor("#252525");
		this.setObj = function() {
				if (!$U.isMobile.mobilePhone()) {
						cp.setHEX(CS.getColor());
				}
		};
		this.addContent(title);
	}
}
