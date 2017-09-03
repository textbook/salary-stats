import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import Spy = jasmine.Spy;
import { Observable } from 'rxjs/Observable';

import { BulkUploadComponent } from './bulk-upload.component';
import { Person } from '@lib/models';
import { PersonService } from '../person.service';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let personServiceSpy: PersonService;

  beforeEach(async(() => {
    personServiceSpy = jasmine.createSpyObj('PersonService', ['addPerson']);
    (personServiceSpy.addPerson as Spy).and.returnValue(Observable.empty());

    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: PersonService, useValue: personServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('data upload', () => {
    it('should call the service with bulk upload data if confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      setFormData('Charlie,123,C');

      clickUploadButton();

      expect(window.confirm).toHaveBeenCalled();
      expect(personServiceSpy.addPerson).toHaveBeenCalledWith(new Person('Charlie', 123, 'C'));
    });

    it('should not call the service with bulk upload data if not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      setFormData('Charlie,123,C');

      clickUploadButton();

      expect(window.confirm).toHaveBeenCalled();
      expect(personServiceSpy.addPerson).not.toHaveBeenCalled();
    });

    it('should not allow an empty form to be submitted', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      setFormData('');

      clickUploadButton();

      expect(window.confirm).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('.is-success:disabled'))
          .not.toBeNull('no disabled success buttons found');
    });
  });

  function setFormData (data: string) {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.value = data;
    textarea.dispatchEvent(new Event('input'));
    return fixture.detectChanges();
  }

  function clickUploadButton() {
    return fixture.nativeElement.querySelector('button.is-success').click();
  }
});
