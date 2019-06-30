import { Component } from '@angular/core';

import {
    Event,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router
} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'SafeNodes';

    loading = false;

    public myModel: string;

    constructor(private router: Router) {

        this.myModel = '';

        this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                    this.loading = true;
                    break;
                }

                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                    this.loading = false;
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }

    public launchSearch(): void {
        this.router.navigateByUrl('/address/' + this.myModel + '?t=' + new Date().getTime(), { skipLocationChange: false });
        this.myModel = null;
    }
}
