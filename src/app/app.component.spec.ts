import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { PersonService } from './person.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let personServiceSpy: PersonService;

  beforeEach(async(() => {
    personServiceSpy = jasmine.createSpyObj('PersonServiceSpy', ['fetch']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: PersonService, useValue: personServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render title in a h1 tag', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Salary statistics');
  });

  it('should fetch the initial people', () => {
    expect(personServiceSpy.fetch).toHaveBeenCalled();
  });
});
