import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import Histogram from 'highcharts/modules/histogram-bellcurve';
import { MunicipiosService } from 'src/app/core/services/municipios.service';
import { VisitasService } from 'src/app/core/services/visitas.service';
import { Municipio } from 'src/app/models/municipio';


declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);
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
    municipios: Municipio[] = [];


    constructor(
      private visitasService: VisitasService,
      private municipiosService: MunicipiosService
      ) {
        this.getWordCloud();
        this.getMunicipios();
    }

    getMunicipios() {
      this.municipiosService.getAll().subscribe({ next: (dataFromAPI) => this.municipios = dataFromAPI });
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
                        data: dataFromAPI,
                    }],

                    title: {
                        text: ''
                    },
                    tooltip: {
                      useHTML: true,
                      padding: 0,
                      borderRadius: 0,
                      borderWidth: 0,
                      shadow: false,
                      backgroundColor: 'none',
                      borderColor: 'none',
                      headerFormat: '',
                      followPointer: false,
                      stickOnContact: true,
                      shared: false,
                      pointFormat:
                                    `<div style="width: 220px; height: 70px; background: #ffffff; box-shadow: 0px 0px 12px 2px rgba(0,0,0,0.40); border-radius: 10px; opacity: 25;">
                                      <div style="width: 5px; height: 100%; box-sizing: border-box; float: left; background-color: {point.color}; border-radius: 10px 0px 0px 10px;"></div>
                                      <div style="padding: 5px; float: left;box-sizing: border-box; width: 200px; height: 60px; background: #ffffff; border-radius: 0px 0px 10px 0px;">
                                        <div class="d-flex flex-row">
                                          <span class="px14 text-muted" style="font-size: 15px;">Numero de repeticiones</span>
                                        </div>
                                        <span class="px15 align-self-center text-muted" style="width: 60%; font-size: 15px;">{point.weight}</span>
                                        <br><br>
                                      </div>
                                    </div>`

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
