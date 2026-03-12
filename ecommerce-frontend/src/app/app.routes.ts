import { Routes } from '@angular/router';

export const routes: Routes = [
{ path: '', loadComponent: () => import('./Pages/home/home').then(m => m.Home) },
{ path: 'login', loadComponent: () => import('./Pages/login/login').then(m => m.Login) },
{ path: 'register', loadComponent: () => import('./Pages/register/register').then(m => m.Register) },
  { path: 'products', loadComponent: () => import('./Pages/products/products').then(m => m.Products) },


];
