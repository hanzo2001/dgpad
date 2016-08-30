
import {MacroPropertiesPanel} from './MacroPropertiesPanel';
import {VerticalBorderPanel} from '../GUI/panels/VerticalBorderPanel';
import {iPadList} from '../GUI/elements/iPadList';
import {Macro} from './Macro';// swap for interface
// be careful with `this.proc`, this is not passing as it should

var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $P = (<any>window).$P;
var $SCALE = (<any>window).$SCALE;

export class MacroPanel extends VerticalBorderPanel {
	protected canvas: iCanvas;
	protected pluginsList: iPadList;
	protected toolsList: iPadList;
	protected props: MacroPropertiesPanel;
	protected exec;
	constructor(canvas:any, exec:any) {
		super(canvas,$P.MacroPanelWidth*$SCALE,true);
		//$U.extend(this, new VerticalBorderPanel(canvas, $P.MacroPanelWidth * $SCALE, true));
		this.canvas = canvas;
		this.setBounds(this.getBounds().left - 15, -5, 0, canvas.getHeight() - $P.controlpanel.size); // Le fond n'est pas affiché
		this.pluginsList = new iPadList(this.getDocObject(), (li,m)=>this.proc(li,m), $L.macro_plugins, 10, 10, 180, 196);
		this.toolsList = new iPadList(this.getDocObject(), (li,m)=>this.proc(li,m), $L.macro_tools, 10, 215, 180, 196);
		this.props = new MacroPropertiesPanel(canvas, this);
		this.exec = exec;
		this.show();
	}
	addPlugins(macro:iMacro) {
		this.pluginsList.append(macro.name, macro);
	}
	addTool(macro:iMacro) {
		this.toolsList.append(macro.name, macro);
	}
	showPlugins() {
		this.pluginsList.show();
	}
	showTools() {
		this.toolsList.show();
	}
	addBlankLI() {
		this.toolsList.append(' ');
	}
	deselectMacros() {
		this.pluginsList.reInit();
		this.toolsList.reInit();
	}
	getToolPath() {
		return this.toolsList.getCurrentPath();
	}
	refreshConstructionPanel(_p, _t, _e) {
		this.props.refreshConstructionPanel(_p, _t, _e);
	}
	clearToolList() {
		var old = this.toolsList ? this.toolsList.getDocObject() : null;
		if (old) {old.parentNode.removeChild(old);}
		let proc = this.proc.bind(this);
		this.toolsList = new iPadList(this.getDocObject(), proc, $L.macro_tools, 10, 210, 180, 196);
	}
	isMacroProps() {
		return this.props !== null;
	}
	showMacroProps() {
		this.props.show();
	}
	hideMacroProps() {
		this.props.close();
	}
	targetToolLI(_m) {
		this.toolsList.targetLI(_m);
	}
	private proc(_li, _m) {
		this.deselectMacros();
		this.exec(_li, _m);
	}
}
