/// <reference path="../../typings/GUI/iBtnGroup.d.ts" />

export class BtnGroup implements iBtnGroup {
	protected a: any[];
	constructor() {
		this.a = [];
	}
	add(button:Deselectable) {
		this.a.push(button);
	}
	deselect() {
		this.a.forEach(deselect);
	}
}

function deselect() {
	this.deselect();
}
