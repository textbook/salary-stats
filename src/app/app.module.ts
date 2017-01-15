import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoxPlotComponent } from './box-plot/box-plot.component';
import { PersonService } from './person.service';
import { SharedModule } from './shared/shared.module';
import { TableComponent } from './table/table.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxPlotComponent,
    BulkUploadComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
