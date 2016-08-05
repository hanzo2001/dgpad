
declare type BoundDim = {
	top: number;
	left: number;
	width: number;
	height: number;
}

interface iElementContainer {
	getDocObject(): HTMLElement;
	getDocObjectBounds(): BoundDim;
	appendChild(e: HTMLElement): HTMLElement;
}
