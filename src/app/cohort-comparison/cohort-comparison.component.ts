import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { PersonService } from '../person.service';
import { CohortService } from '../cohort.service';
import { Person } from '@lib/models';
import { Statistics } from '@lib/statistics';

@Component({
  selector: 'sst-cohort-comparison',
  templateUrl: './cohort-comparison.component.html',
  styleUrls: ['./cohort-comparison.component.scss']
})
export class CohortComparisonComponent implements OnInit {
  pairComparisons$: Observable<any>;

  constructor(private personService: PersonService, private cohortService: CohortService) {}

  ngOnInit() {
    this.pairComparisons$ = this.personService.people$.map(people => this.createPairComparisons(people));
  }

  createPairComparisons(people: Person[]) {
    let cohorts = this.cohortService.map(people);
    let cohortPairs = this.pairs(Object.keys(cohorts));
    return cohortPairs.map(pair => {
      let pairComparison = {p: null, sameDistribution: false, title: pair.join(' to ')};
      let comparisonStats = Statistics.compareSamples(cohorts[pair[0]], cohorts[pair[1]]);

      pairComparison.p = Math.round(comparisonStats.pValue * 10000) / 10000;
      pairComparison.sameDistribution = comparisonStats.sameDistribution;

      return pairComparison;
    });
  }

  private pairs(set: string[]) {
    let pairs = [];
    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        pairs.push([set[i], set[j]]);
      }
    }

    return pairs;
  }
}
