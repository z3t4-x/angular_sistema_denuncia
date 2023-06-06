import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, throwError } from 'rxjs';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
//import { Denuncia } from 'src/app/_model/denuncia';
import { Persona } from 'src/app/_model/persona';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { PersonaService } from 'src/app/_service/persona.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { DenunciaPersona } from 'src/app/_model/denunciaPersona';
import { MatDatepicker } from '@angular/material/datepicker';
import { DenunciaService } from 'src/app/_service/denuncia.service';
import {
  Denuncia,
  LstDenunciado,
  RequestDenuncia,
} from 'src/app/_model/denuncia';
import { PersonaDTO } from 'src/app/_dto/personaDTO';

@Component({
  selector: 'app-denuncias-nuevo',
  templateUrl: './denuncias-nuevo.component.html',
  styleUrls: ['./denuncias-nuevo.component.css'],
})
export class DenunciasNuevoComponent implements OnInit {
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
    private formBuilder: FormBuilder,
    private router: Router
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
  }

  submitForm(): void {}

  //########################################
  //##          DATOS DE LA DENUNCIA
  //#########################################
  // Método para inicializar el formulario y configurar los controles
  initializeForm() {
    this.denunciaForm = new FormGroup({
      tipoDelito: new FormControl('', Validators.required),
      fcIngresoDocumento: new FormControl('', Validators.required),
      fcHechos: new FormControl('', Validators.required),
      tipoDocumento: new FormControl('', Validators.required),
      nmDocumento: new FormControl('', Validators.required),
      auxiliar: new FormControl('', Validators.required),
      dsDescripcion: new FormControl(''),
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
      telefono: [''],
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
  

  // carga de catalogos
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
   * guardar denuncia
   */
  guardarDenuncia() {
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

    const lstDenunciantes = this.dataSourceDenunciantes.data.map(
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
    const denuncia: RequestDenuncia = {
      tipoDelito: {
        idValor: datosDenunciaForm.tipoDelito,
      },
      fcHechos: datosDenunciaForm.fcHechos,
      auxiliar: {
        idValor: datosDenunciaForm.auxiliar,
      },
      dsDescripcion: datosDenunciaForm.dsDescripcion,
      tipoDocumento: {
        idValor: datosDenunciaForm.tipoDocumento,
      },
      fcIngresoDocumento: datosDenunciaForm.fcIngresoDocumento,
      nmDocumento: datosDenunciaForm.nmDocumento,
      lstDenunciados: lstDenunciados,
      lstDenunciantes: lstDenunciantes,
    };

    console.log({
      denuncia,
    });

    this.denunciaService.registrarDenuncia(denuncia).subscribe(
      response => {
        // Aquí puedes manejar la respuesta del servicio, por ejemplo, mostrar un mensaje de éxito
        Swal.fire('Éxito', 'Denuncia guardada correctamente', 'success');
        // Restablecer el formulario y las listas de denunciantes y denunciados
        this.denunciaForm.reset();
       // this.denuncia.lstDenunciantes = [];
       // this.denuncia.lstDenunciados = [];
       console.log("datasourceDENUNCIANTES ==> " , this.dataSourceDenunciantes.data);
        this.dataSourceDenunciantes.data = this.denuncia.lstDenunciantes;
        this.dataSourceDenunciados.data = this.denuncia.lstDenunciados;
  
        console.log("datasourceDENUNCIADOS ==> " ,this.dataSourceDenunciados.data);
        this.router.navigate(['/denuncia']);
      },
      error => {
        // Aquí puedes manejar el error en caso de que ocurra
        Swal.fire('Error', 'Ocurrió un error al guardar la denuncia', 'error');
      }
    );
  }
}
