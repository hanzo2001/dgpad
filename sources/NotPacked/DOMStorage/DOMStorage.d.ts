
interface DOMStorage<T> {
	push(e:HTMLElement, d:T);
	collect(e:HTMLElement): T;
	remove(e:HTMLElement): T;
	clear();
	each(fn:(d:T, i?:number)=>void, tArg?:any);
}
