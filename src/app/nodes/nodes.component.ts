import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-nodes',
    templateUrl: './nodes.component.html',
    styleUrls: ['./nodes.component.less']
})
export class NodesComponent implements OnInit {

    public searchModel: string;

    public nodes: {
        balance: number;
        collateral: number;
        name: string;
        SAFE_address: string;
        tier: number;
    }[];

    // Current collateral
    public collateral = 0;

    // Tiers count
    public tier1Count = 0;
    public tier2Count = 0;
    public tier3Count = 0;

    public nodesEnabled = 0;
    public nodesActives = 0;

    // Check if Error occur
    public error = false;

    // Check if address is currently loading
    public mainLoading = true;

    constructor(private router: Router) {
        this.nodes = [];
        this._loadNodesDataFromServer();
    }

    public launchSearch(): void {
        this.router.navigateByUrl('/address/' + this.searchModel);
    }

    /**
     * Apply data loaded from server
     * @param nodesData         Data from server
     */
    public updateData(nodesData: any): void {

        // Nodes data
        this.nodes = nodesData.SafeNodes;

        // Round balances
        for (let i = 0, ls = this.nodes.length; i < ls; i++) {
            this.nodes[i].collateral = Math.round(this.nodes[i].collateral);
            this.nodes[i].balance = Math.round(this.nodes[i].balance);
        }

        // Apply tiers
        this.tier1Count = nodesData.tier_1_count;
        this.tier2Count = nodesData.tier_2_count;
        this.tier3Count = nodesData.tier_3_count;

        // Apply collateral
        this.collateral = Math.round(nodesData.collateral_total);

        // Calculate nodes
        this.nodesActives = nodesData.node_count - nodesData.tier_0_count;
        this.nodesEnabled = nodesData.node_count;

        // Data loaded... We can load names from server
        this._loadNodesNameFromServer();
    }

    /**
     * Load custom data for Safe Nodes like as JSON file
     */
    private _loadNodesDataFromServer(): void {
        $.getJSON( 'https://rpc.safenodes.org:8443/getNodes', (data) => {
            this.updateData(data.nodes);
        }).done((data) => {
            // Request done
            // console.log(data);
        }).fail((jqXHR, textStatus, errorThrown) => {
            this.error = true;
            console.error( 'Error during load custom Node data : ', jqXHR, jqXHR.responseJSON, jqXHR.responseJSON.error);
        }).always((d) => {
            // console.log( "complete" );
        });
    }

    /**
     * Load custom data for Safe Nodes like as JSON file
     */
    private _loadNodesNameFromServer(): void {
        $.getJSON( 'assets/nodes.json', (data) => {

            // Now we can apply name
            for (let j = 0, lx = data.nodes.length; j < lx; j++) {
                for (let i = 0, ls = this.nodes.length; i < ls; i++) {
                    if (data.nodes[j].address === this.nodes[i].SAFE_address) {
                        this.nodes[i].name = data.nodes[j].name;
                        break;
                    }
                }
            }

            this.mainLoading = false;

        }).done((data) => {
            // Request done
            // console.log(data);
        }).fail((jqXHR, textStatus, errorThrown) => {
            this.error = true;
            console.error( 'Error during load custom Node data : ', jqXHR, jqXHR.responseJSON, jqXHR.responseJSON.error);
        }).always((d) => {
            // console.log( "complete" );
        });
    }

    ngOnInit() {

    }
}
