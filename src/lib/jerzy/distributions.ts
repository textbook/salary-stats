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
	
	distr(arg: number): number {
		return this._di(arg);
	};
}
