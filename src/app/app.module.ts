import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxPlotComponent } from './box-plot/box-plot.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { PersonService } from './person.service';
import { SharedModule } from './shared/shared.module';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxPlotComponent,
    BulkUploadComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
