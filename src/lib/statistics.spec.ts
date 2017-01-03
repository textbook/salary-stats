const _ss = require('simple-statistics');

import { Statistics } from './statistics';

describe('Statistics', () => {
  describe('generateBoxPlotData method', () => {
    beforeEach(() => {
      spyOn(_ss, 'quantileSorted').and.returnValue(0);
    });

    it('should sort the values', () => {
      Statistics.generateBoxPlotData([5, 2, 3, 1, 4]);

      expect(_ss.quantileSorted).toHaveBeenCalledWith([1, 2, 3, 4, 5], 0);
    });

    it('should return the min, max, median and quartiles', () => {
      _ss.quantileSorted.and.callFake((sample, p) => p);

      let result = Statistics.generateBoxPlotData([1, 2, 3, 4, 5]);

      expect(_ss.quantileSorted).toHaveBeenCalledWith([1, 2, 3, 4, 5], 0);
      expect(result).toEqual([0, 0.25, 0.5, 0.75, 1]);
    });
  });
});
