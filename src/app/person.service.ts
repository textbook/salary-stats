import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, ReplaySubject } from 'rxjs';

import { Person, CohortMap } from '@lib/models';

@Injectable()
export class PersonService {
  people$: Observable<Person[]>;
  cohorts$: Observable<CohortMap>;

  private personSubject = new ReplaySubject<Person[]>(1);
  private personRoute = '/app/people';

  constructor(private http: Http) {
    this.people$ = this.personSubject.asObservable();
    this.cohorts$ = this.people$.map(people => this.createCohorts(people));
  }


  addPerson(newPerson: Person) {
    return this.http
        .post(this.personRoute, { name: newPerson.name, salary: newPerson.salary, cohort: newPerson.cohort });
  }

  deletePerson(personToDelete: Person) {
    return this.http
        .delete(`${this.personRoute}/${personToDelete.id}`);
  }

  fetch() {
    this.http
        .get(this.personRoute)
        .subscribe(response => {
          this.personSubject.next(this.deserialise(response.json().data));
        });
  }

  private deserialise(people: any[]): Person[] {
    return people.map(person => new Person(person.name, person.salary, person.cohort, person.id));
  }

  private createCohorts(people: Person[]): CohortMap {
    let cohorts = this.generateInitialCohorts(people);
    this.sortCohortValues(cohorts);
    return cohorts;
  }

  private generateInitialCohorts(people: Person[]): CohortMap {
    let cohorts = {};
    people.map(({ cohort, salary }) => {
      if (!cohorts.hasOwnProperty(cohort)) {
        cohorts[cohort] = [];
      }
      cohorts[cohort].push(salary);
    });
    return cohorts;
  }

  private sortCohortValues(cohorts: CohortMap) {
    for (let cohort of Object.keys(cohorts)) {
      cohorts[cohort].sort();
    }
  }
}
