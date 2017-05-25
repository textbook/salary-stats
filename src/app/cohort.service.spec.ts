import { TestBed } from '@angular/core/testing';
import { CohortService } from './cohort.service';
import { Person } from '../lib/models';

describe('CohortService', () => {
  let service: CohortService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CohortService]
    });

    service = TestBed.get(CohortService);
  });

  it('returns sorted salaries in a cohort map', () => {
    let people = [
      new Person('Anna', 300, 'A'),
      new Person('Bert', 200, 'B'),
      new Person('Clara', 250, 'B'),
      new Person('Bob', 275, 'A')
    ];

    let cohorts = service.map(people);

    expect(Object.keys(cohorts)).toEqual(['A', 'B']);
    expect(cohorts.A).toEqual([275, 300]);
    expect(cohorts.B).toEqual([200, 250]);
  });

});
