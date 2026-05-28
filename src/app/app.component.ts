import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="main-nav">
      <a routerLink="/"                   routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Inicio</a>
      <a routerLink="/personal-operativo" routerLinkActive="active">Personal Operativo</a>
    </nav>
    <router-outlet />
  `,
  styles: [`
    .main-nav {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      background: #1a4d3a;
    }
    .main-nav a {
      color: #a8d5be;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.4rem 0.9rem;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .main-nav a:hover, .main-nav a.active {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
  `]
})
export class AppComponent {}
