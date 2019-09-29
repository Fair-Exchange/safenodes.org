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
  selector: 'app-stats-raven',
  templateUrl: './stats-raven.component.html',
  styleUrls: ['./stats-raven.component.less']
})

export class StatsRavenComponent implements OnInit {

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

    private _loadRavenByBlockNotarizedChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out4 = {
            type: 'line',
            data: {
                labels: this.stats.raven.formatDate,
                datasets: [{
                    label: 'Raven block notarized',
                    backgroundColor: 'rgb(255,44,40)',
                    borderColor: 'rgb(255,132,113)',
                    fill: false,
                    data: this.stats.raven.blockNotarized,
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
                            labelString: 'Number of Block notarized'
                        }
                    }]
                }
            }
        };

        const ctx4 = document.getElementById('ravenChart1').getContext('2d');
        const myChart4 = new Chart(ctx4, out4);

    }

    private _loadRavenMinerChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out4 = {
            type: 'line',
            data: {
                labels: this.stats.raven.formatDate,
                datasets: [{
                    label: 'Raven miner',
                    backgroundColor: 'rgba(240,82,57,0.25)',
                    borderColor: 'rgb(240,82,57)',
                    fill: 'start',
                    borderWidth: 2,
                    data: this.stats.raven.miner
                }]
            },
            options: {
                responsive : true,
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
                            labelString: 'Number of Miner'
                        }
                    }]
                }
            }
        };

        const ctx4 = document.getElementById('ravenChart2').getContext('2d');
        const myChart4 = new Chart(ctx4, out4);

    }

    private _loadRavenByRewardSendChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out4 = {
            type: 'line',
            data: {
                labels: this.stats.raven.formatDate,
                datasets: [{
                    label: 'Raven rewards send',
                    backgroundColor: 'rgb(255,162,0)' ,
                    borderColor: 'rgb(255,194,121)' ,
                    fill: false,
                    data: this.stats.raven.rewardsSend
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
                            labelString: 'Number of Reward send'
                        }
                    }]
                }
            }
        };

        const ctx4 = document.getElementById('ravenChart3').getContext('2d');
        const myChart4 = new Chart(ctx4, out4);

    }

    private _loadRavenByRewardInSafeChartGraphics() {

        const timeFormat = 'MM/DD/YYYY HH:mm';

        const out4 = {
            type: 'line',
            data: {
                labels: this.stats.raven.formatDate,
                datasets: [{
                    label: 'Raven rewards in Safe',
                    backgroundColor: 'rgba(1,136,174, 0.5)',
                    borderColor: 'rgba(1,105,141,1)',
                    fill: false,
                    data: this.stats.raven.rewardsInSafe
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
                            labelString: 'Number of Safe send'
                        }
                    }]
                }
            }
        };

        const ctx4 = document.getElementById('ravenChart4').getContext('2d');
        const myChart4 = new Chart(ctx4, out4);
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

        // Draw Raven graph
        this._loadRavenByBlockNotarizedChartGraphics();
        this._loadRavenMinerChartGraphics();
        this._loadRavenByRewardSendChartGraphics();
        this._loadRavenByRewardInSafeChartGraphics();
    }

    ngOnInit() {
        this._loadStatsFromServer();
    }
}
