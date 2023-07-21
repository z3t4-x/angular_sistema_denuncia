import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Chart, PieController, ArcElement, Title, Tooltip, Legend, ChartConfiguration  } from 'chart.js';
import { forkJoin } from 'rxjs';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';


Chart.register(PieController, ArcElement, Title, Tooltip, Legend);



import { DenunciaService } from 'src/app/_service/denuncia.service';
import { ReportesService } from 'src/app/_service/reportes.service';

@Component({
  selector: 'app-reportes-denuncia',
  templateUrl: './reportes-denuncia.component.html',
  styleUrls: ['./reportes-denuncia.component.css']
})
export class ReportesDenunciaComponent implements  AfterViewInit {

  @ViewChild('myChart') myChart: ElementRef;
  chart: Chart;

  public estadosDenuncias: CatalogosValores[];
  formulario: FormGroup;
  constructor(
        private formBuilder: FormBuilder,
        private denunciaService: DenunciaService,
        private reportesService: ReportesService, 
        private catalogoValoresService: CatalogosValoresService) {

         }



         ngOnInit(): void {
          this.cargarCatalogosValores();
          
          this.formulario = this.formBuilder.group({
            estadoDenuncia: new FormControl(''),
            fcAltaDenuncia: new FormControl('')
          });
        }


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
  

  cargarCatalogosValores(): void {
    forkJoin([
      this.catalogoValoresService.buscarPorNombreCatalogo('ESTADO DE LA DENUNCIA'),
    ]).subscribe(
      ([estadosDenuncias]) => {
        
        const codigosPermitidos = ['DCIA', 'PRM', 'PRPA', 'INTR'];
        
        this.estadosDenuncias = estadosDenuncias.filter(estado => 
          codigosPermitidos.includes(estado.cdCodigo)
        );

        console.log(this.estadosDenuncias);
      }
    );
}



  descargarArchivoExcel(): void {
    const estado = this.formulario.get('estadoDenuncia')?.value;
    const fecha = this.formulario.get('fcAltaDenuncia')?.value;

    this.reportesService.exportarDenunciasExcel(fecha, estado).subscribe(response => {
      
        // Asegurándonos de que response.body no sea null antes de crear el Blob
        if (response.body) {
            const blob = new Blob([response.body], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Verificando si contentDisposition no es nulo
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    a.download = matches[1].replace(/['"]/g, '');
                } else {
                    // En caso de que no encuentre un nombre de archivo, se utiliza un nombre por defecto.
                    a.download = 'Descarga.xlsx';
                }
            } else {
                // En caso de que no haya encabezado Content-Disposition, se utiliza un nombre por defecto.
                a.download = 'Descarga.xlsx';
            }

            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error("El cuerpo de la respuesta es nulo.");
            // Aquí puedes mostrar un mensaje al usuario si el cuerpo de la respuesta es nulo
        }
        
    }, error => {
        console.error("Error descargando el archivo.");
        // Aquí puedes mostrar un mensaje al usuario si hubo un error
    });
}



}