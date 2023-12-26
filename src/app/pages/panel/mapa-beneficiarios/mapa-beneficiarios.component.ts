import { Component } from '@angular/core';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-mapa-beneficiarios',
  templateUrl: './mapa-beneficiarios.component.html',
  styleUrls: ['./mapa-beneficiarios.component.css']
})
export class MapaBeneficiariosComponent {
  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.updateHeaderTitle('Mapa de Beneficiarios por Municipio');
  } 
}
