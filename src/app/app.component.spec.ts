import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartModule } from 'angular2-highcharts';

import { AppComponent, formatChartPoint } from './app.component';
import { Statistics } from '../lib';
import { PersonService } from './person.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let service: PersonService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ChartModule, ReactiveFormsModule],
      providers: [PersonService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    service = TestBed.get(PersonService);
    fixture.detectChanges();
  });

  it('should render title in a h1 tag', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Salary statistics');
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
      let addPerson = spyOn(service, 'addPerson').and.callThrough();
      let name = 'Keira', salary = 12345, cohort = 'C';
      expect(fixture.nativeElement.querySelectorAll('tfoot td input').length).toBe(3);

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      fixture.nativeElement.querySelector('tfoot button.is-success').click();

      expect(addPerson).toHaveBeenCalledWith({ name, salary, cohort });
    });

    it('should provide a button to clear inputs', () => {
      let name = 'Keira', salary = 12345, cohort = 'C';
      let form = fixture.componentInstance.newPersonForm;

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      expect(form.value).toEqual({ name, salary, cohort });

      fixture.nativeElement.querySelector('tfoot button.is-warning').click();
      fixture.detectChanges();

      expect(form.value).toEqual({ name: '', salary: '', cohort: '' });
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

    describe('with valid inputs', () => {
      beforeEach(() => {
        fixture.componentInstance.newPersonForm.setValue(validInput);
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

      it('should focus the name input', () => {
        let element: HTMLInputElement = fixture.nativeElement.querySelector('tfoot td.name input');
        spyOn(element, 'focus');

        fixture.componentInstance.addPerson();

        expect(element.focus).toHaveBeenCalled();
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
        expect(fixture.componentInstance.newPersonForm.value).toEqual(invalidInput);
      });
    });
  });

  describe('deletePerson method', () => {
    it('should remove the person from the array', () => {
      let oldPeople = fixture.componentInstance.people;
      let oldFirstPerson = oldPeople[0];

      fixture.componentInstance.deletePerson(oldFirstPerson);

      let newPeople = fixture.componentInstance.people;
      expect(newPeople.length).toBe(oldPeople.length - 1);
      expect(newPeople[0].name).not.toEqual(oldFirstPerson.name);
    });

    it('should fill the form with the deleted data if empty', () => {
      let oldPeople = fixture.componentInstance.people;
      let oldFirstPerson = oldPeople[0];

      fixture.componentInstance.deletePerson(oldFirstPerson);

      expect(fixture.componentInstance.newPersonForm.value).toEqual(oldFirstPerson);
    });

    it('should not overwrite the form data if not empty', () => {
      let form = fixture.componentInstance.newPersonForm;
      let inputs = { name: 'Foo', salary: '', cohort: '' };
      form.setValue(inputs);

      fixture.componentInstance.deletePerson(fixture.componentInstance.people[0]);

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
      it('should clear the array', () => {
        confirm.and.returnValue(true);
        fixture.componentInstance.deleteAllPeople();

        expect(fixture.componentInstance.people.length).toBe(0);
      });
    });

    describe('if user does not confirm', () => {
      it('should not clear the array', () => {
        let people = fixture.componentInstance.people;
        let initialLength = people.length;
        confirm.and.returnValue(false);

        fixture.componentInstance.deleteAllPeople();

        expect(people.length).toBe(initialLength);
      });
    });
  });

  describe('createChartOptions method', () => {
    it('should provide appropriate chart options', () => {
      let options = fixture.componentInstance.createChartOptions([]);
      expect(options.title.text).toBe('Salary Comparison');
      expect(options.chart.type).toBe('boxplot');
      expect(options.yAxis.title.text).toBe('Salary (£)');
    });

    it('should use salaries in the points', () => {
      let plotValues = [1, 2, 3, 4, 5];
      spyOn(Statistics, 'calculateBoxPlotData').and.returnValue(plotValues);
      let salary = 1234;

      let options = fixture.componentInstance.createChartOptions([{ name: 'Baz', cohort: 'A', salary }]);

      expect(Statistics.calculateBoxPlotData).toHaveBeenCalledWith([salary]);
      expect(options.series[0].data[0]).toEqual(plotValues);
    });

    it('should provide a point per cohort', () => {
      let options = fixture.componentInstance.createChartOptions([
        { name: 'Foo', cohort: 'A', salary: 10 },
        { name: 'Bar', cohort: 'B', salary: 20 },
      ]);

      expect(options.series[0].data.length).toBe(2);
    });

    it('should provide an outliers series', () => {
      let options = fixture.componentInstance.createChartOptions([
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
      let context = { key: 'A', point: { options: {
        low: 123,
        q1: 123,
        median: 1234,
        q3: 123,
        high: 123,
      } } };

      let result = formatChartPoint.bind(context)();

      expect(result).toContain('<strong>Cohort A</strong>');
      expect(result).toContain('Median: £1,234');
    });
  });
});
