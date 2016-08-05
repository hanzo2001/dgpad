
import {props_panel} from './props_panel';
import {props_generic_color} from './props_generic_color';
import {InputText} from '../GUI/elements/InputText';
import {Checkbox} from '../GUI/elements/Checkbox';
import {slider} from '../GUI/elements/slider';
import {ImageGroup} from '../GUI/elements/ImageGroup';

type ColorPicker = {
	setHEX: (hex) => void,
	setHEXcallback: (hex) => void
};

var ColorPicker = (<any>window).ColorPicker;
var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $APP_PATH = (<any>window).$APP_PATH;

export class props_colorPanel extends props_panel {
	private ch: number;
	private cp: ColorPicker;
	private sOpacity;
	private sSize;
	private segSize;
	private sLayer;
	private sFont;
	private sPrec;
	private sInc;
	private pShape;
	private cbApplyAll;
	private cbDash;
	private cbNomouse;
	private cbTrack;
	private setall;
	private sAnim;
	owner: iPropertiesPanel;
	constructor(owner:iPropertiesPanel) {
		super(owner);
		//$U.extend(this, new props_panel(owner));
		this.ch = 100; // Color picker height
		this.cp = null; // Color picker
		this.sOpacity = null;
		this.sSize = null;
		this.segSize = null;
		this.sLayer = null;
		this.sFont = null;
		this.sPrec = null;
		this.sInc = null;
		this.pShape = null;
		this.cbApplyAll = null;
		this.cbDash = null;
		this.cbNomouse = null;
		this.cbTrack = null;
		this.setall = false;
		this.sAnim = null;
		this.setAttr("className", $U.isMobile.mobilePhone() ? "props_colorDIV_Mobile" : "props_colorDIV");
		this.transition("translate_x", 0.2, 200);
	}
	setPickerColor(hex:string) {
		if (!$U.isMobile.mobilePhone()) {this.cp.setHEX(hex);}
		this.HEXcallback(hex);
	};
	setObj() {
		this.clearContent();
		this.ch = 140;
		if (!$U.isMobile.mobilePhone()) {
			this.cp = new ColorPicker(this.getDocObject(), 10, 10, 200, this.ch);
			this.cp.setHEXcallback((hex) => this.HEXcallback(hex));
			this.cp.setHEX(this.obj.getColor().getHEX());
			this.ch += 25;
		} else {
			this.ch = 10;
		}
		if ($U.isMobile.mobilePhone()) {
			new props_generic_color(this, "rgb(0,0,178)", 10, this.ch, 24);
			new props_generic_color(this, "rgb(0,124,124)", 51, this.ch, 24);
			new props_generic_color(this, "rgb(0,124,0)", 92, this.ch, 24);
			new props_generic_color(this, "rgb(150,100,0)", 133, this.ch, 24);
			new props_generic_color(this, "rgb(180,0,0)", 174, this.ch, 24);
			this.ch += 34;
		}
		if (!$U.isMobile.mobilePhone()) {
			this.pShape = new ImageGroup(this.getDocObject(), 10, this.ch, 200, 25, $APP_PATH + "NotPacked/images/pointshape/bgOff.svg", $APP_PATH + "NotPacked/images/pointshape/bgOn.svg", (n) => this.PSHAPEcallback(n));
			this.pShape.setImageSize(25);
			this.pShape.setMargin(15);
			this.pShape.setHspace(25);
			this.pShape.addImage($APP_PATH + "NotPacked/images/pointshape/circle.svg");
			this.pShape.addImage($APP_PATH + "NotPacked/images/pointshape/cross.svg");
			this.pShape.addImage($APP_PATH + "NotPacked/images/pointshape/diamond.svg");
			this.pShape.addImage($APP_PATH + "NotPacked/images/pointshape/square.svg");
			this.pShape.select(this.obj.getShape());
			this.ch += 30;
		}
		var sh = 35;
		this.sSize = new slider(this.getDocObject(), 10, this.ch, 200, sh, 0.5, 25, this.obj.getSize(), (n) => this.SZcallback(n));
		this.sSize.setValueWidth(40);
		this.sSize.setLabel($L.props_size, 80);
		this.sSize.setTextColor("#252525");
		this.sSize.setValuePrecision(0.5);
		this.sSize.setBackgroundColor("rgba(0,0,0,0)");
		this.sSize.setValue(this.obj.getSize());
		if (this.obj.getCode() === "list") {
			this.ch += sh;
			this.sSize.setMin(0);
			this.sSize.setMax(6);
			this.sSize.setValuePrecision(0.1);
			this.sSize.setValue(this.obj.getSize());
			this.segSize = new slider(this.getDocObject(), 10, this.ch, 200, sh, 0, 6, this.obj.getSegmentsSize(), (n) => this.SegSZcallback(n));
			this.segSize.setValueWidth(40);
			this.segSize.setLabel($L.props_segment_size, 80);
			this.segSize.setTextColor("#252525");
			this.segSize.setValuePrecision(0.1);
			this.segSize.setBackgroundColor("rgba(0,0,0,0)");
		}
		this.ch += sh;
		this.sOpacity = new slider(this.getDocObject(), 10, this.ch, 200, sh, 0, 1, this.obj.getOpacity(), (n) => this.BOcallback(n));
		this.sOpacity.setValueWidth(40);
		this.sOpacity.setLabel($L.props_opacity, 80);
		this.sOpacity.setTextColor("#252525");
		this.sOpacity.setValuePrecision(0.01);
		this.sOpacity.setBackgroundColor("rgba(0,0,0,0)");
		this.sOpacity.setValue(this.obj.getOpacity());
		this.ch += sh;
		this.sLayer = new slider(this.getDocObject(), 10, this.ch, 200, sh, -8, 8, this.obj.getLayer(), (n) => this.LAYcallback(n));
		this.sLayer.setValueWidth(40);
		this.sLayer.setLabel($L.props_layer, 80);
		this.sLayer.setTextColor("#252525");
		this.sLayer.setValuePrecision(1);
		this.sLayer.setBackgroundColor("rgba(0,0,0,0)");
		this.sLayer.setValue(this.obj.getLayer());
		this.ch += sh;
		this.sFont = new slider(this.getDocObject(), 10, this.ch, 200, sh, 6, 60, this.obj.getFontSize(), (n) => this.FONTcallback(n));
		this.sFont.setValueWidth(40);
		this.sFont.setLabel($L.props_font, 80);
		this.sFont.setTextColor("#252525");
		this.sFont.setValuePrecision(1);
		this.sFont.setBackgroundColor("rgba(0,0,0,0)");
		this.sFont.setValue(this.obj.getFontSize());
		this.ch += sh;
		this.sPrec = new slider(this.getDocObject(), 10, this.ch, 200, sh, -1, 13, 0, (n) => this.PRECcallback(n));
		this.sPrec.setValueWidth(40);
		this.sPrec.setTextColor("#252525");
		this.sPrec.setValuePrecision(1);
		this.sPrec.setBackgroundColor("rgba(0,0,0,0)");
		if ((this.obj.getCode() === "locus") || (this.obj.getCode() === "quadric")) {
			this.sPrec.setTabValues([
				[1, $L.Locus_density_min], 5, 10, 20, 50, 100, 200, 500, 1000, 1500, 2000, [5000, $L.Locus_density_max]
			]);
			this.sPrec.setValue(this.obj.getPrecision());
			this.sPrec.setLabel($L.Locus_density, 80);
		} else {
			this.sPrec.setTabValues([
				[-1, $L.props_length_none], 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
			]);
			this.sPrec.setValue(precVal(this.obj.getPrecision()));
			this.sPrec.setLabel($L.props_length, 80);
		}
		this.ch += sh;
		var cbh = 30;
		if (this.obj.getCode() === "angle") {
			this.cbDash = new Checkbox(this.getDocObject(), 10, this.ch, 200, cbh, false, $L.props_360, (b) => this.m360callback(b));
			this.cbDash.setTextColor("#252525");
			this.cbDash.setValue(this.obj.is360());
			this.ch += cbh;
		} else if (this.obj.getCode() === "fixedangle") {
			this.cbDash = new Checkbox(this.getDocObject(), 10, this.ch, 200, cbh, false, $L.props_trigo, (b) => this.trigocallback(b));
			this.cbDash.setTextColor("#252525");
			this.cbDash.setValue(this.obj.isTrigo());
			this.ch += cbh;
		} else {
			this.sInc = new slider(this.getDocObject(), 10, this.ch, 200, sh, -4, 4, 0, (b) => this.INCCcallback(b));
			this.sInc.setTabValues([
				[0, $L.props_inc_free], 0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 100, 1000
			]);
			this.sInc.setValue(this.obj.getIncrement());
			this.sInc.setValueWidth(40);
			this.sInc.setLabel($L.props_inc, 80);
			this.sInc.setTextColor("#252525");
			this.sInc.setValuePrecision(1);
			this.sInc.setBackgroundColor("rgba(0,0,0,0)");
			this.sInc.setValue(this.obj.getIncrement());
			this.ch += sh;
		}
		// Curseur animation :
		if (this.obj.isAnimationPossible()) {
			this.sAnim = new slider(this.getDocObject(), 10, this.ch, 200, sh, -4, 4, 0, (n) => this.ANIMcallback(n));
			var fce = this.obj.getAnimationSpeedTab();
			fce[0] = [fce[0], $L.animation_without];
			this.sAnim.setTabValues(fce);
			this.sAnim.setValueWidth(40);
			this.sAnim.setLabel($L.animation_label, 80);
			this.sAnim.setTextColor("#252525");
			this.sAnim.setValuePrecision(1);
			this.sAnim.setBackgroundColor("rgba(0,0,0,0)");
			this.sAnim.setValue(this.owner.getAnimationSpeed(this.obj));
		} else {
			this.cbDash = new Checkbox(this.getDocObject(), 10, this.ch, 200, cbh, false, $L.props_dash, (b) => this.DSHcallback(b));
			this.cbDash.setTextColor("#252525");
			this.cbDash.setValue(this.obj.isDash());
		}
		if (!$U.isMobile.mobilePhone()) {
			this.ch += cbh;
			this.cbNomouse = new Checkbox(this.getDocObject(), 10, this.ch, 200, cbh, false, $L.props_nomouse, (b) => this.NOMOUSEcallback(b));
			this.cbNomouse.setTextColor("#252525");
			this.cbNomouse.setValue(this.obj.isNoMouseInside());
		}
		if (this.obj.getCode() !== "list") {
			this.ch += cbh;
			this.cbTrack = new Checkbox(this.getDocObject(), 10, this.ch, 200, cbh, false, $L.props_track, (b) => this.TRKcallback(b));
			this.cbTrack.setTextColor("#252525");
			this.cbTrack.setValue(this.obj.isTrack());
		}
		this.ch += cbh;
		this.cbApplyAll = new Checkbox(this.getDocObject(), 10, this.ch, 200, cbh, false, $L.props_applyall + $L.object.family[this.obj.getFamilyCode()], (b) => this.APALLcallback(b));
		this.cbApplyAll.setTextColor("#252525");
		this.cbApplyAll.setText($L.props_applyall + $L.object.family[this.obj.getFamilyCode()]);
		this.cbApplyAll.setValue(this.setall = false);
		this.show();
	};
	private HEXcallback(hex) {
		this.setall
			? this.owner.setAllColor(this.obj.getFamilyCode(), hex)
			: this.obj.setColor(hex);
		this.repaint();
	};
	private BOcallback(_val) {
		this.setall
			? this.owner.setAllOpacity(this.obj.getFamilyCode(), _val)
			: this.obj.setOpacity(_val);
		this.repaint();
	};
	private SZcallback(size:number) {
		if (this.setall) {
			this.owner.setAllSize(this.obj.getFamilyCode(), size);
		} else {
			if ((this.obj.getCode() === "list") && (size === 0) && (this.obj.getSegmentsSize() === 0)) {
				this.obj.setSegmentsSize(0.1);
				this.segSize.setValue(0.1);
			}
			this.obj.setSize(size);
			this.obj.compute();
			this.obj.computeChilds();
		}
		this.repaint();
	};
	private SegSZcallback(_val) {
		if (this.setall) {
			this.owner.setAllSegSize(this.obj.getFamilyCode(), _val);
		} else {
			if ((_val === 0) && (this.obj.getSize() === 0)) {
				this.obj.setSize(0.1);
				this.sSize.setValue(0.1);
			}
			this.obj.setSegmentsSize(_val);
			this.obj.compute();
			this.obj.computeChilds();
		}
		this.repaint();
	};
	private LAYcallback(_val) {
		this.setall
			? this.owner.setAllLayer(this.obj.getFamilyCode(), _val)
			: this.obj.setLayer(_val);
		this.repaint();
	};
	private FONTcallback(_val) {
		this.setall
			? this.owner.setAllFontSize(this.obj.getFamilyCode(), _val)
			: this.obj.setFontSize(_val);
		this.repaint();
	};
	private PRECcallback(_val) {
		if (this.setall) {
			this.owner.setAllPrecision(this.obj.getFamilyCode(), _val);
		} else {
			this.obj.setPrecision(_val);
			if ((this.obj.getCode() === "locus") || (this.obj.getCode() === "quadric")) {
				this.obj.compute();
			}
		}
		this.repaint();
	};
	private INCCcallback(_val) {
		this.setall
			? this.owner.setAllIncrement(this.obj.getFamilyCode(), _val)
			: this.obj.setIncrement(_val);
		this.compute();
		this.repaint();
	};
	private ANIMcallback(_val) {
		this.owner.setAnimationSpeed(this.obj, _val)
	};
	private PSHAPEcallback(_val) {
		this.setall
			? this.owner.setAllPtShape(_val)
			: this.obj.setShape(_val);
		this.repaint();
	};
	private APALLcallback(_val) {
		this.setall = _val;
	};
	private DSHcallback(_val) {
		this.setall
			? this.owner.setAllDash(this.obj.getFamilyCode(), _val)
			: this.obj.setDash(_val);
		this.repaint();
	};
	private m360callback(_val) {
		this.setall
			? this.owner.setAll360(this.obj.getFamilyCode(), _val)
			: this.obj.set360(_val);
		this.compute();
		this.repaint();
	};
	private trigocallback(_val) {
		this.setall
			? this.owner.setAllTrigo(this.obj.getFamilyCode(), _val)
			: this.obj.setTrigo(_val);
		this.compute();
		this.repaint();
	};
	private NOMOUSEcallback(_val) {
		this.setall
			? this.owner.setAllNoMouse(this.obj.getFamilyCode(), _val)
			: this.obj.setNoMouseInside(_val);
		this.repaint();
	};
	private TRKcallback(_val) {
		this.setall
			? this.owner.setAllTrack(this.obj.getFamilyCode(), _val)
			: this.owner.setTrack(this.obj, _val);
	};
	private precVal(val) {
		return val === -1 ? val : $U.log(val);
	};
}
