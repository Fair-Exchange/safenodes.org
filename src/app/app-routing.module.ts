import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GenerateWalletComponent } from './generate-wallet/generate-wallet.component';
import { HomeComponent } from './home/home.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { NodesComponent } from './nodes/nodes.component';
import {SetupNodeComponent} from './setup-node/setup-node.component';
import {RavenGuideComponent} from './raven-guide/raven-guide.component';

const routes: Routes = [
    { path: '', component: NodesComponent },
    // { path: '', component: HomeComponent },
    { path: 'generate-wallet', component: GenerateWalletComponent },
    { path: 'nodes', component: NodesComponent },
    { path: 'address/:id', component: NodeDetailsComponent },
    { path: 'setup-safenode', component: SetupNodeComponent },
    { path: 'raven-guide', component: RavenGuideComponent }

];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
