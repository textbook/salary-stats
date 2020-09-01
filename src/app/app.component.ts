import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { PersonService } from './person.service';
import { CohortMap, Person } from '../lib';

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  people$: Observable<Person[]>;
  cohorts$: Observable<CohortMap>;

  constructor(private personService: PersonService) {
    this.people$ = this.personService.people$;
    this.cohorts$ = this.personService.cohorts$;
  }

  ngOnInit() {
    this.personService.fetch();
  }
}
