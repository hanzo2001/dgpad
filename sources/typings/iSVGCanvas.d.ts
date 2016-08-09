
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

interface SVGCanvas {
	lineDash: number[];
	strokeStyle: string;
	lineWidth: string;
	lineCap: number;
	lineJoin: number;
	miterLimit: string;
	fillStyle: number;
	shadowOffsetX: string;
	shadowOffsetY: string;
	shadowBlur: string;
	shadowColor: number;
	font: number;
	textAlign: number;
	textBaseline: number;
	globalAlpha: string;
	globalCompositeOperation: number;
	getCanvas(): HTMLCanvasElement;
	getContext(): CanvasRenderingContext2D;
	polarToCartesian(centerX:number, centerY:number, radius:number, angleInRadians:number): SVGCanvasPoint;
	beginPath();
	closePath();
	moveTo(x:number, y:number);
	lineTo(x:number, y:number);
	quadraticCurveTo(cpx:number, cpy:number, x:number, y:number);
	bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x?:number, y?:number);
	arcTo(x1:number, y1:number, x2:number, y2:number, radius:number);
	arc(cx:number, cy:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean);
	rect(x:number, y:number, width:number, height:number);
	clearRect(x:number, y:number, width:number, height:number);
	fillRect(x:number, y:number, width:number, height:number);
	strokeRect(x:number, y:number, width:number, height:number);
	isPointInPath(x:number, y:number);
	stroke();
	fill();
	strokeText(text:string, x:number, y:number);
	fillText(text:string, x:number, y:number);
	measureText(text:string);
	clip();
	save();
	restore();
	createLinearGradient(x0:number, y0:number, x1:number, y1:number);
	createRadialGradient(x0:number, y0:number, r0:number, x1:number, y1:number, r1:number);
	createPattern(image, repetition);
	createImageData(sw:number, sh:number);
	createImageData(imageData:ImageData);
	createImageData();
	getImageData(sx:number, sy:number, sw:number, sh:number): ImageData;
	putImageData(imagedata:ImageData, dx:number, dy:number, dirtyX:number, dirtyY:number, dirtyWidth:number, dirtyHeight:number);
	drawImage();
	scale(x:number, y:number);
	rotate(angle:number);
	translate(x:number, y:number);
	setLineDash(tab:number[]);
	transform(m11, m12, m21, m22, dx, dy);
	setTransform(m11, m12, m21, m22, dx, dy);
	toDataURL(type, args);
}
