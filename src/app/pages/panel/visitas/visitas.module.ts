import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitasRoutingModule } from './visitas-routing.module';
import { VisitasComponent } from './visitas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VisitasComponent
  ],
  imports: [
    CommonModule,
    VisitasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class VisitasModule { }
