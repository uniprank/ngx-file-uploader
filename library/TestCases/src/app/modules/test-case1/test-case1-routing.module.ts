import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCase1Component } from './test-case1.component';

const routes: Routes = [{ path: '', component: TestCase1Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestCase1RoutingModule {}
