import { Component, ViewChild, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { PersonService } from '../person.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Person } from '../../lib/models';

const EMPTY_FORM = { name: '', salary: '', cohort: '' };
const MESSAGE = 'Are you sure you want to delete all people? This cannot be undone.';

@Component({
  selector: 'sst-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild('nameInput') nameInput;

  formSubmitted: boolean;
  newPersonForm: FormGroup;
  people$: Observable<Person[]>;

  constructor(private builder: FormBuilder, private service: PersonService) { }

  ngOnInit(): void {
    this.people$ = this.service.people$;

    this.newPersonForm = this.builder.group({
      name: ['', Validators.required],
      salary: ['', Validators.required],
      cohort: ['', Validators.required],
    });
  }

  addPerson() {
    this.formSubmitted = true;
    if (this.hasValidInput()) {
      this.service.addPerson(this.getPersonFromForm());
      this.clearInputs();
    }
  }

  deletePerson(person: Person) {
    this.overwriteFormIfEmpty(person);
    this.service.deletePerson(person);
  }

  deleteAllPeople() {
    if (confirm(MESSAGE)) {
      this.service.deleteAllPeople();
    }
  }

  clearInputs() {
    this.resetForm(EMPTY_FORM);
  }

  private getPersonFromForm(): Person {
    let { name, salary, cohort } = this.newPersonForm.value;
    return new Person(name, salary, cohort);
  }

  private overwriteFormIfEmpty(person: Person) {
    let formData = this.newPersonForm.value;
    let keys = Object.keys(formData);
    if (keys.filter(key => formData[key] === EMPTY_FORM[key]).length === keys.length) {
      this.resetForm(person);
    }
  }

  private hasValidInput() {
    return this.newPersonForm.valid;
  }

  private resetForm(person: any) {
    this.formSubmitted = false;
    this.newPersonForm.setValue(person);
    this.nameInput.nativeElement.focus();
  }
}
