
declare type SVGCanvasPoint = {
	x?: number,
	y?: number,
	x1?: number,
	y1?: number,
	x2?: number,
	y2?: number,
	action?: string,
	r?: number,
	wa?: number,
	acw?: number
};

declare type SVGCanvasElement = HTMLCanvasElement | HTMLCanvasElement | HTMLVideoElement;

type SVGCanvasOptions = {
	lineDash?: number[]
	strokeStyle: string;
	lineWidth: number;
	lineCap: string;
	lineJoin: string;
	miterLimit: number;
	fillStyle: string;
	shadowOffsetX: number;
	shadowOffsetY: number;
	shadowBlur: number;
	shadowColor: string;
	font: string;
	textAlign: string;
	textBaseline: string;
	globalAlpha: number;
	globalCompositeOperation: string;
}

type SVGCanvasPath = {
	type: string,
	points?: SVGCanvasPoint[],
	style: Object,
	x?: number,
	y?: number,
	text?: string,
	TRANSFORM?: string
};

interface iSVGCanvasUtils {
	currentPath: SVGCanvasPath;
	generateSVG(): string;
	pathLength(): number;
	pushPoint(point:SVGCanvasPoint);
	pushToStack();
	updateCanvasSettings(o:SVGCanvasOptions);
}

interface SVGCanvas {
	fillStyle: number;
	font: number;
	globalAlpha: string;
	globalCompositeOperation: number;
	lineCap: number;
	lineDash: number[];
	lineJoin: number;
	lineWidth: string;
	miterLimit: string;
	shadowOffsetX: string;
	shadowOffsetY: string;
	shadowBlur: string;
	shadowColor: number;
	strokeStyle: string;
	textAlign: number;
	textBaseline: number;
	arcTo(x1:number, y1:number, x2:number, y2:number, radius:number);
	arc(cx:number, cy:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean);
	beginPath();
	bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x?:number, y?:number);
	clearRect(x:number, y:number, width:number, height:number);
	clip();
	closePath();
	createImageData(sw:number, sh:number);
	createImageData(imageData:ImageData);
	createImageData();
	createLinearGradient(x0:number, y0:number, x1:number, y1:number);
	createPattern(image:SVGCanvasElement, repetition:string);
	createRadialGradient(x0:number, y0:number, r0:number, x1:number, y1:number, r1:number);
	drawImage();
	fill();
	fillText(text:string, x:number, y:number);
	fillRect(x:number, y:number, width:number, height:number);
	getCanvas(): HTMLCanvasElement;
	getContext(): CanvasRenderingContext2D;
	getImageData(sx:number, sy:number, sw:number, sh:number): ImageData;
	isPointInPath(x:number, y:number);
	lineTo(x:number, y:number);
	measureText(text:string);
	moveTo(x:number, y:number);
	polarToCartesian(centerX:number, centerY:number, radius:number, angleInRadians:number): SVGCanvasPoint;
	putImageData(imagedata:ImageData, dx:number, dy:number, dirtyX:number, dirtyY:number, dirtyWidth:number, dirtyHeight:number);
	quadraticCurveTo(cpx:number, cpy:number, x:number, y:number);
	rect(x:number, y:number, width:number, height:number);
	restore();
	rotate(angle:number);
	save();
	scale(x:number, y:number);
	setLineDash(tab:number[]);
	setTransform(m11:number, m12:number, m21:number, m22:number, dx:number, dy:number);
	stroke();
	strokeRect(x:number, y:number, width:number, height:number);
	strokeText(text:string, x:number, y:number);
	toDataURL(type:string, args:any[]);
	transform(m11:number, m12:number, m21:number, m22:number, dx:number, dy:number);
	translate(x:number, y:number);
}
