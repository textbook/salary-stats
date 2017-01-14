import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxPlotComponent, formatChartPoint } from './box-plot.component';
import { Statistics } from '../../lib/statistics';
import { PersonService } from '../person.service';
import { SharedModule } from '../shared/shared.module';

describe('BoxPlotComponent', () => {
  let component: BoxPlotComponent;
  let fixture: ComponentFixture<BoxPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoxPlotComponent],
      imports: [SharedModule],
      providers: [PersonService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('createChartOptions method', () => {
    it('should provide appropriate chart options', () => {
      let options = component.createChartOptions([]);
      expect(options.title.text).toBe('Salary Comparison');
      expect(options.chart.type).toBe('boxplot');
      expect(options.yAxis.title.text).toBe('Salary (£)');
    });

    it('should use salaries in the points', () => {
      let plotValues = [1, 2, 3, 4, 5];
      spyOn(Statistics, 'calculateBoxPlotData').and.returnValue(plotValues);
      let salary = 1234;

      let options = component.createChartOptions([{
        name: 'Baz',
        cohort: 'A',
        salary
      }]);

      expect(Statistics.calculateBoxPlotData).toHaveBeenCalledWith([salary]);
      expect(options.series[0].data[0]).toEqual(plotValues);
    });

    it('should provide a point per cohort', () => {
      let options = component.createChartOptions([
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Bar', cohort: 'B', salary: 20 },
      ]);

      expect(options.series[0].data.length).toBe(2);
    });

    it('should provide an outliers series', () => {
      let options = component.createChartOptions([
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Bar', cohort: 'A', salary: 100 },
      ]);

      expect(options.series[1].data.length).toBe(1);
    });
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
