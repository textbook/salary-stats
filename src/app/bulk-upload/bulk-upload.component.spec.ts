import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadComponent } from './bulk-upload.component';
import { PersonService } from '../person.service';
import { Person } from '../../lib/models';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let mockService: any;

  beforeEach(async(() => {
    mockService = jasmine.createSpyObj('PersonService', ['replaceAllPeople']);

    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      providers: [{ provide: PersonService, useValue: mockService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call the service with bulk upload data if confirmed', () => {
    let text = 'Charlie,123,C';
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.nativeElement.querySelector('#bulkUpload').value = text;

    fixture.nativeElement.querySelector('.is-success').click();

    expect(confirm).toHaveBeenCalled();
    expect(mockService.replaceAllPeople).toHaveBeenCalledWith([
      new Person('Charlie', 123, 'C')
    ]);
  });

  it('should not call the service with bulk upload data if not confirmed', () => {
    let text = 'Charlie,123,C';
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.nativeElement.querySelector('#bulkUpload').value = text;

    fixture.nativeElement.querySelector('.is-success').click();

    expect(confirm).toHaveBeenCalled();
    expect(mockService.replaceAllPeople).not.toHaveBeenCalled();
  });

  describe('parseBulkData method', () => {
    it('should convert each line to a person', () => {
      let people = component.parseBulkData('David,987,D');

      expect(people.length).toBe(1);
      expect(people[0].name).toBe('David');
    });

    it('should handle trailing lines', () => {
      let people = component.parseBulkData('Edwina,654,E\n');

      expect(people.length).toBe(1);
      expect(people[0].name).toBe('Edwina');
    });
  });
});
