
interface iObjectConstructor {
	getCode(): string;
	// Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
	getType(): number;
	getInitials(): any[];
	preview(ev, zc);
	getC(i:number);
	getCList(): any[];
	clearC();
	addC(o);
	isAcceptedInitial(o): boolean;
	isLastObject(): boolean;
	isInstantTool(): boolean;
	selectInitialObjects(zc);
	setInitialObjects(_sel);
	selectCreatePoint(zc, ev);
	createCallBack(zc, o);
	createObj(zc, ev);
	newObj(_zc, _C);
}
