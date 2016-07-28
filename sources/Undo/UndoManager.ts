
//import {TextObject} from '../TextObject';

var TextObject = (<any>window).TextObject;
var $U = (<any>window).$U;

export class UndoManager {
	private canvas;
	private Cn;
	private actions = [];
	private cursor = 0;
	private Cmarker = null; // Marqueur pour les objets de la construction
	private Tmarker = null; // Marqueur pour les textes
	private ADD = true;
	private REMOVE = false;
	constructor(canvas) {
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
	record(_t, _add) {
		if (this.cursor < this.actions.length) {
			this.clear();
		}
		this.cursor++;
		this.actions.push({add: _add, target: _t});
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
		if ((this.Cmarker === null) && (this.Tmarker === null))
			return;
		var v = this.Cn.elements();
		var t = this.canvas.textManager.elements();
		var elts = [];
		for (var m = this.Cmarker; m < v.length; m++) {
			elts.push(v[m]);
		}
		for (var m = this.Tmarker; m < t.length; m++) {
			elts.push(t[m]);
		}
		if (elts.length > 0) {
			this.record(elts, true);
		}
		this.Cmarker = null;
		this.Tmarker = null;
	}
	deleteObjs(_t) {
		if (_t.length > 0)
			this.record(_t, false);
	}
	swap(_o) {
		for (var i = 0; i < this.actions.length; i++) {
			var tab = ($U.isArray(this.actions[i].target)) ? this.actions[i].target : [this.actions[i].target];
			if ((tab.length === 1) && (tab[0] === _o))
				this.actions[i].add = !this.actions[i].add;
		}
	}
	setBtns() {
		this.canvas.setUndoBtn(!this.isLeft());
		this.canvas.setRedoBtn(!this.isRight());
	}

	private isLeft = function() {
		return (this.cursor === 0);
	}
	private isRight = function() {
		return (this.cursor === this.actions.length);
	}
	private refreshCanvas = function() {
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent("mouseup", true, true, window, 1, -100, -100, -100, -100, false,
				false, false, false, 0, null);
		this.Cn.validate(simulatedEvent);
		this.Cn.computeAll();
		this.canvas.paint(simulatedEvent);
		this.setBtns();
	}
	private add = function(_o) {
		var _el = _o;
		if (_o instanceof TextObject) {
			_el = this.canvas.textManager.add(_o)
		} else {
			this.Cn.add(_o);
			_o.setParentList(_o.getParent());
		}
		return _el;
	}
	private remove = function(_o) {
		if (_o instanceof TextObject) {
			this.canvas.textManager.deleteTeX(_o);
		} else {
			this.Cn.remove(_o);
		}
	}
	private undo_redo = function(k) {
		var t = this.actions[k];
		t.add = !t.add;
		var tab = ($U.isArray(t.target)) ? t.target : [t.target];
		var len = tab.length;
		for (var i = 0; i < len; i++) {
			if (t.add)
				tab[i] = this.add(tab[i]);
				//                Cn.add(tab[i]);
			else
				this.remove(tab[i]);
				//                Cn.remove(tab[i]);
				//            if (t.add)
				//                tab[i].setParentList(tab[i].getParent());
		}
	}
}
