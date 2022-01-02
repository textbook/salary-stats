
/*
 * root finding: bisection
 */

export function bisection(f: (arg: number) => number, a: number, b: number, eps?: number): number {
  eps = typeof eps !== "undefined" ? eps : 1e-9;
  while (Math.abs(a - b) > eps) {
    if (f(a) * f((a + b) / 2) < 0) {
      b = (a + b) / 2;
    } else {
      a = (a + b) / 2;
    }
  }
  return (a + b) / 2;
}
