import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';

import { Person } from '../lib/models';

const DEFAULT_PEOPLE = [
  new Person('Alice', 12345, 'A'),
  new Person('Bob', 12435, 'A'),
  new Person('Chris', 12534, 'A'),
  new Person('Davina', 12453, 'A'),
  new Person('Edsger', 12543, 'A'),
  new Person('Fred', 13245, 'B'),
  new Person('Geoff', 13425, 'B'),
  new Person('Helen', 13524, 'B'),
  new Person('Imogen', 13452, 'B'),
  new Person('Jack', 13542, 'B'),
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

  deletePerson(personToDelete: Person) {
    this.personSubject.next(this.people.filter((person) => !person.equals(personToDelete)));
  }

  deleteAllPeople() {
    this.replaceAllPeople([]);
  }

  replaceAllPeople(newPeople: Person[]) {
    this.personSubject.next(newPeople);
  }
}
