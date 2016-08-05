/// <reference path="../../typings/GUI/iPanel.d.ts" />

import {GUIElement} from '../elements/GUIElement';

var $U = (<any>window).$U;

export class Panel extends GUIElement implements iPanel {
	protected effect: string;
	protected effect_var1: number;
	constructor(owner:iElementContainer) {
		super(owner,'div');
		this.effect = '';
		this.effect_var1 = 0;
		this.setAbsolute();
		//this.show_callback = function() {}
		//this.close_callback = function() {}
	}
	show() {
		// Si je n'ai pas encore de parent :
		if (this.docObject.parentNode === null) {
			this.owner.appendChild(this.docObject);
			this.applyTransitionIN();
		}
	}
	close() {
		this.applyTransitionOUT();
		setTimeout(() => {
			if (this.isVisible()) {
				try {
					this.docObject.parentNode.removeChild(this.docObject);
					//this.owner.removeChild(this.docObject);
				} catch (e) {};
			}
		}, 300);
		//this.close_callback();
	}
	isVisible() {
		return this.docObject.parentNode !== null;
	}
	transition(type:string, speed:number, x?:number) {
		this.effect = type;
		switch (this.effect) {
			case "translate_x":
				this.setStyle("transition", "transform " + speed + "s linear");
				this.setStyle("-webkit-transition", "-webkit-transform " + speed + "s linear");
				this.setStyle("-moz-transition", "-moz-transform " + speed + "s linear");
				this.setStyle("-o-transition", "-o-transform " + speed + "s linear");
				this.effect_var1 = x;
				break;
			case "translate_y":
				this.setStyle("transition", "transform " + speed + "s linear");
				this.setStyle("-webkit-transition", "-webkit-transform " + speed + "s linear");
				this.setStyle("-moz-transition", "-moz-transform " + speed + "s linear");
				this.setStyle("-o-transition", "-o-transform " + speed + "s linear");
				this.effect_var1 = x;
				break;
			case "scale":
				this.setStyle("transition", "transform " + speed + "s linear");
				this.setStyle("-webkit-transition", "-webkit-transform " + speed + "s linear");
				this.setStyle("-moz-transition", "-moz-transform " + speed + "s linear");
				this.setStyle("-o-transition", "-o-transform " + speed + "s linear");
				break;
			case "opacity":
				this.setStyle("transition", "opacity " + speed + "s ease-in-out");
				this.setStyle("-webkit-transition", "opacity " + speed + "s ease-in-out");
				this.setStyle("-moz-transition", "opacity " + speed + "s ease-in-out");
				this.setStyle("-o-transition", "opacity " + speed + "s ease-in-out");
				break;
		}
	}
	applyTransitionIN() {
		switch (this.effect) {
			case "translate_x":
				this.setStyle("transform", "translateX(" + this.effect_var1 + "px)");
				this.setStyle("-webkit-transform", "translateX(" + this.effect_var1 + "px)");
				this.setStyle("-moz-transform", "translateX(" + this.effect_var1 + "px)");
				this.setStyle("-o-transform", "translateX(" + this.effect_var1 + "px)");
				setTimeout(() => {
					this.setStyle("transform", "translate3d(0,0,0)");
					this.setStyle("-webkit-transform", "translate3d(0,0,0)");
					this.setStyle("-moz-transform", "translate3d(0,0,0)");
					this.setStyle("-o-transform", "translate(0,0)");
				}, 1);
				break;
			case "translate_y":
				this.setStyle("transform", "translateY(" + this.effect_var1 + "px)");
				this.setStyle("-webkit-transform", "translateY(" + this.effect_var1 + "px)");
				this.setStyle("-moz-transform", "translateY(" + this.effect_var1 + "px)");
				this.setStyle("-o-transform", "translateY(" + this.effect_var1 + "px)");
				setTimeout(() => {
					this.setStyle("transform", "translate3d(0,0,0)");
					this.setStyle("-webkit-transform", "translate3d(0,0,0)");
					this.setStyle("-moz-transform", "translate3d(0,0,0)");
					this.setStyle("-o-transform", "translate(0,0)");
				}, 1);
				break;
			case "scale":
				this.setStyle("transform", "scale(0)");
				this.setStyle("-webkit-transform", "scale(0)");
				this.setStyle("-moz-transform", "scale(0)");
				this.setStyle("-o-transform", "scale(0)");
				setTimeout(() => {
					this.setStyle("transform", "scale(1)");
					this.setStyle("-webkit-transform", "scale(1)");
					this.setStyle("-moz-transform", "scale(1)");
					this.setStyle("-o-transform", "scale(1)");
				}, 1);
				break;
			case "opacity":
				setTimeout(() => {
					this.setStyle("opacity", "1");
				}, 1);
				break;
		}
	}
	applyTransitionOUT() {
		switch (this.effect) {
			case "translate_x":
				setTimeout(() => {
					this.setStyle("transform", "translate3d(" + this.effect_var1 + "px,0, 0)");
					this.setStyle("-webkit-transform", "translate3d(" + this.effect_var1 + "px,0, 0)");
					this.setStyle("-moz-transform", "translate3d(" + this.effect_var1 + "px,0, 0)");
					this.setStyle("-o-transform", "translate(" + this.effect_var1 + "px,0)");
				}, 1);
				break;
			case "translate_y":
				setTimeout(() => {
					this.setStyle("transform", "translate3d(0," + this.effect_var1 + "px, 0)");
					this.setStyle("-webkit-transform", "translate3d(0," + this.effect_var1 + "px, 0)");
					this.setStyle("-moz-transform", "translate3d(0," + this.effect_var1 + "px, 0)");
					this.setStyle("-o-transform", "translate(0," + this.effect_var1 + "px)");
				}, 1);
				break;
			case "scale":
				setTimeout(() => {
					this.setStyle("transform", "scale(0)");
					this.setStyle("-webkit-transform", "scale(0)");
					this.setStyle("-moz-transform", "scale(0)");
					this.setStyle("-o-transform", "scale(0)");
				}, 1);
				break;
			case "opacity":
				setTimeout(() => {
					this.setStyle("opacity", "0");
				}, 1);
				break;
		}
	}
	setBackground(grad) {
		let browser = $U.browserCode();
		this.setStyle("background",browser+grad);
	}
	// For overflow panels(speed : 1-10) :
	scroll(_dir, tf, speed) {
		let s = "";
		switch (_dir) {
			case "top": s = "scrollTop"; break;
			case "left":s = "scrollLeft";break;
		}
		let t0 = this.docObject[s];
		if (t0 !== tf) {
			let i = speed * (tf - t0) / Math.abs(tf - t0);
			let interval = setInterval(() => {
				this.docObject[s] = t0;
				t0 += i;
				if (Math.abs(tf - t0) < speed) {
					this.docObject[s] = tf;
					clearInterval(interval);
				}
			}, 10);
		}
	}
}
