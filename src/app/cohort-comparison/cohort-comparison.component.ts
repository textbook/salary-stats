import {Component} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {PersonService} from '../person.service';
import {CohortMap, Statistics} from '../../lib';

interface PairComparison {
  p: number;
  sameDistribution: boolean;
  title: string;
}

@Component({
  selector: 'sst-cohort-comparison',
  templateUrl: './cohort-comparison.component.html',
  styleUrls: ['./cohort-comparison.component.scss']
})
export class CohortComparisonComponent {
  pairComparisons$: Observable<PairComparison[]>;

  constructor(private personService: PersonService) {
    this.pairComparisons$ = this.personService.cohorts$
        .pipe(map(cohorts => this.createPairComparisons(cohorts)));
  }

  private createPairComparisons(cohorts: CohortMap): PairComparison[] {
    return this.pairs(Object.keys(cohorts)).map(([first, second]) => {
      const { pValue, sameDistribution } = Statistics.compareSamples(cohorts[first], cohorts[second]);
      return {
        p: Math.round(pValue * 10000) / 10000,
        sameDistribution,
        title: `${first} to ${second}`
      };
    });
  }

  private pairs(set: string[]): [string, string][] {
    const pairs: [string, string][] = [];
    for (let i = 0; i < set.length; i++) {
      for (let j = i + 1; j < set.length; j++) {
        pairs.push([set[i], set[j]]);
      }
    }

    return pairs;
  }
}
