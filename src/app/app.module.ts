import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { PersonService } from './person.service';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BoxPlotComponent } from './box-plot/box-plot.component';
import { TableComponent } from './table/table.component';
import { CohortComparisonComponent } from './cohort-comparison/cohort-comparison.component';
import { InMemoryPersonService } from './in-memory-person.service';

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
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryPersonService, { delay: 0 }),
    SharedModule,
  ],
  providers: [
    PersonService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
