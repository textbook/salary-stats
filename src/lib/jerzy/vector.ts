export class Vector {
  constructor(public readonly elements: number[]) { }

  push(value: number): void {
    this.elements.push(value);
  }

  map(func: (arg: number) => number): Vector {
    return new Vector(this.elements.map(func));
  }

  length(): number {
    return this.elements.length;
  }

  concat(x: Vector): Vector {
    return new Vector(this.elements.slice(0).concat(x.elements.slice(0)));
  }

  abs(): Vector {
    const values: number[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      values.push(Math.abs(this.elements[i]));
    }
    return new Vector(values);
  }

  dot(v: Vector): number {
    let result = 0;
    for (let i = 0; i < this.length(); i++) {
      result = result + this.elements[i] * v.elements[i];
    }
    return result;
  }

  sum(): number {
    let sum = 0;
    for (let i = 0, n = this.elements.length; i < n; ++i) {
      sum += this.elements[i];
    }
    return sum;
  };

  log(): Vector {
    const result = new Vector(this.elements.slice(0));
    const n = this.elements.length;
    for (var i = 0; i < n; ++i) {
      result.elements[i] = Math.log(result.elements[i]);
    }
    return result;
  };

  add(term: Vector | number): Vector {
    const result = new Vector(this.elements.slice(0));
    const n = this.elements.length;
    if (term instanceof Vector) {
      for (let i = 0; i < n; ++i) {
        result.elements[i] += term.elements[i];
      }
    } else {
      for (let i = 0; i < n; ++i) {
        result.elements[i] += term;
      }
    }
    return result;
  };

  subtract(term: Vector): Vector {
    return this.add(term.multiply(-1));
  };

  multiply(factor: Vector | number): Vector {
    const result = new Vector(this.elements.slice(0));
    const n = this.elements.length;
    if (factor instanceof Vector) {
      for (var i = 0; i < n; ++i) {
        result.elements[i] = result.elements[i] * factor.elements[i];
      }
    } else {
      for (var i = 0; i < n; ++i) {
        result.elements[i] = result.elements[i] * factor;
      }
    }
    return result;
  };

  pow(p: Vector | number): Vector {
    const result = new Vector(this.elements.slice(0));
    const n = this.elements.length;
    if (p instanceof Vector) {
      for (let i = 0; i < n; ++i) {
        result.elements[i] = Math.pow(result.elements[i], p.elements[i]);
      }
    } else {
      for (let i = 0; i < n; ++i) {
        result.elements[i] = Math.pow(result.elements[i], p);
      }
    }
    return result;
  };

  mean(): number {
    let sum = 0;
    const n = this.elements.length;
    for (let i = 0; i < n; ++i) {
      sum += this.elements[i];
    }
    return sum / this.elements.length;
  };

  geomean(): number {
    return Math.exp(this.log().sum() / this.elements.length);
  };

  sortElements(): number[] {
    const sorted = this.elements.slice(0);
    for (let i = 0, j, tmp; i < sorted.length; ++i) {
      tmp = sorted[i];
      for (j = i - 1; j >= 0 && sorted[j] > tmp; --j) {
        sorted[j + 1] = sorted[j];
      }
      sorted[j + 1] = tmp;
    }
    return sorted;
  };

  _ecdf(x: number): number {
    const sorted = this.sortElements();
    let count = 0;
    for (let i = 0; i < sorted.length && sorted[i] <= x; i++) {
      count++;
    }
    return count / sorted.length;
  };

  ecdf(arg: Vector): Vector;
  ecdf(arg: number): number;
  ecdf(arg: Vector | number): Vector | number {
    if (arg instanceof Vector) {
      const result = new Vector([]);
      for (let i = 0; i < arg.length(); i++) {
        result.push(this._ecdf(arg.elements[i]));
      }
      return result;
    } else {
      return this._ecdf(arg);
    }
  };

  sort(): Vector {
    return new Vector(this.sortElements());
  };

  min(): number {
    return this.sortElements()[0];
  };

  max(): number {
    const maxElement = this.sortElements().pop();
    if (maxElement === undefined) {
      throw new Error("cannot find max of empty Vector");
    }
    return maxElement;
  };

  toString(): string {
    return "[" + this.elements.join(", ") + "]";
  };

  /*
   * unbiased sample variance
   */

  variance(): number {
    return this.ss() / (this.elements.length - 1);
  };

  /*
   * biased sample variance
   */

  biasedVariance(): number {
    return this.ss() / this.elements.length;
  };

  /*
   * corrected sample standard deviation
   */

  sd(): number {
    return Math.sqrt(this.variance());
  };

  /*
   * uncorrected sample standard deviation
   */

  uncorrectedSd(): number {
    return Math.sqrt(this.biasedVariance());
  };

  /*
   * standard error of the mean
   */

  sem(): number {
    return this.sd() / Math.sqrt(this.elements.length);
  };

  /*
   * total sum of squares
   */

  ss(): number {
    const m = this.mean();
    let sum = 0;
    const n = this.elements.length
    for (let i = 0; i < n; ++i) {
      sum += Math.pow(this.elements[i] - m, 2);
    }
    return sum;
  };

  /*
   * residuals
   */

  res(): Vector {
    return this.add(-this.mean());
  };

  kurtosis() {
    return this.res().pow(4).mean() / Math.pow(this.res().pow(2).mean(), 2);
  };

  skewness() {
    return this.res().pow(3).mean() / Math.pow(this.res().pow(2).mean(), 3 / 2);
  };
}
