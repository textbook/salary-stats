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

  describe('person table', () => {
    it('should render people as table rows', () => {
      fixture.componentInstance.people = [
        { name: 'Foo', salary: 1, cohort: 'A' },
        { name: 'Bar', salary: 1, cohort: 'B' },
      ];

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('tbody > tr').length).toBe(2);
    });

    it('should show name, salary and cohort', () => {
      let name = 'Foo';
      let salary = 5;
      let cohort = 'A';
      fixture.componentInstance.people = [{ name, salary, cohort }];

      fixture.detectChanges();

      let names = fixture.nativeElement.querySelectorAll('tbody td.name');
      let salaries = fixture.nativeElement.querySelectorAll('tbody td.salary');
      let cohorts = fixture.nativeElement.querySelectorAll('tbody td.cohort');

      expect(names.length).toBe(1);
      expect(names[0].textContent).toContain(name);
      expect(salaries.length).toBe(1);
      expect(salaries[0].textContent).toContain(salary.toString());
      expect(cohorts.length).toBe(1);
      expect(cohorts[0].textContent).toContain(cohort);
    });

    it('should provide a delete button for each person', () => {
      let updateChart = spyOn(fixture.componentInstance, 'updateChart');
      fixture.componentInstance.people = [{ name: 'Foo', salary: 1, cohort: 'A' }];
      fixture.detectChanges();

      let deleteButtons = fixture.nativeElement.querySelectorAll('button.is-danger');
      expect(deleteButtons.length).toBe(1);
      expect(deleteButtons[0].textContent).toContain('Delete');

      deleteButtons[0].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.people.length).toBe(0, 'people array not empty');
      expect(fixture.nativeElement.querySelectorAll('tbody td').length).toBe(0, 'table rows shown');
      expect(updateChart).toHaveBeenCalled();
    });
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

      expect(getSeries().data.length).toBe(0);
    });

    it('should use salaries in the series', () => {
      let salary = 1234;
      fixture.componentInstance.people = [{ name: 'Baz', cohort: 'A', salary }];

      fixture.componentInstance.updateChart();

      expect(getSeries().data[0]).toEqual([salary]);
    });

    it('should display a series per cohort', () => {
      let salaryA = 10, salaryB = 20;
      fixture.componentInstance.people = [
        { name: 'Foo', cohort: 'A', salary: salaryA },
        { name: 'Bar', cohort: 'B', salary: salaryB },
      ];

      fixture.componentInstance.updateChart();

      expect(getSeries().data[0]).toEqual([salaryA]);
      expect(getSeries().data[1]).toEqual([salaryB]);
    });

    it('should show a warning if any cohort has fewer than five members', () => {
      fixture.componentInstance.people = [
        { name: 'Foo', cohort: 'A', salary: 1 },
        { name: 'Foo', cohort: 'A', salary: 2 },
        { name: 'Foo', cohort: 'A', salary: 3 },
        { name: 'Foo', cohort: 'A', salary: 4 },
        { name: 'Foo', cohort: 'A', salary: 5 },
        { name: 'Bar', cohort: 'B', salary: 6 },
      ];

      fixture.componentInstance.updateChart();
      fixture.detectChanges();

      let expected = 'cohort must have more than five members';
      expect(fixture.nativeElement.querySelector('.is-warning').textContent).toContain(expected);
    });

    it('should show a warning if first cohort has fewer than five members', () => {
      fixture.componentInstance.people = [
        { name: 'Foo', cohort: 'A', salary: 1 },
        { name: 'Bar', cohort: 'B', salary: 2 },
        { name: 'Bar', cohort: 'B', salary: 3 },
        { name: 'Bar', cohort: 'B', salary: 4 },
        { name: 'Bar', cohort: 'B', salary: 5 },
        { name: 'Bar', cohort: 'B', salary: 6 },
      ];

      fixture.componentInstance.updateChart();
      fixture.detectChanges();

      let expected = 'cohort must have more than five members';
      expect(fixture.nativeElement.querySelector('.is-warning').textContent).toContain(expected);
    });

    function getSeries() {
      return fixture.componentInstance.options.series[0];
    }
  });
});
