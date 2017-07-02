import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { CohortMap, Person } from '@lib/models';
import { PersonService } from '../person.service';
import { Statistics } from '@lib/statistics';

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

  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.boxPlotOptions$ = Observable.zip(
        this.personService.people$,
        this.personService.cohorts$,
        (people: Person[], cohorts: CohortMap) => this.createChartOptions(people, cohorts)
    );
  }

  createChartOptions(people: Person[], cohorts: CohortMap): any {
    let { categories, data, outliers } = this.calculateCohortStatistics(people, cohorts);

    let xAxis = { categories, title: { text: 'Cohort' } };
    let series = [{ data }, { type: 'scatter', data: outliers }];

    return Object.assign({}, BASE_BOX_PLOT_OPTIONS, { series, xAxis });
  }

  calculateCohortStatistics(people: Person[], cohortMap: CohortMap) {
    console.log('calculating statistics for', cohortMap);
    let cohorts = Array.from(Object.keys(cohortMap));
    let data = cohorts.map(key => Statistics.calculateBoxPlotData(cohortMap[key]));

    return {
      categories: cohorts,
      data,
      outliers: Statistics.identifyOutliers(people, data, cohorts),
    };
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
