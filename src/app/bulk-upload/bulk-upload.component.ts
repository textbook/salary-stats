import { Component, ViewChild } from '@angular/core';

import { PersonService } from '../person.service';
import { Person } from '../../lib/models';

@Component({
  selector: 'sst-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent {
  @ViewChild('bulkUpload') nameInput;

  constructor(private service: PersonService) { }

  upload() {
    if (confirm('Are you sure you want to upload people? This cannot be undone.')) {
      this.replaceAll();
    }
  }

  parseBulkData(bulkData: string): Person[] {
    return this.getRows(bulkData).map(row => Person.fromString(row));
  }

  private replaceAll() {
    let people = this.parseBulkData(this.nameInput.nativeElement.value);
    this.service.replaceAllPeople(people);
  }

  private getRows(lines: string): string[] {
    return lines.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
  }
}
