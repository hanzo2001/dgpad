
type CommonEvent = (e:Event) => void;

interface ExpandoDOMElement extends HTMLElement {
	event_proc: CommonEvent[];
	letters?: string[][];
	car?: string;
	key?: string;
	stl: (p:string, v:string) => void;
	att: (n:string, v:string) => void;
	stls: (str:string) => void;
	bnds: (left:number,top:number,width:number,height:number) => void;
	center: (width:number, height:number) => void;
	add: (child:Node) => void;
	rmv: (child:Node) => void;
	md: (fn:CommonEvent) => void;
	mm: (fn:CommonEvent) => void;
	mu: (fn:CommonEvent) => void;
	kd: (fn:CommonEvent) => void;
	ku: (fn:CommonEvent) => void;
	rmevt: () => void;
}
