

import { forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogosValores } from 'src/app/_model/catalogosValores';

import { RequestUsuario, RolesDTO, Usuario } from 'src/app/_model/usuario';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { RolService } from 'src/app/_service/rol.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { rolesDTO } from 'src/app/_model/rol';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-edicion',
  templateUrl: './usuario-edicion.component.html',
  styleUrls: ['./usuario-edicion.component.css']
})
export class UsuarioEdicionComponent implements OnInit {

  public fiscalias  : CatalogosValores[];
  public mesaPartes : CatalogosValores[];
  public rolesDTO : rolesDTO[];

  usuariosForm : FormGroup;


  constructor( private usuarioService: UsuarioService,
    private catalogosValoresService: CatalogosValoresService,
     private formBuilder: FormBuilder, private rolService: RolService,
     private router: Router, private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.listarRoles();
    this.cargarCatalogosValores();
    this.usuariosForm = this.crearUsuariosForm();

      // Aquí capturas el id del usuario de la URL
  const id = this.route.snapshot.paramMap.get('id');

  // Si hay un id, obtenemos los datos del usuario para editar
  if (id) {
    this.cargarUsuarioParaEditar(+id);
  }

  }


  crearUsuariosForm(): FormGroup {
   
    return this.formBuilder.group({
      idUsuario: [''],
      nombre: [''],
      apellido: [''],
      cdUsuario: [''],
      password: [''],
      email: [''],
      fiscalia: new FormControl(''),
      mesaParte: new FormControl(''),
      rolesDTO: new FormControl(''),
      //rolesDTO: this.formBuilder.array([]),
    });
  }






  listarRoles():void{
    this.rolService.listarRoles().subscribe(
      data => {
        this.rolesDTO = data;    
      }
    );
  }


   // carga de catalogos
   cargarCatalogosValores(): void {
    forkJoin([
      this.catalogosValoresService.buscarPorNombreCatalogo('FISCALIA'),
      this.catalogosValoresService.buscarPorNombreCatalogo('MESA DE PARTE'),

    ]).subscribe(
      ([
        fiscalias,
        mesaPartes,

      ]) => {
        this.fiscalias = fiscalias;
        this.mesaPartes = mesaPartes;
        console.log(this.mesaPartes);
      }
    );
  }

  getRolesDTOControls(): AbstractControl[] {
    const rolesDTOFormArray = this.usuariosForm.get('rolesDTO') as FormArray;
    return rolesDTOFormArray.controls;
  }
  

  cargarUsuarioParaEditar(id: number): void {
    this.usuarioService.buscarPorId(id).subscribe(
      (usuario: RequestUsuario) => {
        console.log('Respuesta del servicio buscarPorId:', usuario);
        this.usuariosForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          cdUsuario: usuario.cdUsuario,
          password: usuario.password,
          email: usuario.email,
          fiscalia: usuario.fiscalia ? usuario.fiscalia.idValor : '',
          mesaParte: usuario.mesaParte ? usuario.mesaParte.idValor : '',
        // Ahora asignamos el id del rol directamente al FormControl
        rolesDTO: usuario.rolesDTO && usuario.rolesDTO.length > 0 ? usuario.rolesDTO[0].idRol : '',
      });
   

  
      },
      error => {
        console.error('Error al cargar el usuario:', error);
      }
    );
  }
  
  
  
  // Dentro de la clase UsuarioEdicionComponent


  
  
  

/**
 * modificar usuario
 */
modificarUsuario() {
  // Verificamos si el formulario es válido
  if (this.usuariosForm.valid) {
    // Obtén los valores del formulario
    const datosUsuarioForm = this.usuariosForm.value;

    // Obtén el ID del usuario de la URL
    const id = this.route.snapshot.paramMap.get('id');

    // Si no hay un ID, muestra un mensaje de error o realiza las acciones correspondientes
    if (!id) {
      console.log('ID de usuario no válido');
      return;
    }

    // Llama al servicio para buscar el usuario por ID
    this.usuarioService.buscarPorId(+id).subscribe(
      (usuario: RequestUsuario) => {
        // Actualiza los datos del usuario con los valores del formulario
        usuario.nombre = datosUsuarioForm.nombre;
        usuario.apellido = datosUsuarioForm.apellido;
        usuario.cdUsuario = datosUsuarioForm.cdUsuario;
        usuario.password = datosUsuarioForm.password;
        usuario.email = datosUsuarioForm.email;
        usuario.mesaParte = {
          idValor: datosUsuarioForm.mesaParte,
          dsValor: '',
          cdCodigo: ''
        };
        usuario.fiscalia = {
          idValor: datosUsuarioForm.fiscalia,
          dsValor: '',
          cdCodigo: ''
        };

        // Obtén el ID del rol seleccionado en el formulario
        const selectedRoleId = datosUsuarioForm.rolesDTO;

        // Verifica si se seleccionó un rol y actualiza los rolesDTO del usuario en consecuencia
        if (selectedRoleId) {
          usuario.rolesDTO = [
            {
              idRol: selectedRoleId,
              rolNombre: ''
            }
          ];
        } else {
          usuario.rolesDTO = [];
        }

        // Llama al servicio para modificar el usuario
        this.usuarioService.modificarUsuario(usuario).subscribe(
          response =>{
            Swal.fire('Éxito', 'El usuario ha sido modificado correctamente', 'success');
            
            this.usuariosForm.reset();
        
            this.router.navigate(['/usuario']);
         
          },
          error => {
            // Ocurrió un error al modificar el usuario, maneja el error aquí
            console.error('Error al modificar el usuario:', error);
          }
        );
      },
      error => {
        // Ocurrió un error al buscar el usuario, maneja el error aquí
        console.error('Error al buscar el usuario:', error);
      }
    );
  } else {
    // El formulario no es válido, muestra mensajes de error o realiza las acciones correspondientes
    console.log('Formulario inválido');
  }
}



}
