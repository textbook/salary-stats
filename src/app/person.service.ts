import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CohortMap, Person, RawPerson } from '../lib';

@Injectable()
export class PersonService {
  people$: Observable<Person[]>;
  cohorts$: Observable<CohortMap>;

  private personSubject = new ReplaySubject<Person[]>(1);
  private personRoute = '/app/people';

  constructor(private http: HttpClient) {
    this.people$ = this.personSubject.asObservable();
    this.cohorts$ = this.people$.pipe(map(people => this.createCohorts(people)));
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
        .get<RawPerson[]>(this.personRoute)
        .subscribe(json => {
          this.personSubject.next(json);
        });
  }

  private createCohorts(people: Person[]): CohortMap {
    const cohorts = this.generateInitialCohorts(people);
    this.sortCohortValues(cohorts);
    return cohorts;
  }

  private generateInitialCohorts(people: Person[]): CohortMap {
    const cohorts: CohortMap = {};
    people.map(({ cohort, salary }) => {
      if (!cohorts.hasOwnProperty(cohort)) {
        cohorts[cohort] = [];
      }
      cohorts[cohort].push(salary);
    });
    return cohorts;
  }

  private sortCohortValues(cohorts: CohortMap) {
    for (const cohort of Object.keys(cohorts)) {
      cohorts[cohort].sort();
    }
  }
}
