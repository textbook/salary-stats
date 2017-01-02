import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Plug in highcharts-more
import * as HighCharts from 'highcharts';
import * as HighChartsMore from 'highcharts/highcharts-more';
HighChartsMore(HighCharts);

import { Person } from '../lib/models';

const MINIMUM_COHORT_LENGTH = 5;

const BASE_OPTIONS = {
  chart: { type: 'boxplot' },
  legend: { enabled: false },
  title: { text: 'Salary Comparison' },
  yAxis: { title: { text: 'Salary (£)' } },
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
  displayWarning: boolean;
  newPersonForm: FormGroup;
  options: any;
  people: Person[];

  constructor(private builder: FormBuilder) {
    this.newPersonForm = builder.group({
      name: ['', Validators.required],
      salary: ['', Validators.required],
      cohort: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.people = [
      { name: 'Alice', salary: 12345, cohort: 'A' },
      { name: 'Bob', salary: 12435, cohort: 'A' },
      { name: 'Chris', salary: 12534, cohort: 'A' },
      { name: 'Davina', salary: 12453, cohort: 'A' },
      { name: 'Edsger', salary: 12543, cohort: 'A' },
      { name: 'Fred', salary: 13245, cohort: 'B' },
      { name: 'Geoff', salary: 13425, cohort: 'B' },
      { name: 'Helen', salary: 13524, cohort: 'B' },
      { name: 'Imogen', salary: 13452, cohort: 'B' },
      { name: 'Jack', salary: 13542, cohort: 'B' },
    ];
    this.updateChart();
  }

  addPerson() {
    if (this.newPersonForm.valid) {
      this.people.push(this.newPersonForm.value);
      this.updateChart();
      this.newPersonForm.setValue({ name: '', salary: '', cohort: '' });
    }
  }

  deletePerson(index: number) {
    this.people.splice(index, 1);
    this.updateChart();
  }

  deleteAllPeople() {
    let deleteAll = confirm('Are you sure you want to delete all people? This cannot be undone.');
    if (deleteAll) {
      this.people.splice(0, this.people.length);
      this.updateChart();
    }
  }

  updateChart() {
    let { categories, data } = this._splitIntoCohorts(this.people);

    this.displayWarning = this._anyCohortsShorterThanMinimumLength(data);

    let xAxis = { categories, title: { text: 'Cohort' } };
    let series = [Object.assign({}, SERIES_OPTIONS, { data })];
    this.options = Object.assign({}, BASE_OPTIONS, { series, xAxis });
  }

  private _splitIntoCohorts(people: Person[]) {
    let cohortMap = this._createCohortMap(people);
    let cohorts = Object.keys(cohortMap);

    return {
      categories: cohorts,
      data: Array.from(cohorts).map(key => cohortMap[key].sort()),
    };
  }

  private _createCohortMap(people: Person[]): { [key: string]: number[] } {
    let cohorts = {};
    people.map(({ cohort, salary }) => {
      if (!cohorts.hasOwnProperty(cohort)) {
        cohorts[cohort] = [];
      }
      cohorts[cohort].push(salary);
    });
    return cohorts;
  }

  private _anyCohortsShorterThanMinimumLength(cohorts: number[][]) {
    let numberOfCohortsShorterThanMinimumLength = cohorts.reduce(
      (total, cohort) => total + (cohort.length < MINIMUM_COHORT_LENGTH ? 1 : 0),
      0
    );
    return numberOfCohortsShorterThanMinimumLength > 0;
  }
}
