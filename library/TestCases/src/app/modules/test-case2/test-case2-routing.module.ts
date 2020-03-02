import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCase2Component } from './test-case2.component';

const routes: Routes = [{ path: '', component: TestCase2Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestCase2RoutingModule {}
