import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BoxPlotComponent, formatChartPoint } from './box-plot.component';
import { Statistics } from '@lib/statistics';
import { Person } from '@lib/models';

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
    component.people = [];
    component.cohorts = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createChartOptions method', () => {
    it('should provide appropriate chart options', () => {
      let options = getChartOptions();
      expect(options.title.text).toBe('Salary Comparison');
      expect(options.chart.type).toBe('boxplot');
      expect(options.yAxis.title.text).toBe('Salary (£)');
    });

    it('should use salaries in the points', () => {
      let plotValues = [1, 2, 3, 4, 5];
      spyOn(Statistics, 'calculateBoxPlotData').and.returnValue(plotValues);
      let salary = 1234;

      component.people = [new Person('Baz', salary, 'A')];
      component.cohorts = { 'A': [salary] };
      fixture.detectChanges();

      expect(getChartOptions().series[0].data[0]).toEqual(plotValues);
      expect(Statistics.calculateBoxPlotData).toHaveBeenCalledWith([salary]);
    });

    it('should provide a point per cohort', () => {
      component.people = [new Person('Foo', 10, 'A'), new Person('Bar', 20, 'B')];
      component.cohorts = { 'A': [10], 'B': [20] };
      fixture.detectChanges();


      expect(getChartOptions().series[0].data.length).toBe(2);
    });

    it('should provide an outliers series', () => {
      component.people = [
        new Person('Foo', 10, 'A'),
        new Person('Foo', 10, 'A'),
        new Person('Foo', 10, 'A'),
        new Person('Foo', 10, 'A'),
        new Person('Foo', 10, 'A'),
        new Person('Bar', 100, 'A'),
      ];
      component.cohorts = { 'A' : [10, 10, 10, 10, 10, 100] };
      fixture.detectChanges();

      expect(getChartOptions().series[1].data.length).toBe(1);
    });

    function getChartOptions(): any {
      return fixture.debugElement.query(By.css('chart')).properties['options'];
    }
  });

  describe('formatChartPoint function', () => {
    it('should return name and y value for outlier points', () => {
      let context = { point: { options: { y: 1234, name: 'Foo' } } };

      let result = formatChartPoint.bind(context)();

      expect(result).toContain('<strong>Foo</strong>');
      expect(result).toContain('Salary: £1,234');
    });

    it('should return descriptive values for boxplot points', () => {
      let context = {
        key: 'A',
        point: {
          options: {
            low: 123,
            q1: 123,
            median: 1234,
            q3: 123,
            high: 123,
          }
        }
      };

      let result = formatChartPoint.bind(context)();

      expect(result).toContain('<strong>Cohort A</strong>');
      expect(result).toContain('Median: £1,234');
    });
  });
});
