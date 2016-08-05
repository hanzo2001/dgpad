
interface iNamesPanel {
	isEditMode();
	setObserver(fn:()=>string[]);
	setbounds(l:number, t:number, w:number, h:number);
	getBounds(): {t:number,l:number,w:number,h:number};
	hide();
	show();
	isVisible(): boolean;
	refreshkeyboard();
	getName(): string;
}

interface iNamesManager {
	isVisible(): boolean;
	show();
	hide();
	refresh();
	getName();
	setName(_o);
	replaceName(_o);
	setObserver(fn:()=>string[]);
}
