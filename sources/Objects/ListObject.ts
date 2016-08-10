/// <reference path="../typings/Objects/iListObject.d.ts" />

import {ConstructionObject} from './ConstructionObject';

class LocusPoint {
	constructor(
		public alpha:number,
		public x:number  = 0,
		public y:number  = 0,
		public x1:number = 0,
		public y1:number = 0,
		public r:number  = 0
	) {}
}

class Point {
	fill: number;
	text: string[];
	constructor(
		public x:number,
		public y:number,
		public tab:number[],
		public r:number,
		public g:number,
		public b:number,
		public rgb:string,
		public sz:number,
		public pz:number,
		public fnt:any[]
	) {}
}

type LocusPointTable = LocusPoint[];

var $U = (<any>window).$U;

// Liste de points (reliés ou non) :
export class ListObject extends ConstructionObject implements iListObject {
	private ORG3D;
	private pt3D;
	private EXP;
	private Ptab: Point[];
	private arrow: number[];
	private fillStyle;
	private segSize: number;
	private shape: number;
	private paintPoint: (i:number, ctx:CanvasRenderingContext2D) => void;
	private colors: string[];
	constructor(_construction, _name, _EXP) {
		super(_construction, _name);
		//$U.extend(this, new ConstructionObject(_construction, _name)); // Héritage
		//$U.extend(this, new MoveableObject(_construction)); // Héritage
		this.Cn = _construction;
		this.ORG3D = null;
		this.pt3D = this.Cn.getInterpreter().getEX().EX_point3D; // Pour les points3D
		this.EXP = _EXP; // Expression contenant la liste de points (ou points3D)
		this.Ptab = []; // Tableau de points
		this.arrow = null; // Flèches en bout de segments
		this.fillStyle = this.prefs.color.point_free;
		this.segSize = -1; // Taille des segments
		this.shape = 0; // Apparence des points
		this.paintPoint = this.paintCircle;
		this.colors = ["#ffffff", "#cccccc", "#c0c0c0", "#999999", "#666666", "#333333", "#000000", "#ffcccc", "#ff6666", "#ff0000", "#cc0000", "#990000", "#660000", "#330000", "#ffcc99", "#ff9966", "#ff9900", "#ff6600", "#cc6600", "#993300", "#663300", "#ffff99", "#ffff66", "#ffcc66", "#ffcc33", "#cc9933", "#996633", "#663333", "#ffffcc", "#ffff33", "#ffff00", "#ffcc00", "#999900", "#666600", "#333300", "#99ff99", "#66ff99", "#33ff33", "#33cc00", "#009900", "#006600", "#003300", "#99ffff", "#33ffff", "#66cccc", "#00cccc", "#339999", "#336666", "#003333", "#ccffff", "#66ffff", "#33ccff", "#3366ff", "#3333ff", "#000099", "#000066", "#ccccff", "#9999ff", "#6666cc", "#6633ff", "#6600cc", "#333399", "#330099", "#ffccff", "#ff99ff", "#cc66cc", "#cc33cc", "#993399", "#663366", "#330033"];
		this.initPtab();
		this.setParent(this.EXP);
		this.setDefaults("list");
	}
	setArrow(_t) {
		this.arrow = (_t && (_t.length === 2) && (_t[0]) && (_t[1])) ? _t : null;
	}
	getArrow(): number[] {
		return this.arrow;
	}
	getEXP() {
		return this.EXP;
	}
	setSegmentsSize(size:number) {
		this.segSize = size;
	}
	getSegmentsSize(): number {
		return this.segSize;
	}
	getAssociatedTools(): string {
		return "@callproperty,@calltrash,@callcalc,@calllist,point";
	}
	isInstanceType(_c): boolean {
		return (_c === "list");
	}
	getCode(): string {
		return "list";
	}
	getFamilyCode(): string {
		return "list";
	}
	setShape(shape:number) {
		this.shape = shape;
		switch (this.shape) {
			case 0: this.paintPoint = this.paintCircle; break;
			case 1: this.paintPoint = this.paintCross; break;
			case 2: this.paintPoint = this.paintDiamond; break;
			case 3: this.paintPoint = this.paintSquare; break;
		}
	}
	getShape(): number {
		return this.shape;
	}
	getPtNum(_i:number): number[] {
		var k = 0;
		let i=0, s=this.Ptab.length;
		while (i<s) {
			if (!isNaN(this.Ptab[i].x) || !isNaN(this.Ptab[i].y)) {k++;}
			if (k === _i) {return this.Ptab[i].tab;}
			i++;
		}
		return [NaN, NaN];
	}
	getPtLength(): number {
		var k = 0;
		let i=0, s=this.Ptab.length;
		while (i<s) {
			if (!isNaN(this.Ptab[i].x) || !isNaN(this.Ptab[i].y)) {k++;}
			i++;
		}
		return k;
	}
	projectXY(x:number, y:number): number[] {
		// console.log("this.Ptab="+this.Ptab);
		var p = this.Ptab[0];
		var x1 = p.x;
		var y1 = p.y;
		var count = 0;
		var xmin = x1;
		var ymin = y1;
		var dmin = 1e20;
		var cmin = 0;
		let i=1, s=this.Ptab.length;
		while (i<s) {
			p = this.Ptab[i++];
			var x2 = p.x;
			var y2 = p.y;
			var dx = x2 - x1;
			var dy = y2 - y1;
			var r = dx * dx + dy * dy;
			if (r > 1e-5) {
				var h = dx * (x - x1) / r + dy * (y - y1) / r;
				if (h > 1) {
					h = 1;
				} else if (h < 0) {
					h = 0;
				}
				var xh = x1 + h * dx;
				var yh = y1 + h * dy;
				var dist2 = (x - xh) * (x - xh) + (y - yh) * (y - yh);
				if (dist2 < dmin) {
					dmin = dist2;
					xmin = xh;
					ymin = yh;
					cmin = count;
				}
			}
			count++;
			x1 = x2;
			y1 = y2;
		}
		return [xmin, ymin];
	}
	project(p) {
		// console.log("project");
		var coords = this.projectXY(p.getX(), p.getY());
		p.setXY(coords[0], coords[1]);
	}
	projectAlpha(p) {
		if ((this.Ptab.length < 2) || (this.segSize === -1)) {return;}
		var alp = p.getAlpha();
		var nb = alp[0];
		var k = alp[1];
		// S'il y a eu changement de nature du point sur, qui passe
		// d'un comportement continue à discret :
		if ((this.segSize === 0) && (k !== 0)) {
			this.setAlpha(p);
			alp = p.getAlpha();
			nb = alp[0];
			k = alp[1];
		}
		if (nb < 0) {
			nb = 0;
		} else if (nb > (this.Ptab.length - 1)) {
			nb = this.Ptab.length - 1;
		}
		if (this.segSize > 0) {
			p.setXY(this.Ptab[nb].x + k * (this.Ptab[nb + 1].x - this.Ptab[nb].x), this.Ptab[nb].y + k * (this.Ptab[nb + 1].y - this.Ptab[nb].y));
		} else {
			p.setXY(this.Ptab[nb].x, this.Ptab[nb].y);
		}
		// console.log("projectAlpha :" + this.Ptab[nb].x + "  " + this.Ptab[nb].y);
	}
	setAlpha(p) {
		if (this.Ptab.length < 2) {return;}
		var dmin = 1e20;
		var nb = 0;
		var k = 0;
		if (this.segSize > 0) {
			for (var i = 1, len = this.Ptab.length; i < len; i++) {
				var am = (this.Ptab[i - 1].x - p.getX()) * (this.Ptab[i - 1].x - p.getX()) + (this.Ptab[i - 1].y - p.getY()) * (this.Ptab[i - 1].y - p.getY());
				var mb = (this.Ptab[i].x - p.getX()) * (this.Ptab[i].x - p.getX()) + (this.Ptab[i].y - p.getY()) * (this.Ptab[i].y - p.getY());
				var ab = (this.Ptab[i].x - this.Ptab[i - 1].x) * (this.Ptab[i].x - this.Ptab[i - 1].x) + (this.Ptab[i].y - this.Ptab[i - 1].y) * (this.Ptab[i].y - this.Ptab[i - 1].y);
				var epsilon = Math.abs(Math.sqrt(ab) - Math.sqrt(am) - Math.sqrt(mb));
				if (epsilon < dmin) {
					dmin = epsilon;
					nb = i - 1;
					k = Math.sqrt(am / ab);
				}
				p.setAlpha([nb, k]);
			}
		} else {
			for (var i = 0, len = this.Ptab.length; i < len; i++) {
				var d2 = (this.Ptab[i].x - p.getX()) * (this.Ptab[i].x - p.getX()) + (this.Ptab[i].y - p.getY()) * (this.Ptab[i].y - p.getY());
				if (d2 < dmin) {
					dmin = d2;
					k = i;
				}
			}
			p.setAlpha([k, 0]);
		}
	}
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb): LocusPoint[] {
		var table = []; // Liste des sommets du polygone représentant le lieu
		// Initialisation de this.Ptab :
		let i=0, s=this.Ptab.length;
		while (i<s) {table.push(new LocusPoint(i++));}
		return table;
	}
	setLocusAlpha(p, i:number) {
		if (this.Ptab[i] !== undefined) {p.setXY(this.Ptab[i].x, this.Ptab[i].y);}
	}
	mouseInside(event:MouseEvent): boolean {
		var mx = this.mouseX(event);
		var my = this.mouseY(event);
		if (this.Ptab.length > 0) {
			if ($U.isNearToPoint(this.Ptab[0].x, this.Ptab[0].y, mx, my, this.getOversize())) {return true;}
			for (var i = 1, len = this.Ptab.length; i < len; i++) {
				let near2p = $U.isNearToPoint(this.Ptab[i].x, this.Ptab[i].y, mx, my, this.getOversize());
				if (near2p) {return true;}
				let near2s = this.segSize > 0
					? $U.isNearToSegment(this.Ptab[i - 1].x, this.Ptab[i - 1].y, this.Ptab[i].x, this.Ptab[i].y, mx, my, this.getOversize())
					: false;
				if (near2s) {return true;}
			}
		}
		return false;
	}
	compute() {
		this.initPtab();
	}
	paintObject(ctx: CanvasRenderingContext2D) {
		var hilite = ctx.strokeStyle === this.prefs.color.hilite;
		let i:number, s:number=this.Ptab.length;
		if (this.segSize > 0 && this.Ptab.length > 0) {
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			// remplissage des polygones :
			ctx.beginPath();
			ctx.lineWidth = this.segSize;
			ctx.moveTo(this.Ptab[0].x, this.Ptab[0].y);
			i=1;
			while (i<s) {
				var p = this.Ptab[i];
				if (isNaN(p.x) || isNaN(p.y) || (p.fill)) {
					if (p.fill) {
						ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.fill})`;
						ctx.lineTo(p.x, p.y);
						i--
					}
					ctx.fill();
					ctx.beginPath();
					i++
					if (i<s) {ctx.moveTo(p.x, p.y);}
				} else {
					ctx.lineTo(p.x, p.y);
				}
				i++;
			}
			ctx.fill();
			ctx.beginPath();
			ctx.lineWidth = this.segSize;
			if (hilite) {
				i=1;
				while (i<s) {
					if (isNaN(this.Ptab[i].x) || isNaN(this.Ptab[i].y)) {i++;}
					else {
						ctx.beginPath();
						ctx.moveTo(this.Ptab[i - 1].x, this.Ptab[i - 1].y);
						ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y);
						ctx.stroke();
					}
					i++;
				}
			} else {
				i=1;
				while (i<s) {
					if (isNaN(this.Ptab[i].x) || isNaN(this.Ptab[i].y)) {i++;}
					else {
						ctx.beginPath();
						ctx.moveTo(this.Ptab[i - 1].x, this.Ptab[i - 1].y);
						ctx.strokeStyle = this.Ptab[i - 1].rgb;
						ctx.lineWidth = this.Ptab[i - 1].sz;
						ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y);
						ctx.stroke();
						if (this.arrow) {
							this.paintArrow(this.Ptab[i - 1].x, this.Ptab[i - 1].y, this.Ptab[i].x, this.Ptab[i].y, ctx);
						}
					}
					i++;
				}
			}
			ctx.lineCap = "butt";
			ctx.lineJoin = "miter";
		}
		// dessin des points :
		var opaque = this.getOpacity() > 0;
		if (!opaque) ctx.fillStyle = this.fillStyle;
		ctx.lineWidth = this.prefs.size.pointborder;
		if (hilite) {
			i=0;
			while (i<s) {
				if (this.Ptab[i].pz > 1e-10) {
					ctx.beginPath();
					this.paintPoint(i, ctx);
					ctx.fill();
					ctx.stroke();
				}
				i++;
			}
		} else {
			if (opaque) {
				var glob_alpha = ctx.globalAlpha;
				i=0;
				while (i<s) {
					if (this.Ptab[i].pz > 1e-10) {
						ctx.beginPath();
						ctx.strokeStyle = this.Ptab[i].rgb;
						ctx.fillStyle = this.Ptab[i].rgb;
						ctx.globalAlpha = this.getOpacity();
						this.paintPoint(i, ctx);
						ctx.fill();
						ctx.globalAlpha = glob_alpha;
						ctx.stroke();
					}
					if (this.Ptab[i].text) {
						this.paintText(this.Ptab[i], ctx);
					}
					i++;
				}
			} else {
				i=0;
				while (i<s) {
					if (this.Ptab[i].pz > 1e-10) {
						ctx.beginPath();
						ctx.strokeStyle = this.Ptab[i].rgb;
						this.paintPoint(i, ctx);
						ctx.fill();
						ctx.stroke();
					}
					if (this.Ptab[i].text) {
						this.paintText(this.Ptab[i], ctx);
					}
					i++;
				}
			}

		}

	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "List", this.EXP.getVarName());
	}
	private paintCircle(i:number, ctx:CanvasRenderingContext2D) {
		ctx.arc(this.Ptab[i].x, this.Ptab[i].y, this.Ptab[i].pz, 0, Math.PI * 2, true);
		// ctx.arc(this.Ptab[i].x, this.Ptab[i].y, me.getRealsize(), 0, Math.PI * 2, true);
	}
	private paintCross(i:number, ctx: CanvasRenderingContext2D) {
		var sz = this.Ptab[i].pz * 0.9;
		ctx.moveTo(this.Ptab[i].x - sz, this.Ptab[i].y + sz);
		ctx.lineTo(this.Ptab[i].x + sz, this.Ptab[i].y - sz);
		ctx.moveTo(this.Ptab[i].x - sz, this.Ptab[i].y - sz);
		ctx.lineTo(this.Ptab[i].x + sz, this.Ptab[i].y + sz);
	}
	private paintSquare(i:number, ctx: CanvasRenderingContext2D) {
		var sz = this.Ptab[i].pz * 1.8;
		ctx.rect(this.Ptab[i].x - sz / 2, this.Ptab[i].y - sz / 2, sz, sz);
	}
	private paintDiamond(i:number, ctx: CanvasRenderingContext2D) {
		var sz = this.Ptab[i].pz * 1.3;
		ctx.moveTo(this.Ptab[i].x, this.Ptab[i].y - sz);
		ctx.lineTo(this.Ptab[i].x - sz, this.Ptab[i].y);
		ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y + sz);
		ctx.lineTo(this.Ptab[i].x + sz, this.Ptab[i].y);
		ctx.lineTo(this.Ptab[i].x, this.Ptab[i].y - sz);
	}
	private paintArrow(x1:number, y1:number, x2:number, y2:number, ctx: CanvasRenderingContext2D) {
		var rot = -Math.atan2(x2 - x1, y2 - y1);
		ctx.save();
		ctx.fillStyle = ctx.strokeStyle;
		ctx.translate(x2, y2);
		ctx.rotate(rot);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(-this.arrow[1], -this.arrow[0]);
		ctx.lineTo(this.arrow[1], -this.arrow[0]);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	private paintText(p:Point, ctx: CanvasRenderingContext2D) {
		var x0 = p.x;
		var y0 = p.y;
		var _t = p.text[0];
		var _u = p.text[1];
		var font = p.fnt[0];
		var size = p.fnt[1];
		var face = p.fnt[2];
		var align = p.fnt[3];
		var rot = -Math.atan2(<any>_u[1], <any>_u[0]);
		ctx.save();
		ctx.font = `${face} ${size}px ${font}`;
		ctx.textAlign = align;
		ctx.fillStyle = ctx.strokeStyle;
		ctx.translate(x0, y0);
		ctx.rotate(rot);
		// ctx.beginPath();
		// ctx.moveTo(0, 0);
		ctx.fillText(_t, 0, 0);
		ctx.restore();
	}
	private initPtab() {
		// var lst = this.EXP.getValue();
		var lst = this.EXP.getE1().forcevalue();
		// console.log(lst[0]);
		// console.log("initPtab : " + me.getName() + "  " + lst.length);
		this.Ptab.length = 0;
		var rr = this.getColor().getR();
		var gg = this.getColor().getG();
		var bb = this.getColor().getB();
		var ss = this.segSize;
		var ps = this.getRealsize();
		var ft = ["Arial", 30, "normal", "center"];
		var cn = 54;
		// var points = 0;
		var oldColStop = 0;
		if (!$U.isArray(lst)) {return;}
		for (var i = 0, len = lst.length; i < len; i++) {
			if (!$U.isArray(lst[i])) {
				this.Ptab.length = 0;
				return;
			}
			if (lst[i].length === 2) {
				// Il s'agit d'un point 2D :
				var xx = this.Cn.coordsSystem.px(lst[i][0]);
				var yy = this.Cn.coordsSystem.py(lst[i][1]);
				// points++;
				this.Ptab.push(new Point(xx,yy,lst[i],rr,gg,bb,`rgb(${rr},${gg},${bb})`,ss,ps,ft));
			} else if (lst[i].length === 3) {
				if (isNaN(lst[i][0]) && isNaN(lst[i][1]) && isNaN(lst[i][2])) {
					this.Ptab.push(new Point(NaN,NaN,lst[i],rr,gg,bb,`rgb(${rr},${gg},${bb})`,ss,ps,ft));
				} else {
					// Il s'agit d'un point 3D :
					if (this.ORG3D === null) {
						this.ORG3D = this.Cn.get3DOrigin(this);
						if (this.ORG3D === null) {
							// Aucune origine 3D n'est détectée (erreur) :
							this.Ptab.length = 0;
							return;
						}
					}
					// me.set3D(true);
					var c2d = this.pt3D([this.Cn.coordsSystem.x(this.ORG3D.getX()), this.Cn.coordsSystem.y(this.ORG3D.getY())], lst[i]);
					var xx = this.Cn.coordsSystem.px(c2d[0]);
					var yy = this.Cn.coordsSystem.py(c2d[1]);
					// points++;
					this.Ptab.push(new Point(xx,yy,lst[i],rr,gg,bb,`rgb(${rr},${gg},${bb})`,ss,ps,ft));
				}

			} else if (lst[i].length === 4) {
				if (lst[i][0] === 0) {
					// Un élément [0,r,g,b] signale un breakpoint de dégradé de couleur :
					// console.log("*********** : this.Ptab.length=" + this.Ptab.length + "  oldColStop=" + oldColStop);
					if (this.Ptab.length > oldColStop) {
						var iR = (lst[i][1] - rr) / (this.Ptab.length - oldColStop);
						var iG = (lst[i][2] - gg) / (this.Ptab.length - oldColStop);
						var iB = (lst[i][3] - bb) / (this.Ptab.length - oldColStop);
						let j=oldColStop+1, s=this.Ptab.length;
						while (j<s) {
							let k = j - oldColStop;
							var nr = Math.round(rr + k * iR);
							var ng = Math.round(gg + k * iG);
							var nb = Math.round(bb + k * iB);
							this.Ptab[j].r = nr;
							this.Ptab[j].g = ng;
							this.Ptab[j].b = nb;
							this.Ptab[j].rgb = `rgb(${nr},${ng},${nb})`;
							j++;
						}
					}
					rr = lst[i][1];
					gg = lst[i][2];
					bb = lst[i][3];
					oldColStop = this.Ptab.length;
				} else if (lst[i][0] === 1) {
					// Un élément [1,r,g,b] signale un breakpoint de changement de couleur :
					// console.log("*********** : this.Ptab.length=" + this.Ptab.length + "  oldColStop=" + oldColStop);
					rr = lst[i][1];
					gg = lst[i][2];
					bb = lst[i][3];
				} else if (lst[i][0] === 2) {
					// Un élément [2,0,0,n] signale un breakpoint de changement de couleur
					// numéroté n dans la palette 7x10
					cn = (lst[i][3] - 1) % 70; // La couleur tortue commence à 1 et non pas à 0
					var _rgb = $U.hexToRGB(this.colors[cn]);
					rr = _rgb.r;
					gg = _rgb.g;
					bb = _rgb.b;
				} else if (lst[i][0] === 3) {
					// Un élément [3,0,0,i] signale un incrément de couleur
					// (cn+i) dans la palette 7x10
					cn = (cn + lst[i][3]) % 70;
					var _rgb = $U.hexToRGB(this.colors[cn]);
					rr = _rgb.r;
					gg = _rgb.g;
					bb = _rgb.b;
				} else if (lst[i][0] === 4) {
					// Un élément [4,0,0,op] signale l'ordre de remplir avec une opacité de op%
					this.Ptab[this.Ptab.length - 1].fill = lst[i][3] / 100;

				} else if (lst[i][0] === 10) {
					// Un élément [10,0,0,sz] signale un breakpoint de taille de crayon :
					ss = lst[i][3];
				} else if (lst[i][0] === 11) {
					// Un élément [11,0,0,inc] signale un incrément de taille de crayon :
					ss += lst[i][3];
				} else if (lst[i][0] === 12) {
					// Un élément [10,0,0,sz] signale un breakpoint de taille de crayon :
					ps = lst[i][3];
				} else if (lst[i][0] === 13) {
					// Un élément [11,0,0,inc] signale un incrément de taille de crayon :
					ps += lst[i][3];
				} else if (lst[i][0] === 20) {
					// Un élément [20,0,txt,U] signale l'ordre d'écrire txt dans la direction U :
					this.Ptab[this.Ptab.length - 1].text = [lst[i][2], lst[i][3]];
				} else if (lst[i][0] === 21) {
					// Un élément [21,0,0,tab] signale un changement de style d'écriture. tab
					// représente un tableau à 4 éléments [font,size,face,align] :
					ft = lst[i][3];
				}
			} else {
				// Sinon il y a erreur dans l'expression:
				this.Ptab.length = 0;
				return;
			}
		}
		// console.log("*********");
		// for (var i = 0; i < this.Ptab.length; i++) {
		//     console.log("this.Ptab[" + i + "].r=" + this.Ptab[i].r);
		//     console.log("this.Ptab[" + i + "].g=" + this.Ptab[i].g);
		//     console.log("this.Ptab[" + i + "].b=" + this.Ptab[i].b);
		// }
	}
}
