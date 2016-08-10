
import {PointObject} from './PointObject';

/**
 * The constructor does not fulfill the parent constructor signature
 * issue with .dragTo
 */

export class CenterObject extends PointObject {
	protected C;
	constructor(_construction, _name, _C) {
		super(_construction, _name, NaN, NaN);// not well defined
		//super(_construction, _name);
		//$U.extend(this, new PointObject(_construction, _name)); // Héritage
		//    this.setHidden(true);
		this.C = _C;
		//    this.setParent(C);
		this.dragTo = _construction.noop;// modified by me
	}
	startDrag() {}
	compute() {}
	isMoveable(): boolean {
		return false;
	}
	setFillStyle() {
		this.forceFillStyle(this.prefs.color.point_inter);
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Center", this.C.getVarName());
	}
}
