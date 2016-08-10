
import {PrimitiveCircleObject} from './PrimitiveCircleObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;

export class Circle1Object extends PrimitiveCircleObject {
	private RX: Expression;
	setExp: (exy:string|number) => void;
	constructor(_construction:iConstruction, _name:string, _P1, _R:number) {
		super(_construction, _name, _P1);
		// $U.extend(this, new PrimitiveCircleObject(_construction, _name, _P1)); // Héritage
		// $U.extend(this, new MoveableObject(_construction)); // Héritage
		this.RX = null;
		this.setDefaults("circle");
		this.R = _R;
		this.setParent(this.P1);
		this.blocks.setMode(["oncompute"], "oncompute");
		this.compute = this.computeGeom;
		this.getSource = this.getSourceGeom;
		this.getRoot().setExpression = this.setExpression;
		this.setExp = this.setRX;
	}
	getRX(): Expression {
		return this.RX;
	}
	// Pour Blockly :
	setExpression(exy:string|number) {
		this.setRX(exy);
	}
	// setExp pour les widgets :
	setRX(ex:string|number) {
		if ($U.isStr(ex)) {
			// Si ex et ey sont des expressions :
			this.setParent(this.P1);
			Expression.delete(this.RX);
			this.RX = new Expression(this, ex);
			this.isMoveable = () => false;
			this.compute = this.computeFixed;
			this.getSource = this.getSourceFixed;
		} else {
			// Si ex et ey sont des nombres :
			Expression.delete(this.RX);
			this.R = <number>ex;
			this.isMoveable = () => true;
			this.compute = this.computeGeom;
			this.getSource = this.getSourceGeom;
			this.setParent(this.P1)
		}
		// this.compute();
		// this.computeChilds();
	}
	getExp() {
		return this.getRX().getSource();
	}
	getR(): number {
		return this.R;
	}
	redefine(_old, _new) {
		if (_old === this.P1) {
			this.addParent(_new);
			this.P1 = _new;
		}
	}
	getCode(): string {
		return "circle1";
	}
	getAssociatedTools(): string {
		var at = "@callproperty,@calltrash,point";
		if (this.getCn().findPtOn(this) !== null)
			at += ",locus";
		if (this.isMoveable())
			at += ",@objectmover";
		at += ",@callcalc,@blockly";
		return at;
	}
	isMoveable(): boolean {
		return true;
	}
	// Obsolete :
	dragObject(_x:number, _y:number) {
		this.R = Math.sqrt((_x - this.P1.getX()) * (_x - this.P1.getX()) + (_y - this.P1.getY()) * (_y - this.P1.getY()));
	}
	compute_dragPoints(_x:number, _y:number) {
		this.R = Math.sqrt((_x - this.P1.getX()) * (_x - this.P1.getX()) + (_y - this.P1.getY()) * (_y - this.P1.getY()));
	}
	computeDrag() {
		this.computeChilds();
	}
	setZoom(_h:number) {
		this.R *= _h;
	}
	getValue() {
		return this.RX ? this.RX.value() : this.getCn().coordsSystem.l(this.R);
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.P1.getX(), this.P1.getY(), this.R, 0, Math.PI * 2, true);
		ctx.fill();
		ctx.stroke();
	}
	refreshNames() {
		if (this.RX) {this.RX.refreshNames();}
	}
	private computeGeom() { }
	private computeFixed() {
		this.RX.compute();
		this.R = this.getCn().coordsSystem.lx(this.RX.value());
	}
	private getSourceGeom(src) {
		src.geomWrite(false, this.getName(), "Circle1", this.P1.getVarName(), this.getCn().coordsSystem.l(this.R));
	}
	private getSourceFixed(src) {
		var _ex = "\"" + this.RX.getUnicodeSource().replace(/\n/g, "\\n") + "\"";
		src.geomWrite(false, this.getName(), "Circle1", this.P1.getVarName(), _ex);
	}
}
