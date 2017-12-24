declare const require: any;
const _ss = require('simple-statistics');

import { Person } from './models';
import { Statistics } from './statistics';

describe('Statistics', () => {
  describe('calculateBoxPlotData method', () => {
    const testSample = [1, 2, 3, 4, 5];

    beforeEach(() => {
      spyOn(_ss, 'quantileSorted').and.callFake((sample, p) => Math.round(100 * p));
    });

    it('should get the median and quartiles from simple-statistics', () => {
      Statistics.calculateBoxPlotData(testSample);

      expect(_ss.quantileSorted).toHaveBeenCalledWith(testSample, 0.25);
      expect(_ss.quantileSorted).toHaveBeenCalledWith(testSample, 0.5);
      expect(_ss.quantileSorted).toHaveBeenCalledWith(testSample, 0.75);
    });

    it('should calculate the lower and upper bounds for outliers', () => {
      expect(Statistics.calculateBoxPlotData(testSample))
          .toEqual([-50, 25, 50, 75, 150]);
    });

    it('should round the values calculated by simple-statistics', () => {
      _ss.quantileSorted.and.returnValue(1.23);

      expect(Statistics.calculateBoxPlotData(testSample))
          .toEqual([1, 1, 1, 1, 1]);
    });
  });

  describe('identifyOutliers method', () => {
    it('should return values outside the calculated bounds, indexed by cohort', () => {
      const cohorts = ['X', 'A', 'B'];
      const boxPlotData = [[], [1, 2, 3, 4, 5], [3, 5, 7, 9, 11]];
      const people: Person[] = [
        new Person('Foo', 0, 'A'),
        new Person('', 3, 'A'),
        new Person('Bar', 6, 'A'),
        new Person('', 6, 'B'),
        new Person('Baz', 15, 'B'),
      ];
      const result = Statistics.identifyOutliers(people, boxPlotData, cohorts);

      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ x: 1, y: 0, name: 'Foo' });
      expect(result[1]).toEqual({ x: 1, y: 6, name: 'Bar' });
      expect(result[2]).toEqual({ x: 2, y: 15, name: 'Baz' });
    });
  });

  describe('compareSamples method', () => {
    it('returns a p-value and whether the samples are significantly different', () => {
      const sampleA = [50, 25, 10, 4, 3, 2, 1];

      const aComparedToA = Statistics.compareSamples(sampleA, sampleA.concat(2));
      expect(aComparedToA.pValue).toBeCloseTo(0.99999, 4);
      expect(aComparedToA.sameDistribution).toBe(true);

      const sampleB = [100, 45, 35, 25, 100, 50, 65, 30];

      const aComparedToB = Statistics.compareSamples(sampleA, sampleB);
      expect(aComparedToB.pValue).toBeCloseTo(0.03654, 4);
      expect(aComparedToB.sameDistribution).toBe(false);
    });
  });
});

