
export class BtnGroup {
	protected a: any[];
	constructor() {
		this.a = [];
	}
	add(button) {
		this.a.push(button);
	}
	deselect() {
		let i=0, s=this.a.length;
		while (i<s) {
			this.a[i++].deselect();
		}
	}
}

