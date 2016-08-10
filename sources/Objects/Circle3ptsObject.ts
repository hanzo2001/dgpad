
import {PrimitiveCircleObject} from './PrimitiveCircleObject';
import {CenterObject} from './CenterObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;

/**
 * Initialization problem
 * undefined drag methods
 */

export class Circle3ptsObject extends PrimitiveCircleObject {
	protected M;
	protected P3;// is public in original
	constructor(_construction, _name, _P1, _P2, _P3) {
		var M = new CenterObject(_construction, "_Center", this);
		_construction.add(M);
		super(_construction, _name, M);
		// $U.extend(this, new PrimitiveCircleObject(_construction, _name, M)); // Héritage
		// $U.extend(this, new MoveableObject(_construction)); // Héritage
		this.M = M;
		this.M.setParent(this);
		this.M.forceFillStyle(this.prefs.color.point_inter);
		this.M.setHidden(~~true);
		this.P1 = _P1;
		this.P2 = _P2;
		this.P3 = _P3;
		this.setParent(this.P1, this.P2, this.P3);
		this.setDefaults("circle");
	}
	redefine(_old, _new) {
		if (_old === this.P1) {
			this.addParent(_new);
			this.P1 = _new;
		} else if (_old === this.P2) {
			this.addParent(_new);
			this.P2 = _new;
		} else if (_old === this.P3) {
			this.addParent(_new);
			this.P3 = _new;
		}
	}
	getCode() {
		return "circle3pts";
	}
	getM() {
		return this.M;
	}
	getValue() {
		return (this.getCn().coordsSystem.l(this.R));
	}
	fixIntersection(_x, _y, _P) {
		if (this.P1.near(_x, _y)) {
			_P.setAway(this.P1);
			return true;
		}
		if (this.P2.near(_x, _y)) {
			_P.setAway(this.P2);
			return true;
		}
		if (this.P3.near(_x, _y)) {
			_P.setAway(this.P3);
			return true;
		}
		return false;
	}
	// Seulement pour les macros :
	setMacroAutoObject() {
		var vn = this.getVarName();
		this.P1.setMacroMode(1);
		this.P1.setMacroSource(function (src) {
			src.geomWrite(false, this.P1.getVarName(), "DefinitionPoint", vn, 0);
		});
		this.P2.setMacroMode(1);
		this.P2.setMacroSource(function (src) {
			src.geomWrite(false, this.P2.getVarName(), "DefinitionPoint", vn, 1);
		});
		this.P3.setMacroMode(1);
		this.P3.setMacroSource(function (src) {
			src.geomWrite(false, this.P3.getVarName(), "DefinitionPoint", vn, 2);
		});
	}
	// Seulement pour les macros :
	isAutoObjectFlags() {
		return (this.P1.Flag || this.P2.Flag || this.P3.Flag);
	}
	// Seulement pour les macros :
	getPt(_i) {
		if (_i === 0)
			return this.P1;
		if (_i === 1)
			return this.P2;
		return this.P3;
	}
	isMoveable() {
		// Si les extrémités sont des points libres :
		if ((this.P1.getParentLength() === 0) && (this.P2.getParentLength() === 0) && (this.P3.getParentLength() === 0))
			return true;
		return false;
	}
	dragObject(_x, _y) {
		var vx = _x - this.startDragX;
		var vy = _y - this.startDragY;
		this.M.setXY(this.M.getX() + vx, this.M.getY() + vy);
		this.P1.setXY(this.P1.getX() + vx, this.P1.getY() + vy);
		this.P2.setXY(this.P2.getX() + vx, this.P2.getY() + vy);
		this.P3.setXY(this.P3.getX() + vx, this.P3.getY() + vy);
		this.startDragX = _x;
		this.startDragY = _y;
	}
	computeDrag() {
		this.computeChilds();
	}
	paintObject(ctx) {
		ctx.beginPath();
		ctx.arc(this.M.getX(), this.M.getY(), this.R, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.stroke();
	}
	compute() {
		var t = $U.computeCenter(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), this.P3.getX(), this.P3.getY());
		this.M.setXY(t[0], t[1]);
		this.R = $U.computeRay(this.M.getX(), this.M.getY(), this.P1.getX(), this.P1.getY());
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Circle3pts", this.P1.getVarName(), this.P2.getVarName(), this.P3.getVarName());
	}
}
