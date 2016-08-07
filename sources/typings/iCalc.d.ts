/// <reference path="./GUI/iPanel.d.ts" />
/// <reference path="../typings/iCommons.d.ts" />

interface iCustomTextSelection extends iGUIElement {
	setOffset(_x:number);
	setHide(_h:boolean);
	nextCar();
	getSelStart(): number;
	getSelEnd(): number;
	setSelectionRange(_start:number, _end:number);
	setCarLength(x:number);
	getCarLength(): number;
	mousedown(x:number);
	mousemove(x);
	setActive();
	getText();
	executeCommand(_st:string);
	insertText(_st:string);
}

interface iCustomTextInput extends iPanel {
	show();
	hide();
	setPreferredKB(_kb);
	setSelectionRange(_s, _e);
	setActive(_b);
	isActive();
	setChangedFilter(_proc);
	getInputDIV();
	getContentSPAN();
	getInput();
	getSel();
	showKB();
	isStandardKB();
	setBounds(l, t, w, h);
	setLabel(_l);
	setText(txt);
	getText();
	insertText(_st);
	nextCar();
	executeCommand(_st);
}

interface iCustomTexts {
	filterKB(_standardON);
	getActive();
	add(_lbl:string, _l:number, _t:number, _w:number, _h:number): iCustomTextInput;
	removeAll();
	deactiveAll();
	close();
	focus();
	setFirst(_b);
	activate(txt);
	insertText(_st);
	showKB();
	nextCar();
	setKeyEvents(_standardKB:boolean);
}

interface iDigitCalcPanel extends iPanel {
	show();
	close();
	activateBtns(_b);
}

interface iCalcManager {
	keypressed(ev);
	// On a cliqué sur l'icône Macro :
	showPanel();
	hidePanel();
	getCustomKB(): iDigitCalcPanel;
	activateBtns(_b);
	edit(_obj);
}

