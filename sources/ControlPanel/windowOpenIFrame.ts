
var $APP_PATH = (<any>window).$APP_PATH;

export class windowOpenIFrame {
	protected FPDiv: HTMLElement;
	protected FPFrame: HTMLIFrameElement;
	constructor(url) {
		this.FPDiv = document.createElement("div");
		this.FPDiv.style.width = window.innerWidth+'';
		this.FPDiv.style.height = window.innerHeight+'';
		this.FPDiv.style.position = "absolute";
		this.FPDiv.style.left = "0px";
		this.FPDiv.style.top = "0px";
		this.FPDiv.style.width = window.innerWidth + "px";
		this.FPDiv.style.height = window.innerHeight + "px";
		this.FPDiv.style.backgroundColor = "rgba(0,0,0,0.75)";
		var FPsize = {
			width: window.innerWidth - 50,
			height: window.innerHeight - 50
		};
		this.FPFrame = document.createElement("iframe");
		//this.FPFrame.setAttribute("ID", "FP_" + canvas.getID());
		this.FPFrame.width = FPsize.width+'';
		this.FPFrame.height = FPsize.height+'';
		//this.FPFrame.frameborder = 0+'';//HTML4
		//this.FPFrame.marginheight = 0+'';//HTML4
		//this.FPFrame.marginwidth = 0+'';//HTML4
		this.FPFrame.style.position = "absolute";
		this.FPFrame.style.left = (window.innerWidth - FPsize.width) / 2 + "px";
		this.FPFrame.style.top = (window.innerHeight - FPsize.height) / 2 + "px";
		this.FPFrame.style.width = FPsize.width + "px";
		this.FPFrame.style.height = FPsize.height + "px";
		this.FPFrame.style.overflow = "scroll";
		this.FPFrame.addEventListener('message', function (ev) {/* console.log("couosuuujrljsr"); */ }, false);

		var FPClose = document.createElement("img");
		FPClose.style.position = "absolute";
		FPClose.style.margin = "0px";
		FPClose.style.padding = "0px";
		FPClose.setAttribute('src', $APP_PATH + "NotPacked/images/dialog/closebox.svg");
		FPClose.style.left = ((window.innerWidth + FPsize.width) / 2 - 10) + "px";
		FPClose.style.top = ((window.innerHeight - FPsize.height) / 2 - 20) + "px";
		FPClose.style.width = "30px";
		FPClose.style.height = "30px";
		FPClose.addEventListener('click', () => this.close());
		this.FPDiv.appendChild(this.FPFrame);
		this.FPDiv.appendChild(FPClose);
		this.show();
		this.FPFrame.src = url;
	}
	div(): HTMLElement {
		return this.FPDiv;
	}
	frame(): HTMLIFrameElement {
		return this.FPFrame;
	}
	show() {
		document.body.appendChild(this.FPDiv);
	}
	close() {
		document.body.removeChild(this.FPDiv);
	}
	reload() {
		this.FPFrame.contentDocument.location.reload(true);
	}
}
