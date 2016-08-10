
import {TwoPointsLineObject} from './TwoPointsLineObject';
import {VirtualPointObject} from './VirtualPointObject';

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class RayObject extends TwoPointsLineObject {
	constructor(_construction:iConstruction, _name:string, _P1, _P2) {
		super(_construction, _name, _P1, _P2, true);
		// var superObject = $U.extend(this, new TwoPointsLineObject(_construction, _name, _P1, _P2, true)); // Héritage
		this.setParent(this.P1, this.P2);
		this.setDefaults("segment");
	}
	getCode(): string {
		return "segment";
	}
	getAssociatedTools(): string {
		return super.getAssociatedTools() + ",midpoint,perpbis";
	}
	getValue(): number {
		return this.getCn().coordsSystem.l($U.d(this.P1, this.P2));
	}
	setAlpha(p) {
		super.setAlpha(p);
		var a = p.getAlpha();
		if (a < 0) {
			p.setAlpha(0);
		}
		if (a > 1) {
			p.setAlpha(1);
		}
	}
	// ****************************************
	// **** Uniquement pour les animations ****
	// ****************************************
	getAlphaBounds(anim): number[] {
		var inc = anim.direction * (anim.speed * anim.delay / 1000) / $U.d(this.P1, this.P2);
		return [0, 1, inc]
	}
	// ****************************************
	// ****************************************
	// Pour les objets "locus". Initialise le polygone à partir de la donnée
	// du nombre _nb de sommets voulus :
	initLocusArray(_nb) {
		var aMin = 0,
			aMax = 1;
		var step = (aMax - aMin) / (_nb - 1);
		var Ptab = []; // Liste des sommets du polygone représentant le lieu
		// Initialisation de Ptab :
		for (var i = 0; i < _nb; i++) {
			Ptab.push({
				"alpha": aMin + step * i,
				"x": 0,
				"y": 0,
				"x1": 0,
				"y1": 0,
				"r": 0
			});
		}
		return Ptab;
	}
	setLocusAlpha(p, a) {
		var xA = this.P1.getX();
		var yA = this.P1.getY();
		var xB = this.P2.getX();
		var yB = this.P2.getY();
		p.setXY(xA + a * (xB - xA), yA + a * (yB - yA));
	}
	getXmax(): number {
		return this.P1.getX();
	}
	getYmax(): number {
		return this.P1.getY();
	}
	getXmin(): number {
		return this.P2.getX();
	}
	getYmin(): number {
		return this.P2.getY();
	}
	//    redefine(_old,_new) {
	////        super.redefine(_old,_new);
	//        console.log("redefine fonction");
	//        if (_old === this.P2) {
	//            console.log("redefine P2 !");
	//            this.deleteParent(_old);
	//            this.addParent(_new);
	//            _old.deleteChild(this);
	//            _new.addChild(this);
	////            childs[i].deleteParent(_o);
	////            _o.deleteChild(childs[i]);
	////            childs[i].addParent(this);
	////            this.addChild(childs[i]);
	//            
	//            
	//            this.P2=_new;
	//        }
	//    };
	//// Seulement pour les macros. Permet de désigner un segment comme initial,
	//// avec les extrémités comme intermédiaires automatiques :
	//    getMacroSource(src) {
	//        src.geomWrite(false, this.getP1().getName(), "First", this.getName());
	//        src.geomWrite(false, this.getP2().getName(), "Second", this.getName());
	//    };
	//    setMacroAutoObject() {
	//
	//        var p1 = this.getP1();
	//        var p2 = this.getP2();
	//        var s = this;
	//        var proc1 = function(src) {
	//            src.geomWrite(false, p1.getName(), "First", s.getVarName());
	//        };
	//        var proc2 = function(src) {
	//            src.geomWrite(false, p2.getName(), "Second", s.getVarName());
	//        };
	//
	//        // Défini les extrémités comme intermédiaire :
	//        p1.setMacroMode(1);
	//        p2.setMacroMode(1);
	//
	//        // Attache les getSources aux extrémités :
	//        p1.setMacroSource(proc1);
	//        p2.setMacroSource(proc2);
	//    };
	//
	//// For macro process only :
	//    isAutoObjectFlags() {
	//        return (this.getP1().Flag || this.getP2().Flag);
	//    };
	isInstanceType(_c): boolean {
		return _c === "line" || _c === "segment";
	}
	// see if point inside 2 border points
	checkIfValid(_P) {
		var xPA = this.P1.getX() - _P.getX();
		var yPA = this.P1.getY() - _P.getY();
		var xPB = this.P2.getX() - _P.getX();
		var yPB = this.P2.getY() - _P.getY();
		if ((xPA * xPB + yPA * yPB) > 0) {_P.setXY(NaN, NaN);}
	}
	mouseInside(event:MouseEvent) {
		return $U.isNearToSegment(this.P1.getX(), this.P1.getY(), this.P2.getX(), this.P2.getY(), this.mouseX(event), this.mouseY(event), this.getOversize());
	}
	paintLength(ctx:CanvasRenderingContext2D) {
		ctx.save();
		var a = Math.atan2(this.P2.getY() - this.P1.getY(), this.P2.getX() - this.P1.getX());
		if ((a < -$U.halfPI) || (a > $U.halfPI)) {
			a += Math.PI;
		}
		ctx.textAlign = "center";
		ctx.fillStyle = ctx.strokeStyle;
		ctx.translate((this.P1.getX() + this.P2.getX()) / 2, (this.P1.getY() + this.P2.getY()) / 2);
		ctx.rotate(a);
		var prec = this.getPrecision();
		var display = Math.round($U.d(this.P1, this.P2) / this.getUnit() * prec) / prec;
		ctx.fillText($L.number(display), 0, -this.prefs.fontmargin - this.getRealsize() / 2);
		ctx.restore();
	}
	paintObject(ctx:CanvasRenderingContext2D) {
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(this.P1.getX(), this.P1.getY());
		ctx.lineTo(this.P2.getX(), this.P2.getY());
		ctx.stroke();
		ctx.lineCap = 'butt';
	}
	getSource(src) {
		src.geomWrite(false, this.getName(), "Segment", this.P1.getVarName(), this.P2.getVarName());
	}
}
