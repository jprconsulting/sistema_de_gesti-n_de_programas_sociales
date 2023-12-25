import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NubePalabrasRoutingModule } from './nube-palabras-routing.module';
import { NubePalabrasComponent } from './nube-palabras.component';


@NgModule({
  declarations: [
    NubePalabrasComponent
  ],
  imports: [
    CommonModule,
    NubePalabrasRoutingModule
  ]
})
export class NubePalabrasModule { }
