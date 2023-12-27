import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NubePalabrasRoutingModule } from './nube-palabras-routing.module';
import { NubePalabrasComponent } from './nube-palabras.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    NubePalabrasComponent
  ],
  imports: [
    CommonModule,
    NubePalabrasRoutingModule,
    SharedModule
  ]
})
export class NubePalabrasModule { }
