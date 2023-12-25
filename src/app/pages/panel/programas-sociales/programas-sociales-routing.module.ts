import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramasSocialesComponent } from './programas-sociales.component';

const routes: Routes = [
  {
    path: '',
    component: ProgramasSocialesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramasSocialesRoutingModule { }
