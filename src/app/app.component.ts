import { Component, OnInit } from '@angular/core';

import { PersonService } from './person.service';

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.personService.fetch();
  }
}
