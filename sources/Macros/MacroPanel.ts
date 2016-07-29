
import {MacroPropertiesPanel} from './MacroPropertiesPanel';
import {VerticalBorderPanel} from '../GUI/panels/VerticalBorderPanel';
import {iPadList} from '../GUI/elements/iPadList';

// be careful with `this.proc`, this is not passing as it should

var $U = (<any>window).$U;
var $L = (<any>window).$L;
var $P = (<any>window).$P;
var $SCALE = (<any>window).$SCALE;

export class MacroPanel extends VerticalBorderPanel {
	protected canvas;
	protected pluginsList: iPadList;
	protected toolsList: iPadList;
	protected props: MacroPropertiesPanel;
	protected exec;
	constructor(_canvas:any, _exec:any) {
		super(_canvas,$P.MacroPanelWidth*$SCALE,true);
		//$U.extend(this, new VerticalBorderPanel(canvas, $P.MacroPanelWidth * $SCALE, true));
		this.canvas = _canvas;
		this.setBounds(this.getBounds().left - 15, -5, 0, _canvas.getHeight() - $P.controlpanel.size); // Le fond n'est pas affiché
		this.pluginsList = new iPadList(this.getDocObject(), this.proc, $L.macro_plugins, 10, 10, 180, 196);
		this.toolsList = new iPadList(this.getDocObject(), this.proc, $L.macro_tools, 10, 215, 180, 196);
		this.props = new MacroPropertiesPanel(_canvas, this);
		this.exec = _exec;
		this.show();
	}
	addPlugins(_m) {
		this.pluginsList.append(_m.name, _m);
	}
	addTool(_m) {
		this.toolsList.append(_m.name, _m);
	}
	showPlugins() {
		this.pluginsList.show();
	}
	showTools() {
		this.toolsList.show();
	}
	addBlankLI() {
		this.toolsList.append(" ");
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
		if (old) old.parentNode.removeChild(old);
		this.toolsList = new iPadList(this.getDocObject(), this.proc, $L.macro_tools, 10, 210, 180, 196);
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
