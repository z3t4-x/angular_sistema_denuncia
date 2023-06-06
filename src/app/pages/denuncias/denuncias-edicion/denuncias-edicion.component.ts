import { Component, OnInit, ViewChild } from '@angular/core';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { forkJoin, map } from 'rxjs';
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


@Component({
  selector: 'app-denuncias-edicion',
  templateUrl: './denuncias-edicion.component.html',
  styleUrls: ['./denuncias-edicion.component.css']
})
export class DenunciasEdicionComponent implements OnInit {

  errorMessage: string;

  totalItems: number;
  pageSize: number = 10;
  pageIndex: number = 0;

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

  denuncia: Denuncia = new Denuncia();

  public auxiliares: CatalogosValores[];
  public tiposDocumentos: CatalogosValores[];
  public tiposDelitos: CatalogosValores[];
  public estadosDenuncias: CatalogosValores[];
  public generos: CatalogosValores[];
  public tiposIdentificacion: CatalogosValores[];
  public grados: CatalogosValores[];

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
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    
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
    this.cargarCatalogosValores();
    this.initializeForm();
    this.denunciadoForm = this.crearDenunciadosForm();
    this.denuncianteForm = this.crearDenunciantesForm();
    this.cargarDenuncia();
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
      auxiliar: new FormControl('', Validators.required),
      dsDescripcion: new FormControl(''),
      nmDenuncia: new FormControl(''),
      estadoDenuncia: new FormControl(''),
      fcAltaDenuncia: new FormControl(''),
      fcPlazo: new FormControl(''),
    });
  }

  public formatearFechaNacimiento(fcNacimiento: string): string {
    return fcNacimiento ? moment(fcNacimiento).format('yyyy-MM-dd') : '';
  }

  //########################################
  //##          DATOS DENUNCIANTE
  //#########################################

  public buscarDenunciante(): void {
    const dni = this.denuncianteForm.get('dni')?.value;

    if (dni) {
      this.personaService.buscarPorDNI(dni).subscribe((persona: Persona) => {
        console.log('ID Persona: ', persona.idPersona);
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
            };
  
            this.denuncia.lstDenunciantes.push(denunciante);
            this.dataSourceDenunciantes.data = this.denuncia.lstDenunciantes;
            console.log('Lista de DENUNCIANTES:', this.denuncia.lstDenunciantes);
  
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
   * remover denunciante
   * @param idPersona
   */
  eliminarDenunciante(idPersona: number) {
    const index = this.denuncia.lstDenunciantes.findIndex(
      (denunciante) => denunciante.persona.idPersona === idPersona
    );
    if (index !== -1) {
      this.denuncia.lstDenunciantes.splice(index, 1);
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
              };
  
              this.denuncia.lstDenunciados.push(denunciado);
              this.dataSourceDenunciados.data = this.denuncia.lstDenunciados;
              console.log('Lista de DENUNCIADOS:', this.denuncia.lstDenunciados);
  
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
   * elimina de memoria
   * @param denunciado
   */

  eliminarDenunciado(idPersona: number) {
    const index = this.denuncia.lstDenunciados.findIndex(
      (denunciado) => denunciado.persona.idPersona === idPersona
    );
    if (index !== -1) {
      this.denuncia.lstDenunciados.splice(index, 1);
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
      this.catalogoValoresService.buscarPorNombreCatalogo('AUXILIAR'),
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
        auxiliares,
        tiposDelitos,
        tiposDocumentos,
        generos,
        tiposIdentificacion,
        grados,
      ]) => {
        this.auxiliares = auxiliares;
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
      ({ persona }) => {
        return {
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
        };
      }
    );

    const lstDenunciantes:LstDenunciante[] = this.dataSourceDenunciantes.data.map(
      ({ persona }) => {
        return {
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
        };
      }
    );

    // Crear una instancia de la clase Denuncia y asignar los valores
    const fcPlazoFormatted = moment(datosDenunciaForm.fcPlazo).format('YYYY-MM-DDTHH:mm:ss');

    const denuncia: RequestDenunciaModif = {

      idDenuncia: datosDenunciaForm.idDenuncia,
      //fcAltaDenuncia: datosDenunciaForm.fcAltaDenuncia,
      fcHechos: datosDenunciaForm.fcHechos,

      auxiliar: {
        idValor: datosDenunciaForm.auxiliar,
      },

      tipoDelito: {
        idValor: datosDenunciaForm.tipoDelito,
      },

      nmDenuncia:datosDenunciaForm.nmDenuncia,

      fcPlazo: fcPlazoFormatted, 
      //fcPlazo:datosDenunciaForm.fcPlazo,
      estadoDenuncia:datosDenunciaForm.estadoDenuncia,     
      dsDescripcion: datosDenunciaForm.dsDescripcion,

      tipoDocumento: {
        idValor: datosDenunciaForm.tipoDocumento,
      },

      fcIngresoDocumento: datosDenunciaForm.fcIngresoDocumento,
      nmDocumento: datosDenunciaForm.nmDocumento,
    //  nmExpedienteInvPreliminar: datosDenunciaForm.nm
      lstDenunciados: lstDenunciados,
      lstDenunciantes: lstDenunciantes,
    };

    console.log("id denuncia ===> " + denuncia.idDenuncia);
    
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
            fcAltaDenuncia: denuncia.fcAltaDenuncia ? new Date(denuncia.fcAltaDenuncia).toISOString().substring(0, 10) : '',           
            tipoDelito: denuncia.tipoDelito? denuncia.tipoDelito.idValor:'',
            fcHechos: denuncia.fcHechos,
            nmDenuncia: denuncia.nmDenuncia,
            estadoDenuncia: denuncia.estadoDenuncia? denuncia.estadoDenuncia.idValor:'',
            fcPlazo: denuncia.fcPlazo ? new Date(denuncia.fcPlazo).toISOString().substring(0, 10) : '',
            tipoDocumento: denuncia.tipoDocumento? denuncia.tipoDocumento.idValor:'',
            fcIngresoDocumento: denuncia.fcIngresoDocumento,
            nmDocumento: denuncia.nmDocumento,
            auxiliar: denuncia.auxiliar? denuncia.auxiliar.idValor:'',
            dsDescripcion: denuncia.dsDescripcion       
          });

          this.cargarDenunciantes(denunciaId);
          this.cargarDenunciados(denunciaId);

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
        this.dataSourceDenunciantes.data = denunciantes;

        console.log( "==========> " +JSON.stringify(this.dataSourceDenunciantes.data));


        
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

        this.dataSourceDenunciados.data = denunciados;

        console.log(denunciados);
        console.log("=====> " +  this.dataSourceDenunciados.data );
        
      });
  }
  
  



}
