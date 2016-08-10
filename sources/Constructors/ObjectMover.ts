/// <reference path="../typings/iCanvas.d.ts" />

import {ObjectConstructor} from './ObjectConstructor';

var $U = (<any>window).$U;

export class ObjectMover extends ObjectConstructor {
	private draggedObject;
	private x0: number;
	private y0: number;
	constructor() {
		super();
    this.draggedObject = null;
		this.x0 = 0,
		this.y0 = 0;
	}
	getCode(): string {
		return "objectmover";
	}
	// Retourne 0 pour un outil standard, 1 pour un outil de changement de propriété
	getType(): number {
		return 1;
	}
	isAcceptedInitial(o): boolean {
		return true;
	}
	createObj(_, __) {
		this.draggedObject = null;
	}
	selectCreatePoint(_, __) { }
	preview(event:MouseEvent, zc:iCanvas) {
		if (this.draggedObject) {
			this.draggedObject.dragTo(zc.mouseX(event) + this.x0, zc.mouseY(event) + this.y0);
			zc.getConstruction().compute();
		} else {
			this.draggedObject = this.getC(0);
			if ((this.draggedObject) && (this.draggedObject.getFamilyCode() === "point")) {
				this.x0 = this.draggedObject.getX() - zc.mouseX(event);
				this.y0 = this.draggedObject.getY() - zc.mouseY(event);
			} else {
				this.x0 = 0;
				this.y0 = 0;
			}
			if (this.draggedObject) this.draggedObject.startDrag(zc.mouseX(event) + this.x0, zc.mouseY(event) + this.y0);
		}
	}
}
