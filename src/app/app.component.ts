import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
// Plug in highcharts-more and set global config
import * as HighCharts from 'highcharts';
import * as HighChartsMore from 'highcharts/highcharts-more';
HighChartsMore(HighCharts);
HighCharts.setOptions({ lang: { thousandsSep: ',' } });

import { Person, Statistics } from '../lib';
import { PersonService } from './person.service';

const EMPTY_FORM = { name: '', salary: '', cohort: '' };

const BASE_BOX_PLOT_OPTIONS = {
  chart: { type: 'boxplot' },
  legend: { enabled: false },
  title: { text: 'Salary Comparison' },
  tooltip: { formatter: formatChartPoint },
  yAxis: { title: { text: 'Salary (£)' } },
};

@Component({
  selector: 'sst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  newPersonForm: FormGroup;
  people: Person[];

  private boxPlotOptions$: Observable<any>;
  private formSubmitted: boolean;

  constructor(private builder: FormBuilder, private service: PersonService) {
    this.newPersonForm = builder.group({
      name: ['', Validators.required],
      salary: ['', Validators.required],
      cohort: ['', Validators.required],
    });

    this.boxPlotOptions$ = this.service.people$.map((people: Person[]) => {
      return this.createChartOptions(people);
    });

    this.service.people$.subscribe((people: Person[]) => this.people = people);
  }

  addPerson() {
    this.formSubmitted = true;
    if (this._hasValidInput()) {
      this.service.addPerson(this.newPersonForm.value);
      this._clearInputData();
    }
  }

  deletePerson(index: number) {
    this._overwriteFormIfEmpty(this._getPerson(index));
    this.service.deletePersonAtIndex(index);
  }

  deleteAllPeople() {
    let message = 'Are you sure you want to delete all people? This cannot be undone.';
    if (confirm(message)) {
      this.service.deleteAllPeople();
    }
  }

  clearInputs() {
    this._clearInputData();
  }

  createChartOptions(people: Person[]) {
    let { categories, data, outliers } = this._splitIntoCohorts(people);

    let xAxis = { categories, title: { text: 'Cohort' } };
    let series = [{ data }, { type: 'scatter', data: outliers }];

    return Object.assign({}, BASE_BOX_PLOT_OPTIONS, { series, xAxis });
  }

  private _splitIntoCohorts(people: Person[]) {
    let cohortMap = this._createCohortMap(people);
    let cohorts = Array.from(Object.keys(cohortMap));
    let data = cohorts.map(key => Statistics.calculateBoxPlotData(cohortMap[key]));

    return {
      categories: cohorts,
      data,
      outliers: Statistics.identifyOutliers(people, data, cohorts),
    };
  }

  private _createCohortMap(people: Person[]): { [key: string]: number[] } {
    let cohorts = this._generateInitialCohorts(people);
    this._sortCohortValues(cohorts);
    return cohorts;
  }

  private _generateInitialCohorts(people: Person[]): { [key: string]: number[] } {
    let cohorts = {};
    people.map(({ cohort, salary }) => {
      if (!cohorts.hasOwnProperty(cohort)) {
        cohorts[cohort] = [];
      }
      cohorts[cohort].push(salary);
    });
    return cohorts;
  }

  private _sortCohortValues(cohorts: { [p: string]: number[] }) {
    for (let cohort of Object.keys(cohorts)) {
      cohorts[cohort].sort();
    }
  }

  private _overwriteFormIfEmpty(person: Person) {
    let formData = this.newPersonForm.value;
    for (let key of ['name', 'salary', 'cohort']) {
      if (formData[key] !== EMPTY_FORM[key]) {
        return;
      }
    }
    this._resetForm(person);
  }

  private _hasValidInput() {
    return this.newPersonForm.valid;
  }

  private _clearInputData() {
    this._resetForm(EMPTY_FORM);
  }

  private _resetForm(person: any) {
    this.formSubmitted = false;
    this.newPersonForm.setValue(person);
  }

  private _getPerson(index: number): Person {
    return this.people[index];
  }
}

export function formatChartPoint() {
  if (this.point.options.hasOwnProperty('median')) {
    return _formatBoxPlotPoint.call(this);
  }
  return _formatOutlierPoint.call(this);
}

function _formatBoxPlotPoint() {
  let { low, q1, median, q3, high } = this.point.options;
  let cohort = this.key;

  return `<strong>Cohort ${cohort}</strong><br>
          Upper fence: £${high.toLocaleString()}<br>
          Upper quartile: £${q3.toLocaleString()}<br>
          Median: £${median.toLocaleString()}<br>
          Lower quartile: £${q1.toLocaleString()}<br>
          Lower fence: £${low.toLocaleString()}`;
}

function _formatOutlierPoint() {
  let { y, name } = this.point.options;
  return `<strong>${name}</strong><br>
          Salary: £${y.toLocaleString()}`;
}
