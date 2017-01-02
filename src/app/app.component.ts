import { Component, OnInit } from '@angular/core';

import { Person } from '../lib/models';

const BASE_OPTIONS = {
  chart: { type: 'column' },
  title: { text: 'Salaries' },
};

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Salary Statistics';
  people: Person[] = [
    { name: 'Alice', salary: 12345 },
    { name: 'Bob', salary: 12435 },
    { name: 'Chris', salary: 12534 },
  ];
  options: any;

  ngOnInit(): void {
    this.updateChart();
  }

  updateChart() {
    let series = this.people.map(({ name, salary }) => ({ name, data: [salary] }));
    this.options = Object.assign({}, BASE_OPTIONS, { series });
  }
}
