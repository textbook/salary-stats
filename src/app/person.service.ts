import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { Person } from '../lib/models';

const DEFAULT_PEOPLE = [
  { name: 'Alice', salary: 12345, cohort: 'A' },
  { name: 'Bob', salary: 12435, cohort: 'A' },
  { name: 'Chris', salary: 12534, cohort: 'A' },
  { name: 'Davina', salary: 12453, cohort: 'A' },
  { name: 'Edsger', salary: 12543, cohort: 'A' },
  { name: 'Fred', salary: 13245, cohort: 'B' },
  { name: 'Geoff', salary: 13425, cohort: 'B' },
  { name: 'Helen', salary: 13524, cohort: 'B' },
  { name: 'Imogen', salary: 13452, cohort: 'B' },
  { name: 'Jack', salary: 13542, cohort: 'B' },
];

@Injectable()
export class PersonService {
  people$: Observable<Person[]>;

  private personSubject = new ReplaySubject<Person[]>(1);
  private people: Person[];

  constructor() {
    this.people$ = this.personSubject.asObservable();
    this.personSubject.subscribe((people: Person[]) => this.people = people);
    this.personSubject.next(DEFAULT_PEOPLE);
  }

  addPerson(newPerson: Person) {
    this.personSubject.next(this.people.concat([newPerson]));
  }

  deletePersonAtIndex(index: number) {
    this.personSubject.next(this.people.filter((_, currentIndex) => currentIndex !== index));
  }

  deleteAllPeople() {
    this.personSubject.next([]);
  }
}
