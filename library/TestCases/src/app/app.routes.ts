import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'test-case-1', loadComponent: () => import('./modules/test-case1/test-case1.component').then(m => m.TestCase1Component) },
    { path: 'test-case-2', loadComponent: () => import('./modules/test-case2/test-case2.component').then(m => m.TestCase2Component) },
    { path: 'test-case-3', loadComponent: () => import('./modules/test-case3/test-case3.component').then(m => m.TestCase3Component) },
    { path: 'test-case-4', loadComponent: () => import('./modules/test-case4/test-case4.component').then(m => m.TestCase4Component) },
    { path: 'test-case-5', loadComponent: () => import('./modules/test-case5/test-case5.component').then(m => m.TestCase5Component) },
    { path: 'test-case-6', loadComponent: () => import('./modules/test-case6/test-case6.component').then(m => m.TestCase6Component) },
    { path: '', redirectTo: '/test-case-1', pathMatch: 'full' }
];
