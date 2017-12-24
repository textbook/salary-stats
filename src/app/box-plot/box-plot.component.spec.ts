import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BoxPlotComponent } from './box-plot.component';
import { Statistics } from '@lib/statistics';
import { CohortMap, Person } from '@lib/models';

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
      expect(options.title.text).toBe('Salary Comparison');
      expect(options.chart.type).toBe('boxplot');
      expect(options.yAxis.title.text).toBe('Salary (£)');
    });

    it('should use salaries in the points', () => {
      const plotValues = [1, 2, 3, 4, 5];
      spyOn(Statistics, 'calculateBoxPlotData').and.returnValue(plotValues);
      const salary = 1234;

      setInputData([new Person('Baz', salary, 'A')], { 'A': [salary] });

      expect(getChartOptions().series[0].data[0]).toEqual(plotValues);
      expect(Statistics.calculateBoxPlotData).toHaveBeenCalledWith([salary]);
    });

    it('should provide a point per cohort', () => {
      setInputData(
          [new Person('Foo', 10, 'A'), new Person('Bar', 20, 'B')],
          { 'A': [10], 'B': [20] },
      );

      expect(getChartOptions().series[0].data.length).toBe(2);
    });

    it('should provide an outliers series', () => {
      setInputData(
          [
            new Person('Foo', 10, 'A'),
            new Person('Foo', 10, 'A'),
            new Person('Foo', 10, 'A'),
            new Person('Foo', 10, 'A'),
            new Person('Foo', 10, 'A'),
            new Person('Bar', 100, 'A'),
          ],
          { 'A' : [10, 10, 10, 10, 10, 100] },
      );

      expect(getChartOptions().series[1].data.length).toBe(1);
    });

    describe('tooltip formatter', () => {
      let formatter: () => string;

      beforeEach(() => {
        formatter = getChartOptions().tooltip.formatter;
      });

      it('should return name and y value for outlier points', () => {
        const context = { point: { options: { y: 1234, name: 'Foo' } } };

        const result = formatter.call(context);

        expect(result).toContain('<strong>Foo</strong>');
        expect(result).toContain('Salary: £1,234');
      });

      it('should return descriptive values for boxplot points', () => {
        const context = {
          key: 'A',
          point: { options: { low: 123, q1: 123, median: 1234, q3: 123, high: 123 } },
        };

        const result = formatter.call(context);

        expect(result).toContain('<strong>Cohort A</strong>');
        expect(result).toContain('Median: £1,234');
      });
    });
  });

  function getChartOptions(): any {
    return fixture.debugElement.query(By.css('chart')).properties['options'];
  }

  function setInputData(people: Person[], cohorts: CohortMap) {
    component.people = people;
    component.cohorts = cohorts;
    component.ngOnChanges();
    return fixture.detectChanges();
  }
});
