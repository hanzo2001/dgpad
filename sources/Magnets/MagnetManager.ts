/// <reference path="../typings/iMagnets.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {MagnetPanel} from './MagnetPanel';
import {VirtualPointObject} from '../Objects/VirtualPointObject';

export class MagnetManager implements iMagnetManager {
	private zc: iCanvas;
	private C;
	private O;
	private T;
	private M;
	private point: VirtualPointObject;
	private standardM: number;
	private panel: iMagnetPanel;
	constructor(_z: iCanvas) {
		this.zc = _z;
		this.C = this.zc.getConstruction();
		this.O = null; // origin object
		this.T = null; // target object
		this.M = null; // Magnets objects
		this.point = new VirtualPointObject(0, 0); // projeté orthogonal de this.O sur this.T
		this.standardM = 20; // Attirance standard
		this.panel = null;
	}
	edit(_o) {
		this.O = _o;
		this.zc.setMode(9);
		this.setPaintMode();
		this.T = null;
		this.panel = new MagnetPanel(this.zc, (n:number) => this.valueChanged(n));
		this.panel.setXY(-300, -300);
		this.standardM = 20;
	}
	add(_o) {
		if (_o === this.O) return;
		if (_o.projectXY(0, 0) === undefined) return;
		this.T = this.O.addMagnet(_o, this.standardM);
		this.setPaintMode();
		this.zc.paint();
		this.panel.setValue(this.T[1]);
	}
	paint() {
		if (this.O === null || this.T === null) return;
		switch (this.T[0].getCode()) {
			case "arc3pts":
				this.point.setXY(this.T[0].getB().getX(), this.T[0].getB().getY());
				break;
			case "segment":
				this.point.setXY((this.T[0].getP1().getX() + this.T[0].getP2().getX()) / 2, (this.T[0].getP1().getY() + this.T[0].getP2().getY()) / 2);
				break;
			case "point":
				this.point.setXY(this.T[0].getX(), this.T[0].getY());
				break;
			default:
				var t = this.T[0].projectXY(this.O.getX(), this.O.getY());
				this.point.setXY(t[0], t[1]);
		}
		this.panel.setXY(this.point.getX() - 152, this.point.getY() + 17);
	}
	quit() {
		if (this.panel) {this.panel.quit();}
	}
	private valueChanged(value:number) {
		if (this.O === null || this.T === null) {return;}
		if (value === 0) {
			this.O.removeMagnet(this.T[0]);
			this.setPaintMode();
			this.zc.paint();
			return;
		}
		var forcepaint = this.O.getMagnet(this.T[0]) === null;
		this.T = this.O.addMagnet(this.T[0], value);
		this.T[1] = value;
		this.standardM = value;
		this.T[0].setMacroMode(3);
		if (forcepaint) {
			this.setPaintMode();
			this.zc.paint();
		}
	}
	private setPaintMode() {
		var V = this.C.elements();
		let i=0, s=V.length;
		while (i<s) {V[i++].setMacroMode(0);};
		if (this.O) this.O.setMacroMode(2);
		this.M = this.O.getMagnets();
		i=0, s=this.M.length;
		while (i<s) {this.M[i++][0].setMacroMode(3);} // Couleur des finaux de macros
	}
}
