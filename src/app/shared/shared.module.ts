import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  ],
  declarations: [],
  exports: [ChartModule]
})
export class SharedModule { }
