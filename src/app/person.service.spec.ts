import { TestBed } from '@angular/core/testing';

import { PersonService } from './person.service';
import { Person } from '../lib/models';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonService]
    });

    service = TestBed.get(PersonService);
  });

  it('should provide a default set of people', done => {
    service.people$.subscribe((people: Person[]) => {
      expect(people.length).toBe(10);
      done();
    });
  });

  it('should allow a new person to be added', done => {
    let name = 'Lynn';
    let salary = 123;
    let cohort = 'Q';

    service.addPerson({ name, salary, cohort });

    service.people$.subscribe((people: Person[]) => {
      expect(people.length).toBe(11);
      let lastPerson = people.pop();
      expect(lastPerson.name).toBe(name);
      expect(lastPerson.salary).toBe(salary);
      expect(lastPerson.cohort).toBe(cohort);
      done();
    });
  });

  it('should allow a single person to be deleted', done => {
    let name = 'Davina';
    service.deletePerson({ name, salary: 12453, cohort: 'A' });

    service.people$.subscribe((people: Person[]) => {
      expect(people.length).toBe(9);
      expect(people.filter(person => person.name === name).length).toBe(0);
      done();
    });
  });

  it('should allow all people to be deleted', done => {
    service.deleteAllPeople();

    service.people$.subscribe((people: Person[]) => {
      expect(people.length).toBe(0);
      done();
    });
  });
});
