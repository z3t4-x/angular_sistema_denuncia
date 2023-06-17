import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'jquery';
import { CatalogosValores } from 'src/app/_model/catalogosValores';
import { CatalogosValoresService } from 'src/app/_service/catalogos-valores.service';
import { RolService } from 'src/app/_service/rol.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import Swal from 'sweetalert2';
import { RequestUsuario } from 'src/app/_model/usuario';
import { rolesDTO } from 'src/app/_model/rol';

@Component({
  selector: 'app-usuario-nuevo',
  templateUrl: './usuario-nuevo.component.html',
  styleUrls: ['./usuario-nuevo.component.css']
})
export class UsuarioNuevoComponent implements OnInit {
  public fiscalias  : CatalogosValores[];
  public mesaPartes : CatalogosValores[];
  public roles : rolesDTO[];

  usuariosForm : FormGroup;

  constructor( private usuarioService: UsuarioService,
    private catalogosValoresService: CatalogosValoresService,
     private formBuilder: FormBuilder, private rolService: RolService,
     private router: Router) { }

  ngOnInit(): void {
    this.cargarCatalogosValores();
    this.usuariosForm = this.crearUsuariosForm();
    this.listarRoles();
   

  }




listarRoles():void{
  this.rolService.listarRoles().subscribe(
    data => {
      this.roles = data;
      console.log("Roles: => " , data);
    }
  );
}

/**
 * se crea el formulario de usuarios
 */

crearUsuariosForm(): FormGroup {
  return this.formBuilder.group({
    idUsuario: [''],
    nombre: [''],
    apellido: [''],
    cdUsuario: [''],
    password: [''],
    email: [''],
    fiscalia: [''],
    mesaParte: [''], // Cambio aquí
    rol: ['']
  });
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


  guardarUsuario(){
    const datosUsuarioForm =  this.usuariosForm.value;
    const usuario: RequestUsuario = {

      nombre: datosUsuarioForm.nombre,
      apellido: datosUsuarioForm.apellido,
      cdUsuario: datosUsuarioForm.cdUsuario,
      password: datosUsuarioForm.password,
      email: datosUsuarioForm.email,
      mesaParte:{
        idValor: datosUsuarioForm.mesaParte,
        dsValor: '',
        cdCodigo: ''
      },
      fiscalia:{
        idValor: datosUsuarioForm.fiscalia,
        dsValor: '',
        cdCodigo: ''
      },
      rolesDTO:[{
        idRol: datosUsuarioForm.rol
      }]

};

console.log({
  usuario,
});

this.usuarioService.registrarUsuario(usuario).subscribe(
  
  response =>{
    Swal.fire('Éxito', 'Denuncia guardada correctamente', 'success');
    
    this.usuariosForm.reset();

    this.router.navigate(['/usuario']);
 
  }
  ,
      error => {
        // Aquí puedes manejar el error en caso de que ocurra
        Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
      }
  );

  }






}
