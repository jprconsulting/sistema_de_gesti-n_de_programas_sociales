import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderTitleService {

  private headerTitleSubject = new BehaviorSubject<string>('');
  headerTitle$ = this.headerTitleSubject.asObservable();

  constructor() { }

  updateHeaderTitle(title: string): void {
    this.headerTitleSubject.next(title);
  }

}
