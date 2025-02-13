import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExamplesMainComponent } from './pages/examples/main/main.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'examples',
    component: ExamplesMainComponent,
  },
];
