/// <reference path="../typings/Constructors/iPointConstructor.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';
import {PointObject} from '../Objects/PointObject';
import {Expression} from '../Expression';

export class PointConstructor extends ObjectConstructor implements iPointConstructor {
	constructor() {
		super();
		//$U.extend(this, new ObjectConstructor()); //Héritage
	}
	getCode(): string {
		return 'point';
	}
	getInitials(): string[] {
		return ['line,circle,locus,function,quadric,area,circle3pts3D,list', 'line,circle,quadric'];
	}
	createObj(zc, ev): iPointObject {
		var o = new PointObject(zc.getConstruction(), '_P', zc.mouseX(ev), zc.mouseY(ev));
		zc.addObject(o);
		zc.namesManager.setName(o);
		var deps = this.getCList();
		deps.sort(this.indsSortFilter);
		var len = deps.length;
		switch (len) {
			case 1:
				// On veut créer un point sur objet :
				o.addParent(deps[0]);
				deps[0].project(o);
				deps[0].setAlpha(o);
				deps[0].setBoundaryMode(o);
				// o.setAnimation(10, -1, true);
				break;
			case 2:
				// On veut créer un point d'intersection :
				if (deps[0].isCoincident(deps[1])) {
					// Si les objets sont confondus, on crée un point sur objet :
					o.addParent(deps[0]);
					deps[0].project(o);
					deps[0].setAlpha(o);
				} else {
					// Sinon un point d'intersection :
					o.addParent(deps[0]);
					o.addParent(deps[1]);
					deps[0].initIntersect2(deps[1], o);
				}
				break;
		}
		o.setFillStyle();
		Expression.fixAll();
		o.compute();
		return o;
	}
	preview(ev, zc) {
		var deps = this.getCList();
		var len = deps.length;
		if (len > 0) {
			deps.sort(this.indsSortFilter);
			var size = zc.prefs.size.point;
			if (Object.touchpad) {
				size *= zc.prefs.size.touchfactor;
			}
			var coords;
			switch (len) {
				case 1:
					// point sur objet :
					coords = deps[0].projectXY(zc.mouseX(ev), zc.mouseY(ev));
					break;
				case 2:
					// point d'intersection :
					if (deps[0].isCoincident(deps[1])) {
						// Si les objets sont confondus, on prévisualise un point sur objet :
						coords = deps[0].projectXY(zc.mouseX(ev), zc.mouseY(ev));
					} else {
						coords = deps[0].intersectXY(deps[1], zc.mouseX(ev), zc.mouseY(ev));
					}
					break;
			}
			var ctx = zc.getContext();
			ctx.fillStyle = zc.prefs.color.hilite;
			ctx.strokeStyle = zc.prefs.color.hilite;
			ctx.lineWidth = zc.prefs.size.pointborder;
			ctx.beginPath();
			ctx.arc(coords[0], coords[1], size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			ctx.stroke();
		}
	}
	private indsSortFilter(a, b) {
		return a.isInstanceType('line') ? -1 : 1;
	}
}
