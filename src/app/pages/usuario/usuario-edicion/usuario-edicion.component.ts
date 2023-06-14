

import { forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CatalogosValores } from 'src/app/_model/catalogosValores';

import { RequestUsuario } from 'src/app/_model/usuario';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { RolService } from 'src/app/_service/rol.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { rolesDTO } from 'src/app/_model/rol';

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
     // idUsuario: [''],
      nombre: [''],
      apellido: [''],
      cdUsuario: [''],
      password: [''],
      email: [''],
      fiscalia: [''],
      mesaParte: [''],
      rolesDTO:['']
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


  cargarUsuarioParaEditar(id: number): void {
    this.usuarioService.buscarPorId(id).subscribe(
      usuario => {
        console.log('Respuesta del servicio buscarPorId:', usuario);
  
        // Adaptamos los datos del usuario antes de asignarlos al formulario
        const usuarioAdaptado: RequestUsuario = {
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          cdUsuario: usuario.cdUsuario,
          password: usuario.password,
          email: usuario.email,
          mesaParte: usuario.mesaParte || null, // Verificamos si mesaParte es nulo y asignamos null en su lugar
          fiscalia: usuario.fiscalia || null, // Verificamos si fiscalia es nulo y asignamos null en su lugar
          rolesDTO: usuario.rolesDTO
        };
  
        // Actualizamos el formulario con los datos adaptados del usuario
        this.usuariosForm.setValue(usuarioAdaptado);
      },
      error => {
        console.error('Error al cargar el usuario:', error);
      }
    );
  }
  
  
  
  
  
  



  modificarDenuncia(){
      // Verificamos si el formulario es válido
  if (this.usuariosForm.valid) {
    // Obtén los valores del formulario
    const usuarioModificado = this.usuariosForm.value;

    // Llama al servicio para modificar el usuario
    this.usuarioService.modificarUsuario(usuarioModificado).subscribe(
      () => {
        // La modificación fue exitosa, redirige a la página deseada
        this.router.navigate(['/usuarios']);
      },
      error => {
        // Ocurrió un error al modificar el usuario, maneja el error aquí
        console.error('Error al modificar el usuario:', error);
      }
    );
  } else {
    // El formulario no es válido, muestra mensajes de error o realiza las acciones correspondientes
    console.log('Formulario inválido');
  }
  }


}
