const _ss = require('simple-statistics');

import { Statistics } from './statistics';

describe('Statistics', () => {
  describe('calculateBoxPlotData method', () => {
    let testSample = [1, 2, 3, 4, 5];

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
  });

  describe('identifyOutliers method', () => {
    it('should return values outside the calculated bounds, indexed by cohort', () => {
      let cohorts = ['X', 'A', 'B'];
      let boxPlotData = [[], [1, 2, 3, 4, 5], [3, 5, 7, 9, 11]];
      let people = [
        { name: 'Foo', salary: 0, cohort: 'A' },
        { name: '', salary: 3, cohort: 'A' },
        { name: 'Bar', salary: 6, cohort: 'A' },
        { name: '', salary: 6, cohort: 'B' },
        { name: 'Baz', salary: 15, cohort: 'B' },
      ];
      let result = Statistics.identifyOutliers(people, boxPlotData, cohorts);

      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ x: 1, y: 0, name: 'Foo' });
      expect(result[1]).toEqual({ x: 1, y: 6, name: 'Bar' });
      expect(result[2]).toEqual({ x: 2, y: 15, name: 'Baz' });
    });
  });
});

