import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;
import { Observable } from 'rxjs/Observable';

import { BulkUploadComponent } from './bulk-upload.component';
import { Person } from '@lib/models';
import { PersonService } from '../person.service';
import { SharedModule } from '../shared/shared.module';

describe('BulkUploadComponent', () => {
  let component: BulkUploadComponent;
  let fixture: ComponentFixture<BulkUploadComponent>;
  let personServiceSpy: PersonService;

  beforeEach(async(() => {
    personServiceSpy = jasmine.createSpyObj('PersonService', ['addPerson']);
    (personServiceSpy.addPerson as Spy).and.returnValue(Observable.empty());

    TestBed.configureTestingModule({
      declarations: [BulkUploadComponent],
      imports: [SharedModule],
      providers: [{ provide: PersonService, useValue: personServiceSpy }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should invoke the upload method when the submit button is clicked', () => {
    spyOn(component, 'upload');
    component.bulkDataForm.setValue({ data: 'Charlie,123,C' });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button.is-success').click();

    expect(component.upload).toHaveBeenCalled();
  });

  describe('upload method', () => {
    it('should call the service with bulk upload data if confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      component.bulkDataForm.setValue({ data: 'Charlie,123,C' });

      component.upload();

      expect(window.confirm).toHaveBeenCalled();
      expect(personServiceSpy.addPerson).toHaveBeenCalledWith(new Person('Charlie', 123, 'C'));
    });

    it('should not call the service with bulk upload data if not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.bulkDataForm.setValue({ data: 'Charlie,123,C' });

      component.upload();

      expect(window.confirm).toHaveBeenCalled();
      expect(personServiceSpy.addPerson).not.toHaveBeenCalled();
    });

    it('should not allow an empty form to be submitted', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.bulkDataForm.setValue({ data: '' });

      component.upload();

      expect(window.confirm).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('.is-success:disabled'))
          .not.toBeNull('no disabled success buttons found');
    });
  });
});
