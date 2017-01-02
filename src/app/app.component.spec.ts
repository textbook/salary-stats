import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { ChartModule } from 'angular2-highcharts';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ChartModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render title in a h1 tag', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Salary Statistics');
  });

  it('should render people as table rows', () => {
    fixture.componentInstance.people = [{ name: 'Foo', salary: 1 }, { name: 'Bar', salary: 1 }];

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody > tr').length).toBe(2);
  });

  describe('updateChart method', () => {
    it('should render appropriate chart options', () => {
      fixture.componentInstance.updateChart();

      let options = fixture.componentInstance.options;
      expect(options.title.text).toBe('Salaries');
      expect(options.chart.type).toBe('column');
    });

    it('should update the series from the people', () => {
      fixture.componentInstance.people = [];

      fixture.componentInstance.updateChart();

      expect(fixture.componentInstance.options.series.length).toBe(0);
    });

    it('should use salaries and names in the series', () => {
      let salary = 1234, name = 'Baz';
      fixture.componentInstance.people = [{ name, salary }];

      fixture.componentInstance.updateChart();

      let series = fixture.componentInstance.options.series[0];
      expect(series.data).toEqual([salary]);
      expect(series.name).toEqual(name);
    });
  });
});
