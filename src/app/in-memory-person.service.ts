import { Injectable } from '@angular/core';

import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable()
export class InMemoryPersonService implements InMemoryDbService {
  createDb(): {} {
    let people = [
      { id: 1, name: 'Alice', salary: 12345, cohort: 'A' },
      { id: 2, name: 'Bob', salary: 12435, cohort: 'A' },
      { id: 3, name: 'Chris', salary: 12534, cohort: 'A' },
      { id: 4, name: 'Davina', salary: 12453, cohort: 'A' },
      { id: 5, name: 'Edsger', salary: 12543, cohort: 'A' },
      { id: 6, name: 'Fred', salary: 13245, cohort: 'B' },
      { id: 7, name: 'Geoff', salary: 13425, cohort: 'B' },
      { id: 8, name: 'Helen', salary: 13524, cohort: 'B' },
      { id: 9, name: 'Imogen', salary: 13452, cohort: 'B' },
      { id: 10, name: 'Jack', salary: 13542, cohort: 'B' },
    ];
    return { people };
  }
}
