import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapaProgramasSocialesRoutingModule } from './mapa-programas-sociales-routing.module';
import { MapaProgramasSocialesComponent } from './mapa-programas-sociales.component';


@NgModule({
  declarations: [
    MapaProgramasSocialesComponent
  ],
  imports: [
    CommonModule,
    MapaProgramasSocialesRoutingModule
  ]
})
export class MapaProgramasSocialesModule { }
