import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

@NgModule({
  imports: [
    CommonModule,
    HighchartsChartModule,
    ReactiveFormsModule,
  ],
  exports: [
    HighchartsChartModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
