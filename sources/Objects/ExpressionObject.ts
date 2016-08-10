
import {ConstructionObject} from './ConstructionObject';
import {PointObject} from './PointObject';
import {Expression} from '../Expression';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class ExpressionObject extends ConstructionObject {
	private X: number;
	private Y: number;
	private W: number;
	private H: number;
	private arrow: string;
	private OldX: number;
	private OldY: number;
	private T;
	private E1: Expression;
	private min: Expression;
	private max: Expression;
	private cLength: number;
	private cOffsetY: number;
	private anchor;
	private Alpha: number[];
	private agrandirCursor: boolean;
	private dragX;
	private dragY;
	private cPT: PointObject;
	private setH;
	dx;
	dy;
	dz;
	dt;
	setExp;
	constructor(_construction, _name, _txt, _min: string, _max: string, _exp: string, _x: number, _y: number) {
		super(_construction, _name);
		//var parent = $U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		//$U.extend(this, new MoveableObject(_construction));
		var parent = ExpressionObject.prototype;
		this.Flag = false;
		this.Cn = _construction;
		this.X = (_x < 0) ? 0 : _x;
		this.Y = (_y < 0) ? 25 : _y;
		this.W = 0;
		this.H = 0;
		this.arrow = String.fromCharCode(0x27fc); // Juste pour tromper jscompress qui converti abusivement...
		this.OldX;
		this.OldY;
		this.T = _txt;
		this.E1 = new Expression(this, "");
		this.min = null;
		this.max = null;
		this.cLength = 200; // Longueur initiale d'un curseur, en pixel.
		this.cOffsetY = 20; // Décalage du curseur sous l'expression
		this.anchor = null; // PointObject auquel l'expression est rattachée
		this.Alpha = [30, -10];
		this.agrandirCursor = false;
		this.dragX;
		this.dragY;
		this.cPT = new PointObject(this.Cn, this.getName() + ".cursor", 0, 0);
		this.cPT.setH = this.cPT.setHidden;
		this.cPT.increment = 0;
		this.cPT.setDefaults("expression_cursor");
		this.Cn.add(this.cPT);
		this.setH = this.setHidden;
		this.setDefaults("expression");
		if (_exp !== "") { this.setE1(_exp); }
		if (_min !== "") { this.setMin(_min); }
		if (_max !== "") { this.setMax(_max); }
		this.blocks.setMode(["oncompute", "onchange"], "oncompute");
		this.cPT.getCode = function () {
			return "expression_cursor";
		};
		this.cPT.getAssociatedTools = function () {
			return "@callproperty"
		};
		this.cPT.getSource = function () { };
		this.cPT.getStyle = function () { };
		this.cPT.compute = function () { };
		this.cPT.free = function () {
			return false;
		};
		this.cPT.getMacroMode = function () {
			return -1
		};
		this.cPT.setH = function (_sel) {
			this.setH(_sel);
			this.cPT.setH(_sel);
		};
		this.cPT.setIncrement = function (_i) {
			this.cPT.increment = _i;
			this.cPT.dragTo(this.cPT.getX(), this.cPT.getY());
		};
		this.cPT.getIncrement = function () {
			return this.cPT.increment;
		};
		this.cPT.startDrag = function (_x, _y) { };
		this.cPT.dragTo = function (_x, _y) {
			if (_x < this.X) { _x = this.X; }
			if (_x > (this.X + this.cLength)) { _x = this.X + this.cLength; }
			var val = this.min.value() + (this.max.value() - this.min.value()) * (_x - this.X) / this.cLength;
			if (this.cPT.increment) {
				var inc = 1 / this.cPT.increment;
				val = this.min.value() + Math.round((val - this.min.value()) * inc) / inc;
				while (val > this.max.value()) { val -= this.cPT.increment; }
				_x = this.X + this.cLength * (val - this.min.value()) / (this.max.value() - this.min.value());
			}
			this.cPT.setXY(_x, this.Y + this.cOffsetY);
			this.E1.setValue(val);
			this.Cn.is3D() ? this.Cn.computeAll() : this.computeChilds();
		};
		// Pour Blockly :
		(<any>parent).setExpression = this.setExpression = function (exy) {
			this.setExp(exy);
		}
    // setExp pour les widgets et pour blockly :
		this.setExp = this.setE1 = function(_t) {
				if (this.E1.getSource() !== _t) {
						this.E1 = Expression.delete(this.E1);
						this.E1 = new Expression(this, _t);
						this.setMethods();
				}
		};
		this.dragTo = this._dragTo;
	}
	setIncrement(inc: number) {
		this.cPT.setIncrement(inc);
	}
	getIncrement(): number {
		return this.cPT.getIncrement();
	}
	getcPTName() {
		return this.cPT.getName();
	}
	getcPT(): PointObject {
		return this.cPT;
	}
	setHidden(_sel) {
		this.cPT.setH(_sel);
		this.setH(_sel);
	}
	setXY(x, y) {
		var oldX = this.X;
		this.X = x;
		this.Y = y;
		if (this.isCursor()) {
			if (isNaN(this.cPT.getX()) || isNaN(this.cPT.getX()))
				this.initCursorPos();
			else
				this.cPT.setXY(this.cPT.getX() + (this.X - oldX), this.Y + this.cOffsetY);
		}
	}
	getX() {
		return this.X;
	}
	getY() {
		return this.Y;
	}
	getW() {
		return this.W;
	}
	is3D() {
		return this.E1.is3DArray();
	}
	// ****************************************
	// **** Uniquement pour les animations ****
	// ****************************************
	// var hashtab = [];
	// inithashtab(_speed) {
	//     hashtab = [true];
	//     var inc = 100 / _speed;
	//     for (var i = 1; i < 100; i++) {
	//         if (i > inc) {
	//             hashtab.push(true);
	//             inc += 100 / _speed;
	//         } else {
	//             hashtab.push(false);
	//         }
	//     }
	//     console.log(hashtab)
	// };
	isAnimationPossible() {
		return ((this.E1 != null) && (this.E1.isNum()));
	}
	getAnimationSpeedTab() {
		return [0, 1, 2, 3, 5, 10, 25, 50, 75, 90, 100];
	}
	getAnimationParams(x1, y1) {
		var x0 = this.X;
		var y0 = this.Y;
		var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
		var fce = this.getAnimationSpeedTab();
		var f = Math.floor(d / (500 / fce.length));
		if (f >= fce.length) f = fce.length - 1;
		var mess = fce[f] + "%";
		var ang = $U.angleH(x1 - x0, y1 - y0);
		var dir = ((ang > Math.PI / 2) && (ang < 3 * Math.PI / 2)) ? 1 : -1;
		var aller_retour = false;
		if (this.isCursor()) {
			aller_retour = ((ang > Math.PI / 4) && (ang < 3 * Math.PI / 4)) || ((ang > 5 * Math.PI / 4) && (ang < 7 * Math.PI / 4));
		};
		return {
			message: aller_retour ? mess + " \u21C4" : mess,
			speed: fce[f],
			direction: dir,
			ar: aller_retour
		}
	}
	// incrementAlpha(anim) {
	//     if (hashtab[anim.loopnum]) {
	//         var v = anim.speed;
	//         var s = anim.direction;
	//         var ar = anim.ar;
	//         var d = new Date();
	//         anim.delay = d.getTime() - anim.timestamp;
	//         anim.timestamp = d.getTime();
	//         var inc = s * 1;
	//         // var inc = 0.1 * s;
	//         // console.log(this.isCursor());
	//         if (this.isCursor()) {
	//             inc = s * (this.max.value() - this.min.value()) / 50;
	//             var e1 = this.E1.value();
	//             e1 += inc;
	//             if (e1 < this.min.value()) {
	//                 if (ar) {
	//                     anim.direction *= -1;
	//                     e1 = 2 * this.min.value() - e1;
	//                 } else {
	//                     e1 = this.max.value() + e1 - this.min.value();
	//                 }
	//             }
	//             if (e1 > this.max.value()) {
	//                 if (ar) {
	//                     anim.direction *= -1;
	//                     e1 = 2 * this.max.value() - e1;
	//                 } else {
	//                     e1 = this.min.value() + e1 - this.max.value();
	//                 }
	//             }
	//             if (e1 < this.min.value()) e1 = this.min.value();
	//             if (e1 > this.max.value()) e1 = this.max.value();
	//             if (Math.abs(e1) < 1e-13) e1 = 0;
	//             // if (this.cPT.increment) {
	//             //     var inc = 1 / this.cPT.increment;
	//             //     e1 = this.min.value() + Math.round((e1 - this.min.value()) * inc) / inc;
	//             // }
	//             initCursorPos();
	//             this.E1.setValue(e1);
	//             // initCursorPos();
	//             // this.E1.setValue(e1);
	//         } else {
	//             var val = this.E1.value() + inc;
	//             if (Math.abs(val) < 1e-13) val = 0;
	//             this.E1.setValue(val);
	//         }
	//     }
	//     anim.loopnum = (anim.loopnum + 1) % 100;
	//     // console.log(this.E1.value())
	// };
	incrementAlpha(anim) {
		// console.log(anim);
		var v = anim.speed;
		var s = anim.direction;
		var ar = anim.ar;
		var d = new Date();
		anim.delay = d.getTime() - anim.timestamp;
		anim.timestamp = d.getTime();
		var inc = s * (v * anim.delay / 1000);
		// var inc=s*v;
		// console.log(this.isCursor());
		if (this.isCursor()) {
			inc = inc * (this.max.value() - this.min.value()) / 50;
			if (this.cPT.increment) {
				anim.incsum += inc;
				var inc2 = this.cPT.increment;
				if (Math.abs(anim.incsum) < inc2) {
					return;
				};
				inc = s * inc2 * Math.floor(Math.abs(anim.incsum) / inc2);
				anim.incsum = 0;
			}
			// console.log(inc);
			var e1 = this.E1.value();
			e1 += inc;
			if (e1 < this.min.value()) {
				if (ar) {
					anim.direction *= -1;
					e1 = 2 * this.min.value() - e1;
				} else {
					e1 = this.max.value() + e1 - this.min.value();
				}
			}
			if (e1 > this.max.value()) {
				if (ar) {
					anim.direction *= -1;
					e1 = 2 * this.max.value() - e1;
				} else {
					e1 = this.min.value() + e1 - this.max.value();
				}
			}
			if (e1 < this.min.value()) e1 = this.min.value();
			if (e1 > this.max.value()) e1 = this.max.value();
			if (Math.abs(e1) < 1e-13) e1 = 0;
			// if (this.cPT.increment) {
			//     var inc2 = 1 / this.cPT.increment;
			//     e1 = this.min.value() + Math.round((e1 - this.min.value()) * inc2) / inc2;
			// }
			this.initCursorPos();
			this.E1.setValue(e1);
			// initCursorPos();
			// this.E1.setValue(e1);
		} else {
			var val = this.E1.value() + inc;
			if (Math.abs(val) < 1e-13) val = 0;
			this.E1.setValue(val);
		}
		// console.log(this.E1.value())
	}
	// ****************************************
	// ****************************************
	// Utilisé pour attacher une expression à un point (this.anchor) :
	attachTo(_o) {
		if (this.anchor === null) {
			this.anchor = _o;
			this.addParent(this.anchor);
			this.setXY(this.anchor.getX() + this.Alpha[0], this.anchor.getY() + this.Alpha[1]);
			//            _o.setAlpha(this);
		}
	}
	setAlpha(_a) {
		this.Alpha = _a;
	}
	getAlpha() {
		return this.Alpha;
	}
	computeAlpha() {
		if (this.anchor !== null) {
			this.Alpha[0] = this.X - this.anchor.getX();
			this.Alpha[1] = this.Y - this.anchor.getY();
		}
	}
	deleteAlpha() {
		if (this.anchor !== null) {
			var _x = 10 * Math.round((this.anchor.getX() + this.Alpha[0] + 20) / 10);
			var _y = 10 * Math.round((this.anchor.getY() + this.Alpha[1] - 20) / 10);
			this.setXY(_x, _y);
			this.anchor = null;
			this.Alpha = [30, -10];
			this.refresh();
		}
	}
	isInstanceType(_c) {
		return (_c === "expression");
	}
	getCode() {
		return "expression";
	}
	getFamilyCode() {
		return "expression";
	}
	getAssociatedTools() {
		var s = "@callproperty,@calltrash,@objectmover,@anchor,@callcalc";
		if (this.anchor)
			s = "@callproperty,@calltrash,@objectmover,@noanchor,@callcalc";
		// if (this.isCursor())
		if ((this.E1 !== null) && (this.E1.isNum())) s += ",@spring";
		s += ",@blockly";
		return s;
	}
	getValue(x, y, z, t) {
		return this.E1.value(x, y, z, t);
	}
	compute() {
		if (this.E1)
			this.E1.compute();
		if (this.min)
			this.min.compute();
		if (this.max)
			this.max.compute();
		if (this.anchor) {
			this.setXY(this.anchor.getX() + this.Alpha[0], this.anchor.getY() + this.Alpha[1]);
		}
	}
	startDrag(_x, _y) {
		this.dragX = _x;
		this.dragY = _y;
		this.OldX = this.X;
		this.OldY = this.Y;
		//        this.dragX = 10 * Math.round(_x / 10);
		//        this.dragY = 10 * Math.round(_y / 10);
		//        this.OldX = 10 * Math.round(this.X / 10);
		//        this.OldY = 10 * Math.round(this.Y / 10);
	}
	computeDrag() {}
	mouseInside(ev) {
		this.agrandirCursor = false;
		var mx = this.mouseX(ev),
			my = this.mouseY(ev);
		var inside = ((mx > this.X) && (mx < this.X + this.W) && (my < this.Y) && (my > this.Y - this.getFontSize()));
		if ((!inside) && (this.isCursor())) {
			var l = this.X + this.cLength - 20;
			var sz = this.getSize();
			inside = (mx > l) && (mx < this.X + this.cLength + 20) && (my > this.Y + this.cOffsetY - sz / 2 - 5) && (my < this.Y + this.cOffsetY + sz / 2 + 5);
			this.agrandirCursor = inside;
		}
		return inside;
	}
	private _dragTo(_x, _y) {
		if (this.agrandirCursor) {
			var bar = (this.cPT.getX() - this.X) / this.cLength
			this.cLength = Math.max(20 * Math.round((_x - this.X) / 20), 30);
			var x = this.X + this.cLength * bar;
			this.cPT.setXY(x, this.cPT.getY());
		} else {
			//            var oldX = this.X;
			this.setXY(this.OldX + Math.round((_x - this.dragX) / 10) * 10, this.OldY + Math.round((_y - this.dragY) / 10) * 10);
			//            this.X=this.OldX+Math.round((_x-this.dragX)/10)*10;
			//            this.Y=this.OldY+Math.round((_y-this.dragY)/10)*10;
			//            this.cPT.setXY(this.cPT.getX() + (this.X - oldX), this.Y + this.cOffsetY);
			//            var oldX = this.X;
			//            this.X = 10 * Math.round(_x / 10);
			//            this.Y = 10 * Math.round(_y / 10);
			//            this.X = this.X + (this.OldX - this.dragX);
			//            this.Y = this.Y + (this.OldY - this.dragY);
			//            this.cPT.setXY(this.cPT.getX() + (this.X - oldX), this.Y + this.cOffsetY);
		}
		this.computeAlpha();
	}
	private initCursorPos() {
		var cmin = this.min.value();
		var cmax = this.max.value();
		var ce = this.E1.value();
		if (ce < cmin)
			ce = cmin;
		if (ce > cmax)
			ce = cmax;
		this.cPT.setXY(this.X + this.cLength * (ce - cmin) / (cmax - cmin), this.Y + this.cOffsetY);
	}
	private paintFunction(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "left";
		var val = this.getVarName() + "(" + this.E1.getVars() + ") = " + this.E1.get();
		this.W = ctx.measureText(val).width;
		ctx.fillText(val, this.X, this.Y);
	}
	private paintDxyztFunc(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "left";
		var val = this.E1.get() + " : " + this.E1.value().getVars() + " " + this.arrow + " " + this.E1.value().get();
		//        var val = this.getVarName() + "(" + this.E1.value().getVars() + ") = " + this.E1.value().get();
		this.W = ctx.measureText(val).width;
		ctx.fillText(val, this.X, this.Y);
	}
	private paintDxyztDef(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "left";
		var val = this.getVarName() + "(" + this.E1.getVars() + ") = " + this.E1.get() + " = " + this.E1.getDxyzt();
		//        var val = this.E1.get()+" : "+ this.E1.value().getVars() + " \u27fc " + this.E1.value().get();
		//        var v=[];
		//        console.log("****this.depList: ");
		//        for (var i=0;i<this.getParentLength();i++) {
		//            console.log("this.depList: "+this.getParentAt(i).getName());
		//        }
		//        var val = this.getVarName() + "(" + this.E1.value().getVars() + ") = " + this.E1.value().get();
		this.W = ctx.measureText(val).width;
		ctx.fillText(val, this.X, this.Y);
	}
	private parseText(_s) {
		if (typeof _s === "string") {
			var prec = this.getPrecision();
			_s = _s.replace(/(\d+(.\d+)?)/g, function (m, v) {
				return ($L.number(Math.round(parseFloat(v) * prec) / prec))
			});
		}
		return _s;
	}
	private paintText(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "left";
		var val = this.parseText(this.E1.value());
		this.W = ctx.measureText(val).width;
		ctx.fillText(val, this.X, this.Y);
	}
	//    private isArray(_a) {
	//        return (Object.prototype.toString.call(_a) === '[object Array]');
	//    };
	//
	//
	//    private parseArray(tab, prec) {
	//        if (isArray(tab)) {
	//            var elts = [];
	//            for (var i = 0, len = tab.length; i < len; i++) {
	//                elts.push(parseArray(tab[i], prec));
	//            }
	//            return "[" + elts.join($L.comma) + "]";
	//        } else {
	//            if (isNaN(tab))
	//                return "???";
	//            else
	//                return ($L.number(Math.round(tab * prec) / prec));
	//        }
	//    };
	private paintNum(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = ctx.strokeStyle;
		ctx.textAlign = "left";
		var prec = this.getPrecision();
		var t = (this.T === "") ? this.getName() + " = " : this.T;
		var val = (prec > -1) ? t + $U.parseList(this.E1.value(), prec) : t;
		this.W = ctx.measureText(val).width;
		ctx.fillText(val, this.X, this.Y);
	}
	private drawRoundRect(ctx: CanvasRenderingContext2D, x, y, w, h, r) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
	}
	private drawSemiRoundRect(ctx: CanvasRenderingContext2D, x, y, w, h, r) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
	}
	private paintCursor(ctx: CanvasRenderingContext2D) {
		this.paintNum(ctx);
		var y = this.Y + this.cOffsetY;
		var s = this.getSize();
		ctx.lineWidth = this.prefs.size.pointborder;
		this.drawSemiRoundRect(ctx, this.X, y - s / 2, this.cPT.getX() - this.X, s, s / 2);
		ctx.fill();
		this.drawRoundRect(ctx, this.X, y - s / 2, this.cLength, s, s / 2);
		ctx.stroke();
		this.cPT.paint(ctx);
	}
	paintObject(ctx) {
	};
	getSource(src) {
		var _ex = this.E1.getUnicodeSource().replace(/\n/g, "\\n");
		if (this.anchor) {
			let mn = (this.min === null) ? "\"\"" : "\"" + this.min.getSource() + "\"";
			let t = "\"" + $U.native2ascii(this.T) + "\"";
			let mx = (this.max === null) ? "\"\"" : "\"" + this.max.getSource() + "\"";
			let ex = "\"" + _ex + "\"";
			src.geomWrite(false, this.getName(), "ExpressionOn", t, mn, mx, ex, this.anchor.getVarName(), this.Alpha);
		} else {
			let mn = (this.min === null) ? "" : this.min.getSource();
			let mx = (this.max === null) ? "" : this.max.getSource();
			let x = this.Cn.coordsSystem.x(this.X);
			let y = this.Cn.coordsSystem.y(this.Y);
			src.geomWrite(true, this.getName(), "Expression", $U.native2ascii(this.T), mn, mx, _ex, x, y);
		}
	}
	setCursorLength(_cl) {
		var bar = (this.cPT.getX() - this.X) / this.cLength
		this.cLength = _cl;
		var x = this.X + this.cLength * bar;
		this.cPT.setXY(x, this.cPT.getY());
	}
	getStyle(src) {
		var s = this.getStyleString();
		if (this.getPrecision() === -1)
			s += ";p:-1";
		s += ";cL:" + this.cLength;
		s += ";this.cPT:" + $U.base64_encode(this.cPT.getStyleString());
		src.styleWrite(true, this.getName(), "STL", s);
	}
	isCursor() {
		return ((this.E1 !== null) && (this.min !== null) && (this.max !== null) &&
			((this.E1.isEmpty()) || (this.E1.isNum())) && (this.min.isNum()) && (this.max.isNum()));
	}
	objToDelete(): PointObject | ExpressionObject {
		return this.isCursor() ? this.cPT : this;
	}
	private setMethods() {
		//        console.log("curseur :" + this.isCursor());
		this.dx = this.E1.dx;
		this.dy = this.E1.dy;
		this.dz = this.E1.dz;
		this.dt = this.E1.dt;
		//        this.dx = (function() {
		//            return this.E1.dx;
		//        }());
		if (this.E1.isText()) {
			this.paintObject = this.paintText;
			//            this.Cn.remove(this.cPT);
			this.cPT.setXY(NaN, NaN);
		} else if (this.E1.isDxyztFunc()) {
			//            console.log("func");
			this.paintObject = this.paintDxyztFunc;
			this.cPT.setXY(NaN, NaN);
		} else if (this.E1.isDxyztDef()) {
			//            console.log("def");
			this.E1.setDxyzt();
			this.paintObject = this.paintDxyztDef;
			this.cPT.setXY(NaN, NaN);
		} else if (this.E1.isFunc()) {
			this.paintObject = this.paintFunction;
			this.cPT.setXY(NaN, NaN);
		} else if (this.isCursor()) {
			this.setParent(this.cPT);
			this.paintObject = this.paintCursor;
			if (this.E1.isEmpty()) {
				this.cPT.setXY(this.X + this.cLength / 2, this.Y + this.cOffsetY);
			} else {
				this.initCursorPos();
			}
		} else {
			this.paintObject = this.paintNum;
			this.cPT.setXY(NaN, NaN);
		}
	}
	getExp() {
		return this.getE1().getSource();
	}
	getE1() {
		return this.E1;
	}
	setT(_t) {
		this.T = _t;
	}
	getText() {
		return this.T;
	}
	setMin(_t) {
		Expression.delete(this.min);
		this.min = new Expression(this, _t);
		this.setMethods();
	}
	getMinSource() {
		if (this.min)
			return this.min.getSource();
		return "";
	}
	setMax(_t) {
		Expression.delete(this.max);
		this.max = new Expression(this, _t);
		this.setMethods();
	}
	getMaxSource() {
		if (this.max)
			return this.max.getSource();
		return "";
	}
	// Refait à neuf la liste des parents :
	refreshNames() {
		if (this.E1)
			this.E1.refreshNames();
		if (this.min)
			this.min.refreshNames();
		if (this.max)
			this.max.refreshNames();
	}
	// Refait à neuf la liste des parents :
	refresh() {
		// console.log("before:"+this.getParent().length);
		this.setParentList((this.isCursor()) ? [this.cPT] : []);
		if (this.E1)
			this.E1.refresh();
		if (this.min)
			this.min.refresh();
		if (this.max)
			this.max.refresh();
		// console.log("after:"+this.getParent().length);
	}
}
