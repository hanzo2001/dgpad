/// <reference path="./iObjectConstructor.d.ts" />
/// <reference path="../Objects/iPointObject.d.ts" />

interface iPointConstructor extends iObjectConstructor {
	getInitials(): string[];
	createObj(zc, ev): iPointObject;
	preview(ev, zc);
}
