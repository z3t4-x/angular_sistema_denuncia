import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, tap } from 'rxjs/operators';


import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, map, of } from 'rxjs';
import { Catalogos } from 'src/app/_model/catalogos';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { Persona } from 'src/app/_model/persona';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { PersonaService } from 'src/app/_service/persona.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-personas-edicion',
  templateUrl: './personas-edicion.component.html',
  styleUrls: ['./personas-edicion.component.css']
})

export class PersonasEdicionComponent implements OnInit {

  errorMessage: string;
  dniExistsError: boolean = false;


  totalItems: number;
  pageSize: number = 10;
  pageIndex: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;



  personaForm: FormGroup;
  persona: Persona = new Persona();

  esEdicion = false;

  public generos: CatalogosValores[];
  public tiposIdentificacion: CatalogosValores[];
  public grados: CatalogosValores[];

  public guardarHabilitado = false; // Nueva variable

  constructor(
    private personaService: PersonaService,
    private catalogoValoresService: CatalogosValoresService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.dniExistsError = false;
  }

  ngOnInit(): void {


    this.cargarCatalogosValores();
    this.setupForm();

    this.activateRoute.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.esEdicion=true;

        this.personaService.listarPorId(id).subscribe(persona => {

          this.persona = persona;

          this.personaForm.setValue({
            idPersona: persona.idPersona,
            nombre: persona.nombre,
            apellido1: persona.apellido1,
            apellido2: persona.apellido2,
            grado: persona.grado ? persona.grado.idValor : '',
            genero: persona.genero ? persona.genero.idValor : '',
            tipoIdentificacion: persona.tipoIdentificacion ? persona.tipoIdentificacion.idValor : '',
            dni: persona.dni,
            fcNacimiento: persona.fcNacimiento,
            telefono: persona.telefono
          });
        });

            // Suscribirse a los cambios en el formulario
      this.personaForm.valueChanges.subscribe(() => {
        this.guardarHabilitado = true;
      });


      }

    });
  }


  setupForm(): void {
    this.personaForm = this.fb.group({
      idPersona: [''],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      grado: [''],
      genero: [''],
      tipoIdentificacion: ['', Validators.required],
      dni: ['', [Validators.required, dniValidator]],
      fcNacimiento: ['', Validators.required],
      telefono: [null, [Validators.nullValidator, this.telefonoValidator]],
    });
  }
  

  cargarCatalogosValores(): void {
    forkJoin([
      this.catalogoValoresService.buscarPorNombreCatalogo('SEXO'),
      this.catalogoValoresService.buscarPorNombreCatalogo('TIPO DE IDENTIFCACION'),
      this.catalogoValoresService.buscarPorNombreCatalogo('GRADO')
    ]).subscribe(([generos, tiposIdentificacion, grados]) => {
      this.generos = generos;
      this.tiposIdentificacion = tiposIdentificacion;
      this.grados = grados;
    });
  }

  guardar(): void {
    if (this.personaForm.valid) {
      if (this.esEdicion) {
        this.editar();
      } else {

        const personaFormValue = this.personaForm.value;
          if (!personaFormValue.grado) {
            personaFormValue.grado = null;
          }
        this.personaService.registrar(this.personaForm.value).pipe(
          tap(() => {
            this.personaService.listar().subscribe(data => {
              this.personaService.setPersonasCambio(data);
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Se agregó una nueva persona'
              });
              this.router.navigate(['/personas']);
            },
            (error)=>{
              this.errorMessage = error;
            });
          })
        ).subscribe();

      }
    }
  }





  editar(): void {
    if (this.personaForm.valid) {
      this.persona = this.personaForm.value;
      this.personaService.modificar(this.persona).subscribe(() => {
        this.personaService.listar().subscribe(data => {
          this.personaService.setPersonasCambio(data);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Se actualizó la persona correctamente'
          });
          this.router.navigate(['/personas']);
        });
      });
    }
  }



  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // Call your API to fetch data for the current page
  }




  cancelar(): void {
    this.router.navigate(['/personas']);
  }




  telefonoValidator(control: FormControl) {
    if (control.value && (control.value.length !== 9 || !/^\d{9}$/.test(control.value))) {
      return { 'telefonoInvalido': true };
    }
    return null;
  }



  verificarDNI(event: Event): void {
    const target = event.target as HTMLInputElement;
    const dni = target.value;
    
    this.dniExistsError = false;
    
    if (this.personaForm?.get('dni')) {
      this.personaService.buscarPorDNI(dni).subscribe(
        persona => {
          if (persona && persona.dni) {
            this.personaForm.get('dni')?.setErrors({ 'dniExists': true });
            this.changeDetectorRef.detectChanges();
          } else {
            this.personaForm.get('dni')?.setErrors(null);
          }
        },
        error => {
          console.error('Error buscando DNI', error);
        }
      );
    }
  }
  
  
  
  
  
  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    
    if (this.personaForm?.get('dni')) {
      this.personaForm.get('dni')?.setValue(value);
    }
  }
  
  
  
  
  
  
  


}


export function dniValidator(control: FormControl) {
  const dni = control.value;
  if (dni && (!/^\d{8}$/.test(dni))) {
    return { 'dniInvalido': true };
  }
  return null;
}




