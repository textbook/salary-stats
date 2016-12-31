import { Component } from '@angular/core';

import { Person } from '../lib/models';

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Salary Statistics';
  people: Person[] = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Chris' }];
}
