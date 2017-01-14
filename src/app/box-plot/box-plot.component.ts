import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Person } from '../../lib/models';
import { Statistics } from '../../lib/statistics';
import { PersonService } from '../person.service';

const BASE_BOX_PLOT_OPTIONS = {
  chart: { type: 'boxplot' },
  legend: { enabled: false },
  title: { text: 'Salary Comparison' },
  tooltip: { formatter: formatChartPoint },
  yAxis: { title: { text: 'Salary (£)' } },
};

@Component({
  selector: 'sst-box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.scss']
})
export class BoxPlotComponent implements OnInit {

  boxPlotOptions$: Observable<any>;

  constructor(private service: PersonService) { }

  ngOnInit() {
    this.boxPlotOptions$ = this.service.people$.map(people => this.createChartOptions(people));
  }

  createChartOptions(people: Person[]): any {
    let { categories, data, outliers } = this.splitIntoCohorts(people);

    let xAxis = { categories, title: { text: 'Cohort' } };
    let series = [{ data }, { type: 'scatter', data: outliers }];

    return Object.assign({}, BASE_BOX_PLOT_OPTIONS, { series, xAxis });
  }

  private splitIntoCohorts(people: Person[]) {
    let cohortMap = this.createCohortMap(people);
    let cohorts = Array.from(Object.keys(cohortMap));
    let data = cohorts.map(key => Statistics.calculateBoxPlotData(cohortMap[key]));

    return {
      categories: cohorts,
      data,
      outliers: Statistics.identifyOutliers(people, data, cohorts),
    };
  }

  private createCohortMap(people: Person[]): { [key: string]: number[] } {
    let cohorts = this.generateInitialCohorts(people);
    this.sortCohortValues(cohorts);
    return cohorts;
  }

  private generateInitialCohorts(people: Person[]): { [key: string]: number[] } {
    let cohorts = {};
    people.map(({ cohort, salary }) => {
      if (!cohorts.hasOwnProperty(cohort)) {
        cohorts[cohort] = [];
      }
      cohorts[cohort].push(salary);
    });
    return cohorts;
  }

  private sortCohortValues(cohorts: { [p: string]: number[] }) {
    for (let cohort of Object.keys(cohorts)) {
      cohorts[cohort].sort();
    }
  }
}

export function formatChartPoint() {
  if (this.point.options.hasOwnProperty('median')) {
    return formatBoxPlotPoint.call(this);
  }
  return formatOutlierPoint.call(this);
}

function formatBoxPlotPoint() {
  let { low, q1, median, q3, high } = this.point.options;
  let cohort = this.key;

  return `<strong>Cohort ${cohort}</strong><br>
          Upper fence: £${high.toLocaleString()}<br>
          Upper quartile: £${q3.toLocaleString()}<br>
          Median: £${median.toLocaleString()}<br>
          Lower quartile: £${q1.toLocaleString()}<br>
          Lower fence: £${low.toLocaleString()}`;
}

function formatOutlierPoint() {
  let { y, name } = this.point.options;
  return `<strong>${name}</strong><br>
          Salary: £${y.toLocaleString()}`;
}
