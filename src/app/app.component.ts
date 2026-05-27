import { Component } from '@angular/core';
import { HomePage } from './pages/home/home.page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomePage],
  template: `<app-home />`
})
export class AppComponent {}
