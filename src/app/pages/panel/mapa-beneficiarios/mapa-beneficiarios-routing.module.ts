import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapaBeneficiariosComponent } from './mapa-beneficiarios.component';

const routes: Routes = [
  {
    path: '',
    component: MapaBeneficiariosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaBeneficiariosRoutingModule { }
