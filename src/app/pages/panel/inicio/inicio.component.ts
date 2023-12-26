import { Component } from '@angular/core';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.updateHeaderTitle('');
  }
}
