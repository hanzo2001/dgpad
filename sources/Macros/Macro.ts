/// <reference path="../typings/iCanvas.d.ts" />
/// <reference path="../typings/GUI/iiPadDOMElt.d.ts" />

var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class Macro {
	name: string;
	shortname: string;
	protected paramTypes: string[];
	protected exec: (...a) => void;// function
	protected canvas: iCanvas;
	protected params: any[];
	protected Cn: iConstruction;
	protected Li: iiPadDOMElt;
	/**
	 * The exec parameter is a function that expects params.length arguments of types params[i]
	 */
	constructor(canvas:iCanvas, name:string, params:string[], exec) {
		this.name = name;
		this.shortname = (a=>a[a.length-1])(name.split("/"));
		this.shortname = this.shortname[this.shortname.length - 1];
		this.paramTypes = params;
		this.exec = exec;
		this.canvas = canvas;
		this.params = [];
		this.Cn = null;
		this.Li = null;
	}
	tagPossibleInitials() {
		let v = this.Cn.elements();
		let i=0, s=v.length;
		while (i<s) {
			let element = v[i];
			if (element.isInstanceType(this.paramTypes[this.params.length])) {
				if (element.getMacroMode() === 0) {
					// S'il s'agit d'un neutre
					element.setMacroMode(4);// Construction.paint = macroPaint
				}
			} else {
				if (element.getMacroMode() !== 5) {
					// S'il ne s'agit pas d'un initial déjà déclaré
					element.setMacroMode(0);// Construction.paint = standardPaint
				}
			}
			i++;
		}
	}
	init(li:iiPadDOMElt, cn:iConstruction) {
		this.params = [];
		this.Li = li;
		this.Cn = cn;
		this.nextStep();
	}
	addParam(p:any) {
		this.params.push(p);
		this.nextStep();
	}
	getSource() {
		let p='[]';
		if (this.paramTypes.length > 0) {
			p = '["' + this.paramTypes.join('","') + '"]';
		}
		let txt = '\tname:"' + $U.native2ascii(this.name) + '",\n';
		txt += '\tparameters:' + p + ',\n';
		txt += '\texec:\n\t' + this.exec.toString();
		return txt;
	}
	private executeMacro() {
		let s = `myexecutefunc=${this.exec.toString()}\n$macroFinals=myexecutefunc("${this.params.join('","')}")`;
		this.canvas.undoManager.beginAdd();
		this.canvas.InterpretMacro(s);
		this.canvas.undoManager.endAdd();
	}
	private commentMacro(i:number, len:number, type:string) {
		return ` :<p class="macroLIclassComment">${i}/${len}-${$L.object[type]}?</p>`;
	}
	private nextStep() {
		// S'il s'agit d'une macro sans initial :
		if (this.paramTypes.length === 0) {
			this.executeMacro();
			this.canvas.getConstruction().setMode(5);
			this.canvas.paint();
			this.params = [];
			return;
		}
		if (this.params.length < this.paramTypes.length) {
			this.tagPossibleInitials();
			setTimeout(() => {
				let shortname = this.Li.macro.shortname;
				let i = this.params.length + 1;
				let len = this.paramTypes.length;
				let type = this.paramTypes[this.params.length];
				let comment = this.commentMacro(i, len, type);
				this.Li.getDocObject().innerHTML = shortname+comment;
			}, 10);// buffed from 1 to 10
		} else {
			this.executeMacro();
			//this.canvas.macrosManager.endMacro();
			this.canvas.getConstruction().setMode(5);// Construction.paint = macroEXEPaint
			this.canvas.paint();
			this.params = [];
			this.nextStep();
		}
	}
}
