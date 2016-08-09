/// <reference path="./typings/iTrack.d.ts" />
/// <reference path="./typings/iCanvas.d.ts" />

// external TrackObject definition in *.d.ts

var $U = (<any>window).$U;

export class TrackManager implements iTrackManager {
	private canvas: iCanvas;
	private tracks: TrackObject[];
	private docObject: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	constructor(canvas: iCanvas) {
		this.canvas = canvas;
		this.tracks = [];
		this.docObject = document.createElement('canvas');
		this.ctx = this.docObject.getContext('2d');
		this.canvas.getDocObject().parentNode.insertBefore(this.docObject, this.canvas.getDocObject().nextSibling);
		$U.STL(this.docObject, 'position: absolute;top:0px;left:0px;pointer-events:none;background-color:rgba(0,0,0,0)');
		$U.ATT(this.docObject, 'width:' + this.canvas.getWidth() + ';height:' + this.canvas.getHeight());
		this.ctx.globalAlpha = 1;
	}
	getDocObject(): HTMLCanvasElement {
		return this.docObject;
	}
	add(o:TrackObject, forced:boolean) {
		if (!forced && o.isHidden()) return;
		let i=0, s=this.tracks.length;
		while (i<s) {
			if (this.tracks[i++] === o) return;
		}
		o.startTrack();
		this.tracks.push(o);
	}
	remove(o:TrackObject) {
		this.docObject.width = this.docObject.width;// huh??? this again?
		let i=0, s=this.tracks.length;
		while (i<s) {
			if (this.tracks[i] === o) {
				this.tracks[i].clearTrack();
				this.tracks.splice(i, 1);
				return;
			}
			i++;
		}
	}
	resize() {
		let width = this.canvas.getWidth();
		let height= this.canvas.getHeight();
		$U.ATT(this.docObject, `width:${width};height:${height}`);
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	}
	draw() {
		let i=0, s=this.tracks.length;
		while (i<s) {this.tracks[i++].drawTrack(this.ctx);}
	}
	setAllTrack(type, value:boolean) {
		let v = this.canvas.getConstruction().elements();
		let proc = value ? this.add : this.remove;
		for (let i = 0, len = v.length; i < len; i++) {
			if (v[i].getFamilyCode() === type) {
				proc.call(this, v[i]);
			}
		}
	}
}
