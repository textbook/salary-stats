import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { forkJoin } from 'rxjs';

import { PersonService } from '../person.service';
import { Person } from '../../lib';

const MESSAGE = 'Are you sure you want to upload people? This cannot be undone.';

@Component({
  selector: 'sst-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  bulkDataForm: FormGroup;

  constructor(private service: PersonService, private builder: FormBuilder) { }

  ngOnInit(): void {
    this.bulkDataForm = this.builder.group({
      data: ['', Validators.required],
    });
  }

  upload() {
    if (this.hasValidData && confirm(MESSAGE)) {
      this.bulkAdd(this.parseBulkData());
    }
  }

  private get hasValidData(): boolean {
    return this.bulkDataForm.valid;
  }

  private bulkAdd(people: Person[]) {
    forkJoin(people.map(person => this.service.addPerson(person)))
        .subscribe(() => this.service.fetch());
  }

  private parseBulkData(): Person[] {
    return this
        .getRows(this.bulkDataForm.value.data)
        .map(row => Person.fromString(row));
  }

  private getRows(lines: string): string[] {
    return lines.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
  }
}
