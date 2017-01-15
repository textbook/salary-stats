import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartModule } from 'angular2-highcharts';

// Plug in highcharts-more and set global config
import * as HighCharts from 'highcharts';
import * as HighChartsMore from 'highcharts/highcharts-more';
HighChartsMore(HighCharts);
HighCharts.setOptions({ lang: { thousandsSep: ',' } });

@NgModule({
  imports: [
    ChartModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    ChartModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
