import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import Spy = jasmine.Spy;
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { TableComponent } from './table.component';
import { Person } from '@lib/models';
import { PersonService } from '../person.service';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let personServiceSpy: PersonService;
  const peopleSubject = new ReplaySubject<Person[]>(1);

  const people = [new Person('Foo', 1, 'A', 1), new Person('Bar', 1, 'B', 2)];

  beforeEach(async(() => {
    personServiceSpy = jasmine.createSpyObj('PersonService', ['addPerson', 'deletePerson', 'fetch']);
    (personServiceSpy.deletePerson as Spy).and.returnValue(Observable.of(null));
    (personServiceSpy.addPerson as Spy).and.returnValue(Observable.of(null));
    personServiceSpy.people$ = peopleSubject.asObservable();

    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports: [ReactiveFormsModule],
      providers: [{ provide: PersonService, useValue: personServiceSpy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    peopleSubject.next(people);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('person table', () => {
    it('should render people as table rows', () => {
      expect(fixture.nativeElement.querySelectorAll('tbody > tr').length).toBe(people.length);
    });

    it('should show name, salary and cohort', () => {
      const names = fixture.nativeElement.querySelectorAll('tbody td.name');
      const salaries = fixture.nativeElement.querySelectorAll('tbody td.salary');
      const cohorts = fixture.nativeElement.querySelectorAll('tbody td.cohort');
      const firstPerson = people[0];

      expect(names.length).toBe(people.length);
      expect(names[0].textContent).toContain(firstPerson.name);
      expect(salaries.length).toBe(people.length);
      expect(salaries[0].textContent).toContain(firstPerson.salary.toString());
      expect(cohorts.length).toBe(people.length);
      expect(cohorts[0].textContent).toContain(firstPerson.cohort);
    });

    it('should provide a delete button for each person', () => {
      const deleteButtons = fixture.nativeElement.querySelectorAll('tbody button.is-danger');
      expect(deleteButtons.length).toBe(people.length);
      expect(deleteButtons[0].textContent).toContain('Delete');

      deleteButtons[0].click();

      expect(personServiceSpy.deletePerson).toHaveBeenCalled();
      expect(personServiceSpy.fetch).toHaveBeenCalled();
    });

    it('should provide a delete all button for all people', () => {
      const deleteAllButton = fixture.nativeElement.querySelector('thead button.is-danger');
      expect(deleteAllButton.textContent).toContain('Delete All');
      spyOn(window, 'confirm').and.returnValue(true);

      deleteAllButton.click();

      expect(confirm).toHaveBeenCalled();
      expect(personServiceSpy.deletePerson).toHaveBeenCalledTimes(2);
      expect(personServiceSpy.fetch).toHaveBeenCalled();
    });

    it('should allow the user to cancel deleting all', () => {
      const deleteAllButton = fixture.nativeElement.querySelector('thead button.is-danger');
      expect(deleteAllButton.textContent).toContain('Delete All');
      spyOn(window, 'confirm').and.returnValue(false);

      deleteAllButton.click();

      expect(confirm).toHaveBeenCalled();
      expect(personServiceSpy.deletePerson).not.toHaveBeenCalled();
      expect(personServiceSpy.fetch).not.toHaveBeenCalled();
    });

    it('should provide inputs for a new person', () => {
      const name = 'Keira', salary = 12345, cohort = 'C';
      expect(fixture.nativeElement.querySelectorAll('tfoot td input').length).toBe(3);

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      fixture.nativeElement.querySelector('tfoot button.is-success').click();

      expect(personServiceSpy.addPerson).toHaveBeenCalledWith(new Person(name, salary, cohort));
      expect(personServiceSpy.fetch).toHaveBeenCalled();
    });

    it('should allow a person to be added by hitting enter', () => {
      const name = 'Keira', salary = 12345, cohort = 'C';

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      fixture.debugElement
          .query(By.css('tfoot td.cohort input'))
          .triggerEventHandler('keyup.enter', null);

      expect(personServiceSpy.addPerson).toHaveBeenCalledWith(new Person(name, salary, cohort));
      expect(personServiceSpy.fetch).toHaveBeenCalled();
    });

    it('should provide a button to clear inputs', () => {
      const name = 'Keira', salary = 12345, cohort = 'C';
      const form = fixture.componentInstance.newPersonForm;

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      expect(form.value).toEqual({ name, salary, cohort });

      fixture.nativeElement.querySelector('tfoot button.is-warning').click();
      fixture.detectChanges();

      expect(form.value).toEqual({ name: '', salary: '', cohort: '' });
    });

    function setInputValue(selector: string, value: string) {
      const el: HTMLInputElement = fixture.nativeElement.querySelector(selector);
      el.value = value;
      el.dispatchEvent(new Event('input'));
    }
  });

  describe('addPerson method', () => {
    const validInput = { name: 'Foo', salary: 123, cohort: 'A' };
    const invalidInput = { name: '', salary: 123, cohort: '' };

    describe('with valid inputs', () => {
      beforeEach(() => {
        fixture.componentInstance.newPersonForm.setValue(validInput);
      });

      it('should call the service', () => {
        const { name, salary, cohort } = validInput;

        fixture.componentInstance.addPerson();

        expect(personServiceSpy.addPerson).toHaveBeenCalledWith(new Person(name, salary, cohort));
      });

      it('should clear the inputs', () => {
        const form = fixture.componentInstance.newPersonForm;

        fixture.componentInstance.addPerson();

        expect(form.valid).toBe(false);
        expect(form.value).toEqual({ name: '', salary: '', cohort: '' });
      });

      it('should clear any highlighted inputs', () => {
        const form = fixture.componentInstance.newPersonForm;
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
        const element: HTMLInputElement = fixture.nativeElement.querySelector('tfoot td.name input');
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

      it('should not call the service or update the inputs', () => {
        fixture.componentInstance.addPerson();

        expect(personServiceSpy.addPerson).not.toHaveBeenCalled();
        expect(fixture.componentInstance.newPersonForm.value).toEqual(invalidInput);
      });
    });
  });

  describe('deletePerson method', () => {
    it('should fill the form with the deleted data if empty', () => {
      const oldFirstPerson = getFirstPerson();

      fixture.componentInstance.deletePerson(oldFirstPerson);

      const { name, salary, cohort } = fixture.componentInstance.newPersonForm.value;
      expect(new Person(name, salary, cohort)).toEqual(oldFirstPerson);
    });

    it('should not overwrite the form data if not empty', () => {
      const form = fixture.componentInstance.newPersonForm;
      const inputs = { name: 'Foo', salary: '', cohort: '' };
      form.setValue(inputs);

      fixture.componentInstance.deletePerson(getFirstPerson());

      expect(form.value).toEqual(inputs);
    });

    function getFirstPerson(): Person {
      const name = fixture.nativeElement.querySelector('tbody tr td.name').textContent;
      const salary = fixture.nativeElement.querySelector('tbody tr td.salary').textContent;
      const cohort = fixture.nativeElement.querySelector('tbody tr td.cohort').textContent;
      return new Person(name, Number.parseInt(salary), cohort);
    }
  });
});
