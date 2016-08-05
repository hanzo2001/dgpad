/// <reference path="./GUI/iPanel.d.ts" />

interface iMagnetPanel extends iPanel {
	quit();
	setXY(x:number, y:number);
	setValue(num:number);
}

interface iMagnetManager {
	edit(_o);
	add(_o);
	paint();
	quit();
}
