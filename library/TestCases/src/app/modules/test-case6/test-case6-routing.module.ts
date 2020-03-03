import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCase6Component } from './test-case6.component';

const routes: Routes = [{ path: '', component: TestCase6Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestCase6RoutingModule {}
