import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Person } from '../../lib';
import { PersonService } from '../person.service';

type PersonForm = { [P in keyof Person]: string };

const EMPTY_FORM: PersonForm = { name: '', salary: '', cohort: '' };
const MESSAGE = 'Are you sure you want to delete all people? This cannot be undone.';

@Component({
  selector: 'sst-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @ViewChild('nameInput', { static: true }) nameInput?: ElementRef;

  formSubmitted: boolean;
  newPersonForm: FormGroup;
  people$: Observable<Person[]>;

  constructor(private builder: FormBuilder, private service: PersonService) {
    this.people$ = this.service.people$;

    this.newPersonForm = this.builder.nonNullable.group({
      name: ['', Validators.required],
      salary: ['', Validators.required],
      cohort: ['', Validators.required],
    });

    this.formSubmitted = false;
   }

  addPerson() {
    this.formSubmitted = true;
    if (this.hasValidInput()) {
      this.service.addPerson(this.getPersonFromForm()).subscribe(() => {
        this.service.fetch();
        this.clearInputs();
      });
    }
  }

  deletePerson(person: Person) {
    this.overwriteFormIfEmpty(person);
    this.service
        .deletePerson(person)
        .subscribe(() => {
          this.service.fetch();
        });
  }

  deleteAllPeople() {
    if (confirm(MESSAGE)) {
      this.people$
          .pipe(mergeMap(people => forkJoin(people.map(person => this.service.deletePerson(person)))))
          .subscribe(() => this.service.fetch());
    }
  }

  clearInputs() {
    this.resetForm(EMPTY_FORM);
  }

  private getPersonFromForm(): Person {
    const { name, salary, cohort } = this.newPersonForm.value as PersonForm;
    return { name, salary: parseInt(salary, 10), cohort };
  }

  private overwriteFormIfEmpty(person: Person) {
    const formData: PersonForm = this.newPersonForm.value;
    const keys = Object.keys(formData) as (keyof PersonForm)[];
    if (keys.filter(key => formData[key] === EMPTY_FORM[key]).length === keys.length) {
      this.resetForm({ name: person.name, cohort: person.cohort, salary: person.salary.toFixed(0) });
    }
  }

  private hasValidInput() {
    return this.newPersonForm.valid;
  }

  private resetForm(person: PersonForm) {
    this.formSubmitted = false;
    this.newPersonForm.setValue({ name: person.name, salary: person.salary, cohort: person.cohort });
    this.nameInput?.nativeElement.focus();
  }
}
