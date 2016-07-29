
var $U = (<any>window).$U;
var $L = (<any>window).$L;

export class Macro {
	name;
	shortname;
	protected paramTypes;
	protected exec;
	protected canvas;
	protected params;
	protected Cn;
	protected Li;
	constructor(_canvas, _name, _p, _proc) {
		this.name = _name;
		this.shortname = _name.split("/");
		this.shortname = this.shortname[this.shortname.length - 1];
		this.paramTypes = _p;
		this.exec = _proc;
		this.canvas = _canvas;
		this.params = [];
		this.Cn = null;
		this.Li = null;
	}
	tagPossibleInitials() {
		let v = this.Cn.elements();
		for (let i = 0, len = v.length; i < len; i++) {
			if (v[i].isInstanceType(this.paramTypes[this.params.length])) {
				if (v[i].getMacroMode() === 0) {
					// S'il s'agit d'un neutre
					v[i].setMacroMode(4);
				}
			} else {
				if (v[i].getMacroMode() !== 5) {
					// S'il ne s'agit pas d'un initial déjà déclaré
					v[i].setMacroMode(0);
				}
			}
		}
	}
	init(_li, _cn) {
		this.params = [];
		this.Li = _li;
		this.Cn = _cn;
		this.nextStep();
	}
	addParam(_n) {
		this.params.push(_n);
		this.nextStep();
	}
	getSource() {
		let p='[]', t='[]';
		if (this.paramTypes.length > 0) {
			p = '["' + this.paramTypes.join('","') + '"]';
		}
		let txt = '\tname:"' + $U.native2ascii(this.name) + '",\n';
		txt += '\tparameters:' + p + ',\n';
		txt += '\texec:\n\t' + this.exec.toString();
		return txt;
	}
	private executeMacro() {
		let s = "myexecutefunc=" + this.exec.toString();
		s += '\n$macroFinals=myexecutefunc("' + this.params.join('","') + '")';
		this.canvas.undoManager.beginAdd();
		this.canvas.InterpretMacro(s);
		this.canvas.undoManager.endAdd();
	}
	private commentMacro(_i, _len, _tpe) {
		let t = ' :<p class="macroLIclassComment">' + _i + '/' + _len + ' - ' + $L.object[_tpe] + ' ?</p>';
		return t;
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
			// Curiosité : le innerHTML semble prendre beaucoup de temps sur touchpad
			// D'où l'execution par setTimeout dans un autre Thread...
			setTimeout(function() {
				//this.Li.settxt(this.Li.macro.name + commentMacro(this.params.length + 1, this.paramTypes.length, this.paramTypes[this.params.length]));
				this.Li.o().innerHTML = this.Li.macro.shortname + this.commentMacro(this.params.length + 1, this.paramTypes.length, this.paramTypes[this.params.length]);
			}, 1);
		} else {
			this.executeMacro();
			//this.canvas.macrosManager.endMacro();
			this.canvas.getConstruction().setMode(5);
			this.canvas.paint();
			this.params = [];
			this.nextStep();
		}
	}
}
