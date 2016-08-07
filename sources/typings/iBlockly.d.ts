
interface iBlocklyObject {
	getXML();
	getSNC();
	setBehavior(_m, _xml, _sync, _async);
	evaluate();
	setChilds(_childs);
	getChilds();
	setParents(_parents);
	getParents();
}

interface iBlocklyObjects {
	setMode(_tab, _cur);
	getMode();
	isEmpty(): boolean;
	getCn();
	getObj();
	clear();
	setCurrent(_c);
	getCurrent();
	getCurrentObj();
	getCurrentXML();
	get(_m);
	getXML(_m);
	getSNC(_m);
	setChilds(_m, _childs);
	setParents(_m, _childs);
	evaluate(_m);
	setBehavior(_m, _xml, _sync, _async);
	getSource();
	setSource(_src);
}
