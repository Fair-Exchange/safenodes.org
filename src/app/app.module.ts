import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NodesComponent } from './nodes/nodes.component';
import { NodeDetailsComponent } from './node-details/node-details.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        NodesComponent,
        NodeDetailsComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        NgbModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
