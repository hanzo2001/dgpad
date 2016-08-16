/// <reference path="../typings/iBlockly.d.ts" />
/// <reference path="../typings/iCanvas.d.ts" />

import {TurtleObject} from './TurtleObject';
import {BlocklyPanel} from './BlocklyPanel';
import {PrintPanel} from '../Text/PrintPanel';

var $L = (<any>window).$L;
var $APP_PATH = (<any>window).$APP_PATH;

var Blockly;
var goog;

export class BlocklyManager implements iBlocklyManager {
	private canvas: iCanvas;
	private Cn: iConstruction;
	private panel: BlocklyPanel;
	private path1: string;
	private path2: string;
	private source: string;
	private selected: string;
	private workspace;
	private OBJ: iConstructionObject;
	private from_edit: boolean;
	private turtle: TurtleObject;
	private printPanel: PrintPanel;
	private scripts: string[];
	constructor(_canvas: iCanvas) {
		this.canvas = _canvas;
		this.Cn = this.canvas.getConstruction();
		this.panel = null;
		this.path1 = $APP_PATH + 'NotPacked/thirdParty/Blockly/';
		this.path2 = $APP_PATH + 'Blockly/'
		this.source = '';
		this.selected = '';
		this.workspace = null;
		this.OBJ = null;
		this.from_edit = false;
		this.turtle = new TurtleObject(this.canvas);
		this.printPanel = null;
		this.scripts = [this.path1 + 'blockly_compressed.js',
			this.path1 + 'blocks_compressed.js',
			this.path1 + 'javascript_compressed.js',
			this.path1 + 'msg/js/' + $L.blockly.lang,
			this.path1 + 'perso/hacks.js',
			this.path1 + 'perso/blocks/core.js',
			this.path1 + 'perso/blocks/aspect.js',
			this.path1 + 'perso/blocks/geometry.js',
			this.path1 + 'perso/blocks/expressions.js',
			this.path1 + 'perso/blocks/lists.js',
			this.path1 + 'perso/blocks/matrices.js',
			this.path1 + 'perso/blocks/turtle.js',
			this.path1 + 'perso/blocks/globals.js',
			this.path1 + 'perso/js/core.js',
			this.path1 + 'perso/js/aspect.js',
			this.path1 + 'perso/js/geometry.js',
			this.path1 + 'perso/js/expressions.js',
			this.path1 + 'perso/js/lists.js',
			this.path1 + 'perso/js/matrices.js',
			this.path1 + 'perso/js/turtle.js',
			this.path1 + 'perso/js/globals.js'
		];
		// var this.turtle=null;
	}
	private closePrint() {
		this.printPanel && this.printPanel.close();
		this.printPanel = null;
	}
	private initBlockly() {
		var that = <BlocklyManager>this;
		Blockly.Block.prototype.firstadd = true;
		// Blockly.Block.prototype.varname = '';
		Blockly.Block.prototype.name = function () {
			return this.getFieldValue('name');
		};
		Blockly.getObj = function () {
			return this.OBJ;
		};
		Blockly.Block.prototype.isInConstruction = function () {
			return this.getSurroundParent() && this.getSurroundParent().type === 'dgpad_construction';
		};
		Blockly.Globals = {
			NAME_TYPE: 'GLOBAL',
			NAMES: this.Cn.getInterpreter().BLK_GLOB_TAB,
			RENAME: this.Cn.getInterpreter().BLK_GLOB_RENAME
		};
		Blockly.Globals.flyoutCategory = function (workspace) {
			var variableList = Blockly.Globals.NAMES();
			variableList.sort(goog.string.caseInsensitiveCompare);
			goog.array.remove(variableList, Blockly.Msg.VARIABLES_DEFAULT_NAME);
			variableList.unshift(Blockly.Msg.VARIABLES_DEFAULT_NAME);
			var xmlList = [];
			var block = goog.dom.createDom('block');
			block.setAttribute('type', 'dgpad_global_inc');
			block.setAttribute('gap', 24);
			// var num = goog.dom.createDom('block');
			// num.setAttribute('type', 'math_number');
			// var field = goog.dom.createDom('field', null, '1');
			// field.setAttribute('name', 'NUM');
			// num.appendChild(field);
			// var cnx = num.outputConnection;
			// block.getInput('NAME').connection.connect(cnx);
			// block.connect(num);
			xmlList.push(block);
			for (var i = 0; i < variableList.length; i++) {
				if (Blockly.Blocks['dgpad_global_set']) {
					var block = goog.dom.createDom('block');
					block.setAttribute('type', 'dgpad_global_set');
					if (Blockly.Blocks['dgpad_global_get']) {
						block.setAttribute('gap', 8);
					}
					var field = goog.dom.createDom('field', null, variableList[i]);
					field.setAttribute('name', 'VAR');
					block.appendChild(field);
					xmlList.push(block);
				}
				if (Blockly.Blocks['dgpad_global_get']) {
					var block = goog.dom.createDom('block');
					block.setAttribute('type', 'dgpad_global_get');
					if (Blockly.Blocks['dgpad_global_set']) {
						block.setAttribute('gap', 24);
					}
					var field = goog.dom.createDom('field', null, variableList[i]);
					field.setAttribute('name', 'VAR');
					block.appendChild(field);
					xmlList.push(block);
				}
			}
			return xmlList;
		};
		Blockly.dgpad = new function () {
			var me = this;
			var NMS = [];
			me.VARS = []; // Pour collecter les enfants du scripts
			me.PARS = []; // Pour collecter les parents du scripts
			me.ZC = this.canvas;
			me.CN = this.canvas.getConstruction();
			me.getBounds = this.panel.getBounds;
			me.getNames = function () {
				return NMS;
			};
			me.getObj = function () {
				return this.OBJ;
			};
			me.addName = function (_n) {
				NMS.push(_n);
			};
			me.getObjectsFromType = function (_t) {
				return me.CN.getObjectsFromType(_t);
			};
			me.objectPopup = function (_t) {
				// console.log('objectPopup :'+_t);
				var props = me.CN.getObjectsFromType(_t);
				var tab = [];
				var mod = this.OBJ.blocks.getMode()[this.panel.getMode()];
				for (var i = 0; i < props.length; i++) {
					// On doit absolument empécher l'autoréférence en mode Expression :
					if ((mod !== 'oncompute') || (this.OBJ != props[i]))
						tab.push([props[i].getName(), props[i].getVarName()]);
				};
				if (tab.length === 0) tab.push(['? ', null]);
				return (new Blockly.FieldDropdown(tab));
			};
			me.getName = this.canvas.namesManager.getName;
			me.refresh = this.canvas.namesManager.refresh;
		};
		Blockly.bindEvent_(this.panel.DIV, 'mouseup', null, onmouseup);
		this.canvas.namesManager.setObserver(Blockly.dgpad.getNames);
		Blockly.custom_menu_printSource = function () {
			that.print(Blockly.JavaScript.workspaceToCode(that.workspace).replace(/^\s*var\s*\w+\s*;/gm, '').replace(/blockly_var_/g, '').trim() + '\n');
		};
		Blockly.custom_menu_copyAll = function () {
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
			xml = Blockly.Xml.domToText(xml);
			localStorage.setItem('blockly_clipboard', xml);
		};
		Blockly.custom_menu_copySel = function () {
			if (Blockly.selected) {
				var xml = goog.dom.createDom('xml');
				var blks = Blockly.Xml.blockToDom(Blockly.selected);
				var xy = Blockly.selected.getRelativeToSurfaceXY();
				blks.setAttribute('x', Math.round(xy.x) + 5);
				blks.setAttribute('y', Math.round(xy.y) + 5);
				xml.appendChild(blks);
				localStorage.setItem('blockly_clipboard', Blockly.Xml.domToText(xml));
			}
		};
		Blockly.custom_menu_paste = function () {
			this.from_edit = false;
			var xml = localStorage.getItem('blockly_clipboard');
			var elt = Blockly.Xml.textToDom(xml);
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, elt);
		};
	}
	private changeCSS(cname, property, value) {
		var cols = document.getElementsByClassName(cname);
		for (let i = 0; i < cols.length; i++) {
			(<HTMLElement>cols[i]).style[property] = value;
		}
	}
	private showCategory(name, bool) {
		var cat = { 'turtle': 7, 'texts': 8 };
		var elt = document.getElementById(':' + cat[name]);
		if (bool) {
			elt.style['visibility'] = 'visible';
			elt.style['height'] = '25px';
			this.turtle.show(<iPointObject>this.OBJ);
			// this.turtle = new TurtleObject(this.canvas, this.OBJ);
			this.canvas.paint();
		} else {
			elt.style['visibility'] = 'hidden';
			elt.style['height'] = '0px';
			this.turtle.hide();
			// this.turtle = null;
			this.canvas.paint();
		}
	}
	private modifyCSSRule(className, property, value) {
		var ss = document.styleSheets;
		for (var i = 0; i < ss.length; i++) {
			var ss = document.styleSheets;
			var rules = ss[i].cssRules || ss[i].rules;
			for (var j = 0; j < rules.length; j++) {
				if (rules[j].selectorText === className) {
					rules[j].style[property] = value;
				}
			}
		}
	}
	private onload() {
		setTimeout(() => {
			// Blockly.FieldTextInput.FONTSIZE = 36;
			this.workspace = Blockly.inject(this.panel.DIV, {
				media: $APP_PATH + 'NotPacked/thirdParty/Blockly/media/',
				toolbox: this.panel.XML.firstChild,
				zoom: {
					controls: true,
					wheel: true,
					startScale: 1.0,
					maxScale: 3,
					minScale: 0.3,
					scaleSpeed: 1.1
				},
				trashcan: true
				// toolbox: document.getElementById('toolbox')
			});
			// Blockly.Xml.domToWorkspace(this.workspace, document.getElementById('startBlocks'));
			this.initBlockly();
			this.workspace.addChangeListener(() => this.onchanged());
			this.changeCSS('blocklyToolboxDiv', 'z-index', '9001');
			// changeCSS('blocklyToolboxDiv', 'background', '#FEFEFE');
			this.changeCSS('blocklyMainBackground', 'fill', '#FEFEFE');
			this.changeCSS('blocklyMainBackground', 'fill-opacity', '0.0');
			this.changeCSS('blocklySvg', 'background-color', 'rgba(0,0,0,0)');
			this.modifyCSSRule('.blocklyText', 'font-family', 'Verdana, Geneva, sans-serif');
			this.changeCSS('blocklyTreeLabel', 'font-family', 'Verdana, Geneva, sans-serif');
			this.modifyCSSRule('.blocklyWidgetDiv', 'z-index', '9002');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menu', 'border-radius', '10px');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menu', 'border', '1px solid gray');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menu', 'background', 'rgba(250,250,250,0.9)');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menuitem-content', 'font', 'normal 16px Verdana, Geneva, sans-serif');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menuitem-hover', 'padding-bottom', '4px');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menuitem-hover', 'padding-top', '4px');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menuitem-content', 'padding-bottom', '4px');
			this.modifyCSSRule('.blocklyWidgetDiv .goog-menuitem-content', 'padding-top', '4px');
			// On cache la catégorie 'Tortue' :
			this.showCategory('turtle', false);
			this.showCategory('texts', false);
			this.showCallback();
		}, 200);
	}
	private onmouseup() {
		if ((Blockly.selected) && (Blockly.selected.onselect) && (this.selected != Blockly.selected)) {
			Blockly.selected.onselect();
			this.selected = Blockly.selected;
		} else if ((this.selected != Blockly.selected)) {
			this.selected = '';
		}
	}
	// Appelée chaque fois que quelque chose change
	// dans le workspace de Blockly :
	private onchanged() {
		// console.log('onchanged : ' + this.OBJ.getName());
		// Bloquer l'évenement 'onchanged' quand on vient d'éditer un objet :
		if (this.from_edit) {
			this.from_edit = false;
			return
		}
		if (this.OBJ) {
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
			var mod = this.OBJ.blocks.getMode()[this.panel.getMode()];
			if (xml.innerHTML === '') {
				this.OBJ.blocks.setBehavior(mod, null, null, null);
				this.resetTurtle(this.OBJ.getVarName());
			} else {
				xml = Blockly.Xml.domToText(xml);
				Blockly.dgpad.VARS = [];
				Blockly.dgpad.PARS = [];
				var snc = Blockly.JavaScript.workspaceToCode(this.workspace);
				this.OBJ.blocks.setBehavior(mod, xml, snc, null);
				this.OBJ.blocks.setChilds(mod, Blockly.dgpad.VARS);
				this.OBJ.blocks.setParents(mod, Blockly.dgpad.PARS);
			}
			this.Cn.orderObjects();
			if (mod !== 'onprogram') {
				this.OBJ.blocks.evaluate(mod);
				this.Cn.computeAll();
				this.canvas.paint();
			}
		}
	}
	private addScript(_scpnum:number) {
		var next = _scpnum + 1;
		var parent = document.getElementsByTagName('head')[0];
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = this.scripts[_scpnum];
		s.onload = (next === this.scripts.length) ? () => this.onload() : () => this.addScript(next);
		parent.appendChild(s);
	}
	// var injectXML = function(_s) {
	//     window.document.getElementById('dgpad_xml').innerHTML = _s;
	// };
	private loadBlockly() {
		this.panel = new BlocklyPanel(window.document.body, this.canvas, ()=>this.hideCallback(), ()=>this.currentTabCallBack(), (this.canvas.getHeight() - this.canvas.prefs.controlpanel.size));
		// Load xml formatted toolbox :
		var request = new XMLHttpRequest();
		request.open('GET', this.path1 + 'perso/Blockly_toolbox.xml', true);
		request.send(null);
		request.onload = (e) => {
			var xml = request.responseText;
			// Internationalize strings in toolbox :
			for (var obj in $L.blockly) {
				var key = '$L.blockly.' + obj.toString();
				xml = xml.split(key).join($L.blockly[obj]);
			}
			// injectXML(xml);
			this.panel.XML.innerHTML = xml;
			// var parser = new DOMParser();
			// var xml=parser.parseFromString(request.responseText, 'application/xml');
			// this.panel.DIV.parentNode.appendChild(xml.firstChild);
			// Load this.scripts synchroniously :
			this.addScript(0);
		}
	}
	private showCurrentTab() {
		Blockly.mainWorkspace.clear();
		this.panel.setMode(this.OBJ.blocks.getMode(), this.OBJ.blocks.getCurrent());
		var xml = this.OBJ.blocks.getCurrentXML();
		if (xml) {
			var elt = Blockly.Xml.textToDom(xml);
			Blockly.Xml.domToWorkspace(this.workspace, elt);
		}
		setTimeout(() => {
			var mod = this.OBJ.blocks.getMode()[this.panel.getMode()];
			this.showCategory('turtle', (mod === 'onlogo'));
			this.showCategory('texts', (mod === 'onlogo'));
		}, 300);
	}
	// Appelé par le panel chaque fois qu'on change d'onglet :
	private currentTabCallBack() {
		Blockly.mainWorkspace.clear();
		if (this.OBJ) {
			var mod = this.OBJ.blocks.getMode()[this.panel.getMode()];
			this.OBJ.blocks.setCurrent(mod);
			var xml = this.OBJ.blocks.getXML(mod);
			if (xml) {
				var elt = Blockly.Xml.textToDom(xml);
				Blockly.Xml.domToWorkspace(this.workspace, elt);
			}
			this.showCategory('turtle', (mod === 'onlogo'));
			this.showCategory('texts', (mod === 'onlogo'));
			// Blockly.Toolbox.dispose();
			// Blockly.mainWorkspace.updateToolbox(document.getElementById('toolbox_turtle'))
		}
		this.from_edit = true;
	}
	private hideCallback() {
		this.showCategory('turtle', false);
		this.showCategory('texts', false);
		this.changeCSS('blocklyToolboxDiv', 'visibility', 'hidden');
		Blockly.ContextMenu.hide();
	}
	private showCallback() {
		setTimeout(() => {
			this.changeCSS('blocklyToolboxDiv', 'visibility', 'visible');
			this.panel.setTitle(this.OBJ.getName());
		}, 320);
		this.showCurrentTab();
	}
	private show() {
		if (this.panel === null) {this.loadBlockly()}
		else {
			this.panel.show();
			this.showCallback();
		}
	}
	paintTurtle() {
		this.turtle.paint();
	}
	// me.computeTurtle = function() {
	//     if (turtle) this.turtle.compute();
	// };
	changeTurtleUVW(name:string, u: number[], v: number[], w: number[]) {
		this.turtle.changeUVW(name, u, v, w);
	}
	changeTurtlePT(name:string, P:iPointObject) {
		this.turtle.changePT(name, P);
	}
	resetTurtle(name:string) {
		this.turtle.reset(name);
	}
	// Appelée chaque fois qu'on clique sur un objet
	// pendant que le panel est ouvert :
	tryEdit(o:iConstructionObject) {
		// clearOBJ(); // Effacement éventuel du dernier objet
		if (this.panel && (!this.panel.isHidden())) {
			if (Blockly.selected && Blockly.selected.getName) {
				Blockly.selected.getName(o)
			} else {
				this.edit(o);
			}
			return true
		}
		return false;
	}
	edit(o:iConstructionObject) {
		this.OBJ = o;
		this.from_edit = true;
		this.show();
	}
	print(txt:string) {
		if (!this.printPanel) {this.printPanel = new PrintPanel(this.canvas, () => this.closePrint());}
		this.printPanel.setText(txt);
	}
}
