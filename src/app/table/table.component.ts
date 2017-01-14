import { Component, ViewChild } from '@angular/core';

import { PersonService } from '../person.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Person } from '../../lib/models';

const EMPTY_FORM = { name: '', salary: '', cohort: '' };

@Component({
  selector: 'sst-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @ViewChild('nameInput') nameInput;

  newPersonForm: FormGroup;

  private formSubmitted: boolean;

  constructor(private builder: FormBuilder, protected service: PersonService) {
    this.newPersonForm = builder.group({
      name: ['', Validators.required],
      salary: ['', Validators.required],
      cohort: ['', Validators.required],
    });
  }

  addPerson() {
    this.formSubmitted = true;
    if (this.hasValidInput()) {
      this.service.addPerson(this.newPersonForm.value);
      this.clearInputs();
    }
  }

  deletePerson(person: Person) {
    this.overwriteFormIfEmpty(person);
    this.service.deletePerson(person);
  }

  deleteAllPeople() {
    if (confirm('Are you sure you want to delete all people? This cannot be undone.')) {
      this.service.deleteAllPeople();
    }
  }

  clearInputs() {
    this.resetForm(EMPTY_FORM);
  }

  private overwriteFormIfEmpty(person: Person) {
    let formData = this.newPersonForm.value;
    let keys = Object.keys(person);
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
