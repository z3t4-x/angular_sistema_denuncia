import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { Persona } from 'src/app/_model/persona';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { PersonaService } from 'src/app/_service/persona.service';
import Swal from 'sweetalert2';
import { Observable, forkJoin, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-persona-dialog',
  templateUrl: './persona-dialog.component.html',
  styleUrls: ['./persona-dialog.component.css']
})
export class PersonaDialogComponent implements OnInit {

  errorMessage: string;
  dniExistsError: boolean = false;

  public generos: CatalogosValores[];
  public tiposIdentificacion: CatalogosValores[];
  public grados: CatalogosValores[];

  modalPersonaForm: FormGroup;
  persona: Persona = new Persona();

  constructor(   private personaService: PersonaService,
    private catalogoValoresService: CatalogosValoresService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PersonaDialogComponent>,
    private changeDetectorRef: ChangeDetectorRef) { 

    this.modalPersonaForm = this.fb.group({
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
    this.dniExistsError = false;
  }

  ngOnInit(): void {
    this.cargarCatalogosValores();
  }


  guardar(): void {
    if (this.modalPersonaForm.valid) {
      const personaFormValue = this.modalPersonaForm.value;
      if (!personaFormValue.grado) {
        personaFormValue.grado = null;
      }
      this.personaService.registrarPersona(this.modalPersonaForm.value).subscribe(
        (respuesta: any) => {
          const personaRegistrada: Persona = respuesta;
          console.log("RESPUESTA => ", personaRegistrada);
          // Obtener el DNI de la persona registrada
          const dniRegistrado = personaRegistrada.dni;
          console.log("DNI REGISTRADO DIALOG => ", dniRegistrado);
          // Cerrar el diálogo y pasar el DNI como resultado
          setTimeout(() => {
            this.dialogRef.close(dniRegistrado);
          }, 200);
  
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Se agregó una nueva persona'
          });
  
          // Redirigir a una nueva página
       //   this.router.navigate(['/denunciaEditar']);
        },
        (error: any) => {
          this.errorMessage = error;
        }
      );
    }
  }
  
  
  
  

  /**
   * verifica si el dni existe
   */
verificarDNI(event: Event): void {
  const target = event.target as HTMLInputElement;
  const dni = target.value;
    
  this.dniExistsError = false;
    
  if (this.modalPersonaForm?.get('dni')) {
    this.personaService.buscarPorDNI(dni).subscribe(
      persona => {
        if (persona && persona.dni) {
          this.modalPersonaForm.get('dni')?.setErrors({ 'dniExists': true });
        } else {
          this.modalPersonaForm.get('dni')?.setErrors(null);
        }
        this.modalPersonaForm.get('dni')?.updateValueAndValidity();
      },
      error => {
        console.error('Error buscando DNI', error);
      }
    );
  }
}

  

/**
 * 
 * @param control m
 * @returns 
 */
  telefonoValidator(control: FormControl) {
    if (control.value && (control.value.length !== 9 || !/^\d{9}$/.test(control.value))) {
      return { 'telefonoInvalido': true };
    }
    return null;
  }


  /**
   * 
   * @param event restringe que solo peermita ingresar numeros
   */
  restrictToNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    
    if (this.modalPersonaForm.get('dni')) {
      this.modalPersonaForm.get('dni')?.setValue(value);
    }
  }
  




/**
 * carga la lista de catalogos
 */
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





  }

  export function dniValidator(control: FormControl) {
    const dni = control.value;
    if (dni && (!/^\d{8}$/.test(dni))) {
      return { 'dniInvalido': true };
    }
    return null;
  }


