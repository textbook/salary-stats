import { Person } from './models';
import { Statistics } from './statistics';

describe('Statistics', () => {
  describe('calculateBoxPlotData method', () => {
    it('should calculate the quartiles plus lower and upper bounds for outliers', () => {
      expect(Statistics.calculateBoxPlotData([1, 2, 3, 4, 5]))
          .toEqual([-1, 2, 3, 4, 7]);
    });

    it('should round the values calculated by simple-statistics', () => {
      expect(Statistics.calculateBoxPlotData([0.1, 0.2, 0.3, 4, 5]))
          .toEqual([-6, 0, 0, 4, 10]);
    });
  });

  describe('identifyOutliers method', () => {
    it('should return values outside the calculated bounds, indexed by cohort', () => {
      const cohorts = ['X', 'A', 'B'];
      const boxPlotData = [[], [1, 2, 3, 4, 5], [3, 5, 7, 9, 11]];
      const people: Person[] = [
        { name: 'Foo', salary: 0, cohort: 'A' },
        { name: '', salary: 3, cohort: 'A' },
        { name: 'Bar', salary: 6, cohort: 'A' },
        { name: '', salary: 6, cohort: 'B' },
        { name: 'Baz', salary: 15, cohort: 'B' },
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

