import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GenerateWalletComponent } from './generate-wallet/generate-wallet.component';
import { HomeComponent } from './home/home.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { NodesComponent } from './nodes/nodes.component';
import {SetupNodeComponent} from './setup-node/setup-node.component';
import {RavenGuideComponent} from './raven-guide/raven-guide.component';
import {StatsComponent} from './stats/stats.component';
import {StatsRavenComponent} from './stats-raven/stats-raven.component';
import {StatsSafenodesComponent} from './stats-safenodes/stats-safenodes.component';

const routes: Routes = [
    { path: '', component: NodesComponent },
    // { path: '', component: HomeComponent },
    { path: 'generate-wallet', component: GenerateWalletComponent },
    { path: 'nodes', component: NodesComponent },
    { path: 'address/:id', component: NodeDetailsComponent },
    { path: 'setup-safenode', component: SetupNodeComponent },
    { path: 'raven-guide', component: RavenGuideComponent },
    { path: 'statistics', component: StatsComponent },
    { path: 'statistics/safenodes', component: StatsSafenodesComponent },
    { path: 'statistics/raven', component: StatsRavenComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule { }
