import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { NodesComponent } from './nodes/nodes.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'nodes', component: NodesComponent },
    { path: 'address/:id', component: NodeDetailsComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }