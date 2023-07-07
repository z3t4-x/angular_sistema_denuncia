
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fi } from 'date-fns/locale';
import { forkJoin } from 'rxjs';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { Denuncia } from 'src/app/_model/denuncia';
import { DenunciaPersona } from 'src/app/_model/denunciaPersona';
import { DenunciaSearch } from 'src/app/_model/denunciaSearch';
import { Usuario } from 'src/app/_model/usuario';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { DenunciaService } from 'src/app/_service/denuncia.service';
import { PersonaService } from 'src/app/_service/persona.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
 
@Component({
  selector: 'app-busqueda-denuncia',
  templateUrl: './busqueda-denuncia.component.html',
  styleUrls: ['./busqueda-denuncia.component.css']
})
export class BusquedaDenunciaComponent implements OnInit {



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSourceDenuncia: MatTableDataSource<DenunciaPersona>;
  dataSource = new MatTableDataSource<DenunciaSearch>([]);
  columnas: string[] = ['idDenuncia', 'nmDenuncia','estadoDenuncia', 'delito', 'nmExpedienteInvPreliminar', 'investigador', 'nmExpedientePreparatoria',  'nmDocumento', 'acciones'];
  filtroForm: FormGroup;


  //public auxiliares: CatalogosValores[];
  public tiposDocumentos: CatalogosValores[];
  public tiposDelitos: CatalogosValores[];
  public estadosDenuncias: CatalogosValores[];
  public generos: CatalogosValores[];
  public tiposIdentificacion: CatalogosValores[];
  public grados: CatalogosValores[];
  public investigadores: Usuario[];

  constructor(
    private catalogoValoresService: CatalogosValoresService,
    private denunciaService: DenunciaService,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: Router)    
    { 
      this.filtroForm = this.formBuilder.group({
        faAltaDemuncia: [null],
        fcIngresoDocumento: [null],
        fcHechos: [null],
        tipoDelito: [null],
        tipoDocumento: [null],
        nmDocumento: [null],
        investigador: [null],
        nmDenuncia: [null],
        estadoDenuncia: [null],
        nmExpedienteInvPreliminar: [null],
        nmExpedientePreparatoria: [null],
      });        }
  ngOnInit(): void {
    this.cargarCatalogosValores();
    this.obtenerUsuarios();
  }

  filtrar2(): void {
    // Crear un objeto denuncia a partir de los valores del formulario
    const denuncia: DenunciaSearch = this.filtroForm.value;  
    // Llama al servicio para realizar la búsqueda
    this.denunciaService.buscarDenuncias(denuncia).subscribe(
      denuncias => {
        console.log("LOG DATA => ",denuncias);
        this.dataSource.data = denuncias; // Actualiza la tabla con las denuncias recibidas
      },
      error => {
        console.error('Error:', error); // Maneja cualquier error que pueda surgir
      }
    );
    console.log("LOG BUSQUEDA-FORM => ", this.filtroForm.value);
  }

  
  eliminarDenuncia(denuncia: Denuncia){

  }


  cargarCatalogosValores(): void {
    forkJoin([
      this.catalogoValoresService.buscarPorNombreCatalogo(
        'ESTADO DE LA DENUNCIA'
      ),
    //  this.catalogoValoresService.buscarPorNombreCatalogo('AUXILIAR'),
      this.catalogoValoresService.buscarPorNombreCatalogo('TIPOS DE DELITOS'),
      this.catalogoValoresService.buscarPorNombreCatalogo('TIPOS DE DOCUMENTO'),
      this.catalogoValoresService.buscarPorNombreCatalogo('SEXO'),
      this.catalogoValoresService.buscarPorNombreCatalogo(
        'TIPO DE IDENTIFCACION'
      ),

      this.catalogoValoresService.buscarPorNombreCatalogo('GRADO'),
    ]).subscribe(
      ([
        estadosDenuncias,
      //  auxiliares,
        tiposDelitos,
        tiposDocumentos,
        generos,
        tiposIdentificacion,
        grados,
      ]) => {
      //  this.auxiliares = auxiliares;
        this.tiposDocumentos = tiposDocumentos;
        this.tiposDelitos = tiposDelitos;
        this.estadosDenuncias = estadosDenuncias;
        this.generos = generos;
        this.tiposIdentificacion = tiposIdentificacion;
        this.grados = grados;
        console.log(this.tiposIdentificacion);
      }
    );
  }


  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuariosPorRolYFiscalia().subscribe(
      (data) => {
        this.investigadores = data;
      },
      (error) => {
        console.log('Error al obtener los usuarios', error);
      }
    );
  }
}
