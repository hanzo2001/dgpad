/// <reference path="./iGUIElement.d.ts" />

interface iPanel extends iGUIElement {
	show();
	close();
	isVisible();
	transition(_type, _speed, _x?);
	applyTransitionIN();
	applyTransitionOUT();
	setBackground(_grad);
	scroll(_dir, tf, _speed);
}
