import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PersonService } from '../person.service';
import { Person } from '@lib/models';

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
    if (this.hasValidData() && confirm(MESSAGE)) {
      this.replaceAll();
    }
  }

  parseBulkData(bulkData: string): Person[] {
    return this.getRows(bulkData).map(row => Person.fromString(row));
  }

  private hasValidData(): boolean {
    return this.bulkDataForm.valid;
  }

  private replaceAll() {
    let people = this.parseBulkData(this.bulkDataForm.value.data);
    this.service.replaceAllPeople(people);
  }

  private getRows(lines: string): string[] {
    return lines.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
  }
}
