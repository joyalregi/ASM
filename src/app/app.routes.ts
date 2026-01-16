import { Routes } from '@angular/router';
import { Login } from '../Components/login/login';
import { Homepage } from '../Components/homepage/homepage';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Homepage },
  { path: '**', redirectTo: '/login' }, // Wildcard route for 404
];
