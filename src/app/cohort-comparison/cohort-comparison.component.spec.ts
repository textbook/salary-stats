import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReplaySubject, Subject } from 'rxjs';

import { CohortComparisonComponent } from './cohort-comparison.component';
import { PersonService } from '../person.service';
import { CohortMap } from '../../lib';

describe('CohortComparisonComponent', () => {
  let fixture: ComponentFixture<CohortComparisonComponent>;
  let component: CohortComparisonComponent;
  let personServiceSpy: PersonService;
  let cohortSubject: Subject<CohortMap>;

  beforeEach(waitForAsync(() => {
    cohortSubject = new ReplaySubject<CohortMap>(1);
    personServiceSpy = jasmine.createSpyObj('PersonServiceSpy', ['addPerson']);
    personServiceSpy.cohorts$ = cohortSubject.asObservable();

    TestBed.configureTestingModule({
      declarations: [CohortComparisonComponent],
      imports: [],
      providers: [
        { provide: PersonService, useValue: personServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CohortComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('comparisons', () => {
    it('creates titles for cohort pairs', done => {
      cohortSubject.next({
        'A': [275, 300],
        'B': [200],
        'C': [230],
        'D': [240],
      });

      component.pairComparisons$.subscribe(comparisonPairs => {
        expect(comparisonPairs.map(p => p.title)).toEqual([
          'A to B', 'A to C', 'A to D',
          'B to C', 'B to D',
          'C to D'
        ]);
        done();
      });
    });

    it('creates no pairs for only one cohort', done => {
      cohortSubject.next({ 'H': [10] });

      component.pairComparisons$.subscribe(comparisonPairs => {
        expect(comparisonPairs).toEqual([]);
        done();
      });
    });

    it('creates p values for cohort pairs', done => {
      cohortSubject.next({
        'A': [220, 275, 300],
        'B': [200, 220],
        'C': [230, 275, 295],
      });

      component.pairComparisons$.subscribe(comparisonPairs => {
        const pValues = comparisonPairs.map(p => p.p);
        expect(pValues[0]).toBeCloseTo(0.6604, 3);
        expect(pValues[1]).toBeCloseTo(0.9963, 3);
        expect(pValues[2]).toBeCloseTo(0.1813, 3);
        done();
      });
    });

    it('shows significance for cohort pairs', done => {
      cohortSubject.next({
        'A': [275, 300],
        'B': [200, 200, 210, 220],
        'C': [230, 275, 295, 20520],
      });

      component.pairComparisons$.subscribe(comparisonPairs => {
        const isSameDistribution = comparisonPairs.map(p => p.sameDistribution);
        expect(isSameDistribution[0]).toBe(true);
        expect(isSameDistribution[1]).toBe(true);
        expect(isSameDistribution[2]).toBe(false);
        done();
      });
    });
  });
});
