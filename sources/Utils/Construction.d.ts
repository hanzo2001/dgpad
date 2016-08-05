
interface Construction {
	mouseX: number;
	mouseY: number;
	prefs;
	coordsSystem;
	paint;
	computeAll;
	createTurtleExpression(_startpt);
	removeTurtleExpression(_startpt);
	getObjectsFromType(_t);
	isDragOnlyMoveable();
	setDragOnlyMoveable(_d);
	isDEG();
	setDEG(_d);
	cos(_a);
	sin(_a);
	tan(_a);
	getInterpreter();
	getTrackManager();
	getVarName(_n);
	isVarName(_n);
	getCanvas();
	getSerial();
	getBounds();
	getHeight();
	getWidth();
	reconstructChilds();
	setMode(_mode);
	getMode();
	isMode();
	isConsultOrArrowMode();
	isConsultMode();
	isArrowMode();
	isHideMode();
	isDeleteMode();
	isMacroMode();
	isMacroEXEMode();
	isPropertiesMode();
	add(_obj);
	Quickadd(_obj);
	deleteAll();
	setAllSize(_type, _sze);
	setAllSegSize(_type, _sze);
	setAllColor(_type, _col);
	setAllOpacity(_type, _alpha);
	setAllLayer(_type, _lay);
	setAllPtShape(_shape);
	setAllFontSize(_type, _v);
	setAllPrecision(_type, _v);
	setAllIncrement(_type, _v);
	setAllDash(_type, _v);
	setAll360(_type, _is360);
	setAllTrigo(_type, _t);
	setAllNoMouse(_type, _v);
	elements();
	isEmpty();
	zoom(_x, _y, _h);
	translate(_x, _y);
	translateANDzoom(_xt, _yt, _xz, _yz, _h);
	findCoincidents(_t);
	getNames();
	find(_oName);
	findVar(_vName);
	getSubName(_n);
	getUnusedName(_n, _o);
	findFreePoints(_o);
	remove(_o);
	safelyDelete(_o);
	addIndicated(obj);
	clearIndicated();
	getIndicated();
	getFirstIndicatedPoint();
	getLastPoint();
	getSelected();
	addSelected(obj);
	clearSelected();
	getObjectsUnderMouse(ev);
	doOrder(_tab);
	orderObjects();
	validate(ev);
	compute();
	get3DOrigin(_P);
	isOrigin3D(_P);
	setOrigin3D(_P);
	set3DMode(_b);
	is3DMode();
	set3D(_b);
	is3D();
	getPhi();
	getTheta();
	setcompute3D_filter(_proc);
	clearcompute3D_filter();
	computeChilds(t);
	computeMagnetObjects();
	isAxisUsed();
	getSource();
	findDeps(_obj, _untilObj);
	findPtOn(_obj);
	clearMacroMode();
	macroConstructionTag(obj);
	macroExecutionTag(obj);
	resizeBtn();
	showAnimations(_b);
	findInAnimations(_o);
	getAnimationSpeed(_o);
	setAnimationSpeed(_o, _v);
	addAnimation(_o, _v, _d, _m)
}
