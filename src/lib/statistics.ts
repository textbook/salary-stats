const _ss = require('simple-statistics');

import { Person } from './models';

const FENCE_FACTOR = 1.5;
const QUARTILES = [0.25, 0.5, 0.75];

export class Statistics {
  static calculateBoxPlotData(sample: number[]): number[] {
    let [lowerQuartile, median, upperQuartile] = QUARTILES.map(p => _ss.quantileSorted(sample, p));
    let interQuartileRange = upperQuartile - lowerQuartile;

    let lowerInnerFence = Math.round(lowerQuartile - (interQuartileRange * FENCE_FACTOR));
    let upperInnerFence = Math.round(upperQuartile + (interQuartileRange * FENCE_FACTOR));

    return [lowerInnerFence, lowerQuartile, median, upperQuartile, upperInnerFence];
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
