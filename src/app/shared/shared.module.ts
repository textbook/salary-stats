import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

declare const require: any;

export function chartFactory() {
  // Plug in highcharts-more and set global config
  const HighCharts = require('highcharts');
  const HighChartsMore = require('highcharts/highcharts-more');
  HighChartsMore(HighCharts);
  HighCharts.setOptions({ lang: { thousandsSep: ',' } });
  return HighCharts;
}

@NgModule({
  imports: [
    ChartModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HighchartsStatic, useFactory: chartFactory },
  ],
  exports: [
    ChartModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
