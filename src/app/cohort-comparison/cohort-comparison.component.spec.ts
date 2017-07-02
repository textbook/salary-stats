import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';

import { CohortComparisonComponent } from './cohort-comparison.component';
import { CohortService } from '../cohort.service';
import { PersonService } from '../person.service';
import { Person } from '@lib/models';

describe('CohortComparisonComponent', () => {
  let fixture: ComponentFixture<CohortComparisonComponent>;
  let component: CohortComparisonComponent;
  let commonPeople: Person[];
  let personServiceSpy: PersonService;

  beforeEach(async(() => {
    personServiceSpy = jasmine.createSpyObj('PersonServiceSpy', ['addPerson']);
    personServiceSpy.people$ = Observable.of([]);

    TestBed.configureTestingModule({
      declarations: [CohortComparisonComponent],
      imports: [],
      providers: [
        { provide: PersonService, useValue: personServiceSpy },
        CohortService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CohortComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    commonPeople = [
      new Person('Anna', 300, 'A'),
      new Person('Adelbert', 275, 'A'),
      new Person('Bert', 200, 'B'),
      new Person('Celine', 230, 'C'),
    ];
  });

  describe('comparisons', () => {
    it('creates titles for cohort pairs', () => {
      let people = commonPeople.concat(new Person('Damien', 240, 'D'));

      let comparisonPairs = component.createPairComparisons(people);

      expect(comparisonPairs.map(p => p.title)).toEqual([
        'A to B', 'A to C', 'A to D',
        'B to C', 'B to D',
        'C to D'
      ]);
    });

    it('creates no pairs for only one person', () => {
      let comparisonPairs = component.createPairComparisons([new Person('Han Solo', 10, 'H')]);

      expect(comparisonPairs).toEqual([]);
    });

    it('creates p values for cohort pairs', () => {
      let people = commonPeople.concat(
        new Person('Ada', 220, 'A'),
        new Person('Bert', 220, 'B'),
        new Person('Carmelia', 275, 'C'),
        new Person('Carlton', 295, 'C'),
      );

      let comparisonPairs = component.createPairComparisons(people);

      let pValues = comparisonPairs.map(p => p.p);
      expect(pValues[0]).toEqual(0.6604);
      expect(pValues[1]).toEqual(0.9963);
      expect(pValues[2]).toEqual(0.1813);
    });

    it('shows significance for cohort pairs', () => {
      let people = commonPeople.concat(
        new Person('Bert', 220, 'B'),
        new Person('Bart', 210, 'B'),
        new Person('Borg', 200, 'B'),
        new Person('Carmelia', 275, 'C'),
        new Person('Carlton', 295, 'C'),
        new Person('Cornelius', 20520, 'C'),
      );

      let comparisonPairs = component.createPairComparisons(people);

      let isSameDistribution = comparisonPairs.map(p => p.sameDistribution);
      expect(isSameDistribution[0]).toBe(true);
      expect(isSameDistribution[1]).toBe(true);
      expect(isSameDistribution[2]).toBe(false);
    });

  });

});
