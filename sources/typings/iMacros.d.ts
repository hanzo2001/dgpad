/// <reference path="./GUI/iPanel.d.ts" />
/// <reference path="./GUI/iiPadDOMElt.d.ts" />
/// <reference path="./GUI/iVerticalBorderPanel.d.ts" />

interface iMacro {
	name: string;
	shortname: string;
	tagPossibleInitials();
	init(li:iiPadDOMElt, cn:iConstruction);
	addParam(p:any);
	getSource();
}

interface iMacrosManager {
	clearTools();
	refreshToolList();
	refreshMacro();
	endMacro();
	addParam(v:any);
	refreshConstructionPanel(_p, _t, _e);
	showPanel();
	hidePanel();
	addTool(name:string, params:string[], call): iMacro;
	addPlugin(name:string, parameters:string[], call): iMacro;
	getSource(): string;
}

interface iMacroPropertiesPanel extends iPanel {
	refreshConstructionPanel(_p, _t, _e);
}

interface iMacroPanel extends iVerticalBorderPanel {
	addPlugins(macro:iMacro);
	addTool(macro:iMacro);
	showPlugins();
	showTools();
	addBlankLI();
	deselectMacros();
	getToolPath();
	refreshConstructionPanel(_p, _t, _e);
	clearToolList();
	isMacroProps();
	showMacroProps();
	hideMacroProps();
	targetToolLI(_m);
}
