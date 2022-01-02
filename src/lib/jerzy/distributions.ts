import { bisection } from "./numeric";
import { Vector } from "./vector";

/*
* Kolmogorov distribution
*/

export class Kolmogorov {
	private _di(x: number): number {
		let term;
		let sum = 0;
		let k = 1;
		do {
			term = Math.exp(-Math.pow(2 * k - 1, 2) * Math.pow(Math.PI, 2) / (8 * Math.pow(x, 2)));
			sum = sum + term;
			k++;
		} while (Math.abs(term) > 0.000000000001);
		return Math.sqrt(2 * Math.PI) * sum / x;
	};
	
	distr(arg: Vector): Vector;
	distr(arg: number): number;
	distr(arg: Vector | number): Vector | number {
		if (arg instanceof Vector) {
			const result = new Vector([]);
			for (let i = 0; i < arg.length(); ++i) {
				result.push(this._di(arg.elements[i]));
			}
			return result;
		} else {
			return this._di(arg);
		}
	};
	
	inverse(x: number): number {
		return bisection((y) => this._di(y) - x, 0, 1);
	};
}
