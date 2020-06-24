import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PersonService } from './person.service';
import { Person } from '../lib';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonService],
    });

    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get the people from the API', () => {
    service.fetch();

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toMatch(/\/people$/);
  });

  it('should expose the people as an observable', done => {
    const people = [{ name: 'Alice', salary: 12345, cohort: 'A' }];

    service.fetch();

    const req = httpMock.expectOne({ method: 'GET' });
    expect(req.request.url).toMatch(/\/people$/);
    req.flush(people);

    service.people$.subscribe(received => {
      expect(received).toEqual([new Person(people[0].name, people[0].salary, people[0].cohort)]);
      done();
    });
  });

  it('should post a new person to the API', () => {
    const name = 'Lynn';
    const salary = 123;
    const cohort = 'Q';

    service
        .addPerson(new Person(name, salary, cohort))
        .subscribe(() => {});

    const req = httpMock.expectOne({ method: 'POST' });
    expect(req.request.url).toMatch(/\/people$/);
    expect(req.request.body).toEqual({ name, salary, cohort });
  });

  it('should delete a single person from the API', () => {
    const name = 'Davina';

    service
        .deletePerson(new Person(name, 12453, 'A', 4))
        .subscribe(() => {});

    const req = httpMock.expectOne({ method: 'DELETE' });
    expect(req.request.url).toMatch(/\/people\/4$/);
  });

  it('should expose an observable of sorted cohorts', done => {
    const people = [
      new Person('Anna', 300, 'A'),
      new Person('Bert', 200, 'B'),
      new Person('Clara', 250, 'B'),
      new Person('Bob', 275, 'A')
    ];

    service.fetch();

    httpMock
        .expectOne({ method: 'GET' })
        .flush(people);

    service.cohorts$.subscribe(cohorts => {
      expect(Object.keys(cohorts)).toEqual(['A', 'B']);
      expect(cohorts.A).toEqual([275, 300]);
      expect(cohorts.B).toEqual([200, 250]);
      done();
    });
  });
});
