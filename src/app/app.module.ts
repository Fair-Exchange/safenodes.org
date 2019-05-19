import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NodesComponent } from './nodes/nodes.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { HomeComponent } from './home/home.component';
import { GenerateWalletComponent } from './generate-wallet/generate-wallet.component';

// Additional modules
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
    declarations: [
        AppComponent,
        NodesComponent,
        NodeDetailsComponent,
        HomeComponent,
        GenerateWalletComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule,
        QRCodeModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
