import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExamplesMainComponent } from './pages/examples/main/main.component';
import { TestBaseComponent } from './pages/tests/base/base.component';
import { TestInputsComponent } from './pages/tests/inputs/inputs.component';
import { TestWithFocusAfterInitComponent } from './pages/tests/with-focus-afterinit/with-focus-afterinit.component';
import { TestWithOnCompleteComponent } from './pages/tests/with-on-complete/with-on-complete.component';
import { CopyPasteComponent } from './pages/tests/copy-paste/copy-paste.component';

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
  {
    path: 'tests',
    children: [
      {
        path: 'base',
        component: TestBaseComponent,
      },
      {
        path: 'inputs',
        component: TestInputsComponent,
      },
      {
        path: 'with-focus-afterinit',
        component: TestWithFocusAfterInitComponent,
      },
      {
        path: 'with-on-complete',
        component: TestWithOnCompleteComponent,
      },
      {
        path: 'copy-paste',
        component: CopyPasteComponent,
      },
    ],
  },
];
