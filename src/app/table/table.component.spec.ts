import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ReplaySubject } from 'rxjs';

import { TableComponent } from './table.component';
import { Person } from '../../lib/models';
import { PersonService } from '../person.service';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let mockService: any;
  let peopleSubject = new ReplaySubject<Person[]>(1);

  let people = [new Person('Foo', 1, 'A'), new Person('Bar', 1, 'B')];

  beforeEach(async(() => {
    mockService = jasmine.createSpyObj('PersonService', ['addPerson', 'deletePerson', 'deleteAllPeople']);
    mockService.people$ = peopleSubject.asObservable();

    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports: [ReactiveFormsModule],
      providers: [{ provide: PersonService, useValue: mockService }]
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
      let names = fixture.nativeElement.querySelectorAll('tbody td.name');
      let salaries = fixture.nativeElement.querySelectorAll('tbody td.salary');
      let cohorts = fixture.nativeElement.querySelectorAll('tbody td.cohort');
      let firstPerson = people[0];

      expect(names.length).toBe(people.length);
      expect(names[0].textContent).toContain(firstPerson.name);
      expect(salaries.length).toBe(people.length);
      expect(salaries[0].textContent).toContain(firstPerson.salary.toString());
      expect(cohorts.length).toBe(people.length);
      expect(cohorts[0].textContent).toContain(firstPerson.cohort);
    });

    it('should provide a delete button for each person', () => {
      let deletePerson = spyOn(fixture.componentInstance, 'deletePerson');

      let deleteButtons = fixture.nativeElement.querySelectorAll('tbody button.is-danger');
      expect(deleteButtons.length).toBe(people.length);
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
      let name = 'Keira', salary = 12345, cohort = 'C';
      expect(fixture.nativeElement.querySelectorAll('tfoot td input').length).toBe(3);

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      fixture.nativeElement.querySelector('tfoot button.is-success').click();

      expect(mockService.addPerson).toHaveBeenCalledWith(new Person(name, salary, cohort));
    });

    it('should allow a person to be added by hitting enter', () => {
      let name = 'Keira', salary = 12345, cohort = 'C';

      setInputValue('tfoot td.name input', name);
      setInputValue('tfoot td.salary input', salary.toString());
      setInputValue('tfoot td.cohort input', cohort);

      fixture.debugElement
          .query(By.css('tfoot td.cohort input'))
          .triggerEventHandler('keyup.enter', null);

      expect(mockService.addPerson).toHaveBeenCalledWith(new Person(name, salary, cohort));
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

      it('should call the service', () => {
        let { name, salary, cohort } = validInput;

        fixture.componentInstance.addPerson();

        expect(mockService.addPerson).toHaveBeenCalledWith(new Person(name, salary, cohort));
      });

      it('should clear the inputs', () => {
        let form = fixture.componentInstance.newPersonForm;

        fixture.componentInstance.addPerson();

        expect(form.valid).toBe(false);
        expect(form.value).toEqual({ name: '', salary: '', cohort: '' });
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

      it('should not call the service or update the inputs', () => {
        fixture.componentInstance.addPerson();

        expect(mockService.addPerson).not.toHaveBeenCalled();
        expect(fixture.componentInstance.newPersonForm.value).toEqual(invalidInput);
      });
    });
  });

  describe('deletePerson method', () => {
    it('should call the service', () => {
      let person = new Person('Hello', 123, 'World');

      fixture.componentInstance.deletePerson(person);

      expect(mockService.deletePerson).toHaveBeenCalledWith(person);
    });

    it('should fill the form with the deleted data if empty', () => {
      let oldFirstPerson = getFirstPerson();

      fixture.componentInstance.deletePerson(oldFirstPerson);

      let { name, salary, cohort } = fixture.componentInstance.newPersonForm.value;
      expect(new Person(name, salary, cohort)).toEqual(oldFirstPerson);
    });

    it('should not overwrite the form data if not empty', () => {
      let form = fixture.componentInstance.newPersonForm;
      let inputs = { name: 'Foo', salary: '', cohort: '' };
      form.setValue(inputs);

      fixture.componentInstance.deletePerson(getFirstPerson());

      expect(form.value).toEqual(inputs);
    });

    function getFirstPerson(): Person {
      let name = fixture.nativeElement.querySelector('tbody tr td.name').textContent;
      let salary = Number.parseInt(fixture.nativeElement.querySelector('tbody tr td.salary').textContent);
      let cohort = fixture.nativeElement.querySelector('tbody tr td.cohort').textContent;
      return new Person(name, salary, cohort);
    }
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
      it('should call the service', () => {
        confirm.and.returnValue(true);

        fixture.componentInstance.deleteAllPeople();

        expect(mockService.deleteAllPeople).toHaveBeenCalled();
      });
    });

    describe('if user does not confirm', () => {
      it('should not call the service', () => {
        confirm.and.returnValue(false);

        fixture.componentInstance.deleteAllPeople();

        expect(mockService.deleteAllPeople).not.toHaveBeenCalled();
      });
    });
  });
});
