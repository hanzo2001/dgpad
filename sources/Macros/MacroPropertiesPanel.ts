
import {Panel} from '../GUI/panels/Panel';
import {GUIElement} from '../GUI/elements/GUIElement';

var $L = (<any>window).$L;
var $APP_PATH = (<any>window).$APP_PATH;

export class MacroPropertiesPanel extends Panel {
	protected macropanel;
	protected canvas;
	protected params: any[];
	protected targets: any[];
	protected exec;
	protected viewport: GUIElement;
	protected inner: GUIElement;
	protected nameDIV: GUIElement;
	protected form: GUIElement;
	protected name: GUIElement;
	protected inp: HTMLInputElement;
	protected div_init: GUIElement;
	protected img_init: GUIElement;
	protected span_init: GUIElement;
	protected div_final: GUIElement;
	protected img_final: GUIElement;
	protected span_final: GUIElement;
	protected div_exec: GUIElement;
	protected textarea_exec: GUIElement;
	constructor(_canvas, _macropanel) {
		super(_macropanel.getDocObject());
		//$U.extend(this, new Panel(macropanel.getDocObject()));
		this.macropanel = _macropanel;
		this.canvas = _canvas;
		this.params = [];
		this.targets = [];
		this.exec = "";

		this.viewport      = new GUIElement(this, "div");
		this.inner         = new GUIElement(this, "div");
		this.nameDIV       = new GUIElement(this, "div");
		this.form          = new GUIElement(this, "form");
		this.name          = new GUIElement(this, "input");
		this.inp           = <HTMLInputElement>this.name.getDocObject();
		this.div_init      = new GUIElement(this, "div");
		this.img_init      = new GUIElement(this, "img");
		this.span_init     = new GUIElement(this, "span");
		this.div_final     = new GUIElement(this, "div");
		this.img_final     = new GUIElement(this, "img");
		this.span_final    = new GUIElement(this, "span");
		this.div_exec      = new GUIElement(this, "div");
		this.textarea_exec = new GUIElement(this, "textarea");

		this.setAttr("className", "macroPropsDIV");
		this.transition("translate_x", 0.2, -200);

		this.viewport.setAttr("className", "macroPropsViewport");
		this.inner.setAttr("className", "macroPropsInnerDIV");
		this.nameDIV.setAttr("className", "macroPropsNameDIV");
		this.form.setAttr("action", "javascript:void(0);");
		this.form.getDocObject().onsubmit = (e) => this.validMacro();
		this.name.setAttr("type", "text");
		this.name.setAttr("className", "macroPropsNameINPUT");
		this.name.setAttr("id", "macro_name");
		this.inp.onmouseup = (e) => e.preventDefault();
		this.inp.onfocus   = (e) => this.inp.setSelectionRange(0, 9999);
		this.inp.onkeyup   = (e) => e.preventDefault();
		this.div_init.setAttr("className", "macroLabelDiv");
		this.img_init.setAttr("src", $APP_PATH + "NotPacked/images/macros/init.svg");
		this.img_init.setAttr("className", "macroLabelImage");
		this.span_init.setAttr("className", "macroLabelSpan");
		this.div_init.addContent(this.img_init);
		this.div_init.addContent(this.span_init);
		this.div_final.setAttr("className", "macroLabelDiv");
		this.img_final.setAttr("src", $APP_PATH + "NotPacked/images/macros/target.svg");
		this.img_final.setAttr("className", "macroLabelImage");
		this.span_final.setAttr("className", "macroLabelSpan");
		this.div_final.addContent(this.img_final);
		this.div_final.addContent(this.span_final);
		this.div_exec.setAttr("className", "macroLabelDiv");
		this.textarea_exec.setAttr("className", "macroExecInput");
		this.textarea_exec.setAttr("wrap", "off");
		this.div_exec.addContent(this.textarea_exec);
		this.form.addContent(this.name);
		this.nameDIV.addContent(this.form);
		this.viewport.addContent(this.inner);
		this.addContent(this.nameDIV);
		this.addContent(this.viewport);
	}
	refreshConstructionPanel(_p, _t, _e) {
		this.params = _p;
		this.targets = _t;
		this.exec = _e;
		this.setMacroContent();
		this.setMacroTitle();
	};
	private setMacroTitle() {
		this.name.setAttr("value", $L.macroname);
	};
	private setMacroContent() {
		this.inner.clearContent();
		this.span_init.setAttr("innerHTML", this.params.join(", "));
		this.span_final.setAttr("innerHTML", this.targets.join(", "));
		this.textarea_exec.setAttr("innerHTML", this.exec.toString().replace(/\n/g, "\n\t"));
		this.inner.addContent(this.div_init);
		this.inner.addContent(this.div_final);
		//this.inner.addContent(this.div_exec);
	};
	// La macro a été validée par la touche retour
	// après avoir tapé son nom dans le input text :
	private validMacro() {
		//let N = this.name.getDocObject();
		this.inp.blur();
		let codes = [];
		let cn = this.canvas.getConstruction();
		let i=0, s=this.params.length;
		while (i<s) {
			codes.push(cn.find(this.params[i++]).getFamilyCode());
		}
		let m = this.canvas.macrosManager.addTool(this.macropanel.getToolPath() + this.inp.value, codes, this.exec);
		this.canvas.macrosManager.refreshToolList();
		cn.clearMacroMode();
		this.canvas.paint();
		this.macropanel.hideMacroProps();
		this.macropanel.targetToolLI(m);
		window.scrollTo(0, 0);
	};
}
