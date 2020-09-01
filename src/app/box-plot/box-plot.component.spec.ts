import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BoxPlotComponent } from './box-plot.component';
import { CohortMap, Person, Statistics } from '../../lib';
import * as Highcharts from 'highcharts';

describe('BoxPlotComponent', () => {
  let component: BoxPlotComponent;
  let fixture: ComponentFixture<BoxPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxPlotComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('chart options', () => {
    it('should provide appropriate chart options', () => {
      const options = getChartOptions();
      expect(options.title?.text).toBe('Salary Comparison');
      expect(options.chart?.type).toBe('boxplot');
      expect((options.yAxis as Highcharts.YAxisOptions).title?.text).toBe('Salary (£)');
    });

    it('should use salaries in the points', () => {
      const plotValues = [1, 2, 3, 4, 5];
      spyOn(Statistics, 'calculateBoxPlotData').and.returnValue(plotValues);
      const salary = 1234;

      setInputData([{ name: 'Baz', salary, cohort: 'A' }], { 'A': [salary] });

      const boxplot = getChartOptions().series?.[0] as Highcharts.SeriesBoxplotOptions;
      expect(boxplot?.data?.[0]).toEqual(plotValues);
      expect(Statistics.calculateBoxPlotData).toHaveBeenCalledWith([salary]);
    });

    it('should provide a point per cohort', () => {
      setInputData(
          [{ name: 'Foo', salary: 10, cohort: 'A' }, { name: 'Bar', salary: 20, cohort: 'B' }],
          { 'A': [10], 'B': [20] },
      );

      const boxplot = getChartOptions().series?.[0] as Highcharts.SeriesBoxplotOptions;
      expect(boxplot?.data?.length).toBe(2);
    });

    it('should provide an outliers series', () => {
      setInputData(
          [
            { name: 'Foo', salary: 10, cohort: 'A' },
            { name: 'Foo', salary: 10, cohort: 'A' },
            { name: 'Foo', salary: 10, cohort: 'A' },
            { name: 'Foo', salary: 10, cohort: 'A' },
            { name: 'Foo', salary: 10, cohort: 'A' },
            { name: 'Bar', salary: 100, cohort: 'A' },
          ],
          { 'A' : [10, 10, 10, 10, 10, 100] },
      );

      const scatter = getChartOptions().series?.[1] as Highcharts.SeriesScatterOptions;
      expect(scatter?.data?.length).toBe(1);
    });

    describe('tooltip formatter', () => {
      let formatter: Highcharts.TooltipFormatterCallbackFunction;

      beforeEach(() => {
        formatter = getChartOptions().tooltip?.formatter || (() => '');
      });

      it('should return name and y value for outlier points', () => {
        const context = {
          point: { options: { y: 1234, name: 'Foo' } }
        } as unknown as Highcharts.TooltipFormatterContextObject;

        const result = formatter.call(context, {} as Highcharts.Tooltip);

        expect(result).toContain('<strong>Foo</strong>');
        expect(result).toContain('Salary: £1,234');
      });

      it('should return descriptive values for boxplot points', () => {
        const context = {
          key: 'A',
          point: { options: { low: 123, q1: 123, median: 1234, q3: 123, high: 123 } },
        } as unknown as Highcharts.TooltipFormatterContextObject;

        const result = formatter.call(context, {} as Highcharts.Tooltip);

        expect(result).toContain('<strong>Cohort A</strong>');
        expect(result).toContain('Median: £1,234');
      });
    });
  });

  function getChartOptions(): Highcharts.Options {
    return fixture.debugElement.query(By.css('highcharts-chart')).properties['options'];
  }

  function setInputData(people: Person[], cohorts: CohortMap) {
    component.people = people;
    component.cohorts = cohorts;
    component.ngOnChanges();
    return fixture.detectChanges();
  }
});
