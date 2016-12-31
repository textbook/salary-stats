import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { PersonComponent } from './person/person.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, PersonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should render title in a h1 tag', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Salary Statistics');
  });

  it('should render people as person elements', () => {
    fixture.componentInstance.people = [{ name: 'Foo' }, { name: 'Bar' }];

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('sst-person').length).toBe(2);
  });
});
