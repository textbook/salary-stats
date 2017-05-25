declare const require: any;
const _ss = require('simple-statistics');

import { Person } from './models';
import { Nonparametric, Vector } from 'jerzy';

const FENCE_FACTOR = 1.5;
const QUARTILES = [0.25, 0.5, 0.75];

export class Statistics {
  private static SIGNIFICANCE_LEVEL = 0.05;

  static calculateBoxPlotData(sample: number[]): number[] {
    let [lowerQuartile, median, upperQuartile] = QUARTILES
        .map(p => Math.round(_ss.quantileSorted(sample, p)));
    let interQuartileRange = upperQuartile - lowerQuartile;

    let lowerInnerFence = Math.round(lowerQuartile - (interQuartileRange * FENCE_FACTOR));
    let upperInnerFence = Math.round(upperQuartile + (interQuartileRange * FENCE_FACTOR));

    return [lowerInnerFence, lowerQuartile, median, upperQuartile, upperInnerFence];
  }

  static identifyOutliers(people: Person[], boxPlotData: number[][], cohorts: string[]): any[] {
      return people
          .filter(({ salary, cohort }) => {
            let index = cohorts.indexOf(cohort);
            let [lowerBound, , , , upperBound] = boxPlotData[index];
            return salary < lowerBound || salary > upperBound;
          })
          .map(({ salary, cohort, name }) => ({ x: cohorts.indexOf(cohort), y: salary, name }));
  }

  static compareSamples(sampleA: number[], sampleB: number[]) {
      let ks = Nonparametric.kolmogorovSmirnov(new Vector(sampleA), new Vector(sampleB));
      return {
          pValue: ks.p,
          sameDistribution: ks.p >= Statistics.SIGNIFICANCE_LEVEL
      };
  }
}
