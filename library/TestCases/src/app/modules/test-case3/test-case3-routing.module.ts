import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCase3Component } from './test-case3.component';

const routes: Routes = [{ path: '', component: TestCase3Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestCase3RoutingModule {}
