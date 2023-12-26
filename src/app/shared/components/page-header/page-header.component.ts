import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderTitleService } from 'src/app/core/services/header-title.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent {
  headerTitle = '';

  constructor(private headerTitleService: HeaderTitleService) {
    this.headerTitleService.headerTitle$.subscribe((newTitle) => {
      this.headerTitle = newTitle;
    });
  }
}
