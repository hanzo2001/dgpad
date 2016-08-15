
type Point = number[];
type Vector = number[];
type Complex = number[];
type Angle = number;

type num = number | Complex;
type ComplexSolutions = Complex[];

interface iMathExtension {
	coef3D: number;
	doublePI: number;
	simplePI: number;
	deg: boolean;
	rad: boolean;
	Angle180(A:Point, O:Point, C:Point): Angle;
	Angle360(A:Point, O:Point ,C:Point): Angle;
	test(test:boolean, tr:any, fl:any): any;
	IF(test:boolean, tr:any, fl:any): any;
	unitVector(a:Vector): num;
	crossProduct( A:Vector, B:Vector): Vector|number;
	distance(A:Point, B:Point): number;
	plus(a:any, b:any): num | string;
	minus(a:num, b:num): num;
	times(b:num, a:num): num;
	quotient(a:num, b:num): num;
	power(a:num, b:number): num|ComplexSolutions;
	gcd(a:number, b:number): number;
	csqrt(a: num): num|ComplexSolutions;
	mod(a:num): number;
	arg(a:num): number;
	conj(a:num): num;
	angleH(x:number, y:number): number;
	asin(x:number): number;
	acos(x:number): number;
	atan(x:number): number;
	atan2(x:number, y:number): number;
	sin(x:number): number;
	cos(x:number): number;
	tan(x:number): number;
	sqrt(x:number): number;
}
