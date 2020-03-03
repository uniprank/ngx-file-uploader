import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    { path: 'test-case-1', loadChildren: () => import('./modules/test-case1/test-case1.module').then((m) => m.TestCase1Module) },
    { path: 'test-case-2', loadChildren: () => import('./modules/test-case2/test-case2.module').then((m) => m.TestCase2Module) },
    { path: 'test-case-3', loadChildren: () => import('./modules/test-case3/test-case3.module').then((m) => m.TestCase3Module) },
    { path: 'test-case-4', loadChildren: () => import('./modules/test-case4/test-case4.module').then((m) => m.TestCase4Module) },
    { path: 'test-case-5', loadChildren: () => import('./modules/test-case5/test-case5.module').then((m) => m.TestCase5Module) },
    { path: 'test-case-5', loadChildren: () => import('./modules/test-case5/test-case5.module').then((m) => m.TestCase5Module) },
    { path: '', redirectTo: '/test-case-1', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
