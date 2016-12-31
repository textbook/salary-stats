import { Component } from '@angular/core';

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Salary Statistics';
  people = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Chris' }];
}
