import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { PersonalOperativoPage } from './pages/personal-operativo/personal-operativo.page';

export const routes: Routes = [
  { path: '',                   component: HomePage },
  { path: 'personal-operativo', component: PersonalOperativoPage },
  { path: '**',                 redirectTo: '' }
];