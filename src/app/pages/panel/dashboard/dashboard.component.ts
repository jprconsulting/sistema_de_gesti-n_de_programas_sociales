import { Component } from '@angular/core';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.updateHeaderTitle('Tablero');
  } 
}
