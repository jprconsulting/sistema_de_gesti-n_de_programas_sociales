import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreasAdscripcionRoutingModule } from './areas-adscripcion-routing.module';
import { AreasAdscripcionComponent } from './areas-adscripcion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AreasAdscripcionComponent
  ],
  imports: [
    CommonModule,
    AreasAdscripcionRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AreasAdscripcionModule { }
