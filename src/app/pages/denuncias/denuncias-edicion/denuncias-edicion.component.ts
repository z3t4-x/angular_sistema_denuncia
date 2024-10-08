import { Component, OnInit, ViewChild } from '@angular/core';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { Observable, forkJoin, map } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  Denuncia } from 'src/app/_model/denuncia';
import { MatPaginator } from '@angular/material/paginator';
import { DenunciaPersona } from 'src/app/_model/denunciaPersona';
import { PersonaService } from 'src/app/_service/persona.service';
import { Persona } from 'src/app/_model/persona';
 
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { DenunciaService } from 'src/app/_service/denuncia.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DenunciaPersonaService } from 'src/app/_service/denuncia-persona.service';
import { catchError } from 'rxjs/operators';
import { LstDenunciado, LstDenunciante, RequestDenunciaModif } from 'src/app/_model/denunciaModif';
import { MatDialog } from '@angular/material/dialog';
import { PersonaDialogComponent } from '../../dialog/persona-dialog/persona-dialog.component';
import { RolesDTO, Usuario } from 'src/app/_model/usuario';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { FirebaseService } from 'src/app/_service/firebase.service';
import { RolService } from 'src/app/_service/rol.service';
import { rolesDTO } from 'src/app/_model/rol';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-denuncias-edicion',
  templateUrl: './denuncias-edicion.component.html',
  styleUrls: ['./denuncias-edicion.component.css']
})
export class DenunciasEdicionComponent implements OnInit {

  errorMessage: string;
  estadoFiltro : string;

  totalItems: number;
  pageSize: number = 10;
  pageIndex: number = 0;
  linkFile: string | null = null;
  nmArchivo: string | null = null;
  cargando: boolean = false;

  anaquel: number | null = null;
  banda: number | null = null;
  paquete: number | null = null;



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pickerDenunciante') pickerDenunciante: MatDatepicker<Date>;
  @ViewChild('pickerDenunciado') pickerDenunciado: MatDatepicker<Date>;
  dataSourceDenunciantes: MatTableDataSource<DenunciaPersona>;
  dataSourceDenunciados: MatTableDataSource<DenunciaPersona>;

  denunciaForm: FormGroup;
  denuncianteForm: FormGroup;
  denunciadoForm: FormGroup;

  tablasLlenas: boolean = false;
  chckFcProrroga: boolean = false;

  esAdministrador:boolean= false;
  esArchivador:boolean= false;
  esAuxiliarInvestigador:boolean= false;
  esMesaDePartes:boolean= false;

  denuncia: Denuncia = new Denuncia();

 // public auxiliares: CatalogosValores[];
  public tiposDocumentos: CatalogosValores[];
  public tiposDelitos: CatalogosValores[];
  public estadosDenuncias: CatalogosValores[];
  public generos: CatalogosValores[];
  public tiposIdentificacion: CatalogosValores[];
  public grados: CatalogosValores[];
  public investigadores: Usuario[];
  public estadoExpedienteEtapas: CatalogosValores[];
  public roles: rolesDTO[];

  // public lstDenunciantes: DenunciaPersona[] = [];

  columnas: string[] = [
    'orden',
    'nombre',
    'apellido1',
    'apellido2',
    'grado',
    'genero',
    'tipoIdentificacion',
    'dni',
    'fcNacimiento',
    'telefono',
    'acciones',
  ];

  // Definición de las columnas para los denunciados
  columnasDenunciados: string[] = [
    'orden',
    'nombre',
    'apellido1',
    'apellido2',
    'grado',
    'genero',
    'tipoIdentificacion',
    'dni',
    'fcNacimiento',
    'telefono',
    'acciones',
  ];

  constructor(
    private catalogoValoresService: CatalogosValoresService,
    private denunciaService: DenunciaService,
    private personaService: PersonaService,
    private denunciaPersonaService: DenunciaPersonaService,
    private usuarioService: UsuarioService,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog

  ) {
    this.denuncia.lstDenunciantes = [];
    this.denuncia.lstDenunciados = [];
    this.dataSourceDenunciantes = new MatTableDataSource<DenunciaPersona>(
      this.denuncia.lstDenunciantes
    );
    this.dataSourceDenunciados = new MatTableDataSource<DenunciaPersona>(
      this.denuncia.lstDenunciados
    );

    // this.denuncia.lstDenunciantes.push(new DenunciaPersona());
    // this.denuncia.lstDenunciados.push(new DenunciaPersona());
  }

  ngOnInit(): void {
   
    this.obtenerUsuarios();
    this.cargarCatalogosValores();
    this.initializeForm();
    this.denunciadoForm = this.crearDenunciadosForm();
    this.denuncianteForm = this.crearDenunciantesForm();
    this.cargarDenuncia();
    this.obtenerRolesUsuario();

    if( sessionStorage.getItem("codigoEstadoDenuncia")==null ){
      this.estadoFiltro = 'DCIA';
    }else{
      this.estadoFiltro = ""+sessionStorage.getItem("codigoEstadoDenuncia");
    }

    if( this.estadoFiltro  == 'DCIA' ){
      this.denuncianteForm;
    }


  }


  submitForm(): void {}

  //########################################
  //##          DATOS DE LA DENUNCIA
  //#########################################
  // Método para inicializar el formulario y configurar los controles
  initializeForm() {
    this.denunciaForm = new FormGroup({
      idDenuncia: new FormControl(''),
      tipoDelito: new FormControl('', Validators.required),
      fcIngresoDocumento: new FormControl('', Validators.required),
      fcHechos: new FormControl('', Validators.required),
      tipoDocumento: new FormControl('', Validators.required),
      nmDocumento: new FormControl('', Validators.required),
      investigador: new FormControl('', Validators.required),
      dsDescripcion: new FormControl(''),
      nmDenuncia: new FormControl(''),
      nmExpedienteInvPreliminar: new FormControl(''),
      nmExpedientePreparatoria: new FormControl(''),
      estadoDenuncia: new FormControl(''),
      cdEstadoDenuncia: new FormControl(''),
      fcAltaDenuncia: new FormControl(''),
      fcPlazo: new FormControl(''),
      mesaParte: new FormControl(''),
      fiscalia: new FormControl(''),
      fcAltaFila: new FormControl(''),
      cdUsuAlta: new FormControl(''),
      fcModifFila: new FormControl(''),
      cdUsuModif: new FormControl(''),
      estadoExpedienteEtapa: new FormControl('', Validators.required),
    //  fcProrroga: new FormControl('', Validators.required)
     fcProrroga: new FormControl({ value: '', disabled: true }),
     nmArchivo:  new FormControl(''),
     subirArchivo: new FormControl(''),
     linkFile: new FormControl(''),
     // campos del archivdero
     anaquel : new FormControl(''),
     banda : new FormControl(''),
     paquete : new FormControl(''),
     codigoArchivo : new FormControl(''),

    });
  }

  public formatearFechaNacimiento(fcNacimiento: string): string {
    if (fcNacimiento) {
      const fecha = moment(fcNacimiento, 'YYYY-MM-DD'); // Ajusta el formato aquí si es necesario
      if (fecha.isValid()) {
        return fecha.format('YYYY-MM-DD');
      }
    }
    return '';
  }
  

  //########################################
  //##          DATOS DENUNCIANTE
  //#########################################

  public buscarDenunciante(): void {
    const dni = this.denuncianteForm.get('dni')?.value;

    if (dni) {
      this.personaService.buscarPorDNI(dni).subscribe((persona: Persona) => {

        const gradoSeleccionado = this.grados.find(
          (grado) => grado.cdCodigo === persona.grado?.cdCodigo
        );
        const generoSeleccionado = this.generos.find(
          (genero) => genero.cdCodigo === persona.genero?.cdCodigo
        );
        const tipoIdentificacionSeleccionado = this.tiposIdentificacion.find(
          (tipo) => tipo.cdCodigo === persona.tipoIdentificacion?.cdCodigo
        );
        const fcNacimientoDate = persona.fcNacimiento
          ? new Date(persona.fcNacimiento)
          : null;

        this.denuncianteForm.patchValue({
          idPersona: persona.idPersona,
          dni: persona.dni,
          nombre: persona.nombre,
          apellido1: persona.apellido1,
          apellido2: persona.apellido2,
          grado: gradoSeleccionado,
          genero: generoSeleccionado,
          tipoIdentificacion: tipoIdentificacionSeleccionado,
          fcNacimiento: fcNacimientoDate,
        });
      });
    }
  }

  crearDenunciantesForm(): FormGroup {
    return this.formBuilder.group({
      idPersona: [''],
      dni: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      grado: [''],
      genero: [''],
      tipoIdentificacion: [''],
      fcNacimiento: [''],
      telefono: ['']
    });
  }


  /**
   * agregar denunciante
   */
  agregarDenunciante() {
    const dni = this.denuncianteForm.get('dni')?.value;

    if (dni) {
      // Verificar si el DNI ya existe en la lista de denunciantes
      const existeDenunciante = this.denuncia.lstDenunciantes.some(
        (denunciante) => denunciante.persona.dni === dni
      );

      if (existeDenunciante) {
        // Mostrar mensaje de error si el DNI ya existe en la lista de denunciantes
        Swal.fire('Error', 'El DNI ya ha sido agregado como denunciante', 'error');
      } else if (this.denuncia.lstDenunciados.some((denunciado) => denunciado.persona.dni === dni)) {
        // Mostrar mensaje de error si el DNI ya existe en la lista de denunciados
        Swal.fire('Error', 'El DNI ya ha sido agregado como denunciado', 'error');
      } else {
        // Verificar si el DNI existe en la base de datos
        this.personaService.buscarPorDNI(dni).subscribe((persona: Persona) => {
          if (persona) {
            // Agregar el denunciante a la lista
            const denunciante: any = {
              persona: persona,
              itBaja: 'N'
            };

            this.denuncia.lstDenunciantes.push(denunciante);
            this.dataSourceDenunciantes.data = this.denuncia.lstDenunciantes;


            Swal.fire('Éxito', 'Denunciante agregado correctamente', 'success');
          } else {
            // Mostrar mensaje de error si el DNI no existe en la base de datos
            Swal.fire('Error', 'El DNI no existe en la base de datos', 'error');
          }
        });
      }
    }

    this.denuncianteForm.reset();
    this.verificarTablasLlenas();
  }



  //

  /**
   * remover denunciante en vista
   * @param idPersona
   */
  eliminarDenunciante(idPersona: number) {
    const index = this.denuncia.lstDenunciantes.findIndex(
      (denunciante) => denunciante.persona.idPersona === idPersona
    );
    if (index !== -1) {
      //this.denuncia.lstDenunciantes.splice(index, 1);
      this.denuncia.lstDenunciantes[index].itBaja = 'S';
      this.dataSourceDenunciantes.data = this.denuncia.lstDenunciantes;
    }
  }

/**
   * revertir remover denunciante en vista
   * @param idPersona
   */
revertirEliminarDenunciante(idPersona: number) {
  const index = this.denuncia.lstDenunciantes.findIndex(
    (denunciante) => denunciante.persona.idPersona === idPersona
  );
  if (index !== -1) {
    //this.denuncia.lstDenunciantes.splice(index, 1);
    this.denuncia.lstDenunciantes[index].itBaja = 'N';
    this.dataSourceDenunciantes.data = this.denuncia.lstDenunciantes;
  }
}

  //########################################
  //##          DATOS DENUNCIADOS
  //#########################################

  /**
   * Denunciados
   */

  public buscarDenunciados(): void {
    const dni = this.denunciadoForm.get('dni')?.value;

    if (dni) {
      this.personaService.buscarPorDNI(dni).subscribe((persona: Persona) => {
        const gradoSeleccionado = this.grados.find(
          (grado) => grado.cdCodigo === persona.grado?.cdCodigo
        );
        const generoSeleccionado = this.generos.find(
          (genero) => genero.cdCodigo === persona.genero?.cdCodigo
        );
        const tipoIdentificacionSeleccionado = this.tiposIdentificacion.find(
          (tipo) => tipo.cdCodigo === persona.tipoIdentificacion?.cdCodigo
        );
        const fcNacimientoDate = persona.fcNacimiento
          ? new Date(persona.fcNacimiento)
          : null;

        this.denunciadoForm.patchValue({
          idPersona: persona.idPersona,
          dni: persona.dni,
          nombre: persona.nombre,
          apellido1: persona.apellido1,
          apellido2: persona.apellido2,
          grado: gradoSeleccionado,
          genero: generoSeleccionado,
          tipoIdentificacion: tipoIdentificacionSeleccionado,
          fcNacimiento: fcNacimientoDate,
        });
      });
    }
  }

  /**
   * agregar denunciado
   */
  agregarDenunciado() {
    const dni = this.denunciadoForm.get('dni')?.value;

    if (dni) {
      // Verificar si el DNI ya existe en la lista de denunciantes
      const existeDenunciante = this.denuncia.lstDenunciantes.some(
        (denunciante) => denunciante.persona.dni === dni
      );

      if (existeDenunciante) {
        // Mostrar mensaje de error si el DNI ya existe en la lista de denunciantes
        Swal.fire('Error', 'El DNI ya ha sido agregado como denunciante', 'error');
      } else {
        // Verificar si el DNI ya existe en la lista de denunciados
        const existeDenunciado = this.denuncia.lstDenunciados.some(
          (denunciado) => denunciado.persona.dni === dni
        );

        if (existeDenunciado) {
          // Mostrar mensaje de error si el DNI ya existe en la lista de denunciados
          Swal.fire('Error', 'El DNI ya ha sido agregado como denunciado', 'error');
        } else {
          // Verificar si el DNI existe en la base de datos
          this.personaService.buscarPorDNI(dni).subscribe((persona: Persona) => {
            if (persona) {
              // Agregar el denunciado a la lista
              const denunciado: any = {
                persona: persona,
                itBaja: 'N'
              };

              this.denuncia.lstDenunciados.push(denunciado);
              this.dataSourceDenunciados.data = this.denuncia.lstDenunciados;


              Swal.fire('Éxito', 'Denunciado agregado correctamente', 'success');
            } else {
              // Mostrar mensaje de error si el DNI no existe en la base de datos
              Swal.fire('Error', 'El DNI no existe en la base de datos', 'error');
            }
          });
        }
      }
    }

    this.denunciadoForm.reset();
    this.verificarTablasLlenas();
  }


  /**
   * elimina de memoria en vista
   * @param denunciado
   */

  eliminarDenunciado(idPersona: number) {
    const index = this.denuncia.lstDenunciados.findIndex(
      (denunciado) => denunciado.persona.idPersona === idPersona
    );
    if (index !== -1) {
      //this.denuncia.lstDenunciados.splice(index, 1);
      this.denuncia.lstDenunciados[index].itBaja = 'S';
      this.dataSourceDenunciados.data = this.denuncia.lstDenunciados;
    }
  }


/**
   * revertir elimina de memoria en vista
   * @param denunciado
   */

revertirEliminarDenunciado(idPersona: number) {
  const index = this.denuncia.lstDenunciados.findIndex(
    (denunciado) => denunciado.persona.idPersona === idPersona
  );
  if (index !== -1) {
    //this.denuncia.lstDenunciados.splice(index, 1);
    this.denuncia.lstDenunciados[index].itBaja = 'N';
    this.dataSourceDenunciados.data = this.denuncia.lstDenunciados;
  }
}

  /**
   *
   * @returns
   */
  crearDenunciadosForm(): FormGroup {
    return this.formBuilder.group({
      idPersona: [''],
      dni: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      grado: [''],
      genero: [''],
      tipoIdentificacion: [''],
      fcNacimiento: [''],
      telefono: [''],
    });
  }



/**
 * busca a la persona para que lo liste en la tabla de denunciadoForm
 */
  public buscarDenunciado(): void {
    const dni = this.denunciadoForm.get('dni')?.value;

    if (dni) {
      this.personaService.buscarPorDNI(dni).subscribe(
        (persona: Persona) => {
          const gradoSeleccionado = this.grados.find(
            (grado) => grado.cdCodigo === persona.grado?.cdCodigo
          );
          const generoSeleccionado = this.generos.find(
            (genero) => genero.cdCodigo === persona.genero?.cdCodigo
          );
          const tipoIdentificacionSeleccionado = this.tiposIdentificacion.find(
            (tipo) => tipo.cdCodigo === persona.tipoIdentificacion?.cdCodigo
          );
          const fcNacimientoDate = persona.fcNacimiento
            ? new Date(persona.fcNacimiento)
            : null;

          this.denunciadoForm.patchValue({
            idPersona: persona.idPersona,
            dni: persona.dni,
            nombre: persona.nombre,
            apellido1: persona.apellido1,
            apellido2: persona.apellido2,
            grado: gradoSeleccionado,
            genero: generoSeleccionado,
            tipoIdentificacion: tipoIdentificacionSeleccionado,
            fcNacimiento: fcNacimientoDate,
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El DNI no se encuentra en la base de datos. Por favor, registre a una nueva persona.',
            heightAuto: true,
          });
          this.denunciadoForm.get('dniDenunciado')?.reset();
        }
      );
    }
  }


  // carga de catalogos para el formulario
  cargarCatalogosValores(): void {
    forkJoin([
      this.catalogoValoresService.buscarPorNombreCatalogo(
        'ESTADO DE LA DENUNCIA'
      ),
      this.catalogoValoresService.buscarPorNombreCatalogo('ETAPAS DEL EXPEDIENTE'),
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
        estadoExpedienteEtapas,
        tiposDelitos,
        tiposDocumentos,
        generos,
        tiposIdentificacion,
        grados,
      ]) => {
        this.estadosDenuncias = estadosDenuncias;
        this.estadoExpedienteEtapas = estadoExpedienteEtapas;
        this.tiposDelitos = tiposDelitos;
        this.tiposDocumentos = tiposDocumentos;
        this.generos = generos;
        this.tiposIdentificacion = tiposIdentificacion;
        this.grados = grados;

      }
    );
  }

  public filtrarEstadoDenuncia(estadosDenuncias: CatalogosValores[]) : any {

    if( this.denunciaForm.get('cdEstadoDenuncia')!=null ){

      let cdEstadoDenunciaForm : any = this.denunciaForm.get('cdEstadoDenuncia');

      if( cdEstadoDenunciaForm.value == 'DCIA'){//Denuncia

        
        return estadosDenuncias.filter(x=>x.cdCodigo=='DCIA'||x.cdCodigo=='OTR'||x.cdCodigo=='PRM');
      }else if( cdEstadoDenunciaForm.value == 'OTR'){//Otros
        return estadosDenuncias.filter(x=>x.cdCodigo=='OTR');
      }else if( cdEstadoDenunciaForm.value == 'DST'){//Desestimar
        return estadosDenuncias.filter(x=>x.cdCodigo=='DST');
      }else if( cdEstadoDenunciaForm.value == 'PRM'){//Preliminar
        return estadosDenuncias.filter(x=>x.cdCodigo=='PRM'||x.cdCodigo=='OTR'||x.cdCodigo=='PRPA'||x.cdCodigo=='ARCH');
      }else if( cdEstadoDenunciaForm.value == 'PRPA'){//Preparatoria
        return estadosDenuncias.filter(x=>x.cdCodigo=='PRPA'||x.cdCodigo=='INTR' || 'OTR');
      }else {
        return [];
      }

    }

  }

// valida si las tablas tienen datos para guardar la denuncia
  private verificarTablasLlenas() {
    // Verifica si ambas tablas están llenas
    if (
      this.denuncia.lstDenunciantes.length > 0 &&
      this.denuncia.lstDenunciados.length > 0
    ) {
      this.tablasLlenas = true;
    } else {
      this.tablasLlenas = false;
    }
  }



  /**
   * modifica denuncia
   */
  modificarDenuncia() {
    // Obtener los datos de la denuncia del formulario
    const datosDenunciaForm = this.denunciaForm.value;

    const lstDenunciados: LstDenunciado[] = this.dataSourceDenunciados.data.map(
      ({ idDenunciaPersona, idDenuncia, persona, itBaja }) => {
        return {
          idDenunciaPersona: idDenunciaPersona,
          idDenuncia: idDenuncia,
          personaDTO: {
            idPersona: persona.idPersona,
            nombre: persona.nombre,
            apellido1: persona.apellido1,
            apellido2: persona.apellido2,
            telefono: persona.telefono,
            fcNacimiento: persona.fcNacimiento
              ? persona.fcNacimiento.toString()
              : null,
            dni: persona.dni,
          },
          genero: {
            idValor: <any>persona.genero,
          },
          tipoIdentificacion: {
            idValor: <any>persona.tipoIdentificacion,
          },
          grado: {
            idValor: <any>persona.grado,
          },
          itBaja: itBaja
        };
      }
    );

    const lstDenunciantes:LstDenunciante[] = this.dataSourceDenunciantes.data.map(
      ({ idDenunciaPersona, idDenuncia, persona, itBaja }) => {
        return {
          idDenunciaPersona: idDenunciaPersona,
          idDenuncia: idDenuncia,
          personaDTO: {
            idPersona: persona.idPersona,
            nombre: persona.nombre,
            apellido1: persona.apellido1,
            apellido2: persona.apellido2,
            telefono: persona.telefono,
            fcNacimiento: persona.fcNacimiento
              ? persona.fcNacimiento.toString()
              : null,
            dni: persona.dni,
          },
          genero: {
            idValor: <any>persona.genero,
          },
          tipoIdentificacion: {
            idValor: <any>persona.tipoIdentificacion,
          },
          grado: {
            idValor: <any>persona.grado,
          },
          itBaja: itBaja,
        };
      }
    );

    // Crear una instancia de la clase Denuncia y asignar los valores
    const fcAltaFormatted = datosDenunciaForm.fcAltaFila?moment(datosDenunciaForm.fcAltaFila).format('YYYY-MM-DDTHH:mm:ss'):'';
    const fcModifFormatted = datosDenunciaForm.fcModifFila?moment(datosDenunciaForm.fcModifFila).format('YYYY-MM-DDTHH:mm:ss'):'';

    const denuncia: RequestDenunciaModif = {

      idDenuncia: datosDenunciaForm.idDenuncia,
      fcAltaDenuncia: datosDenunciaForm.fcAltaDenuncia,
      fcHechos: datosDenunciaForm.fcHechos,

      tipoDelito: {
        idValor: datosDenunciaForm.tipoDelito,
      },

      nmDenuncia:datosDenunciaForm.nmDenuncia,

      fcPlazo: datosDenunciaForm.fcPlazo,
      estadoDenuncia:datosDenunciaForm.estadoDenuncia,
      dsDescripcion: datosDenunciaForm.dsDescripcion,

      tipoDocumento: {
        idValor: datosDenunciaForm.tipoDocumento,
      },

      fcIngresoDocumento: datosDenunciaForm.fcIngresoDocumento,
      nmDocumento: datosDenunciaForm.nmDocumento,
      nmExpedienteInvPreliminar: datosDenunciaForm.nmExpedienteInvPreliminar,
      nmExpedientePreparatoria: datosDenunciaForm.nmExpedientePreparatoria,
      lstDenunciados: lstDenunciados,
      lstDenunciantes: lstDenunciantes,

      mesaParte: {
        idValor: datosDenunciaForm.mesaParte,
      },

      fiscalia: {
        idValor: datosDenunciaForm.fiscalia,
      },

      investigador: {
        idUsuario: datosDenunciaForm.investigador,
        nombre:'',
        apellido:''
      },

      fcAltaFila: fcAltaFormatted,
      cdUsuAlta: datosDenunciaForm.cdUsuAlta,
      fcModifFila: fcModifFormatted,
      cdUsuModif: datosDenunciaForm.cdUsuModif,
      fcProrroga: datosDenunciaForm.fcProrroga,
      estadoExpedienteEtapa: {
        idValor: datosDenunciaForm.estadoExpedienteEtapa
      },

      linkFile: datosDenunciaForm.linkFile,
      nmArchivo: datosDenunciaForm.nmArchivo,

      anaquel: datosDenunciaForm.anaquel,
      banda: datosDenunciaForm.banda,
      paquete: datosDenunciaForm.paquete,
      codigoArchivo: datosDenunciaForm.codigoArchivo

    };

    this.denunciaService.modificarDenuncia(denuncia).subscribe(
      response => {
        // Aquí puedes manejar la respuesta del servicio, por ejemplo, mostrar un mensaje de éxito
        Swal.fire('Éxito', 'Denuncia se ha modificado correctamente', 'success');
        // Restablecer el formulario y las listas de denunciantes y denunciados
        this.denunciaForm.reset();

        this.router.navigate(['/denuncia']);
      },
      error => {
        // Aquí puedes manejar el error en caso de que ocurra
        Swal.fire('Error', 'Ocurrió un error al guardar la denuncia', 'error');
      }
    );
  }




  /**
   * cargar denincia al editar
   */
  cargarDenuncia(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const denunciaId = Number(id);

      this.denunciaService.obtenerDenunciaPorId(denunciaId).subscribe(
        (denuncia: Denuncia) => {
          // Asignar los valores de la denuncia al formulario
          this.denunciaForm.patchValue({
            // Asumiendo que los nombres de los campos en el formulario coinciden con los nombres de las propiedades en la clase Denuncia
            idDenuncia:denuncia.idDenuncia,
            fcAltaDenuncia: denuncia.fcAltaDenuncia,
            tipoDelito: denuncia.tipoDelito? denuncia.tipoDelito.idValor:'',
            fcHechos: denuncia.fcHechos,
            nmDenuncia: denuncia.nmDenuncia,
            nmExpedientePreparatoria:denuncia.nmExpedientePreparatoria,
            nmExpedienteInvPreliminar: denuncia.nmExpedienteInvPreliminar,
            estadoDenuncia: denuncia.estadoDenuncia? denuncia.estadoDenuncia.idValor:'',
            cdEstadoDenuncia: denuncia.estadoDenuncia? denuncia.estadoDenuncia.cdCodigo:'',
            fcPlazo: denuncia.fcPlazo,
            tipoDocumento: denuncia.tipoDocumento? denuncia.tipoDocumento.idValor:'',
            fcIngresoDocumento: denuncia.fcIngresoDocumento,
            nmDocumento: denuncia.nmDocumento,
            estadoExpedienteEtapa: denuncia.estadoExpedienteEtapa? denuncia.estadoExpedienteEtapa.idValor:'',
            fiscalia: denuncia.fiscalia? denuncia.fiscalia.idValor:'',
            mesaParte: denuncia.mesaParte? denuncia.mesaParte.idValor:'',
            investigador: denuncia.investigador? denuncia.investigador.idUsuario:'',
            dsDescripcion: denuncia.dsDescripcion,
            fcAltaFila: denuncia.fcAltaFila,
            cdUsuAlta: denuncia.cdUsuAlta,
            fcModifFila: denuncia.fcModifFila,
            cdUsuModif: denuncia.cdUsuModif,
            fcProrroga: denuncia.fcProrroga,
            nmArchivo: denuncia?.nmArchivo,
            linkFile: denuncia?.linkFile,
            anaquel: denuncia?.anaquel,
            banda: denuncia?.banda,
            paquete: denuncia?.paquete,
            codigoArchivo: denuncia?.codigoArchivo

          });

          this.cargarDenunciantes(denunciaId);
          this.cargarDenunciados(denunciaId);

          this.estadosDenuncias = this.filtrarEstadoDenuncia(this.estadosDenuncias);

        },
        error => {
          console.error(error);
        }
      );
    }
  }



  cargarDenunciantes(idDenuncia: number): void {
    this.denunciaPersonaService.obtenerDenunciantes(idDenuncia)
      .pipe(
        catchError((error) => {
          this.errorMessage = error.message;
          console.error(error);
          throw error; // Opcional: rethrow el error para que sea manejado por el componente que invoca este método
        })
      )
      .subscribe((denunciantes: DenunciaPersona[]) => {

        denunciantes.forEach(e=>e.itBaja='N');

        this.denuncia.lstDenunciantes = denunciantes;
        this.dataSourceDenunciantes.data = denunciantes;
        //console.log( "==========> " +JSON.stringify(this.dataSourceDenunciantes.data));

      });
  }


  cargarDenunciados(idDenuncia: number): void {
    this.denunciaPersonaService.obtenerDenunciados(idDenuncia)
      .pipe(
        catchError((error) => {
          this.errorMessage = error.message;
          console.error(error);
          throw error; // Opcional: rethrow el error para que sea manejado por el componente que invoca este método
        })
      )
      .subscribe((denunciados: DenunciaPersona[]) => {

        denunciados.forEach(e=>e.itBaja='N');

        this.denuncia.lstDenunciados = denunciados;
        this.dataSourceDenunciados.data = denunciados;


      });
  }


  /**
   * Abrel dialogo de registro de personas
   */

  abrirDialogoPersonaDenunciante(): void {
    const dialogRef = this.dialog.open(PersonaDialogComponent);
  
    dialogRef.afterClosed().subscribe((dniRegistrado: string) => {
      if (dniRegistrado) {
        
        // Se ha registrado un nuevo denunciante, buscar y autocompletar los datos
        this.personaService.buscarPorDNI(dniRegistrado).subscribe((persona: Persona) => {

          const gradoSeleccionado = this.grados.find(
            (grado) => grado.cdCodigo === persona.grado?.cdCodigo
          );
          const generoSeleccionado = this.generos.find(
            (genero) => genero.cdCodigo === persona.genero?.cdCodigo
          );
          const tipoIdentificacionSeleccionado = this.tiposIdentificacion.find(
            (tipo) => tipo.cdCodigo === persona.tipoIdentificacion?.cdCodigo
          );
          const fcNacimientoDate = persona.fcNacimiento
            ? new Date(persona.fcNacimiento)
            : null;
  
          this.denuncianteForm.patchValue({
            idPersona: persona.idPersona,
            dni: persona.dni,
            nombre: persona.nombre,
            apellido1: persona.apellido1,
            apellido2: persona.apellido2,
            grado: gradoSeleccionado,
            genero: generoSeleccionado,
            tipoIdentificacion: tipoIdentificacionSeleccionado,
            fcNacimiento: fcNacimientoDate,
          });
        });
      }
    });
  }

/**
 * abre dialogo para denunciado
 */

abrirDialogoPersonaDenunciado(): void {
  const dialogRef = this.dialog.open(PersonaDialogComponent);

  dialogRef.afterClosed().subscribe((dniRegistrado: string) => {
    if (dniRegistrado) {
     
      // Se ha registrado un nuevo denunciante, buscar y autocompletar los datos
      this.personaService.buscarPorDNI(dniRegistrado).subscribe((persona: Persona) => {

        const gradoSeleccionado = this.grados.find(
          (grado) => grado.cdCodigo === persona.grado?.cdCodigo
        );
        const generoSeleccionado = this.generos.find(
          (genero) => genero.cdCodigo === persona.genero?.cdCodigo
        );
        const tipoIdentificacionSeleccionado = this.tiposIdentificacion.find(
          (tipo) => tipo.cdCodigo === persona.tipoIdentificacion?.cdCodigo
        );
        const fcNacimientoDate = persona.fcNacimiento
          ? new Date(persona.fcNacimiento)
          : null;

        this.denunciadoForm.patchValue({
          idPersona: persona.idPersona,
          dni: persona.dni,
          nombre: persona.nombre,
          apellido1: persona.apellido1,
          apellido2: persona.apellido2,
          grado: gradoSeleccionado,
          genero: generoSeleccionado,
          tipoIdentificacion: tipoIdentificacionSeleccionado,
          fcNacimiento: fcNacimientoDate,
        });
      });
    }
  });
}

  

/**
 * lista investigadores
 */


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


onChckFcProrrogaChange(checked: boolean): void {
  const fcProrrogaControl = this.denunciaForm.get('fcProrroga');
  
  if (fcProrrogaControl) {
    if (checked) {
      fcProrrogaControl.enable();
      fcProrrogaControl.setValidators([Validators.required]);
    } else {
      fcProrrogaControl.disable();
      fcProrrogaControl.clearValidators();
    }
    
    fcProrrogaControl.updateValueAndValidity();
  }
}



subirArchivo(file: File | undefined): void {
  if (file) {
    this.cargando = true; // Activar el estado de carga
    this.firebaseService.uploadFile(file).subscribe(
      (downloadURL: string | null) => {
        this.denunciaForm.get('linkFile')?.patchValue(downloadURL);
        this.denunciaForm.get('nmArchivo')?.patchValue(file.name);

        this.cargando = false; 
      },
      (error: any) => {
        console.error('Error al subir el archivo:', error);
        this.cargando = false; 
      }
    );
  }
}

  

anaquelesData: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
bandaData: number[] = [1, 2, 3, 4, 5];
paqueteData: number[] = [1, 2, 3, 4];


/*
obtenerRolesUsuario() {
  return this.usuarioService.obtenerRolesUsuario().pipe(
    tap((roles: rolesDTO[]) => {
      this.esAdministrador = roles.some(rol => rol.rolNombre === 'ADMINISTRADOR');
      this.esArchivador = roles.some(rol => rol.rolNombre === 'ARCHIVADOR');
      this.esAuxiliarInvestigador = roles.some(rol => rol.rolNombre === 'AUXILIAR INVESTIGADOR');
      this.esMesaDePartes = roles.some(rol => rol.rolNombre === 'MESA DE PARTES');
      console.log("Administrador => ", this.esAdministrador);
      console.log("Archivador => ", this.esArchivador);
      console.log("Auxiliar Investigador => ", this.esAuxiliarInvestigador);
      console.log("Mesa de Partes => ", this.esMesaDePartes);
    })
  );
}
*/

obtenerRolesUsuario() {
  this.usuarioService.obtenerRolesUsuario().subscribe((roles: rolesDTO[]) => {

    this.esAdministrador = roles.some(rol => rol.rolNombre === 'ADMINISTRADOR');
    this.esArchivador = roles.some(rol => rol.rolNombre === 'ARCHIVADOR');
    this.esAuxiliarInvestigador = roles.some(rol => rol.rolNombre === 'AUXILIAR INVESTIGADOR');
    this.esMesaDePartes = roles.some(rol => rol.rolNombre === 'MESA DE PARTES');

  });
}



}




