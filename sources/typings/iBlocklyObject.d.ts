
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
