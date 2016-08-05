/// <reference path="../typings/iCanvas.d.ts" />

import {TextObject} from '../Text/TextObject';

var $U = (<any>window).$U;

type UndoAction = {add:boolean, target:any};

export class UndoManager implements iUndoManager {
	private canvas: iCanvas;
	private Cn;
	private actions: UndoAction[];
	private cursor: number;
	private Cmarker: number; // Marqueur pour les objets de la construction
	private Tmarker: number; // Marqueur pour les textes
	private ADD: boolean;
	private REMOVE: boolean;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
		this.Cn = canvas.getConstruction();
		this.actions = [];
		this.cursor = 0;
		this.Cmarker = null; // Marqueur pour les objets de la construction
		this.Tmarker = null; // Marqueur pour les textes
		this.ADD = true;
		this.REMOVE = false;
	}
	clear() {
		this.actions = [];
		this.cursor = 0;
		this.refreshCanvas();
	}
	record(target, add:boolean) {
		if (this.cursor < this.actions.length) {this.clear();}
		this.cursor++;
		this.actions.push({add,target});
		this.setBtns();
	}
	undo() {
		if (this.cursor > 0) {
			this.undo_redo(this.cursor - 1);
			this.cursor--;
		}
		this.refreshCanvas();
	}
	redo() {
		if (this.cursor < this.actions.length) {
			this.undo_redo(this.cursor);
			this.cursor++;
		}
		this.refreshCanvas();
	}
	beginAdd() {
		this.Cmarker = this.Cn.elements().length;
		this.Tmarker = this.canvas.textManager.elements().length;
	}
	endAdd() {
		if (this.Cmarker === null && this.Tmarker === null) {return;}
		let elements = [];
		let v = this.Cn.elements();
		let t = this.canvas.textManager.elements();
		let i=this.Cmarker, s=v.length;
		while (i<s) {elements.push(v[i++]);}
		i=this.Tmarker, s=t.length;
		while (i<s) {elements.push(t[i++]);}
		if (elements.length > 0) {this.record(elements, true);}
		this.Cmarker = null;
		this.Tmarker = null;
	}
	deleteObjs(_t) {
		if (_t.length > 0) {this.record(_t, false);}
	}
	swap(withTarget) {
		let i=0, s=this.actions.length;
		while (i<s) {
			let action = this.actions[i++];
			let target = action.target;
			let tab = $U.isArray(target) ? target : [target];
			if (tab.length === 1 && tab[0] === withTarget) {action.add = !action.add;}
			i++;
		}
	}
	setBtns() {
		this.canvas.setUndoBtn(!this.isLeft());
		this.canvas.setRedoBtn(!this.isRight());
	}

	private isLeft() {
		return this.cursor === 0;
	}
	private isRight() {
		return this.cursor === this.actions.length;
	}
	private refreshCanvas() {
		let simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent("mouseup", true, true, window, 1, -100, -100, -100, -100, false,
				false, false, false, 0, null);
		this.Cn.validate(simulatedEvent);
		this.Cn.computeAll();
		this.canvas.paint(simulatedEvent);
		this.setBtns();
	}
	private add(txt:iTextObject|any) {
		let textElement = txt;
		if (txt instanceof TextObject) {
			textElement = this.canvas.textManager.add(txt);
		} else {
			// what is it then?
			this.Cn.add(txt);
			txt.setParentList(txt.getParent());
		}
		return textElement;
	}
	private remove(txt:iTextObject|any) {
		if (txt instanceof TextObject) {
			this.canvas.textManager.deleteTeX(txt);
		} else {
			// what is it then?
			this.Cn.remove(txt);
		}
	}
	private undo_redo(index:number) {
		let action = this.actions[index];
		action.add = !action.add;
		let tab = $U.isArray(action.target) ? action.target : [action.target];
		let i=0, s=tab.length;
		while (i<s) {
			if (action.add) {
				tab[i] = this.add(tab[i]);
				// Cn.add(tab[i]);
			} else {
				this.remove(tab[i]);
				// Cn.remove(tab[i]);
				// if (t.add)
				// tab[i].setParentList(tab[i].getParent());
			}
			i++;
		}
	}
}
