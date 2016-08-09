/// <reference path="./GUI/iPanel.d.ts" />
/// <reference path="./GUI/iVerticalBorderPanel.d.ts" />

interface iMacro {
	name;
	shortname;
	tagPossibleInitials();
	init(_li, _cn);
	addParam(_n);
	getSource(): string;
}

interface iMacrosManager {
	clearTools();
	refreshToolList();
	refreshMacro();
	endMacro();
	addParam(_n);
	refreshConstructionPanel(_p, _t, _e);
	showPanel();
	hidePanel();
	addTool(_n, _p, _e);
	addPlugin(_n, _p, _e);
	getSource();
}

interface iMacroPropertiesPanel extends iPanel {
	refreshConstructionPanel(_p, _t, _e);
}

interface iMacroPanel extends iVerticalBorderPanel {
	addPlugins(_m);
	addTool(_m);
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
