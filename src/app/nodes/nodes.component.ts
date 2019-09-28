import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import * as moment from 'moment';

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

        $.getJSON( 'https://rpc.safenodes.org:8443/getJSONNodes', (data) => {
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

            this._loadTable();

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

    public move(address: string) {
        console.log(address);

        // this.router.navigate(['/superheroes', { id: heroId, foo: 'foo' }])
    }

    private _loadTable() {

        const table: any = $('#safenodes').DataTable({
            info: false,
            paging : false,
            data: this.nodes,
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    data: '',
                    render: (data, type, row) => {
                        return (row && row.tier > 0)
                            ? '<i class="fas fa-dot-circle text-success"></i>'
                            : '<i class="fas fa-dot-circle text-danger"></i>';
                    }
                },
                {
                    targets: 2,
                    data: 'SAFE_address',
                    render: (data, type, full, meta) => '<a href="javascript:void(0)" title="SAFE address : ' + data + '" target="_parent">' + data + '</a>'
                },
                {
                    render: (data, type, row) => {
                        return (data)
                            ? '<b>' + data + '</b>'
                            : '';
                    },
                    targets: 1
                },
                {
                    render: (data, type, row) => {

                        const activity = (row.lastActivity) ? moment(row.lastActivity * 1000).fromNow()  : 'Never active';

                        return activity;
                    },
                    targets: 3
                }
            ],
            columns: [
                { },
                { data: 'name' },
                { data: 'SAFE_address' },
                { data: 'lastActivity' },
                { data: 'balance' },
                { data: 'collateral' },
                { data: 'tier' },
            ],
            order: [[ 4, 'desc' ]],
        });

        const self = this;

        $('#safenodes tbody').on( 'click', 'tr', function() {
            self.router.navigate(['/address/' + table.row( this ).data().SAFE_address]);
        } );
    }

    ngOnInit() {

    }
}
