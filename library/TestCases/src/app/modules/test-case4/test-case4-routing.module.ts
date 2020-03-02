import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCase4Component } from './test-case4.component';

const routes: Routes = [{ path: '', component: TestCase4Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestCase4RoutingModule {}
