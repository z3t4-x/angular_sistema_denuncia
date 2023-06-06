import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { Denuncia } from 'src/app/_model/denuncia';
import { DenunciaPersona } from 'src/app/_model/denunciaPersona';
import { Persona } from 'src/app/_model/persona';
import { DenunciaService } from 'src/app/_service/denuncia.service';
import { PersonaService } from 'src/app/_service/persona.service';
import 'moment-timezone'; 
import { MatTooltipModule } from '@angular/material/tooltip';
declare var $: any;

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.component.html',
  styleUrls: ['./denuncias.component.css']
})
export class DenunciasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  dataSource = new MatTableDataSource<Denuncia>([]);
  columnas: string[] = ['idDenuncia', 'nmDenuncia','estadoDenuncia', 'delito', 'fcAltaDenuncia', 'fcPlazo', 'diasRestantes',  'fcHechos', 'auxiliar', 'tipoDocumento', 'fcIngresoDocumento', 'nmDocumento', 'acciones'];

  diasRestantes: number;
  tooltipVisible = false;
  tooltipStyles = {};


  constructor(
    private denunciaService: DenunciaService
   

  ) {
    moment.tz.setDefault('America/Lima');
   }

  ngOnInit(): void {
    this.listarDenuncias();
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  }
  
  listarDenuncias() {
    this.denunciaService.listarDenuncias().subscribe(denuncias => {

      denuncias.forEach(denuncia =>{
        denuncia.fcHechos =  moment(denuncia.fcHechos).format('YYYY-MM-DD');
        denuncia.fcIngresoDocumento =  moment(denuncia.fcIngresoDocumento).format('YYYY-MM-DD');
        denuncia.fcPlazo =  moment(denuncia.fcPlazo).format('YYYY-MM-DD');
        denuncia.fcAltaDenuncia =  moment(denuncia.fcAltaDenuncia).format('YYYY-MM-DD');

        const fechaActual = moment();
        const fechaPlazo = moment(denuncia.fcPlazo);
        const diasRestantes = fechaPlazo.diff(fechaActual, 'days');
                
        // Agregar días restantes a la denuncia
        denuncia.diasRestantes = diasRestantes;

      })


      this.dataSource = new MatTableDataSource(denuncias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  

  eliminarDenuncia(denuncia: Denuncia){
    
  }



}