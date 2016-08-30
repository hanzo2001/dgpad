/// <reference path="../typings/iCoincedences.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {BubblePanel} from '../GUI/panels/BubblePanel';

var $L = (<any>window).$L;

let priorities:{[code:string]:number} = {
	'point' : 0,
	'line'  : 1,
	'circle': 2,
	'locus' : 3,
	'angle' : 4,
	'area'  : 5
}

function getPriority(o:iConstructionObject) {
	let p = priorities[o.getFamilyCode()];
	return p === undefined ? 10 : p;
}

export class CoincidenceManager implements iCoincidenceManager {
	private canvas: iCanvas;
	private panel: BubblePanel;
	private event: MouseEvent;
	constructor(canvas:iCanvas) {
		this.canvas = canvas;
		this.panel = null;
		this.event = null;
	}
	checkCoincidences(event:MouseEvent): boolean {
		let Cn = this.canvas.getConstruction();
		// On récupère dans un tableau tous les objets situés
		// sous le clic de souris ou le tap :
		var t = Cn.getObjectsUnderMouse(event);
		if (t.length < 2) {return false;}
		// On va trier le tableau par famille d'objets :
		var len = t.length;
		let i=0, s=t.length;
		//while (i<s) {t[i++].Scratch = this.priority(t[i]);}// attach priority to object
		let sorter = (a:iConstructionObject, b:iConstructionObject) => getPriority(a) - getPriority(b);
		t.sort(sorter);
		i=1;
		while (i<s && t[i].Scratch === t[0].Scratch) {i++;}
		// On ne va garder dans ce tableau que les objets d'une même
		// famille (selon la priorité définie dans priority) :
		t = t.slice(0, i);
		if (t.length < 2) {return false;}
		// Il faut ensuite que les objets soient confondus :
		if (Cn.isMode(1)) {
			i=1, s=t.length;
			while (i<s) {if (!t[0].isCoincident(t[i++])) {return false;}}
		}
		// Si on arrive jusqu'ici, c'est qu'il y a ambiguité :
		i=0, s=t.length;
		while (i<s) {
			t[i] = [t[i].getName() + ': ' + $L.object[t[i].getCode()], t[i]];
			let color = t[i][1].isHidden() ? '#777' : t[i][1].getColor().getHEX();
			t[i++].push(color);// this is a very mixed array
		}
		this.event = event;
		this.panel = new BubblePanel(this.canvas, (a)=>this.exec(a), ()=>this.close(), event, t, $L.coincidence_message + ' : ' + $L.coincidence_select.replace('$1', t.length), 270, 190, 50);
		return true;
	}
	isVisible(): boolean {
		return (this.panel && this.panel.isVisible());
	}
	close() {
		this.panel = null;
	}
	exec(o:iConstructionObject) {
		var cn = this.canvas.getConstruction();
		cn.clearIndicated();
		cn.clearSelected();
		cn.addSelected(o);
		this.canvas.paint(this.event);// premature paint?
		this.canvas.initTools(this.event, o);
	}
	/*
	private priority(o): number {
		switch (o.getFamilyCode()) {
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
	*/
}
