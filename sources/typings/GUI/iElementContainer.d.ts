/// <reference path="../iCommons.d.ts" />

interface iElementContainer {
	getDocObject(): HTMLElement;
	getDocObjectBounds(): BoundDimensions;
	appendChild(e: HTMLElement): HTMLElement;
}
