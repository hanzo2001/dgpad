/// <reference path="../typings/iCalc.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {Panel} from '../GUI/panels/Panel';
import {GUIElement} from '../GUI/elements/GUIElement';
import {ImageElt} from '../GUI/elements/ImageElt';
import {slider} from '../GUI/elements/slider';
import {CustomTexts} from './CustomTexts';
import {PointObject} from '../Objects/PointObject';
import {CurvusObject} from '../Objects/CurvusObject';
import {ListObject} from '../Objects/ListObject';
import {ExpressionObject} from '../Objects/ExpressionObject';

var $U = (<any>window).$U;
var $P = (<any>window).$P;
var $L = (<any>window).$L;
var $APP_PATH = (<any>window).$APP_PATH;
var $APPLICATION = (<any>window).$APPLICATION;
var $STANDARD_KBD = (<any>window).$STANDARD_KBD;

export class MainCalcPanel extends Panel implements iMainCalcPanel {
	private man: iCalcManager;
	private canvas: iCanvas;
	private Cn: iConstruction;
	private txtman: CustomTexts;
	private scl: number;
	private OBJ: ExpressionObject;
	private E1: iCustomTextInput;
	private E2: iCustomTextInput;
	private MIN: iCustomTextInput;
	private MAX: iCustomTextInput;
	private editObj;
	private segBtn: ImageElt;
	private pointBtn: ImageElt;
	private func1Btn: ImageElt;
	private validBtn: ImageElt;
	private cancelBtn: ImageElt;
	private KBBtn: GUIElement;
	private KBBtn_img: ImageElt;
	private deg_slider: slider;
	private s_top: number;
	private s_left: number;
	constructor(_man:iCalcManager, _canvas:iCanvas) {
		super(_canvas);
		//$U.extend(this, new Panel(_canvas.getDocObject()));
		this.height = $P.CalcPanelHeight;
		this.man = _man;
		this.canvas = _canvas;
		this.Cn = this.canvas.getConstruction();
		this.txtman = new CustomTexts(this);
		this.scl = ($U.isMobile.mobilePhone()) ? $P.MobileScale - 0.05 : 1;
		this.OBJ = null; // Objet à éditer
		this.editObj = null;
		this.setAttr("className", "mainCalcPanel");
		// this.setStyles("background: " + $U.browserCode() + "-linear-gradient(bottom, #9c9ba6, #57575f);box-shadow: inset 0 -1px 0 0 #bfbfbf;border-bottom: 1px solid #303236");
		this.transition("translate_y", 0.2, -this.height);
		this.initInputs();
		(function () {
			var t = this.getOwnerBounds();
			this.setBounds(0, 0, t.width, this.height);
		})();
		this.txtman.focus = function () {
			this.man.activateBtns(true);
			this.showBtns();
		}
		this.txtman.filterKB = function (_standardON) {
			//        console.log("filterKB");
			if (this.man.getCustomKB()) {
				if (_standardON)
					this.man.getCustomKB().close();
				else
					this.man.getCustomKB().show();
			}
		}
		$STANDARD_KBD.setbtn = () => {this.set_href(true);};
		$STANDARD_KBD.show = () => {
			var act = this.txtman.getActive();
			if (act !== null) {
				var inp = act.getInput();
				if (inp.style.getPropertyValue('visibility') !== "visible") {
					this.set_href(false);
					inp.style.setProperty('visibility', 'visible');
					this.txtman.filterKB(true);
					this.txtman.setKeyEvents(true);
					inp.value = act.getText();
					inp.focus();
					inp.setSelectionRange(act.getSel().getSelStart(), act.getSel().getSelEnd());
				}
			}
		};
		$STANDARD_KBD.hide = function () {
			var act = this.txtman.getActive();
			if (act !== null) {
				act.getInput().blur();
			}
		};
		this.s_left = this.getBounds().width - 160;
		this.s_top = 130;
		var bleft = this.getBounds().width - 250;
		var btop = 80;
		var bwidth = 40;
		var bgap = 25;
		this.segBtn = new ImageElt(this, "NotPacked/images/tools/bg_standard2.svg", this.transformToSegments, bleft - bwidth - bgap, btop, bwidth, bwidth);
		this.segBtn.addImage($APP_PATH + "NotPacked/images/tools/segment.svg");
		this.pointBtn = new ImageElt(this, "NotPacked/images/tools/bg_standard2.svg", this.transformToPoints, bleft, btop, bwidth, bwidth);
		this.pointBtn.addImage($APP_PATH + "NotPacked/images/tools/point.svg");
		this.func1Btn = new ImageElt(this, "NotPacked/images/tools/bg_standard2.svg", this.transformToFunc, bleft, btop, bwidth, bwidth);
		this.func1Btn.addImage($APP_PATH + "NotPacked/images/tools/function.svg");
		bleft += bwidth + bgap;
		this.validBtn = new ImageElt(this, "NotPacked/images/calc/valid.svg", this.valid, bleft, btop, bwidth, bwidth);
		bleft += bwidth + bgap;
		this.cancelBtn = new ImageElt(this, "NotPacked/images/calc/cancel.svg", this.cancel, bleft, btop, bwidth, bwidth);
		bleft += bwidth + bgap;
		var KBBtn = new GUIElement(this, "a");
		KBBtn.setStyles("position:absolute;border:3px");
		KBBtn.setBounds(bleft, btop + (bwidth - 30) / 2, 48, 30);
		this.KBBtn_img = new ImageElt(KBBtn, "NotPacked/images/calc/keyboard.png", null, 0, 0, 48, 30);
		this.set_href(true);
		var doc = ($APPLICATION) ? window.parent.document.body : window.document.body;
		doc.appendChild(KBBtn.getDocObject());
		this.deg_slider = null;
		this.hideBtns();
		this.show();
	}
	show() {
		this.canvas.getDocObject().parentNode.appendChild(this.getDocObject());
		this.applyTransitionIN();
	}
	close() {
		this.cancel();
		this.E1.hide();
		this.E2.hide();
		this.MIN.hide();
		this.MAX.hide();
		this.applyTransitionOUT();
		setTimeout(function () {
			this.canvas.getDocObject().parentNode.removeChild(this.getDocObject());
		}, 300);
		this.txtman.close();
	}
	cancel() {
		this.txtman.deactiveAll();
		this.clearChangeFilters();
		if (this.OBJ) {
			if (this.editObj) {
				for (var i = 0; i < this.editObj.length; i++) {
					this.editObj[i]();
				}
			} else {
				this.Cn.safelyDelete(this.OBJ);
				this.OBJ = null;
			}
			this.valid();
		}
	};
	valid() {
		this.txtman.deactiveAll();
		this.clearChangeFilters();
		this.E1.setText("");
		this.E2.setText("");
		this.MIN.setText("");
		this.MAX.setText("");
		this.E1.setLabel("E =");
		this.E2.setLabel($L.calc_text);
		this.MIN.setLabel("min =");
		this.MAX.setLabel("max =");
		this.E1.show();
		this.E2.hide();
		this.MIN.hide();
		this.MAX.hide();
		this.hideBtns();
		this.man.activateBtns(false);
		this.txtman.setFirst(true);
		setTimeout(function () {
			this.txtman.deactiveAll();
		}, 1);
		if ((this.OBJ) && (this.OBJ.getE1) && (this.OBJ.getE1().isDxyztFunc())) {
			this.OBJ.setE1(this.OBJ.getE1().get() + "(" + this.OBJ.getE1().value().getVars() + ")");
		}
		if (this.OBJ)
			this.OBJ.computeChilds();
		this.canvas.paint();
		this.OBJ = null;
		this.editObj = null;
	}
	createObj() {
		this.OBJ = new ExpressionObject(this.Cn, "_E", "", "", "", "", 50, 120);
		this.canvas.namesManager.setName(this.OBJ);
		this.OBJ.setT("");
		var r = Math.random() * 128;
		var g = Math.random() * 128;
		var b = Math.random() * 128;
		this.OBJ.setRGBColor(r, g, b);
		this.canvas.addObject(this.OBJ);
		this.E2.setPreferredKB(1);
		this.E1.setLabel(this.OBJ.getVarName() + " =");
		this.E2.setText(this.OBJ.getText());
		this.E1.setChangedFilter(this.cFilter(this.OBJ.setE1));
		this.E2.setChangedFilter(this.cFilter(this.OBJ.setT));
		this.MIN.setChangedFilter(this.cFilter(this.OBJ.setMin));
		this.MAX.setChangedFilter(this.cFilter(this.OBJ.setMax));
		this.E1.show();
		this.E2.show();
		this.MIN.show();
		this.MAX.show();
		this.Cn.compute();
		this.canvas.paint();
	}
	insertText(_st) {
		this.txtman.insertText(_st);
	}
	edit(_obj) {
		if (this.OBJ !== null) {
			this.txtman.insertText(_obj.getVarName());
			this.txtman.nextCar();
		} else {
			this.OBJ = _obj;
			switch (this.OBJ.getCode()) {
				case "expression":
					this.txtman.setFirst(false);
					this.editObj = [this.editFilter(this.OBJ.setE1, this.OBJ.getE1().getSource().replace(/\\\"/g, "\"")),
						this.editFilter(this.OBJ.setT, this.OBJ.getText()),
						this.editFilter(this.OBJ.setMin, this.OBJ.getMinSource()),
						this.editFilter(this.OBJ.setMax, this.OBJ.getMaxSource())
					];
					this.E2.setPreferredKB(1);
					var t = this.OBJ.getE1().getSource().replace(/\\/g, "");
					this.E1.setText(t);
					this.MIN.setText(this.OBJ.getMinSource());
					this.MAX.setText(this.OBJ.getMaxSource());
					this.E2.setText(this.OBJ.getText());
					this.E1.show();
					this.E2.show();
					this.MIN.show();
					this.MAX.show();
					this.E1.setChangedFilter(this.cFilter(this.OBJ.setE1));
					this.MIN.setChangedFilter(this.cFilter(this.OBJ.setMin));
					this.MAX.setChangedFilter(this.cFilter(this.OBJ.setMax));
					this.E2.setChangedFilter(this.cFilter(this.OBJ.setT));
					this.E1.setLabel(this.OBJ.getName() + " =");
					this.txtman.activate(this.E1);
					this.E1.setSelectionRange(t.length, t.length);
					break;
				case "list":
					var _o = this.OBJ;
					this.OBJ = null;
					this.edit(_o.getEXP());
					return;
				case "function":
					this.txtman.setFirst(false);
					this.editObj = [this.editFilter(this.OBJ.setE1, this.OBJ.getE1().getSource()),
						this.editFilter(this.OBJ.setMin, this.OBJ.getMinSource()),
						this.editFilter(this.OBJ.setMax, this.OBJ.getMaxSource())
					];
					this.E2.setPreferredKB(0);
					this.E1.setText(this.OBJ.getE1().getSource());
					this.MIN.setText(this.OBJ.getMinSource());
					this.MAX.setText(this.OBJ.getMaxSource());
					this.E1.show();
					this.E2.hide();
					this.MIN.show();
					this.MAX.show();
					this.E1.setChangedFilter(this.cFilter(this.OBJ.setE1));
					this.MIN.setChangedFilter(this.cFilter(this.OBJ.setMin));
					this.MAX.setChangedFilter(this.cFilter(this.OBJ.setMax));
					this.E1.setLabel(this.OBJ.getName() + "(" + this.OBJ.getE1().getVars() + ") =");
					this.txtman.activate(this.E1);
					this.E1.setSelectionRange(this.OBJ.getE1().getSource().length, this.OBJ.getE1().getSource().length);
					break;
				case "fixedangle":
					this.txtman.setFirst(false);
					var ex = this.OBJ.getExp();
					this.editObj = [this.editFilter(this.OBJ.setE1, ex)];
					this.E2.setPreferredKB(0);
					this.E1.show();
					this.E2.hide();
					this.MIN.hide();
					this.MAX.hide();
					this.E1.setText(ex);
					this.E1.setChangedFilter(this.cFilter(this.OBJ.setE1));
					this.E1.setLabel(this.OBJ.getName() + " =");
					this.txtman.activate(this.E1);
					this.E1.setSelectionRange(this.OBJ.getExp().length, this.OBJ.getExp().length);
					break;
				case "circle1":
					this.txtman.setFirst(false);
					var ex = this.OBJ.getRX() ? this.OBJ.getRX().getSource() : this.OBJ.getR();
					this.editObj = [this.editFilter(this.OBJ.setRX, ex)];
					this.E2.setPreferredKB(0);
					this.E1.show();
					this.E2.hide();
					this.MIN.hide();
					this.MAX.hide();
					ex = this.OBJ.getRX() ? ex : this.Cn.coordsSystem.l(ex);
					this.OBJ.setRX("" + ex);
					this.E1.setText(ex);
					this.E1.setChangedFilter(this.cFilter(this.OBJ.setRX));
					this.E1.setLabel(this.OBJ.getName() + " =");
					this.txtman.activate(this.E1);
					this.E1.setSelectionRange(this.OBJ.getRX().getSource().length, this.OBJ.getRX().getSource().length);
					break;
				case "point":
					// Si le point est flottant ou n'est pas libre, on ne l'édite pas :
					if ((!this.OBJ.getEXY()) && ((this.OBJ.getParentLength() > 0) || (this.OBJ.getFloat()))) {
						this.OBJ = null;
						return;
					}
					this.txtman.setFirst(false);
					var ex = this.OBJ.getEXY() ? this.OBJ.getEXY().getSource() : this.OBJ.getX();
					var ey = this.OBJ.getY();
					this.editObj = [this.editFilter(this.OBJ.setEXY, ex, ey)];
					this.E2.setPreferredKB(0);
					this.E1.show();
					this.E2.hide();
					this.MIN.hide();
					this.MAX.hide();
					ex = this.OBJ.getEXY() ? ex : "[" + this.Cn.coordsSystem.x(ex) + "," + this.Cn.coordsSystem.y(ey) + "]";
					this.OBJ.setEXY(ex);
					this.E1.setText(ex);
					this.E1.setChangedFilter(this.cFilter(this.OBJ.setEXY));
					this.E1.setLabel("[X,Y] =");
					this.txtman.activate(this.E1);
					var u = "" + this.E1.getText() + "";
					this.E1.setSelectionRange(u.length, u.length);
					break;
				default:
					this.OBJ = null;
					break;
			}
			this.mainFilter();
		}
	}
	private initInputs() {
		this.E1 = this.txtman.add("E =", 10, 6, 740 * this.scl, 22);
		this.E2 = this.txtman.add($L.calc_text, 10, 39, 740 * this.scl, 22);
		this.MIN = this.txtman.add("min =", 780 * this.scl, 6, 230 * this.scl, 22);
		this.MAX = this.txtman.add("max =", 780 * this.scl, 39, 230 * this.scl, 22);
		this.E1.show();
		this.E2.hide();
		this.MIN.hide();
		this.MAX.hide();
		this.addContent(this.E1);
		this.addContent(this.E2);
		this.addContent(this.MIN);
		this.addContent(this.MAX);
	}
	private clearChangeFilters() {
		this.E1.setChangedFilter(function () { });
		this.E2.setChangedFilter(function () { });
		this.MIN.setChangedFilter(function () { });
		this.MAX.setChangedFilter(function () { });
	}
	private showKB() {
		this.txtman.showKB();
	}
	private transformToList(_segs) {
		if (this.OBJ === null)
			return;
		this.OBJ.compute();
		var list = this.OBJ.getE1().getPointList();
		if (list.length > 0) {
			var LST = new ListObject(this.Cn, "_List", this.OBJ);
			LST.setSegmentsSize(_segs);
			this.canvas.addObject(LST);
			this.valid();
		} else {
			var o = new PointObject(this.Cn, "_P", 0, 0);
			o.setEXY(this.OBJ.getE1().getSource());
			this.canvas.addObject(o);
			o.compute();
			this.cancel();
			this.editObj = null;
		}
	}
	private transformToPoints() {
		this.transformToList(0);
	}
	private transformToSegments() {
		this.transformToList(1);
	}
	private transformToFunc() {
		if (this.OBJ === null) {return;}
		var vs = (this.OBJ.getE1().isDxyztFunc()) ? this.OBJ.getE1().value().getVars() : this.OBJ.getE1().getVars();
		var src = this.OBJ.getVarName() + "(" + vs + ")";
		var o = new CurvusObject(this.Cn, "_f", this.OBJ.getMinSource(), this.OBJ.getMaxSource(), src);
		o.setColor(this.OBJ.getColor().getRGBA());
		this.canvas.addObject(o);
		this.valid();
	}
	// All this messy global code because old android versions (<4.4) need 
	// an "a href" link to open the virtual keyboard... Beside, there were
	// a lot of focus problem to solve to unify behavior in various android
	// version :
	private set_href(_bool) {
		if ($U.isOldAndroid()) {
			if ($APPLICATION) {var lnk = (_bool) ? "http://keyboardshow" : "http://keyboardhide";}
			// var lnk = (_bool) ? "http://www.google.fr" : "javascript:void(0)";
			else {var lnk = (_bool) ? "javascript:$STANDARD_KBD.show()" : "javascript:void(0)";}
			this.KBBtn.setAttr("href", lnk);
		} else {
			if (_bool) {
				this.KBBtn_img.removeDownEvent($STANDARD_KBD.hide);
				this.KBBtn_img.addDownEvent($STANDARD_KBD.show);
			} else {
				this.KBBtn_img.removeDownEvent($STANDARD_KBD.show);
				this.KBBtn_img.addDownEvent($STANDARD_KBD.hide);
			}
		}
	}
	private showDegSlider() {
		this.deg_slider = new slider(this.getDocObject(), this.s_left, this.s_top, 150, 50, 0, 1, 0, function (_v) {
			this.Cn.setDEG(_v === 1);
			this.Cn.computeAll();
			this.canvas.paint();
		});
		this.deg_slider.setDiscrete(true);
		this.deg_slider.setValueWidth(65);
		this.deg_slider.setFontSize(14);
		this.deg_slider.setHeights(14, 20);
		this.deg_slider.setBackgroundColor("rgba(0,0,0,0)");
		this.deg_slider.setLabel("RAD", 60);
		this.deg_slider.setTextColor("#252525");
		this.deg_slider.setTabValues([
			[0, "DEG"],
			[1, "DEG"]
		]);
		this.deg_slider.setValue(1 * ~~this.Cn.isDEG());
	}
	private showBtns() {
		this.validBtn.show();
		this.cancelBtn.show();
		this.KBBtn_img.show();
		this.showDegSlider();
	}
	private hideBtns() {
		this.segBtn.hide();
		this.pointBtn.hide();
		this.func1Btn.hide();
		this.validBtn.hide();
		this.cancelBtn.hide();
		this.KBBtn_img.hide();
		if (this.deg_slider)
			this.getDocObject().removeChild(this.deg_slider.getDocObject());
		this.deg_slider = null;
	}
	private setPointBtn() {
		if ((this.OBJ === null) || (this.OBJ.getCode() !== "expression") || (!this.OBJ.getE1()))
			return;
		var oneValidValue = this.OBJ.getE1().getValidValue();
		if (!oneValidValue)
			return;
		var v = this.OBJ.getE1().getVars().length;
		if ((v === undefined) || (v > 0))
			return;
		if (!$U.isArray(oneValidValue))
			return;
		if ($U.isPoint(oneValidValue) || $U.isPointArrayWithNaN(oneValidValue)) {
			this.pointBtn.show();
			if ($U.isPointArrayWithNaN(oneValidValue))
				this.segBtn.show();
		}
	};
	private setFuncBtn() {
		if ((this.OBJ === null) || (this.OBJ.getCode() !== "expression") || (!this.OBJ.getE1()))
			return;
		var oneValidValue = this.OBJ.getE1().getValidValue();

		if (!oneValidValue)
			return;
		if (($U.isArray(oneValidValue)) && (oneValidValue.length !== 2))
			return;
		var v = (this.OBJ.getE1().isDxyztFunc()) ? this.OBJ.getE1().value().getVars().length : this.OBJ.getE1().getVars().length;
		if ((v === undefined) || (v !== 1))
			return;
		this.func1Btn.show();
	};
	private mainFilter() {
		this.pointBtn.hide();
		this.segBtn.hide();
		this.func1Btn.hide();
		this.setPointBtn();
		this.setFuncBtn();
		if ((this.OBJ !== null) && (this.OBJ.getCode() === "function") && (this.OBJ.getE1())) {
			this.E1.setLabel(this.OBJ.getName() + "(" + this.OBJ.getE1().getVars() + ") =");
		}
		if ((this.OBJ !== null) && (this.OBJ.getCode() === "expression") && (this.OBJ.getE1()))
			this.OBJ.refresh();
		return;
	}
	private cFilter(_proc, _p1?, _p2?, _p3?) {
		return function (_t) {
			_proc(_t, _p1, _p2, _p3);
			this.mainFilter();
			if (this.OBJ) {
				if (this.Cn.is3D())
					this.Cn.computeAll();
				else {
					this.OBJ.compute();
					this.OBJ.computeChilds();
				}
			}
			this.canvas.paint();
		}
	}
	private editFilter(_proc, _p1?, _p2?, _p3?) {
		return function () {
			_proc(_p1, _p2, _p3);
		}
	}
}
