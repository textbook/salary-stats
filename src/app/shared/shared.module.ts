import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';

import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsA11y from 'highcharts/modules/accessibility';

HighchartsMore(Highcharts);
HighchartsA11y(Highcharts);

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
