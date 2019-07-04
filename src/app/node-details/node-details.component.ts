import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as moment from 'moment';

@Component({
    selector: 'app-node-details',
    templateUrl: './node-details.component.html',
    styleUrls: ['./node-details.component.less']
})

export class NodeDetailsComponent implements OnInit {

    // Address searched as string
    public address: string;

    // Boolean to check if address is correct/found or not
    public addressFound: boolean;

    // First counter for Safe Amount
    public counterOpt = {
        duration: 2,
        separator: ' ',
        decimalPlaces: 2,
        suffix: ' SAFE'
    };

    // Second counter for Safe Received on address
    public counterOptReceived = {
        duration: 2.5,
        separator: ' ',
        decimalPlaces: 2,
        suffix: ' SAFE'
    };

    // Quantity of rewards show by pages
    public dataPerLoad = 20;
    public dataLoaded = 20;

    // Check if Error occur
    public error = false;

    // Last update found
    public lastUpdate: number;

    // Check if client try load more data
    public loading = false;

    // Used to know if user can load more data or not
    public loadMoreData = false;

    // Check if address is currently loading
    public mainLoading = false;

    // Data about Node
    public node = {
        tier : 0,
        amount : 0,
        amountNeed : 0,
        received : 0,
    };

    // List of rewards get by address
    public rewards = [];

    // Library to calculate time
    public moment: any = moment;

    /**
     * Constructor
     * @param route     Angular Route
     */
    constructor(private route: ActivatedRoute) {

        this.lastUpdate = Date.now();

        // Clear values
        this.clear();

        // Check address before
        this.checkAddress(this.route.snapshot.paramMap.get('id'));

        // Subscribe route for watching changes on URL
        this.route.queryParams.subscribe((data) => {
            if (data && data.t && (this.lastUpdate + 1000) < Date.now()) {
                this.clear();
                this.checkAddress(this.route.snapshot.paramMap.get('id'));
            }
        });
    }

    /**
     * Check validity of address
     *
     * @param address       Address who must be checked
     */
    public checkAddress(address: string) {

        // Trim address
        address = address.trim();

        // Regex to check validity of address before server side
        const checkSafeAddress = RegExp('^[R][a-km-zA-HJ-NP-Z0-9]{26,33}$', 'igm');

        if (checkSafeAddress.test(address)) {
            this.address = address;

            this._loadFromServer();
        } else {
            this.mainLoading = false;
            this.addressFound = false;
        }
    }

    /**
     * Clear all values
     */
    public clear(): void {
        // No address found by default
        this.addressFound = false;

        // Default values
        this.node.tier = 0;
        this.node.amountNeed = 0;
        this.dataLoaded = 20;

        /*
        If change amount & amount need, Count Up will go to 0 and stop
        this.node = {
            tier : 0,
            // amount : 0,
            amountNeed : 0
            // received : 0
        };*/

        this.error = false;
        this.loading = false;
        this.mainLoading = true;
        this.loadMoreData = true;
    }

    /**
     * Calculate tier of SafeNode
     */
    private _calculateTier(): void {
        this.node.tier = (this.node.amount < 10000) ? 0 : (
            (this.node.amount >= 10000 && this.node.amount < 50000) ? 1 : (
                (this.node.amount >= 50000 && this.node.amount < 10000) ? 2 : 3
            )
        );
    }

    /**
     * Calculate tier of SafeNode
     */
    private _loadFromServer(): void {
        $.getJSON( 'https://rpc.safenodes.org/' + this.address + '/' + this.dataLoaded, (data) => {
            // console.log( "success", data );
        }).done((data) => {

            this.addressFound = true;
            this.mainLoading = false;

            this.node.amount = Math.floor(data.balance / 100000000 * 100) / 100;
            this.node.received = data.received / 100000000;

            // Calculate tier of User
            this._calculateTier();

            // If tier 1 is no reach
            this.node.amountNeed = Math.floor((10000 - (data.balance / 100000000)) * 100) / 100;

            this.rewards = data.rewards;

            this.dataLoaded += this.dataPerLoad;

            if (data.rewards.length < this.dataPerLoad ) {
                this.loadMoreData = false;
            }

            // Sort that by timestamp
            this.rewards.sort((a, b) => b.timestamp - a.timestamp);
        }).fail((jqXHR, textStatus, errorThrown) => {
            if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.error === 'addressNoFound') {
                this.addressFound = false;
                this.mainLoading = false;
            } else {
                this.error = true;
            }

            console.error( 'Error : ', jqXHR, jqXHR.responseJSON, jqXHR.responseJSON.error);
        }).always((d) => {
            // console.log( "complete" );
        });
    }

    /**
     * Load more rewards
     */
    public loadMore(): void {

        // Send request
        this.loading = true;

        $.getJSON( 'https://rpc.safenodes.org/' + this.address + '/' + this.dataLoaded, (data) => {
            // console.log( "success", data );
        }).done((data) => {

            // Send request
            this.loading = false;

            for (let i = 0, ls = data.rewards.length; i < ls; i++) {
                for (let j = 0, lx = this.rewards.length; j < lx; j++) {
                    if (this.rewards[j].txid === data.rewards[i].txid) {
                        data.rewards.splice(i, 1);
                        i--;
                        ls--;
                        break;
                    }
                }
            }

            this.rewards = this.rewards.concat(data.rewards);

            this.dataLoaded += this.dataPerLoad;

            if (data.rewards.length < this.dataPerLoad ) {
                this.loadMoreData = false;
            }

            // Sort that by timestamp
            this.rewards.sort((a, b) => b.timestamp - a.timestamp);

        }).fail((jqXHR, textStatus, errorThrown) => {
            if (jqXHR && jqXHR.responseJSON && jqXHR.responseJSON.error === 'addressNoFound') {
                this.addressFound = false;
            } else {
                this.error = true;
            }
            console.error( 'Error : ', jqXHR, jqXHR.responseJSON, jqXHR.responseJSON.error);
        }).always(() => {
            // console.log( "complete" );
        });
    }

    /**
     * On NG Initialised
     */
    ngOnInit() {

    }
}
