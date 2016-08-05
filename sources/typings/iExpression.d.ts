
interface iExpression {
	setText(_src:string);
	setDxyzt();
	getDxyzt();
	getVars(): string;
	compute();
	forcevalue(x, y, z, t);
	value(x?, y?, z?, t?);
	dx(x, y, z, t);
	dy(x, y, z, t);
	dz(x, y, z, t);
	dt(x, y, z, t);
	refresh();
	refreshNames();
	setValue(_val);
	isText(): boolean;
	isFunc(): boolean;
	isDxyztFunc(): boolean;
	isDxyztDef(): boolean;
	isEmpty(): boolean;
	isNum(): boolean;
	isArray(): boolean;
	is3DArray(): boolean;
	getPointList();
	getValidValue();
	fix();
	get();
	js();
	getUnicodeSource();
	getSource();
	/*
	static fixAll();
	static delete(expression:Expression);
	*/
}
