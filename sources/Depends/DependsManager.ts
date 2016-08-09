
export class DependsManager {
	private zc;
	private C;
	private O;
	private M;
	constructor(_z) {
		this.zc = _z;
		this.C = this.zc.getConstruction();
		this.O = null; // origin object
		this.M = null; // Depends objects
		//    var valueChanged = function(_val) {
		//        if ((this.O === null) || (T === null)) return;
		//        if (_val === 0) {
		//            this.O.removeMagnet(T[0]);
		//            setPaintMode();
		//            this.zc.paint();
		//            return;
		//        }
		//        var forcepaint = (this.O.getMagnet(T[0]) === null);
		//        T = this.O.addMagnet(T[0], _val);
		//        T[1] = _val;
		//        standardM = _val;
		//        T[0].setMacroMode(3);
		//        if (forcepaint) {
		//            setPaintMode();
		//            this.zc.paint();
		//        }
		//    };
	}
	edit(_o) {
		this.O = _o;
		this.O.initDragPoints();
		this.zc.setMode(11);
		this.setPaintMode();
	}
	add(_o) {
		if (_o === this.O) return;
		if (_o.getCode() !== "point") return;
		this.O.add_removeDragPoint(_o);
		this.setPaintMode();
		this.zc.paint();
	}
	quit() {
		// if (P) P.quit();
	}
	private setPaintMode() {
		var V = this.C.elements();
		for (var i = 0, len = V.length; i < len; i++) {
			V[i].setMacroMode(0);
		}
		if (this.O) this.O.setMacroMode(2);
		this.M = this.O.getDragPoints();
		for (var i = 0; i < this.M.length; i++) {
			this.M[i].setMacroMode(3); // Couleur des finaux de macros
		}
	}
}
