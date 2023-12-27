import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

import Histogram from 'highcharts/modules/histogram-bellcurve';
import { VisitasService } from 'src/app/core/services/visitas.service';
Histogram(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

const Wordcloud = require('highcharts/modules/wordcloud');
Wordcloud(Highcharts);

@Component({
    selector: 'app-nube-palabras',
    templateUrl: './nube-palabras.component.html',
    styleUrls: ['./nube-palabras.component.css']
})

export class NubePalabrasComponent {

    options: Highcharts.Options = {};

    constructor(private visitasService: VisitasService) {
        this.getWordCloud();
    }

    getWordCloud() {
        this.visitasService.getWordCloud().subscribe({
            next: (dataFromAPI) => {
                this.options = {
                    series: [{
                        rotation: {
                            from: -60,
                            to: 60,
                            orientations: 5
                        },
                        type: 'wordcloud',
                        data: dataFromAPI
                    }],
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                };
                Highcharts.chart('container', this.options);
            },
            error: (error) => {
                console.error('error', error);
            }
        })
    }


}
