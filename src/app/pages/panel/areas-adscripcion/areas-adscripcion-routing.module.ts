import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreasAdscripcionComponent } from './areas-adscripcion.component';

const routes: Routes = [
  {
    path: '',
    component: AreasAdscripcionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreasAdscripcionRoutingModule { }
