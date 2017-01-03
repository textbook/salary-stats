const _ss = require('simple-statistics');

export class Statistics {
  static generateBoxPlotData(values: number[]) {
    let sample = values.sort();
    return [0, 0.25, 0.5, 0.75, 1.0].map(p => _ss.quantileSorted(sample, p));
  }
}
