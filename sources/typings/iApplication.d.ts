
interface String {
	startsWith: (s:string) => boolean;
}

interface Event {
	cursor: string;
	getCursor: () => string;
	setCursor: (cursor:string) => void;
}

interface iApplication {
	applicationCanvas: Canvas[];
	debugSource: boolean;
	touchpadFlag: boolean;
	style: HTMLLinkElement;
	canvas: HTMLCanvasElement;
	scripts: NodeListOf<HTMLScriptElement>;
	applicationPath: string;
	cssScale: number;
	filepickerUrl: string;
	filepickerKey: string;
	standalone: boolean;
	userAgent: string;
	safari: boolean;
	ios: boolean;
	filePickerFrame;
	application: boolean;
	ios_application: boolean;
	initCanvas(id:string);
}

interface iApplicationConstructor {
	loadScriptTag(src:string, onload?:(e)=>void): HTMLScriptElement;
	get(url:string, fn:(xhr:XMLHttpRequest)=>void);
}
