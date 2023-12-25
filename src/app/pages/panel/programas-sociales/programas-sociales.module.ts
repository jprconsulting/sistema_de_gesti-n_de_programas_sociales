import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramasSocialesRoutingModule } from './programas-sociales-routing.module';
import { ProgramasSocialesComponent } from './programas-sociales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProgramasSocialesComponent
  ],
  imports: [
    CommonModule,
    ProgramasSocialesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProgramasSocialesModule { }
