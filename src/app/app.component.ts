import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Plug in highcharts-more
import * as HighCharts from 'highcharts';
import * as HighChartsMore from 'highcharts/highcharts-more';
HighChartsMore(HighCharts);

import { Person, Statistics } from '../lib';

const EMPTY_FORM = { name: '', salary: '', cohort: '' };

const BASE_CHART_OPTIONS = {
  chart: { type: 'boxplot' },
  legend: { enabled: false },
  title: { text: 'Salary Comparison' },
  yAxis: { title: { text: 'Salary (£)' } },
};

const BASE_SERIES_OPTIONS = {
  name: 'Salaries',
  tooltip: { headerFormat: '<strong>Cohort {point.key}</strong><br>' },
};

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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
    if (this._hasValidInput()) {
      this._addPerson(this.newPersonForm.value);
      this._clearInputData();
      this.updateChart();
    }
  }

  deletePerson(index: number) {
    this._overwriteFormIfEmpty(this._getPerson(index));
    this._deletePerson(index);
    this.updateChart();
  }

  deleteAllPeople() {
    let message = 'Are you sure you want to delete all people? This cannot be undone.';
    if (confirm(message)) {
      this._deletePeople();
      this.updateChart();
    }
  }

  updateChart() {
    this.options = this._createChartOptions(this.people);
  }

  private _createChartOptions(people: Person[]) {
    let { categories, data } = this._splitIntoCohorts(people);

    let xAxis = { categories, title: { text: 'Cohort' } };
    let series = [Object.assign({}, BASE_SERIES_OPTIONS, { data })];
    return Object.assign({}, BASE_CHART_OPTIONS, { series, xAxis });
  }

  private _splitIntoCohorts(people: Person[]) {
    let cohortMap = this._createCohortMap(people);
    let cohorts = Array.from(Object.keys(cohortMap));

    return {
      categories: cohorts,
      data: cohorts.map(key => Statistics.generateBoxPlotData(cohortMap[key])),
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

  private _overwriteFormIfEmpty(person: Person) {
    let formData = this.newPersonForm.value;
    for (let key of ['name', 'salary', 'cohort']) {
      if (formData[key] !== EMPTY_FORM[key]) {
        return;
      }
    }
    this.newPersonForm.setValue(person);
  }

  private _hasValidInput() {
    return this.newPersonForm.valid;
  }

  private _clearInputData() {
    this.newPersonForm.setValue(EMPTY_FORM);
  }

  private _getPerson(index: number): Person {
    return this.people[index];
  }

  private _addPerson(person: any) {
    this.people.push(person);
  }

  private _deletePerson(index: number) {
    this.people.splice(index, 1);
  }

  private _deletePeople() {
    this.people.splice(0, this.people.length);
  }
}
