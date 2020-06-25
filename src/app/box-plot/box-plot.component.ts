import { Component, Input, OnChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { CohortMap, Person, Statistics } from '../../lib';
import { formatChartPoint } from './tooltip-formatter';

const BASE_BOX_PLOT_OPTIONS: Highcharts.Options = {
  chart: { type: 'boxplot' },
  legend: { enabled: false },
  title: { text: 'Salary Comparison' },
  tooltip: { formatter: formatChartPoint },
  yAxis: { title: { text: 'Salary (£)' } },
};

interface CohortStatistics {
  categories: string[];
  data: number[][];
  outliers: Partial<Highcharts.Point>[];
}

@Component({
  selector: 'sst-box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.scss']
})
export class BoxPlotComponent implements OnChanges {
  @Input() cohorts: CohortMap;
  @Input() people: Person[];

  Highcharts = Highcharts;
  chartOptions$: Observable<Highcharts.Options>;

  private chartOptionSubject: Subject<Highcharts.Options>;

  constructor() {
    this.chartOptionSubject = new BehaviorSubject<Highcharts.Options>(BASE_BOX_PLOT_OPTIONS);
    this.chartOptions$ = this.chartOptionSubject.asObservable();
  }

  ngOnChanges() {
    this.chartOptionSubject.next(this.createChartOptions(this.people, this.cohorts));
  }

  private createChartOptions(people: Person[], cohorts: CohortMap): Highcharts.Options {
    if (!people || !cohorts) {
      return BASE_BOX_PLOT_OPTIONS;
    }

    const { categories, data, outliers } = this.calculateCohortStatistics(people, cohorts);

    const xAxis: Highcharts.XAxisOptions = { categories, title: { text: 'Cohort' } };
    const series: [Highcharts.SeriesBoxplotOptions, Highcharts.SeriesScatterOptions] = [
      { data, type: 'boxplot' },
      { type: 'scatter', data: outliers }
    ];

    return { ...BASE_BOX_PLOT_OPTIONS, series, xAxis };
  }

  private calculateCohortStatistics(people: Person[], cohortMap: CohortMap): CohortStatistics {
    const cohorts = Array.from(Object.keys(cohortMap));
    const data = cohorts.map(key => Statistics.calculateBoxPlotData(cohortMap[key]));

    return {
      categories: cohorts,
      data,
      outliers: Statistics.identifyOutliers(people, data, cohorts),
    };
  }
}
