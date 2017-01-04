const _ss = require('simple-statistics');

import { Person } from './models';

const BOUND_MULTIPLIER = 1.5;
const QUARTILES = [0.25, 0.5, 0.75];

export class Statistics {
  static calculateBoxPlotData(sample: number[]): number[] {
    let [lowerQuartile, median, upperQuartile] = QUARTILES.map(p => _ss.quantileSorted(sample, p));
    let interQuartileRange = upperQuartile - lowerQuartile;

    let lowerBound = Math.round(lowerQuartile - (interQuartileRange * BOUND_MULTIPLIER));
    let upperBound = Math.round(upperQuartile + (interQuartileRange * BOUND_MULTIPLIER));

    return [lowerBound, lowerQuartile, median, upperQuartile, upperBound];
  }

  static identifyOutliers(people: Person[], boxPlotData: number[][], cohorts: string[]): number[][] {
      let outliers = [];

      for (let { salary, cohort, name } of people) {
        let index = cohorts.indexOf(cohort);
        let [lowerBound, , , , upperBound] = boxPlotData[index];

        if (salary < lowerBound || salary > upperBound) {
          outliers.push({ x: index, y: salary, name });
        }
      }

      return outliers;
  }
}
