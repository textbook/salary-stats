import { Component, OnInit } from '@angular/core';

// Plug in highcharts-more
import * as HighCharts from 'highcharts';
import * as HighChartsMore from 'highcharts/highcharts-more';
HighChartsMore(HighCharts);

import { Person } from '../lib/models';

const BASE_OPTIONS = {
  chart: { type: 'boxplot' },
  legend: { enabled: false },
  title: { text: 'Salaries' },
};

const SERIES_OPTIONS = {
  name: 'Salaries',
  tooltip: { headerFormat: '<strong>Cohort {point.key}</strong><br>' },
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
    { name: 'Davina', salary: 12453 },
    { name: 'Edsger', salary: 12543 },
  ];
  options: any;

  ngOnInit(): void {
    this.updateChart();
  }

  updateChart() {
    let xAxis = { categories: ['A'], title: { text: 'Cohort' } };
    let series = [Object.assign({}, SERIES_OPTIONS, {
      data: [this.people.map(({ salary }) => salary)],
    })];
    this.options = Object.assign({}, BASE_OPTIONS, { series, xAxis });
  }
}
