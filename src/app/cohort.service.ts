import { Injectable } from '@angular/core';
import { Person } from '../lib/models';

@Injectable()
export class CohortService {
  map(people: Person[]): { [key: string]: number[] } {
    let cohorts = this.generateInitialCohorts(people);
    this.sortCohortValues(cohorts);
    return cohorts;
  }

  private generateInitialCohorts(people: Person[]): { [key: string]: number[] } {
    let cohorts = {};
    people.map(({ cohort, salary }) => {
      if (!cohorts.hasOwnProperty(cohort)) {
        cohorts[cohort] = [];
      }
      cohorts[cohort].push(salary);
    });
    return cohorts;
  }

  private sortCohortValues(cohorts: { [p: string]: number[] }) {
    for (let cohort of Object.keys(cohorts)) {
      cohorts[cohort].sort();
    }
  }
}
