import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NodesComponent } from './nodes/nodes.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { HomeComponent } from './home/home.component';
import { GenerateWalletComponent } from './generate-wallet/generate-wallet.component';
import { SetupNodeComponent } from './setup-node/setup-node.component';
import { FormsModule } from '@angular/forms';
import { CountUpModule } from 'countup.js-angular2';

// Additional modules
import { QRCodeModule } from 'angular2-qrcode';
import { RavenGuideComponent } from './raven-guide/raven-guide.component';
import { StatsComponent } from './stats/stats.component';
import { StatsSafenodesComponent } from './stats-safenodes/stats-safenodes.component';
import { StatsRavenComponent } from './stats-raven/stats-raven.component';

@NgModule({
    declarations: [
        AppComponent,
        NodesComponent,
        NodeDetailsComponent,
        HomeComponent,
        GenerateWalletComponent,
        SetupNodeComponent,
        RavenGuideComponent,
        StatsComponent,
        StatsSafenodesComponent,
        StatsRavenComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule,
        FormsModule,
        QRCodeModule,
        CountUpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
