/// <reference path="./typings/iConstruction.d.ts" />

var $U = (<any>window).$U;

export class SourceWriter {
	private Cn: iConstruction;
	private geom: string;
	private style: string;
	private block: string;
	private vars;
	private names;
	constructor(Cn:iConstruction) {
		this.Cn = Cn;
		this.geom = "";
		this.style = "";
		this.block = "";
		this.vars = {};
		this.names = {};
	}
	//    var getvarname = function(s) {
	//        var v = $U.leaveAccents(s);
	//        if (this.vars.hasOwnProperty(v)) {
	//            var b = 1;
	//            while (this.vars.hasOwnProperty(v + b)) {
	//                b++
	//            }
	//            v = v + b;
	//        }
	//        ;
	//        this.vars[v] = s;
	//        this.names[s] = v;
	//        return v;
	//    };
	//
	//me.getVar=function(_n){
	//    return getvarname(_n);
	//};
	getGeom(): string {
		// Remplacement du caractère spécial π :
		return this.geom.replace(/\u03C0/g, "\\u" + "03C0");;
	}
	getStyle(): string {
		return this.style;
	}
	getBlock(): string {
		return this.block;
	}
	//    geomWrite(_withquotes, _name, _code) {
	//        var params = [];
	//        var v = getvarname(_name);
	//        for (var i = 3; i < arguments.length; i++) {
	//            var p = (this.names.hasOwnProperty(arguments[i])) ? this.names[arguments[i]] : arguments[i];
	//            var myarg = _withquotes ? "\"" + p + "\"" : p;
	//            params.push(myarg);
	//        }
	//        if (params.length === 0) {
	//            this.geom += v + "=" + _code + "(\"" + _name + "\");\n";
	//        } else {
	//            var args = params.join(",");
	//            this.geom += v + "=" + _code + "(\"" + _name + "\"," + args + ");\n";
	//        }
	//    };
	geomWrite(_withquotes:boolean, _name, _code:string) {
		var params = [];
		for (var i = 3; i < arguments.length; i++) {
			// console.log("arguments[i]="+arguments[i]);
			// var a = this.Cn.isVarName(arguments[i]) ?  arguments[i] : this.Cn.getVarName(arguments[i]);
			// var a = this.Cn.isVarName(arguments[i]) ? this.Cn.getVarName(arguments[i]) : arguments[i];
			// console.log("a="+a);
			var myarg = _withquotes ? "\"" + arguments[i] + "\"" : arguments[i];
			if ($U.isArray(myarg)) myarg = "[" + myarg.join(",") + "]";
			params.push(myarg);
		}
		if (params.length === 0) {
			this.geom += this.Cn.getVarName(_name) + "=" + _code + "(\"" + $U.native2ascii(_name) + "\");\n";
		} else {
			var args = params.join(",");
			this.geom += this.Cn.getVarName(_name) + "=" + _code + "(\"" + $U.native2ascii(_name) + "\"," + args + ");\n";
		}
	}
	styleWrite(_withquotes:boolean, _name, _code:string) {
		var params = [];
		for (var i = 3; i < arguments.length; i++) {
			var myarg = _withquotes ? "\"" + arguments[i] + "\"" : arguments[i];
			params.push(myarg);
		}
		var args = params.join(",");
		this.style += _code + "(" + this.Cn.getVarName(_name) + "," + args + ");\n";
	}
	blockWrite(_name, _src:string, _code:string) {
		this.block += _code + "(" + this.Cn.getVarName(_name) + "," + _src + ");\n";
	}
}
