import { Component, OnInit, AfterViewInit, ElementRef, ViewChild  } from '@angular/core';


import { Chart, PieController, ArcElement, Title, Tooltip, Legend, ChartConfiguration  } from 'chart.js';


Chart.register(PieController, ArcElement, Title, Tooltip, Legend);



import { DenunciaService } from 'src/app/_service/denuncia.service';

@Component({
  selector: 'app-reportes-denuncia',
  templateUrl: './reportes-denuncia.component.html',
  styleUrls: ['./reportes-denuncia.component.css']
})
export class ReportesDenunciaComponent implements  AfterViewInit {

  @ViewChild('myChart') myChart: ElementRef;
  chart: Chart;

  constructor(private denunciaService: DenunciaService) { }

  ngAfterViewInit() {
    const ctx = this.myChart.nativeElement.getContext('2d');

    this.denunciaService.generarInforme().subscribe(data => {
      const chartConfig: ChartConfiguration = {
        type: 'pie',
        data: {
          labels: ['Denuncias', 'Exp. etapa preliminar', 'Exp. etapa Preparatoria'],
          datasets: [{
            data: [
              data.totalDenuncias,
              data.totalEtapaPreliminar,
              data.totalEtapaPreparatoria
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ]
          }]
        }
      };

      this.chart = new Chart(ctx, chartConfig);
    });
  }
  
}