import { Component } from '@angular/core';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-nube-palabras',
  templateUrl: './nube-palabras.component.html',
  styleUrls: ['./nube-palabras.component.css']
})
export class NubePalabrasComponent {
  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.updateHeaderTitle('Nube de Palabras');
  }
}
