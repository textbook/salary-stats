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
      expect(options.chart.type).toBe('boxplot');
    });

    it('should update the series from the people', () => {
      fixture.componentInstance.people = [];

      fixture.componentInstance.updateChart();

      expect(getSeries(0).data[0].length).toBe(0);
    });

    it('should use salaries in the series', () => {
      let salary = 1234;
      fixture.componentInstance.people = [{ name: 'Baz', salary }];

      fixture.componentInstance.updateChart();

      expect(getSeries(0).data[0]).toEqual([salary]);
    });

    function getSeries(index: number) {
      return fixture.componentInstance.options.series[index];
    }
  });
});
