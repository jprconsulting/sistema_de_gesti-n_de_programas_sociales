import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariosRoutingModule } from './beneficiarios-routing.module';
import { BeneficiariosComponent } from './beneficiarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BeneficiariosComponent
  ],
  imports: [
    CommonModule,
    BeneficiariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BeneficiariosModule { }
