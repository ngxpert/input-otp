import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./pages/examples/main/main.component').then(
        (m) => m.ExamplesMainComponent,
      ),
  },
  {
    path: 'tests',
    children: [
      {
        path: 'base',
        loadComponent: () =>
          import('./pages/tests/base/base.component').then(
            (m) => m.TestBaseComponent,
          ),
      },
      {
        path: 'inputs',
        loadComponent: () =>
          import('./pages/tests/inputs/inputs.component').then(
            (m) => m.TestInputsComponent,
          ),
      },
      {
        path: 'with-focus-afterinit',
        loadComponent: () =>
          import(
            './pages/tests/with-focus-afterinit/with-focus-afterinit.component'
          ).then((m) => m.TestWithFocusAfterInitComponent),
      },
      {
        path: 'with-on-complete',
        loadComponent: () =>
          import(
            './pages/tests/with-on-complete/with-on-complete.component'
          ).then((m) => m.TestWithOnCompleteComponent),
      },
      {
        path: 'copy-paste',
        loadComponent: () =>
          import('./pages/tests/copy-paste/copy-paste.component').then(
            (m) => m.CopyPasteComponent,
          ),
      },
    ],
  },
];
