import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-nodes',
    templateUrl: './nodes.component.html',
    styleUrls: ['./nodes.component.less']
})
export class NodesComponent implements OnInit {

    public searchModel: string;

    constructor(private router: Router) {

    }

    public launchSearch(): void {
        this.router.navigateByUrl('/address/' + this.searchModel);
    }

    ngOnInit() {
    }

}
