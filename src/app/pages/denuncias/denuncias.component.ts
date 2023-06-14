import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Denuncia } from 'src/app/_model/denuncia';
import { DenunciaService } from 'src/app/_service/denuncia.service';
import 'moment-timezone';
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
  columnas: string[] = ['idDenuncia', 'nmDenuncia','estadoDenuncia', 'delito',  'fcPlazo', 'diasRestantes', 'auxiliar', 'tipoDocumento',  'nmDocumento', 'acciones'];

  diasRestantes: number;
  tooltipVisible = false;
  tooltipStyles = {};

  estadoFiltro : string;

  constructor(
    private denunciaService: DenunciaService


  ) {
    moment.tz.setDefault('America/Lima');
   }

  ngOnInit(): void {

    if( sessionStorage.getItem("codigoEstadoDenuncia")==null ){
      this.estadoFiltro = 'DCIA';
    }else{
      this.estadoFiltro = ""+sessionStorage.getItem("codigoEstadoDenuncia");
    }

    if( this.estadoFiltro  == 'DCIA' ){
      this.listarDenuncias();
    }else if( this.estadoFiltro  == 'PRM' ){
      this.listarPreliminar();
    }else if( this.estadoFiltro  == 'PRPA' ){
      this.listarPreparatoria();
    }

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

  listarPreliminar() {

    this.denunciaService.listarPreliminar().subscribe(denuncias => {

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

  listarPreparatoria() {

    this.denunciaService.listarPreparatoria().subscribe(denuncias => {

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
