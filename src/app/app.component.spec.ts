import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';


import { ChartModule } from 'angular2-highcharts';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ChartModule, ReactiveFormsModule],
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
      let deletePerson = spyOn(fixture.componentInstance, 'deletePerson');

      let deleteButtons = fixture.nativeElement.querySelectorAll('tbody button.is-danger');
      expect(deleteButtons.length).toBe(fixture.componentInstance.people.length);
      expect(deleteButtons[0].textContent).toContain('Delete');

      deleteButtons[0].click();

      expect(deletePerson).toHaveBeenCalled();
    });

    it('should provide a delete all button for all people', () => {
      let deleteAllPeople = spyOn(fixture.componentInstance, 'deleteAllPeople');

      let deleteAllButton = fixture.nativeElement.querySelector('thead button.is-danger');
      expect(deleteAllButton.textContent).toContain('Delete All');

      deleteAllButton.click();

      expect(deleteAllPeople).toHaveBeenCalled();
    });

    it('should provide inputs for a new person', () => {
      let addPerson = spyOn(fixture.componentInstance, 'addPerson');
      expect(fixture.nativeElement.querySelectorAll('tfoot td input').length).toBe(3);

      fixture.nativeElement.querySelector('button.is-success').click();

      expect(addPerson).toHaveBeenCalled();
    });
  });

  describe('addPerson method', () => {
    beforeEach(() => {
      spyOn(fixture.componentInstance, 'updateChart');
    });

    describe('with valid inputs', () => {
      let validPerson = { name: 'Foo', salary: 123, cohort: 'A' };

      beforeEach(() => {
        fixture.componentInstance.newPersonForm.setValue(validPerson);
      });

      it('should update the chart', () => {
        fixture.componentInstance.addPerson();

        expect(fixture.componentInstance.updateChart).toHaveBeenCalled();
      });

      it('should add the form values to the array', () => {
        fixture.componentInstance.addPerson();

        expect(fixture.componentInstance.people.pop()).toEqual(validPerson);
      });

      it('should clear the inputs', () => {
        let form = fixture.componentInstance.newPersonForm;

        fixture.componentInstance.addPerson();

        expect(form.valid).toBe(false);
        expect(form.value).toEqual({ name: '', salary: '', cohort: ''});
      });
    });

    describe('with invalid inputs', () => {
      let invalidPerson = { name: '', salary: 123, cohort: '' };

      beforeEach(() => {
        fixture.componentInstance.newPersonForm.setValue(invalidPerson);
      });

      it('should not do anything', () => {
        let initialLength = fixture.componentInstance.people.length;
        fixture.componentInstance.addPerson();

        expect(fixture.componentInstance.people.length).toBe(initialLength);
        expect(fixture.componentInstance.updateChart).not.toHaveBeenCalled();
        expect(fixture.componentInstance.newPersonForm.value).toEqual(invalidPerson);
      });
    });
  });

  describe('deletePerson method', () => {
    beforeEach(() => {
      spyOn(fixture.componentInstance, 'updateChart');
    });

    it('should remove the person from the array', () => {
      let people = fixture.componentInstance.people;
      let initialLength = people.length;
      let firstPersonName = people[0].name;

      fixture.componentInstance.deletePerson(0);

      expect(people.length).toBe(initialLength - 1);
      expect(people[0].name).not.toEqual(firstPersonName);
    });

    it('should update the chart', () => {
      fixture.componentInstance.deletePerson(0);

      expect(fixture.componentInstance.updateChart).toHaveBeenCalled();
    });

    it('should fill the form with the deleted data if empty', () => {
      let index = 0;
      let person = fixture.componentInstance.people[index];

      fixture.componentInstance.deletePerson(index);

      expect(fixture.componentInstance.newPersonForm.value).toEqual(person);
    });

    it('should not overwrite the form data if not empty', () => {
      let form = fixture.componentInstance.newPersonForm;
      let inputs = { name: 'Foo', salary: '', cohort: '' };
      form.setValue(inputs);

      fixture.componentInstance.deletePerson(0);

      expect(form.value).toEqual(inputs);
    });
  });

  describe('deleteAllPeople method', () => {
    let confirm: jasmine.Spy;

    beforeEach(() => {
      confirm = spyOn(window, 'confirm');
    });

    it('should ask for confirmation', () => {
      fixture.componentInstance.deleteAllPeople();

      expect(confirm).toHaveBeenCalled();
    });

    describe('if user confirms', () => {
      beforeEach(() => {
        spyOn(fixture.componentInstance, 'updateChart');
        confirm.and.returnValue(true);
      });

      it('should clear the array', () => {
        fixture.componentInstance.deleteAllPeople();

        expect(fixture.componentInstance.people.length).toBe(0);
      });

      it('should update the chart', () => {
        fixture.componentInstance.deleteAllPeople();

        expect(fixture.componentInstance.updateChart).toHaveBeenCalled();
      });
    });

    describe('if user does not confirm', () => {
      it('should do nothing', () => {
        let people = fixture.componentInstance.people;
        let initialLength = people.length;
        confirm.and.returnValue(false);

        fixture.componentInstance.deleteAllPeople();

        expect(people.length).toBe(initialLength);
      });
    });
  });

  describe('updateChart method', () => {
    it('should render appropriate chart options', () => {
      fixture.componentInstance.updateChart();

      let options = fixture.componentInstance.options;
      expect(options.title.text).toBe('Salary Comparison');
      expect(options.chart.type).toBe('boxplot');
      expect(options.yAxis.title.text).toBe('Salary (£)');
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

    it('should sort the salaries in each cohort', () => {
      fixture.componentInstance.people = [
        { name: 'A', cohort: 'A', salary: 5 },
        { name: 'B', cohort: 'A', salary: 1 },
        { name: 'C', cohort: 'A', salary: 3 },
        { name: 'D', cohort: 'B', salary: 4 },
        { name: 'E', cohort: 'B', salary: 2 },
      ];

      fixture.componentInstance.updateChart();

      expect(getSeries().data[0]).toEqual([1, 3, 5]);
      expect(getSeries().data[1]).toEqual([2, 4]);
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
