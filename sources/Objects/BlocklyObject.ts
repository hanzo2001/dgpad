/// <reference path="../typings/iBlocklyObject.d.ts" />

import {Expression} from '../Expression';

var $U = (<any>window).$U

export class BlocklyObject implements iBlocklyObject {
	private owner;
	private Cn;
	private EX;
	private type;
	private xml;
	private sync;
	private async;
	private childs;
	private parents;
	constructor(_owner, _construction) {
		this.owner = _owner;
		this.Cn = _construction;
		this.EX = null;
		this.type = null;
		this.xml = null;
		this.sync = null;
		this.async = null;
		this.childs = {};
		this.parents = {};
	}
	getXML() {
		return this.xml;
	}
	getSNC() {
		return this.sync;
	}
	setBehavior(_m, _xml, _sync, _async) {
		this.type = _m;
		this.xml = _xml;
		if (this.xml === null) {
			this.sync = null;
			this.async = null;
			this.setEX(null);
			if (this.type === "oncompute") this.owner.getObj().setExpression("NaN");
			if (this.type === "onlogo") this.Cn.removeTurtleExpression(this.owner.getObj().getVarName());
		} else {
			this.sync = _sync.replace(/^\s*var\s*\w+\s*;/gm, "").trim();
			// console.log(this.sync);
			this.async = _async;
			var cod = "";
			if (this.type === "onlogo") {
				this.Cn.setDEG(true);
				var startpt = this.owner.getObj().getVarName();
				var ex = this.Cn.createTurtleExpression(startpt);
				// Entier aléatoire entre 1 et 1 000 000 000 :
				var rand = (Math.floor(Math.random() * (Math.abs(1 - 1000000000) + 1) + (1 + 1000000000 - Math.abs(1 - 1000000000)) / 2));
				var fname = "bl_" + $U.number2letter(rand.toString());
				cod += "var " + fname + "=function(){\n";
				cod += "TURTLE_INIT(\"" + startpt + "\"," + startpt + ");\n";
				cod += this.sync;
				cod += "\nreturn TURTLE_RESULT()";
				cod += "\n};\n" + fname + "()";
				ex.setExpression(cod);
			} else {
				var fname = "bl_" + $U.number2letter(Date.now().toString());
				cod = "var " + fname + "=function(){\n";
				cod += this.sync;
				cod += "\n};\n" + fname + "()";
				if (this.type === "oncompute") {
					this.owner.getObj().setExpression(cod);
					this.setEX(null);
				} else {
					this.setEX(cod);
				}
			}
		}
	}
	evaluate() {
		if (this.EX) {
			this.EX.forcevalue();
			for (var o in this.childs) {
				this.childs[o].compute();
				this.childs[o].computeChilds();
			}
		}
	}
	setChilds(_childs) {
		this.childs = {};
		for (var i = 0; i < _childs.length; i++) {
			var o = this.Cn.find(_childs[i]);
			if (o === undefined || o.getVarName() === this.owner.getObj().getVarName()) {continue;}
			this.childs[o.getVarName()] = o;
		}
	}
	getChilds() {
		var ch = [];
		for (var o in this.childs) {ch.push(o);}
		return ch;
	}
	setParents(_parents) {
		this.parents = Object.create(null);
		let obj = this.owner.getObj();
		for (var i = 0; i < _parents.length; i++) {
			var o = this.Cn.find(_parents[i]);
			if (o === undefined || o.getVarName() === obj.getVarName()) {continue;}
			this.parents[o.getVarName()] = o;
		}
	}
	getParents() {
		var ch = [];
		for (var o in this.parents) {ch.push(o);}
		return ch;
	}
	private setEX(_cod) {
		this.EX = Expression.delete(this.EX);
		if (_cod) {
			this.EX = new Expression(this.owner, _cod);
			Expression.delete(this.EX);
		}
	}
}
