import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'comp-a', pathMatch: 'full' },
  {
    path: 'comp-a',
    loadComponent: async () =>
      (await import('./components/comp-a/comp-a.component')).CompAComponent,
  },
  {
    path: 'comp-b',
    loadComponent: async () =>
      (await import('./components/comp-b/comp-b.component')).CompBComponent,
  },
];
