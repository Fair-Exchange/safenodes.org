import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as Chart from 'chart.js';
import * as $ from 'jquery';

// Fix bug for getContext
declare var document;

interface StatsObj {
    dates?: any;
    formatDate: number[];
    coinSupplyTotal: number;
    raven: {
        dates?: any;
        formatDate: number[];
        blockNotarized: number[];
        miner: number[];
        rewardsSend: number[];
        rewardsInSafe: number[];
    };
    safeTiers: number[];
    safeTiersByDates: {
        tier0: number[];
        tier1: number[];
        tier2: number[];
        tier3: number[];
    };
    safeCollateral: number[];
    safeCollateralByTier: {
        tier0: number[];
        tier1: number[];
        tier2: number[];
        tier3: number[];
    };
}

@Component({
  selector: 'app-stats-safenodes',
  templateUrl: './stats-safenodes.component.html',
  styleUrls: ['./stats-safenodes.component.less']
})

export class StatsSafenodesComponent implements OnInit {

    // Check if Error occur
    public error = false;

    // Check if address is currently loading
    public mainLoading = true;

    // Contains stats
    public stats: StatsObj;

    /**
     * Constructor
     */
    constructor() {

    }

    /**
     * Load custom data for Safe Nodes like as JSON file
     */
    private _loadStatsFromServer(): void {

        $.getJSON( 'https://rpc.safenodes.org:8443/getStats', (data) => {

            // Apply Data
            this.stats = data.stats;
            this.stats.formatDate = [];
            this.stats.raven.formatDate = [];

            console.log(this.stats);

            // Init canvas stats
            this._initStats();

            // Load is finished
            this.mainLoading = false;
        }).fail((jqXHR, textStatus, errorThrown) => {

            this.error = true;
            console.error('Error during load custom Node data : ', jqXHR);
            console.error(jqXHR.responseJSON);
            console.error(jqXHR.responseJSON.error);
        });
    }

    private _loadSafeNodesByTierDoughnutGraphics() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3'],
                datasets: [{
                    data: this.stats.safeTiers,
                    backgroundColor: [
                        'rgb(0,0,0)',
                        'rgb(255,116,58)',
                        'rgb(171,174,174)',
                        'rgb(255,162,0)',
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 1)'
                    ],
                    borderWidth: 3
                }]
            },
            options: {
                layout : {
                    padding: {
                        left: 50,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                animation : {
                    animateScale : true
                },
                legend : {
                    position : 'right',
                    labels: {
                        fontStyle: 'bold',
                        boxWidth : 20
                    }
                }
            }
        });
    }

    private _loadSafeNodesByTierChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out4 = {
            type: 'line',
            data: {
                labels: this.stats.formatDate,
                datasets: [{
                    label: 'Tier 0',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderColor: 'rgb(0,0,0)',
                    fill: false,
                    data: this.stats.safeTiersByDates.tier0
                },
                    {
                        label: 'Tier 1',
                        backgroundColor: 'rgba(255,116,58, 0.5)',
                        borderColor: 'rgb(255,116,58)',
                        fill: false,
                        data: this.stats.safeTiersByDates.tier1,
                    },
                    {
                        label: 'Tier 2',
                        backgroundColor: 'rgba(171,174,174, 0.5)',
                        borderColor: 'rgb(171,174,174)',
                        fill: false,
                        data: this.stats.safeTiersByDates.tier2,
                    },
                    {
                        label: 'Tier 3',
                        backgroundColor: 'rgba(255,162,0, 0.5)',
                        borderColor: 'rgb(255,162,0)',
                        fill: false,
                        data: this.stats.safeTiersByDates.tier3,
                    }]
            },
            options: {
                legend : {
                    position : 'top',
                    labels: {
                        fontStyle: 'bold',
                        boxWidth : 20
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            parser: timeFormat,
                            tooltipFormat: 'll'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Nodes'
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label(tooltipItem, myData) {
                            let label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(tooltipItem.value);
                            return label;
                        }
                    }
                }
            }
        };

        const ctx4 = document.getElementById('myChart4').getContext('2d');
        const myChart4 = new Chart(ctx4, out4);

    }

    private _loadSafeNodesOnlineChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';
        const safeTier = this.stats.safeTiersByDates;
        const onlineNodes = [];

        for (let i = 0, ls = this.stats.formatDate.length; i < ls; i++) {
            onlineNodes.push(safeTier.tier1[i] + safeTier.tier2[i] + safeTier.tier3[i]);
        }

        const out4 = {
            type: 'line',
            data: {
                labels: this.stats.formatDate,
                datasets: [{
                    label: 'Online Nodes',
                    backgroundColor: 'rgba(1,136,174, 0.5)',
                    borderColor: 'rgba(1,105,141,1)',
                    fill: true,
                    data: onlineNodes
                }]
            },
            options: {
                legend : {
                    position : 'top',
                    labels: {
                        fontStyle: 'bold',
                        boxWidth : 20
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            parser: timeFormat,
                            tooltipFormat: 'll'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Nodes Online'
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label(tooltipItem, myData) {
                            let label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(tooltipItem.value);
                            return label;
                        }
                    }
                }
            }
        };

        const ctx = document.getElementById('chartOnlineNodes').getContext('2d');
        const chartOnlineNodes = new Chart(ctx, out4);
    }

    private _loadSafeCollateralChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out = {
            type: 'line',
            data: {
                labels: this.stats.formatDate,
                datasets: [{
                    label: 'Safe Collateral',
                    backgroundColor: 'rgba(1,136,174, 0.5)',
                    borderColor: 'rgba(1,105,141,1)',
                    data: this.stats.safeCollateral,
                    type: 'line',
                    pointRadius: 0,
                    fill: 'start',
                    borderWidth: 2
                }]
            },
            options: {
                legend : {
                    labels: {
                        fontStyle: 'bold',
                        boxWidth : 20
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            parser: timeFormat,
                            tooltipFormat: 'll'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Collateral (in Million)'
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label(tooltipItem, myData) {
                            let label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.value * 1000000;
                            return label;
                        }
                    }
                }
            }
        };

        const ctx2 = document.getElementById('myChart2').getContext('2d');
        const chart = new Chart(ctx2, out);
    }

    private _loadSafeCollateralByTierChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out2 = {
            type: 'line',
            data: {
                labels: this.stats.formatDate,
                datasets: [
                    {
                        label: 'Tier 1',
                        backgroundColor: 'rgba(255,116,58, 0.5)',
                        borderColor: 'rgb(255,116,58)',
                        fill: false,
                        data: this.stats.safeCollateralByTier.tier1,
                    },
                    {
                        label: 'Tier 2',
                        backgroundColor: 'rgba(171,174,174, 0.5)',
                        borderColor: 'rgb(171,174,174)',
                        fill: false,
                        data: this.stats.safeCollateralByTier.tier2,
                    },
                    {
                        label: 'Tier 3',
                        backgroundColor: 'rgba(255,162,0, 0.5)',
                        borderColor: 'rgb(255,162,0)',
                        fill: false,
                        data: this.stats.safeCollateralByTier.tier3,
                    }]
            },
            options: {
                legend : {
                    labels: {
                        fontStyle: 'bold',
                        boxWidth : 20
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            parser: timeFormat,
                            // round: 'day'
                            tooltipFormat: 'll'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Collateral (in Million)'
                        }
                    }]
                },
                tooltips: {
                    intersect: false,
                    mode: 'index',
                    callbacks: {
                        label(tooltipItem, myData) {
                            let label = myData.datasets[tooltipItem.datasetIndex].label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(tooltipItem.value * 1000000);
                            return label;
                        }
                    }
                }
            }
        };

        const ctx3 = document.getElementById('myChart3').getContext('2d');
        const myChart3 = new Chart(ctx3, out2);

    }

    private _loadSafeSupplyChartGraphics() {

        const totalCollateral = this.stats.safeCollateral[this.stats.safeCollateral.length - 1] * 1000000;

        const ctxx = document.getElementById('myChartSupply').getContext('2d');
        const myChartx = new Chart(ctxx, {
            type: 'pie',
            data: {
                labels: ['Safe Collateral', 'Safe circulation', 'Safe lock'],
                datasets: [{
                    data: [totalCollateral, this.stats.coinSupplyTotal - totalCollateral, 36000000 - this.stats.coinSupplyTotal],
                    backgroundColor: [
                        'rgb(255,162,0)',
                        'rgb(1,136,174)',
                        'rgb(111,111,111)',
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.5)',
                        'rgba(255, 255, 255, 0.5)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                layout : {
                    padding: {
                        left: 50,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                animation : {
                    animateScale : true
                },
                legend : {
                    position : 'right',
                    labels: {
                        fontStyle: 'bold',
                        boxWidth : 20
                    }
                }
            }
        });
    }

    /**
     * Load custom data for Safe Nodes like as JSON file
     */
    private _initStats(): void {

        // Format date
        for (let j = 0, lx = this.stats.dates.length; j < lx; j++) {
            // @ts-ignore
            this.stats.formatDate.push(moment(this.stats.dates[j]));
        }

        // Format raven date
        for (let j = 0, lx = this.stats.raven.dates.length; j < lx; j++) {
            // @ts-ignore
            this.stats.raven.formatDate.push(moment(this.stats.raven.dates[j]));
        }

        for (let j = 0, lx = this.stats.safeCollateral.length; j < lx; j++) {
            this.stats.safeCollateral[j] = this.stats.safeCollateral[j] / 1000000;
        }

        for (let j = 0, lx = this.stats.safeCollateralByTier.tier0.length; j < lx; j++) {
            this.stats.safeCollateralByTier.tier0[j] = this.stats.safeCollateralByTier.tier0[j] / 1000000;
            this.stats.safeCollateralByTier.tier1[j] = this.stats.safeCollateralByTier.tier1[j] / 1000000;
            this.stats.safeCollateralByTier.tier2[j] = this.stats.safeCollateralByTier.tier2[j] / 1000000;
            this.stats.safeCollateralByTier.tier3[j] = this.stats.safeCollateralByTier.tier3[j] / 1000000;
        }

        // Draw Safe graph
        this._loadSafeNodesByTierDoughnutGraphics();
        this._loadSafeNodesByTierChartGraphics();
        this._loadSafeCollateralChartGraphics();
        this._loadSafeCollateralByTierChartGraphics();
        this._loadSafeSupplyChartGraphics();
        this._loadSafeNodesOnlineChartGraphics();
    }

    ngOnInit() {
        this._loadStatsFromServer();
    }
}
