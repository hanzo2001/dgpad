/// <reference path="../typings/iCoincedences.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {BubblePanel} from '../GUI/panels/BubblePanel';

var $L = (<any>window).$L;

export class CoincidenceManager implements iCoincedences {
	private canvas: iCanvas;
	private panel: BubblePanel;
	private event: MouseEvent;
	constructor(_canvas:iCanvas) {
		this.canvas = _canvas;
		this.panel = null;
		this.event = null;
	}
	checkCoincidences(event:MouseEvent): boolean {
		// On récupère dans un tableau tous les objets situés
		// sous le clic de souris ou le tap :
		var t = this.canvas.getConstruction().getObjectsUnderMouse(event);
		if (t.length < 2) {return false;}
		// On va trier le tableau par famille d'objets :
		var len = t.length;
		for (var i = 0; i < len; i++) {
			t[i].Scratch = this.priority(t[i]);
		}
		t.sort(this.sortFilter);
		var i = 1;
		while ((i < len) && (t[i].Scratch === t[0].Scratch)) {i++;}
		// On ne va garder dans ce tableau que les objets d'une même
		// famille (selon la priorité définie dans priority) :
		t = t.slice(0, i);
		if (t.length < 2) {return false;}
		// Il faut ensuite que les objets soient confondus :
		if (this.canvas.getConstruction().isMode(1)) {
			for (var i = 1, len = t.length; i < t.length; i++) {
				if (!t[0].isCoincident(t[i])) {return false;}
			}
		}
		// Si on arrive jusqu'ici, c'est qu'il y a ambiguité :
		for (var i = 0; i < t.length; i++) {
			t[i] = [t[i].getName() + ': ' + $L.object[t[i].getCode()], t[i]];
			if (t[i][1].isHidden()) t[i].push('#777');
			else t[i].push(t[i][1].getColor().getHEX());
		}
		this.event = event;
		this.panel = new BubblePanel(this.canvas, (a)=>this.exec(a), ()=>this.close(), event, t, $L.coincidence_message + ' : ' + $L.coincidence_select.replace('$1', t.length), 270, 190, 50);
		// var cp = new CoincidencePanel(this.canvas, ev, t);
		// for (var i = 0, len = t.length; i < t.length; i++) {
		// 	console.log(t[i].getName() + ' ' + t[i].Scratch);
		// }
		return true;
		// console.log(t);
	}
	isVisible(): boolean {
		return (this.panel && this.panel.isVisible());
	};
	close() {
		this.panel = null;
	}
	exec(_o) {
		var cn = this.canvas.getConstruction();
		cn.clearIndicated();
		cn.clearSelected();
		cn.addSelected(_o);
		this.canvas.paint(this.event);
		this.canvas.initTools(this.event, _o);
	}
	private priority(_o): number {
		switch (_o.getFamilyCode()) {
			case 'point': return 0;
			case 'line':  return 1;
			case 'circle':return 2;
			case 'locus': return 3;
			case 'angle': return 4;
			case 'area':  return 5;
			default:      return 10;
		}
	}
	private sortFilter(_a, _b): number {
		return (_a.Scratch - _b.Scratch);
	}
}
