import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCase5Component } from './test-case5.component';

const routes: Routes = [{ path: '', component: TestCase5Component }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestCase5RoutingModule {}
