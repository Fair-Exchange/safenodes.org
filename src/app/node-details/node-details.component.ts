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
    public dataPerLoad = 40;
    public dataLoaded = 40;

    public ravenDataLoaded = 40;
    public ravenDataPerLoad = 40;
    public loadMoreRavenData = false;

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
        collateral : 0,
        tier : 0,
        tierReal : 0,
        amount : 0,
        amountNeed : 0,
        received : 0,
        totalRewards : 0,
        totalEarned : 0,

        // How much Safe earned with Raven notarization
        safeEarnedWithRVN : 0
    };

    // List of rewards get by address
    public rewards = [];

    // List of Raven rewards get by address
    public ravenRewards = [];

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
                (this.node.amount >= 50000 && this.node.amount < 100000) ? 2 : 3
            )
        );
    }

    /**
     * Calculate tier of SafeNode
     */
    private _loadFromServer(): void {

        $.getJSON( 'https://rpc.safenodes.org:8443/getJSONNodes', (data) => {
            // console.log( "success", data );
        }).done((nodesData) => {

            // Data of Node
            let nodeFound = {
                collateral : 0,
                tier : 0
            };

            // Get current Node from list
            for (let i = 0, ls = nodesData.nodes.SafeNodes.length; i < ls; i++) {
                if (nodesData.nodes.SafeNodes[i].SAFE_address === this.address) {
                    nodeFound = nodesData.nodes.SafeNodes[i];
                }
            }

            $.getJSON( 'https://rpc.safenodes.org:8443/home/' + this.address, (data) => {
                // console.log( "success", data );
            }).done((data) => {

                this.addressFound = true;
                this.mainLoading = false;

                this.node.collateral = Math.floor(nodeFound.collateral * 100) / 100;
                this.node.tierReal = nodeFound.tier;
                this.node.amount = Math.floor(data.balance * 100) / 100;
                this.node.received = data.received / 100000000;
                this.node.totalRewards = data.totalRewards;
                this.node.totalEarned = Math.floor(data.totalEarned * 100) / 100;

                this.node.safeEarnedWithRVN = data.safeEarnedWithRVN;

                // Calculate tier of User
                this._calculateTier();

                // If tier 1 is no reach
                this.node.amountNeed = Math.floor((10000 - (data.balance / 100000000)) * 100) / 100;

                this.rewards = data.safeRewards;
                this.ravenRewards = data.ravenRewards;

                this.dataLoaded += this.dataPerLoad;

                if (this.rewards.length < this.dataPerLoad ) {
                    this.loadMoreData = false;
                }

                if (this.ravenRewards.length < this.ravenDataPerLoad ) {
                    this.loadMoreRavenData = false;
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
    public loadMore(crypto): void {

        // Send request
        this.loading = true;

        // Assign values as crypto
        const rewardsTable = (crypto === 'safe') ? 'rewards' : (crypto === 'raven') ? 'ravenRewards' : null;
        const dataLoadedTable = (crypto === 'safe') ? 'dataLoaded' : (crypto === 'raven') ? 'ravenDataLoaded' : null;
        const dataPerLoadTable = (crypto === 'safe') ? 'dataPerLoad' : (crypto === 'raven') ? 'ravenDataPerLoad' : null;
        const loadMore = (crypto === 'safe') ? 'loadMoreData' : (crypto === 'raven') ? 'loadMoreRavenData' : null;

        // Load data from server
        $.getJSON( 'https://rpc.safenodes.org:8443/' + crypto + '/' + this.address + '/' + this.dataLoaded, (data) => {
            // console.log( "success", data );
        }).done((data) => {

            // Send request
            this.loading = false;

            for (let i = 0, ls = data.rewards.length; i < ls; i++) {
                for (let j = 0, lx = this[rewardsTable].length; j < lx; j++) {
                    if (this[rewardsTable][j].txid === data.rewards[i].txid) {
                        data.rewards.splice(i, 1);
                        i--;
                        ls--;
                        break;
                    }
                }
            }

            this[rewardsTable] = this[rewardsTable].concat(data.rewards);
            this[dataLoadedTable] += this.dataPerLoad;

            if (data.rewards.length < this[dataPerLoadTable]) {
                this[loadMore] = false;
            }

            // Sort that by timestamp
            this[rewardsTable].sort((a, b) => b.timestamp - a.timestamp);

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
