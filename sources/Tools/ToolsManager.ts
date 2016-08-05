/// <reference path="../typings/iTools.d.ts" />

import {Tool} from './Tool';

export class ToolsManager implements iToolsManager {
	private canvas: any;
	private context: CanvasRenderingContext2D;
	private toolsize: number;
	private toolgap: number;
	private toolmarginV: number;
	private bxy: any[];
	private pxy: any[];
	private tools: any[];
	private targets: any[];
	private visible: boolean;
	private tool: iTool;
	private objectConstructor;
	constructor(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext();
		this.toolsize = parseInt(this.canvas.prefs.tool.size);
		this.toolgap = parseInt(this.canvas.prefs.tool.gap);
		this.toolmarginV = parseInt(this.canvas.prefs.tool.marginV);
		this.bxy = [];//Tableau multidimensionnel représentant les outils
		this.pxy = [];//Tableau simple représentant les modificateurs de propriété
		this.tools = [];
		this.targets = [];
		this.visible = false;
		this.tool = null;
		this.objectConstructor = null;
		if (Object.touchpad) {
			this.toolsize *= parseFloat(this.canvas.prefs.tool.touchfactor);
			this.toolgap *= parseFloat(this.canvas.prefs.tool.touchfactor);
			this.toolmarginV *= parseFloat(this.canvas.prefs.tool.touchfactor);
		}
	}
	isVisible(): boolean {
		return this.visible;
	}
	addTool(objectConstructor:any) {
		this.tools[objectConstructor.getCode()] = new Tool(this.canvas,this,objectConstructor);
	}
	getConstructor(code:string): any {
		return this.tools[code].getConstructor();
	}
	closeTools() {
		this.visible = false;
		for (let k in this.tools) {this.tools[k].close();}
	}
	hideTools() {
		this.visible = false;
		for (let k in this.tools) {this.tools[k].hide();}
	}
	showTools(event) {
		this.visible = true;
		this.canvas.setMovedFilter(()=>this.mouseMoved);
		this.targets = this.canvas.getConstruction().getSelected().slice();
		if (this.targets.length) {
			let myTools = <string[]>this.targets[0].getAssociatedTools().split(",");
			this.bxy = [];
			this.pxy = [];
			let col = [];
			let i=0, s=myTools.length;
			while (i<s) {
				let tool = myTools[i++];
				if (tool[0] === "@") {
					this.pxy.push({tool: this.tools[tool.split("@")[1]]});
				} else if (tool === "BR") {
					this.bxy.push(col);
					col = [];
				} else {
					col.push({tool: this.tools[tool]});
				}
			}
			this.bxy.push(col);
			this.context.globalAlpha = 1;
			this.setCoords(event, this.targets[0]);
		}
	}
	showOneTool(tool:iTool, event:MouseEvent) {
		this.visible = true;
		this.canvas.setMovedFilter(this.mouseMoved);
		let cX = this.canvas.mouseX(event);
		let cY = this.canvas.mouseY(event);
		let stX = cX - this.toolsize / 2;
		if (stX < 0) {stX = this.toolgap;}
		else
		if (stX + this.toolsize > this.canvas.getWidth()) {stX = this.canvas.getWidth() - this.toolsize - this.toolgap;}
		let stY = cY - this.toolsize - this.toolmarginV;
		if (stY < 0) {stY = cY + this.toolmarginV;}
		tool.init(stX, stY, this.toolsize);
	}
	mouseDown(event:MouseEvent, tool:iTool) {
		this.hideTools();
		this.tool = tool;
		this.objectConstructor = this.tool.getConstructor();
		if (!this.canvas.isObjectConstructor(this.objectConstructor)) {
			this.canvas.setObjectConstructor(this.objectConstructor);
			this.objectConstructor.setInitialObjects(this.targets);
			if (this.objectConstructor.isInstantTool()) {
				this.closeTools();
				this.canvas.clearFilters();
				this.objectConstructor.createObj(this.canvas, event);
				this.canvas.setPointConstructor();
				this.canvas.getConstruction().validate(event);
				this.canvas.getConstruction().clearSelected();
				this.canvas.paint(event);
				return;
			}
		}
		this.canvas.setMovedFilter(null);
		this.canvas.setReleasedFilter(this.mouseReleased);
		this.canvas.paint(event);
	}
	mouseMoved(event:MouseEvent) {
	}
	mouseReleased(event:MouseEvent) {
		if ((!this.objectConstructor) || (this.objectConstructor.isInstantTool())) {return;}
		this.canvas.clearFilters();
		this.canvas.getConstruction().validate(event);
		this.objectConstructor.selectCreatePoint(this.canvas, event);
		if (this.objectConstructor.isLastObject()) {
			this.closeTools();
			this.objectConstructor.createObj(this.canvas, event);
			this.canvas.setPointConstructor();
			this.canvas.getConstruction().validate(event);
			this.canvas.getConstruction().clearSelected();
			this.canvas.getConstruction().clearIndicated();
			this.canvas.paint(event);
		} else {
			this.canvas.paint(event);
			this.showOneTool(this.tool, event);
		}
	}
	private setCoords(event, _o) {
		let cX, cY, lenc, lenl, H, W, startx, starty, ts, w;
		if (_o.getFamilyCode() === "point") {
			cX = _o.getX();
			cY = _o.getY();
		} else {
			cX = this.canvas.mouseX(event);
			cY = this.canvas.mouseY(event);
		}
		lenl = this.bxy.length;
		H = lenl * this.toolsize + (lenl - 1) * this.toolgap;
		starty = cY - H - this.toolmarginV;
		if (starty < 0) {starty = cY + this.toolmarginV;}
		for (let line = 0; line < lenl; line++) {
			lenc = this.bxy[line].length;
			W = lenc * this.toolsize + (lenc - 1) * this.toolgap;
			startx = cX - W / 2;
			if (startx < 0) {
				startx = this.toolgap;
			} else if (startx + W > this.canvas.getWidth()) {
				startx = this.canvas.getWidth() - W - this.toolgap;
			}
			for (let col = 0; col < lenc; col++) {
				let x = startx + col * (this.toolsize + this.toolgap);
				let y = starty + line * (this.toolsize + this.toolgap);
				this.bxy[line][col].tool.init(x, y, this.toolsize);
			}
		}
		ts = 3 * this.toolsize / 4;
		w = this.pxy.length * ts + (this.pxy.length - 1) * this.toolgap;
		startx += (W - w) / 2;
		if ((cY - H - this.toolmarginV) > 0) {
			starty = cY + this.toolmarginV;
		} else {
			starty = cY - this.toolmarginV - ts;
		}
		for (let col = 0; col < this.pxy.length; col++) {
			this.pxy[col].tool.init(startx + col * (ts + this.toolgap), starty, ts);
			//this.pxy[col].tool.init(cX + _o.getRealsize() + 3 * this.toolgap + col * (ts + this.toolgap), cY - ts / 2, ts);
		}
		//propBtn.init(100,100,this.toolsize,this.toolsize);
	}
}
