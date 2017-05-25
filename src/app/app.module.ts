import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PersonService } from './person.service';
import { CohortService } from './cohort.service';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BoxPlotComponent } from './box-plot/box-plot.component';
import { TableComponent } from './table/table.component';
import { CohortComparisonComponent } from './cohort-comparison/cohort-comparison.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxPlotComponent,
    BulkUploadComponent,
    CohortComparisonComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [
    PersonService,
    CohortService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
