/// <reference path="../typings/iCalc.d.ts" />

import {Button} from '../GUI/elements/Button';

export class DigitBtn extends Button implements iDigitBtn {
	constructor(_owner) {
		super(_owner);
		//$U.extend(this, new Button(_owner));
		//me.setStyles("border-radius:5px;border:1px solid #58575e;font-family:Verdana;font-size:20px;font-weight:normal;color:#222;background:" + $U.browserCode() + "-linear-gradient(top, #eeeef0, #d3d3d9)");
		this.setStyles("background-color:#FAFAFA;text-align: center;font: 20px sans-serif;display: inline-block;border: 1px solid #b4b4b4;border-radius: 5px;" + $U.browserCode() + "-transition: all 0.1s ease-in-out");
		this.addDownEvent(() => {
			this.setStyles("background-color:#d3d3d9");
		});
		this.addUpEvent(() => {
			this.setStyles("background-color:#FAFAFA");
		});
	}
	setEnabled(off:boolean) {
		(<HTMLButtonElement>this.docObject).disabled = !off;
		this.setStyle("color", off ? "#666" : "#999");
	}
}
