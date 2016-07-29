
var $U = (<any>window).$U;
var $APP_PATH = (<any>window).$APP_PATH;

export class FilePickerDIV {
	protected canvas;
	protected ParentDOM;
	protected FPDiv;
	protected FPsize;
	protected FPFrame;
	constructor(_c) {
		this.canvas = _c;
		this.ParentDOM = _c.getDocObject().parentNode;
		this.FPDiv = document.createElement('div');
		this.FPsize = {
				width: 820,
				height: 520
		};
		this.FPFrame = document.createElement('iframe');
		this.FPDiv.setAttribute('width', this.canvas.getBounds().width);
		this.FPDiv.setAttribute('height', this.canvas.getBounds().height);
		this.FPDiv.style.position = 'absolute';
		this.FPDiv.style.left = (this.canvas.getBounds().left) + 'px';
		this.FPDiv.style.top = (this.canvas.getBounds().top) + 'px';
		this.FPDiv.style.width = (this.canvas.getBounds().width) + 'px';
		this.FPDiv.style.height = (this.canvas.getBounds().height) + 'px';
		this.FPDiv.style.backgroundColor = 'rgba(0,0,0,0.75)';
		this.FPFrame.setAttribute('ID', 'FP_' + this.canvas.getID());
		this.FPFrame.setAttribute('width', this.FPsize.width);
		this.FPFrame.setAttribute('height', this.FPsize.height);
		this.FPFrame.setAttribute('frameborder', 0);
		this.FPFrame.setAttribute('marginheight', 0);
		this.FPFrame.setAttribute('marginwidth', 0);
		this.FPFrame.style.position = 'absolute';
		this.FPFrame.style.left = (this.canvas.getBounds().width - this.FPsize.width) / 2 + 'px';
		this.FPFrame.style.top = (this.canvas.getBounds().height - this.FPsize.height) / 2 + 'px';
		this.FPFrame.style.width = this.FPsize.width + 'px';
		this.FPFrame.style.height = this.FPsize.height + 'px';
		this.FPFrame.style.overflow = 'hidden';

		var FPClose = document.createElement('img');
		FPClose.style.position = 'absolute';
		FPClose.style.margin = '0px';
		FPClose.style.padding = '0px';
		FPClose.setAttribute('src', $APP_PATH + 'NotPacked/images/dialog/closebox.svg');
		FPClose.style.left = ((this.canvas.getBounds().width + this.FPsize.width) / 2 - 10) + 'px';
		FPClose.style.top = ((this.canvas.getBounds().height - this.FPsize.height) / 2 - 20) + 'px';
		FPClose.style.width = '30px';
		FPClose.style.height = '30px';
		FPClose.addEventListener('click',() => this.ParentDOM.removeChild(this.FPDiv));

		this.FPDiv.appendChild(this.FPFrame);
		this.FPDiv.appendChild(FPClose);
	}
	div() {
		return this.FPDiv;
	}
	id() {
		return ('FP_' + this.canvas.getID());
	}
	frame() {
		return this.FPFrame;
	}
	show() {
		this.ParentDOM.appendChild(this.FPDiv);
	}
	close() {
		this.ParentDOM.removeChild(this.FPDiv);
	}
}
