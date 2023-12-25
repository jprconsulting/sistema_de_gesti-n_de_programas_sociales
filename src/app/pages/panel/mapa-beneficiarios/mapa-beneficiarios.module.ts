import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaBeneficiariosRoutingModule } from './mapa-beneficiarios-routing.module';
import { MapaBeneficiariosComponent } from './mapa-beneficiarios.component';


@NgModule({
  declarations: [
    MapaBeneficiariosComponent
  ],
  imports: [
    CommonModule,
    MapaBeneficiariosRoutingModule
  ]
})
export class MapaBeneficiariosModule { }
