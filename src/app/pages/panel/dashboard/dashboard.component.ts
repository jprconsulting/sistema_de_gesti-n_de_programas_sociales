import { AfterViewInit, Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { TotalGeneral } from 'src/app/models/estadistica';
// import HC_exporting from 'highcharts/modules/exporting';
// HC_exporting(Highcharts);

interface PointOptionsWithTotal extends Highcharts.PointOptionsObject {
  totalItems: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements AfterViewInit {

  Highcharts: typeof Highcharts = Highcharts;
  totalGeneral: TotalGeneral = { totalBeneficiarios: 0, totalUsuarios: 0, totalProgramasSociales: 0, totalVisitas: 0 };
  optionsBeneficiariosPorProgramaSocial: Highcharts.Options = {};
  optionsVisitasPorProgramaSocial: Highcharts.Options = {};
  optionsBeneficiariosPorMunicipio: Highcharts.Options = {};
  optionsNubePalabras: Highcharts.Options = {};

  constructor(private dashboardService: DashboardService) {
    this.getTotalBeneficiariosPorProgramaSocial();
    this.getTotalVisitasPorProgramaSocial();
    this.getTotalBeneficiariosPorMunicipio();
    this.getTotalGeneral();
    this.getWordCloud();
  }

  getTotalBeneficiariosPorProgramaSocial() {
    this.dashboardService.getTotalBeneficiariosPorProgramaSocial().subscribe({
      next: (dataFromAPI) => {
        this.optionsBeneficiariosPorProgramaSocial = {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Beneficiarios por programa social',
            align: 'left'
          },

          tooltip: {
            pointFormat: `
              {series.name}:
              <b>{point.percentage:.1f}%</b> <br> 
              Beneficiarios: <b>{point.totalItems}</b>
            `
          },
          subtitle: {
            text: ''
          },
          credits: {
            enabled: false
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                distance: 20,
                format: '{point.name}: {point.percentage:.1f}%',
                style: {
                  fontSize: '0.8rem',
                  textOutline: 'none',
                  opacity: 0.7
                },
              },
            }
          },
          series: [{
            type: 'pie',
            name: 'Porcentaje',
            data: dataFromAPI.map((d) => ({ name: d.nombre, y: d.porcentaje, totalItems: d.totalBeneficiarios }) as PointOptionsWithTotal)
          }]
        };
        Highcharts.chart('container-beneficiarios-por-programa-social', this.optionsBeneficiariosPorProgramaSocial);
      }
    });
  }

  getTotalVisitasPorProgramaSocial() {
    this.dashboardService.getTotalVisitasPorProgramaSocial().subscribe({
      next: (dataFromAPI) => {
        this.optionsVisitasPorProgramaSocial = {
          chart: {
            type: 'pie',
          },
          title: {
            text: 'Visitas por programa social',
            align: 'left'
          },
          credits: {
            enabled: false
          },
          subtitle: {
            text: '',
          },
          plotOptions: {
            pie: {
              innerSize: 100,
              depth: 45
            }
          },
          series: [{
            type: 'pie',
            name: 'Visitas',
            data: dataFromAPI.map((d) => ([d.nombre, d.total]))
          }]
        };

        Highcharts.chart('container-visitas-por-programa-social', this.optionsVisitasPorProgramaSocial);
      }
    });
  }

  getTotalBeneficiariosPorMunicipio() {
    this.dashboardService.getTotalBeneficiariosPorMunicipio().subscribe({
      next: (dataFromAPI) => {
        this.optionsBeneficiariosPorMunicipio = {
          chart: {
            type: 'column'
          },
          title: {
            text: 'Beneficiarios por municipio',
            align: 'left'
          },
          subtitle: {
            text: ''
          },
          credits: {
            enabled: false
          },
          xAxis: {
            type: 'category',
            labels: {
              autoRotation: [-45, -90],
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total de beneficiarios'
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            pointFormat: 'Beneficiarios: <b>{point.y:.1f}</b>'
          },
          series: [{
            type: 'column',
            name: 'Beneficiarios',
            colors: [
              '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
              '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
              '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
              '#03c69b', '#00f194'
            ],
            colorByPoint: true,
            groupPadding: 0,
            data: dataFromAPI.map((d) => ([d.nombre, d.total])),
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#FFFFFF',
              align: 'right',
              format: '{point.y:.1f}',
              y: 10,
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          }]
        };

        Highcharts.chart('container-beneficiarios-por-municipio', this.optionsBeneficiariosPorMunicipio);
      }
    });
  }

  getTotalGeneral() {
    this.dashboardService.getTotalGeneral().subscribe({
      next: (totalFromAPI) => {
        this.totalGeneral = totalFromAPI;
      }
    });
  }

  getWordCloud() {
    this.dashboardService.getWordCloud().subscribe({
      next: (dataFromAPI) => {
        this.optionsNubePalabras = {
          series: [{
            rotation: {
              from: -60,
              to: 60,
              orientations: 5
            },
            type: 'wordcloud',
            data: dataFromAPI.generalWordCloud,

          }],
          title: {
            text: 'Nube de palabras',
            align: 'left'
          },
          lang: {
            noData: '<h2 class="page-title">Sin datos</h2>'
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
            pointFormat: `
                <div
                style="
                    width: 220px;
                    height: 70px;
                    background: #ffffff;
                    box-shadow: 0px 0px 12px 2px rgba(0, 0, 0, 0.4);
                    border-radius: 10px;
                    opacity: 25;
                "
                >
                    <div
                        style="width: 5px; height: 100%; box-sizing: border-box; float: left; background-color: {point.color}; border-radius: 10px 0px 0px 10px;"
                    ></div>
                    <div
                        style="
                        padding: 5px;
                        float: left;
                        box-sizing: border-box;
                        width: 200px;
                        height: 60px;
                        background: #ffffff;
                        border-radius: 0px 0px 10px 0px;
                        "
                    >
                        <div class="d-flex flex-row">
                        <span class="px14 text-muted" style="font-size: 17px"
                            >Número de repeticiones</span
                        >
                        </div>
                        <span
                        class="px15 align-self-center"
                        style="width: 60%; font-size: 19px; font-weight: bolder"
                        >{point.weight}</span
                        >
                        <br /><br />
                    </div>
                </div>
            `
          },
          subtitle: {
            text: ''
          },
          credits: {
            enabled: false
          },
        };
        Highcharts.chart('container-nube-palabras', this.optionsNubePalabras);
      }
    })
  }

  ngAfterViewInit() {
    Highcharts.chart('container-beneficiarios-por-programa-social', this.optionsBeneficiariosPorProgramaSocial);
    Highcharts.chart('container-visitas-por-programa-social', this.optionsVisitasPorProgramaSocial);
    Highcharts.chart('container-beneficiarios-por-municipio', this.optionsBeneficiariosPorMunicipio);
    Highcharts.chart('container-nube-palabras', this.optionsNubePalabras);
  }




}
