export class Vector {
  constructor(public readonly elements: number[]) { }

  push(value: number): void {
    this.elements.push(value);
  }

  length(): number {
    return this.elements.length;
  }

  abs(): Vector {
    const values: number[] = [];
    for (let i = 0; i < this.elements.length; i++) {
      values.push(Math.abs(this.elements[i]));
    }
    return new Vector(values);
  }

  add(term: Vector): Vector {
    const result = new Vector(this.elements.slice(0));
    const n = this.elements.length;
    for (let i = 0; i < n; ++i) {
      result.elements[i] += term.elements[i];
    }
    return result;
  };

  subtract(term: Vector): Vector {
    return this.add(term.multiply(-1));
  };

  multiply(factor: number): Vector {
    const result = new Vector(this.elements.slice(0));
    const n = this.elements.length;
    for (var i = 0; i < n; ++i) {
      result.elements[i] = result.elements[i] * factor;
    }
    return result;
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

  ecdf(arg: Vector): Vector {
    const result = new Vector([]);
    for (let i = 0; i < arg.length(); i++) {
      result.push(this._ecdf(arg.elements[i]));
    }
    return result;
  };

  sort(): Vector {
    return new Vector(this.sortElements());
  };

  max(): number {
    return this.sortElements().pop()!;
  };

  toString(): string {
    return "[" + this.elements.join(", ") + "]";
  };
}
