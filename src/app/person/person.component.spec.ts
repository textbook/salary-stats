import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';

describe('PersonComponent', () => {
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    fixture.detectChanges();
  });

  it('should render the name', () => {
    let name = 'Edsger';
    fixture.componentInstance.person = { name };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.name').textContent).toContain(name);
  });
});
