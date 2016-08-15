/// <reference path="../typings/GUI/iiPadDOMElt.d.ts" />

import {Macro} from './Macro';
import {MacroPanel} from './MacroPanel';

var $U = (<any>window).$U;

export class MacrosManager {
	protected canvas: iCanvas;
	protected plugins: iMacro[];// Macros de bibliothèque
	protected tools: iMacro[];// Macros personnelles
	protected currentTool: iMacro;
	protected macroPanel: MacroPanel;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
		this.plugins = [];
		this.tools = [];
		this.currentTool = null;
		this.macroPanel = null;
	}
	clearTools() {
		this.tools = [];
	}
	refreshToolList() {
		this.macroPanel.clearToolList();
		this.loadToolsList();
	}
	refreshMacro() {
		if (this.currentTool) {this.currentTool.tagPossibleInitials();}
	}
	endMacro() {
		this.currentTool = null;
		this.macroPanel.deselectMacros();
		this.canvas.getConstruction().setMode(4);
		this.canvas.paint();
	}
	addParam(p:any) {
		if (this.currentTool) {this.currentTool.addParam(p);}
	}
	//Pour la construction de macros :
	refreshConstructionPanel(_p, _t, _e) {
		//console.log(_p.length+_e);
		if (_p.length === 0) {
			// S'il n'y a pas d'initiaux :
			this.macroPanel.hideMacroProps();
			return;
		}
		this.macroPanel.showMacroProps();
		this.macroPanel.refreshConstructionPanel(_p, _t, _e);
	}
	// On a cliqué sur l'icône Macro :
	showPanel() {
		this.currentTool = null;
		if (!this.macroPanel) {
			this.macroPanel = new MacroPanel(this.canvas, (li,m)=>this.startMacro(li,m));
			this.loadPluginsList();
			this.loadToolsList();
		} else {
			this.macroPanel.deselectMacros();
		}
	}
	hidePanel() {
		if (this.macroPanel) {
			this.macroPanel.close();
			this.macroPanel = null;
		}
	}
	addTool(name:string, params:string[], call): iMacro {
		let macro = new Macro(this.canvas, name, params, call);
		this.tools.push(macro);
		return macro;
	}
	addPlugin(name:string, parameters:string[], call): iMacro {
		let macro = new Macro(this.canvas, name, parameters, call);
		this.plugins.push(macro);
		return macro;
	}
	getSource(): string {
		if (this.tools.length === 0) {return "";}
		let txt = "// Macros :\n";
		txt += "$macros={};\n";
		for (let i = 0, len = this.tools.length; i < len; i++) {
			txt += "$macros[\"" + $U.leaveAccents(this.tools[i].name) + "\"]={\n";
			txt += this.tools[i].getSource();
			txt += "};\n\n";
		}
		return txt;
	}
	private macrosSortFilter(a:iMacro, b:iMacro): number {
		if (a.name.toUpperCase() < b.name.toUpperCase()) {return -1;}
		if (a.name === b.name) {return 0;}
		return 1;
	}
	private loadPluginsList() {
		let i=0, s=this.plugins.length;
		while (i<s) {this.macroPanel.addPlugins(this.plugins[i++]);}
		this.macroPanel.showPlugins();
	}
	private loadToolsList() {
		this.tools.sort(this.macrosSortFilter);
		let i=0, s=this.tools.length;
		while (i<s) {this.macroPanel.addTool(this.tools[i++]);}
		this.macroPanel.addBlankLI();
		this.macroPanel.showTools();
	}
	// Pour l'execution de macros :
	private startMacro(li:iiPadDOMElt, macro:iMacro) {
		if (this.currentTool === macro) {
			this.endMacro();
		} else {
			this.currentTool = macro;
			this.canvas.getConstruction().setMode(5);
			macro.init(li, this.canvas.getConstruction());
			this.canvas.paint();
		}
	}
}
