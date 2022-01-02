import { Kolmogorov } from "./distributions";
import { Vector } from "./vector";

export const Nonparametric = {
  /*
   * Two-sample Kolmogorov-Smirnov test
   */

  kolmogorovSmirnov(x: Vector, y: Vector): { d: number, ks: number, p: number } {
    const all = new Vector(x.elements.concat(y.elements)).sort();
    const ecdfx = x.ecdf(all);
    const ecdfy = y.ecdf(all);
    const d = ecdfy.subtract(ecdfx).abs().max();
    const n = (x.length() * y.length()) / (x.length() + y.length());
    const ks = Math.sqrt(n) * d;
    const p = 1 - new Kolmogorov().distr(ks);

    return { d, ks, p };
  }
};
