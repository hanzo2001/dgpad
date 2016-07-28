var $U = (<any>window).$U;
var $L = (<any>window).$L;

var OXObject;
var OYObject;

export class CoordsSystem {
	private Cn;
	private P; // Properties
	private OX = null;
	private OY = null;
	private Unit = 40; // x and y Axis units, in pixels
	private x0; // x origin coord, in canvas coord system
	private y0; // y origin coord, in canvas coord system
	private lockOx = false; // Dit si l'axe Ox doit être fixe (ne peut pas se déplacer verticalement) ou non
	private lockOy = false;
	private centerZoom = false;
	// Curieusement, sur webkit le lineTo du context n'accepte pas de paramètre x ou y 
	// supérieur à 2147483583. La valeur ci-dessous est la moitié de ce nombre :
	private maxInt = 1073741791;
	// Pour la restriction 3D :
	private theta = [];
	private phi = [];
	private paint;
	private paint_Grid;
	private paint_Ox;
	private paint_Oy;
	constructor(_C) {
		this.Cn = _C;
		this.P = this.Cn.prefs; // Properties
		this.x0 = this.Cn.getBounds().width / 2; // x origin coord, in canvas coord system
		this.y0 = this.Cn.getBounds().height / 2; // y origin coord, in canvas coord system
		this.paint_Grid = this.paintGrid;
		this.paint_Ox = this.paintOx;
		this.paint_Oy = this.paintOy;
		this.paint = $U.nullproc;
	}
	getX0() {
		return this.x0;
	}
	getY0() {
		return this.y0;
	}
	// Pour la restriction 3D de l'angle theta :
	restrictTheta(t) {
		this.theta = t;
	}
	// Pour la restriction 3D de l'angle phi :
	restrictPhi(t) {
		this.phi = t;
	}
	getUnit() {
		return this.Unit;
	}
	zoom(_xz, _yz, _h) {
		this.Cn.getTrackManager().clear();
		_xz = ((this.centerZoom) || (this.islockOy())) ? this.x0 : _xz;
		_yz = ((this.centerZoom) || (this.islockOx())) ? this.y0 : _yz;
		_h = ((this.Unit * _h) > this.maxInt) ? 1 : _h;
		var V = this.Cn.elements();
		for (var i = 0, len = V.length; i < len; i++) {
			if ((V[i].isInstanceType("point")) && V[i].free()) {
				// S'il s'agit d'un point libre :
				V[i].setXY(_xz + (V[i].getX() - _xz) * _h, _yz + (V[i].getY() - _yz) * _h);
			}
			if (V[i].getCode() === "circle1") {
				V[i].setZoom(_h);
			}
		}
		this.x0 = _xz + (this.x0 - _xz) * _h;
		this.y0 = _yz + (this.y0 - _yz) * _h;
		this.Unit *= _h;
	}
	translate(_xt, _yt) {
		this.Cn.getTrackManager().clear();
		_yt = (this.islockOx()) ? 0 : _yt;
		_xt = (this.islockOy()) ? 0 : _xt;
		var V = this.Cn.elements();
		for (var i = 0, len = V.length; i < len; i++) {
			if ((V[i].isInstanceType("point")) && V[i].free()) {
				// S'il s'agit d'un point libre :
				V[i].setXY(V[i].getX() + _xt, V[i].getY() + _yt);
			}
		}
		this.x0 += _xt;
		this.y0 += _yt;
		this.restrict3D();
	}
	translateANDzoom(_xt, _yt, _xz, _yz, _h) {
		this.Cn.getTrackManager().clear();
		_yt = (this.islockOx()) ? 0 : _yt;
		_xt = (this.islockOy()) ? 0 : _xt;
		_xz = ((this.centerZoom) || (this.islockOy())) ? this.x0 : _xz;
		_yz = ((this.centerZoom) || (this.islockOx())) ? this.y0 : _yz;
		_h = ((this.Unit * _h) > this.maxInt) ? 1 : _h;
		var V = this.Cn.elements();
		for (var i = 0, len = V.length; i < len; i++) {
			if ((V[i].isInstanceType("point")) && V[i].free()) {
				// S'il s'agit d'un point libre :
				V[i].setXY(V[i].getX() + _xt, V[i].getY() + _yt);
				V[i].setXY(_xz + (V[i].getX() - _xz) * _h, _yz + (V[i].getY() - _yz) * _h);
			} else if (V[i].getCode() === "circle1") {
				V[i].setZoom(_h);
			}
		}
		this.x0 += _xt;
		this.y0 += _yt;
		this.restrict3D();
		this.x0 = _xz + (this.x0 - _xz) * _h;
		this.y0 = _yz + (this.y0 - _yz) * _h;
		this.Unit *= _h;
	}
	// Translate length in pixel to this coords system :
	l(_l) {
		return _l / this.Unit;
	}
	// Le contraire :
	lx(_l) {
		return _l * this.Unit;
	}
	// Translate area in square pixel to this coords system :
	a(_a) {
		return _a / (this.Unit * this.Unit);
	}
	// Translate canvas coords to this coords system :
	x(_px) {
		return (_px - this.x0) / this.Unit;
	}
	y(_py) {
		return (this.y0 - _py) / this.Unit;
	}
	xy(_t) {
		return [this.x(_t[0]), this.y(_t[1])];
	}
	// Translate this coords system to canvas coords :
	px(_x) {
		var x = (_x * this.Unit + this.x0);
		if (x > this.maxInt)
			return this.maxInt;
		if (x < -this.maxInt)
			return -this.maxInt;
		//        return (Math.round(x));
		return (x);
	}
	py(_y) {
		var y = (this.y0 - _y * this.Unit);
		if (y > this.maxInt)
			return this.maxInt;
		if (y < -this.maxInt)
			return -this.maxInt;
		//        return (Math.round(y));
		return (y);
	}
	setCoords(_x, _y, _u, _md3D) {
		this.x0 = _x;
		this.y0 = _y;
		this.Unit = _u;
		if (_md3D) {this.Cn.set3D(true);}
	}
	private restrict3D() {
		if (this.theta.length === 2) {
			if (this.y0 < this.theta[0]) {this.y0 = this.theta[0];}
			else if (this.y0 > this.theta[1]) {this.y0 = this.theta[1];}
		}
		if (this.phi.length === 2) {
			if (this.x0 < this.phi[0]) {this.x0 = this.phi[0];}
			else if (this.x0 > this.phi[1]) {this.x0 = this.phi[1];}
		}
	}
	private paintOx(ctx) {
			ctx.beginPath();
			if ((this.y0 > 0) && (this.y0 < this.Cn.getHeight())) {
					ctx.moveTo(0, Math.round(this.y0));
					ctx.lineTo(this.Cn.getBounds().width, Math.round(this.y0));
					ctx.stroke();
			}
			var dx = 16,
					dy = 8;
			ctx.moveTo(this.Cn.getBounds().width + 1, Math.round(this.y0));
			ctx.lineTo(this.Cn.getBounds().width - dx, Math.round(this.y0) - dy);
			ctx.lineTo(this.Cn.getBounds().width - dx, Math.round(this.y0) + dy);
			ctx.lineTo(this.Cn.getBounds().width + 1, Math.round(this.y0));
			ctx.fill();
	}
	private paintOy(ctx) {
			ctx.beginPath();
			if ((this.x0 > 0) && (this.x0 < this.Cn.getBounds().width)) {
					ctx.moveTo(Math.round(this.x0), 0);
					ctx.lineTo(Math.round(this.x0), this.Cn.getBounds().height);
					ctx.stroke();
			}
			var dx = 16,
					dy = 8;
			ctx.moveTo(Math.round(this.x0), 0);
			ctx.lineTo(Math.round(this.x0) - dy, dx);
			ctx.lineTo(Math.round(this.x0) + dy, dx);
			ctx.lineTo(Math.round(this.x0), 0);
			ctx.fill();
	}
	private paintGridx(ctx) {
			var y = Math.min(Math.max(this.y0, 0), this.Cn.getHeight());
			var log = Math.floor($U.log(this.Unit / this.P.grid.limitinf));
			var inc = Math.pow(10, log);
			var inv = Math.pow(10, -log);
			var min = (Math.round(inc * this.x(0))) * inv;
			var max = (Math.round(inc * this.x(this.Cn.getBounds().width)) + 1) * inv;
			for (var i = min; i < max; i += inv) {
					var j = (Math.round(inc * i)) * inv;
					var x = Math.round(this.px(j));
					ctx.beginPath();
					ctx.moveTo(x, 0);
					ctx.lineTo(x, this.Cn.getHeight());
					ctx.stroke();
			}
	}
	private paintGridy(ctx) {
			var x = Math.min(Math.max(this.x0, 0), this.Cn.getWidth());
			var log = Math.floor($U.log(this.Unit / this.P.grid.limitinf));
			var inc = Math.pow(10, log);
			var inv = Math.pow(10, -log);
			var max = (Math.round(inc * this.y(0)) + 1) * inv;
			var min = (Math.round(inc * this.y(this.Cn.getHeight()))) * inv;
			for (var i = min; i < max; i += inv) {
					var j = (Math.round(inc * i)) * inv;
					var y = Math.round(this.py(j));
					ctx.beginPath();
					ctx.moveTo(0, y);
					ctx.lineTo(this.Cn.getWidth(), y);
					ctx.stroke();
			}
	}
	private paintGradx(ctx) {
			var y = Math.min(Math.max(this.y0, 0), this.Cn.getHeight());
			var log = Math.floor($U.log(this.Unit / this.P.grid.limitinf));
			var inc = Math.pow(10, log);
			var inv = Math.pow(10, -log);
			var min = (Math.round(inc * this.x(0))) * inv;
			var max = (Math.round(inc * this.x(this.Cn.getBounds().width)) + 1) * inv;
			var y1 = Math.round(y - this.P.grid.smalltick) - this.P.grid.axis_linewidth;
			var y2 = Math.round(y + this.P.grid.smalltick) + this.P.grid.axis_linewidth;
			for (var i = min; i < max; i += inv) {
					var j = (Math.round(inc * i)) * inv;
					var x = Math.round(this.px(j));
					ctx.beginPath();
					ctx.moveTo(x, y1);
					ctx.lineTo(x, y2);
					ctx.stroke();
			}
			inc /= 5;
			inv *= 5;
			min = (Math.round(inc * this.x(0))) * inv;
			max = (Math.round(inc * this.x(this.Cn.getBounds().width)) + 1) * inv;
			y1 = Math.round(y - this.P.grid.longtick) - this.P.grid.axis_linewidth;
			y2 = Math.round(y + this.P.grid.longtick) + this.P.grid.axis_linewidth;
			var prec = (log < 0) ? 0 : log;
			ctx.textAlign = "center";
			ctx.fillStyle = this.P.grid.grid_color;
			ctx.font = this.P.grid.fontsize + "px " + this.P.grid.font;
			for (var i = min; i < max; i += inv) {
					var j = (Math.round(inc * i)) * inv;
					var x = Math.round(this.px(j));
					var test = (!this.isOy()) ? true : (j !== 0);
					if (test) {
							ctx.beginPath();
							ctx.moveTo(x, y1);
							ctx.lineTo(x, y2);
							ctx.stroke();
							if (this.y0 > y) {
									ctx.fillText($L.number(j.toFixed(prec)), x, y1 - this.P.grid.fontsize / 2);
							} else {
									ctx.fillText($L.number(j.toFixed(prec)), x, y2 + this.P.grid.fontsize);
							}
					}
			}
	}
	private paintGrady(ctx) {
			var x = Math.min(Math.max(this.x0, 0), this.Cn.getWidth());
			var log = Math.floor($U.log(this.Unit / this.P.grid.limitinf));
			var inc = Math.pow(10, log);
			var inv = Math.pow(10, -log);
			var max = (Math.round(inc * this.y(0)) + 1) * inv;
			var min = (Math.round(inc * this.y(this.Cn.getHeight()))) * inv;
			var x1 = Math.round(x - this.P.grid.smalltick) - this.P.grid.axis_linewidth;
			var x2 = Math.round(x + this.P.grid.smalltick) + this.P.grid.axis_linewidth;
			for (var i = min; i < max; i += inv) {
					var j = (Math.round(inc * i)) * inv;
					var y = Math.round(this.py(j));
					ctx.beginPath();
					ctx.moveTo(x1, y);
					ctx.lineTo(x2, y);
					ctx.stroke();
			}
			inc /= 5;
			inv *= 5;
			max = (Math.round(inc * this.y(0)) + 1) * inv;
			min = (Math.round(inc * this.y(this.Cn.getHeight()))) * inv;
			x1 = Math.round(x - this.P.grid.longtick) - this.P.grid.axis_linewidth;
			x2 = Math.round(x + this.P.grid.longtick) + this.P.grid.axis_linewidth;
			var prec = (log < 0) ? 0 : log;
			ctx.textAlign = "left";
			ctx.fillStyle = this.P.grid.grid_color;
			ctx.font = this.P.grid.fontsize + "px " + this.P.grid.font;
			for (var i = min; i < max; i += inv) {
					var j = (Math.round(inc * i)) * inv;
					var y = Math.round(this.py(j));
					var test = (!this.isOx()) ? true : (j !== 0);
					if (test) {
							ctx.beginPath();
							ctx.moveTo(x1, y);
							ctx.lineTo(x2, y);
							ctx.stroke();
							var num = $L.number(j.toFixed(prec));
							if (this.x0 < 0) {
									ctx.fillText(num, x2 + 2, y + this.P.grid.fontsize / 2 - 2);
							} else {
									var w = ctx.measureText(num).width;
									ctx.fillText(num, x1 - w - 2, y + this.P.grid.fontsize / 2 - 2);
							}
					}
			}
	}
	paintGrid(ctx) {
			ctx.lineWidth = this.P.grid.grid_linewidth;
			this.paintGridx(ctx);
			this.paintGridy(ctx);
	}
	paintOx(ctx) {
			ctx.lineWidth = this.P.grid.tick_linewidth;
			this.paintGradx(ctx);
			ctx.lineWidth = this.P.grid.axis_linewidth;
			this.paintOx(ctx);
	}
	paintOy(ctx) {
			ctx.lineWidth = this.P.grid.tick_linewidth;
			this.paintGrady(ctx);
			ctx.lineWidth = this.P.grid.axis_linewidth;
			this.paintOy(ctx);
	}
	paintAll(ctx) {
			ctx.globalAlpha = 1;
			ctx.fillStyle = this.P.grid.grid_color;
			ctx.strokeStyle = this.P.grid.grid_color;
			this.paint_Grid(ctx);
			this.paint_Ox(ctx);
			this.paint_Oy(ctx);
	}
	setOX(_ox) {
			this.OX = _ox;
	}
	setOY(_oy) {
			this.OY = _oy;
	}
	showCS(_v) {
			this.paint = (_v) ? this.paintAll : $U.nullproc;
			if (_v) {
					if (!this.OX) {
							this.OX = new OXObject(this.Cn, "ox");
							this.Cn.add(this.OX);
							this.OX.compute();
					}
					if (!this.OY) {
							this.OY = new OYObject(this.Cn, "oy");
							this.Cn.add(this.OY);
							this.OY.compute();
					}
			}
	}
	isCS() {
			return (this.paint === this.paintAll);
	}
	showGrid(_v) {
			this.paint_Grid = (_v) ? this.paintGrid : $U.nullproc;
	}
	isGrid() {
			return (this.paint_Grid === this.paintGrid);
	}
	showOx(_v) {
			this.paint_Ox = (_v) ? this.paintOx : $U.nullproc;
	}
	isOx() {
			return (this.paint_Ox === this.paintOx);
	}
	showOy(_v) {
			this.paint_Oy = (_v) ? this.paintOy : $U.nullproc;
	}
	isOy() {
			return (this.paint_Oy === this.paintOy);
	}
	setColor(_c) {
			this.P.grid.grid_color = _c;
	}
	getColor() {
			return this.P.grid.grid_color;
	}
	getFontSize() {
			return this.P.grid.fontsize;
	}
	setFontSize(_s) {
			this.P.grid.fontsize = _s;
	}
	getAxisWidth() {
			return this.P.grid.axis_linewidth;
	}
	setAxisWidth(_s) {
			this.P.grid.axis_linewidth = _s;
	}
	getGridWidth() {
			return this.P.grid.grid_linewidth;
	}
	setGridWidth(_s) {
			this.P.grid.grid_linewidth = _s;
	}
	setlockOx(_l) {
			this.lockOx = _l;
	}
	islockOx() {
			return this.lockOx;
	}
	setlockOy(_l) {
			this.lockOy = _l;
	}
	islockOy() {
			return this.lockOy;
	}
	setCenterZoom(_b) {
			this.centerZoom = _b;
	}
	isCenterZoom(_b?) {
			return this.centerZoom;
	}
	getSource() {
			var mode3d = (this.Cn.is3D()) ? ",true" : "";
			var txt = "SetCoords(" + this.x0 + "," + this.y0 + "," + this.Unit + mode3d + ");\n";
			return txt;
	}
	getStyle() {
			var t = "SetCoordsStyle(\"";
			if (this.Cn.is3D())
					t += "3Dmode:true;";
			t += "isAxis:" + this.isCS();
			t += ";isGrid:" + this.isGrid();
			t += ";isOx:" + this.isOx();
			t += ";isOy:" + this.isOy();
			t += ";isLockOx:" + this.islockOx();
			t += ";isLockOy:" + this.islockOy();
			t += ";centerZoom:" + this.isCenterZoom();
			t += ";color:" + this.getColor();
			t += ";fontSize:" + this.getFontSize();
			t += ";axisWidth:" + this.getAxisWidth();
			t += ";gridWidth:" + this.getGridWidth();
			t += "\");\n";
			return t;
	}
}
