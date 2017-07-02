import { TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, ConnectionBackend, Http, RequestMethod,
  RequestOptions, ResponseOptions, Response,
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { PersonService } from './person.service';
import { Person } from '@lib/models';

describe('PersonService', () => {
  let service: PersonService;
  let backend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions },
        Http,
        PersonService,
      ]
    });

    service = TestBed.get(PersonService);
    backend = TestBed.get(ConnectionBackend);
  });

  it('should get the people from the API', done => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/\/people$/);
      expect(connection.request.method).toBe(RequestMethod.Get, 'expected GET request');
      done();
    });

    service.fetch();
  });

  it('should expose the people as an observable', done => {
    let people = [{ name: 'Alice', salary: 12345, cohort: 'A' }];

    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        status: 200,
        body: { data: people },
      })));
    });

    service.fetch();

    service.people$.subscribe(received => {
      expect(received).toEqual([new Person(people[0].name, people[0].salary, people[0].cohort)]);
      done();
    });
  });

  it('should post a new person to the API', done => {
    let name = 'Lynn';
    let salary = 123;
    let cohort = 'Q';

    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/\/people$/);
      expect(connection.request.method).toBe(RequestMethod.Post, 'expected POST request');
      expect(connection.request.json()).toEqual({ name, salary, cohort });
      done();
    });

    service.addPerson(new Person(name, salary, cohort));
  });

  it('should delete a single person from the API', done => {
    let name = 'Davina';

    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toMatch(/\/people\/4$/);
      expect(connection.request.method).toBe(RequestMethod.Delete, 'expected DELETE request');
      done();
    });

    service.deletePerson(new Person(name, 12453, 'A', 4));
  });

  it('should expose an observable of sorted cohorts', done => {
    let people = [
      new Person('Anna', 300, 'A'),
      new Person('Bert', 200, 'B'),
      new Person('Clara', 250, 'B'),
      new Person('Bob', 275, 'A')
    ];

    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        status: 200,
        body: { data: people },
      })));
    });

    service.fetch();

    service.cohorts$.subscribe(cohorts => {
      expect(Object.keys(cohorts)).toEqual(['A', 'B']);
      expect(cohorts.A).toEqual([275, 300]);
      expect(cohorts.B).toEqual([200, 250]);
      done();
    });
  });
});
