/// <reference path="./iSVGCanvas.d.ts" />

import {Color} from '../Color/Color';
import {ColorStringParser as Parser} from '../Color/ColorStringParser';

function svgGenerator(width:number, height:number, body:string) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	x="0px" y="0px"
	width="${width}" height="${height}"
	viewBox="0, 0, ${width}, ${height}">${body}</svg>`;
}

export class SVGCanvasUtils implements iSVGCanvasUtils {
	public currentPath: SVGCanvasPath;
	constructor(
		public canvas: HTMLCanvasElement,
		public ctx: CanvasRenderingContext2D,
		public paths: SVGCanvasPath[]
	) {
		this.currentPath = {
			type: 'path',
			points: [],
			style: {}
		};
	}
	updateCanvasSettings(o:SVGCanvasOptions) {
		for (let i in o) {this.ctx[i] = o[i];}
		this.ctx.setLineDash(o.lineDash);
	}
	pushToStack() {
		if (this.currentPath.points.length) {
			this.paths.push(this.currentPath);
			this.currentPath = {
				type: 'path',
				points: [],
				style: {}
			}
		}
	}
	generateSVG(): string {
		let xml = '', i=0, s=this.paths.length;
		while (i<s) {
			let path = this.paths[i++], style='', attr:string;
			let styles = path.style;
			let match: number[], color = new Color();
			for (attr in styles) {
				let s = styles[attr];
				switch (attr) {
					case 'fill':
						try {
							color.set(s);
							style += `fill-opacity:${color.alpha};`;
							styles[attr] = color.getHEX();
						} catch (e) {}
						break;
					case 'stroke':
						try {
							color.set(s);
							style += `stroke-opacity:${color.alpha};`;
							styles[attr] = color.getHEX();
						} catch (e) {}
						break;
					case 'font':
						let [size, family] = s.split(' ');
						style += family ? `font-size:${size};font-family:${family};` : `font:${s};`;
						break;
					case 'text-align':
						switch (s) {
							case 'center': style += 'text-anchor:middle;'+'text-align:center;'; break;
							case 'left':   style += 'text-anchor:start;' +'text-align:left;';   break;
							case 'right':  style += 'text-anchor:end;'   +'text-align:right;';  break;
						}
						break;
					default:
						style += `${attr}:${s};`;
						break;
				}
			}
			switch (path.type) {
				case 'text':
					let transform = path.TRANSFORM ? ` transform="${path.TRANSFORM}"` : '';
					xml += `<text x="${path.x}" y="${path.y}" style="${style}"${transform}>${path.text}</text>`;
					break;
				case 'path':
					let points = '';
					let i=0, s=path.points.length;
					while (i<s) {
						let p = path.points[i++];
						switch (p.action) {
							case 'move':     points += `M${p.x} ${p.y} `; break;
							case 'line':     points += `L${p.x} ${p.y} `; break;
							case 'quadratic':points += `Q${p.x1} ${p.y1} ${p.x} ${p.y} `; break;
							case 'bezier':   points += `C${p.x2} ${p.y2} ${p.x1} ${p.y1} ${p.x} ${p.y} `; break;
							case 'arc':      points += `M${p.x1} ${p.y1} A ${p.r} ${p.r} 0 ${p.wa} ${p.acw} ${p.x2} ${p.y2} `; break;
							case 'circle':   points += `M${p.x} ${p.y} m ${-p.r}, 0 a ${p.r},${p.r} ${p.y} 0 1,0 ${2*p.r},0 a ${p.r},${p.r} 0 1,0 ${-2*p.r},0 `;
						}
					}
					xml += `<path d="${points}" style="${style}" />`;
					break;
			}
		}
		return svgGenerator(this.canvas.width, this.canvas.height, xml);
	}
	pushPoint(point:SVGCanvasPoint) {
		this.currentPath.points.push(point);
	}
	pathLength(): number {
		return this.currentPath.points.length;
	}
}
