import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartModule } from 'angular2-highcharts';

import { AppComponent } from './app.component';
import { Statistics } from '../lib';

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
      let _addPerson = spyOn(fixture.componentInstance, '_addPerson');
      let name = 'Keira', salary = 12345, cohort = 'C';
      expect(fixture.nativeElement.querySelectorAll('tfoot td input').length).toBe(3);

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      fixture.nativeElement.querySelector('button.is-success').click();

      expect(_addPerson).toHaveBeenCalledWith({ name, salary, cohort });
    });

    function setInputValue(selector: string, value: string) {
      let el: HTMLInputElement = fixture.nativeElement.querySelector(selector);
      el.value = value;
      el.dispatchEvent(new Event('input'));
    }
  });

  describe('addPerson method', () => {
    let validInput = { name: 'Foo', salary: 123, cohort: 'A' };
    let invalidInput = { name: '', salary: 123, cohort: '' };

    beforeEach(() => {
      spyOn(fixture.componentInstance, 'updateChart');
    });

    describe('with valid inputs', () => {

      beforeEach(() => {
        fixture.componentInstance.newPersonForm.setValue(validInput);
      });

      it('should update the chart', () => {
        fixture.componentInstance.addPerson();

        expect(fixture.componentInstance.updateChart).toHaveBeenCalled();
      });

      it('should add the form values to the array', () => {
        fixture.componentInstance.addPerson();

        expect(fixture.componentInstance.people.pop()).toEqual(validInput);
      });

      it('should clear the inputs', () => {
        let form = fixture.componentInstance.newPersonForm;

        fixture.componentInstance.addPerson();

        expect(form.valid).toBe(false);
        expect(form.value).toEqual({ name: '', salary: '', cohort: ''});
      });

      it('should clear any highlighted inputs', () => {
        let form = fixture.componentInstance.newPersonForm;
        form.setValue(invalidInput);
        fixture.componentInstance.addPerson();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('td.name input.is-danger'))
            .not.toBeNull('name not highlighted');

        form.setValue(validInput);
        fixture.componentInstance.addPerson();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('td.name input.is-danger'))
            .toBeNull('name still highlighted');
      });
    });

    describe('with invalid inputs', () => {
      beforeEach(() => {
        fixture.componentInstance.newPersonForm.setValue(invalidInput);
      });

      it('should highlight invalid inputs', () => {
        fixture.componentInstance.addPerson();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('td.name input.is-danger'))
            .not.toBeNull('name not highlighted');
        expect(fixture.nativeElement.querySelector('td.cohort input.is-danger'))
            .not.toBeNull('cohort not highlighted');
      });

      it('should not update the array, chart or inputs', () => {
        let initialLength = fixture.componentInstance.people.length;
        fixture.componentInstance.addPerson();

        expect(fixture.componentInstance.people.length).toBe(initialLength);
        expect(fixture.componentInstance.updateChart).not.toHaveBeenCalled();
        expect(fixture.componentInstance.newPersonForm.value).toEqual(invalidInput);
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
      let plotValues = [1, 2, 3, 4, 5];
      spyOn(Statistics, 'calculateBoxPlotData').and.returnValue(plotValues);
      let salary = 1234;
      fixture.componentInstance.people = [{ name: 'Baz', cohort: 'A', salary }];

      fixture.componentInstance.updateChart();

      expect(Statistics.calculateBoxPlotData).toHaveBeenCalledWith([salary]);
      expect(getSeries().data[0]).toEqual(plotValues);
    });

    it('should display a series per cohort', () => {
      fixture.componentInstance.people = [
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Bar', cohort: 'B', salary: 20 },
      ];

      fixture.componentInstance.updateChart();

      expect(getSeries().data.length).toBe(2);
    });

    it('should display outliers', () => {
      fixture.componentInstance.people = [
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Bar', cohort: 'A', salary: 100 },
      ];

      fixture.componentInstance.updateChart();

      expect(getSeries(1).data.length).toBe(1);
    });

    function getSeries(index?: number) {
      return fixture.componentInstance.options.series[index || 0];
    }
  });
});
