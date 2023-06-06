import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Catalogos } from 'src/app/_model/catalogos';
import { CatalogosService } from 'src/app/_service/catalogos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-catalogos-edicion',
  templateUrl: './catalogos-edicion.component.html',
  styleUrls: ['./catalogos-edicion.component.css']
})
export class CatalogosEdicionComponent implements OnInit {
 
  id: number;
  catalogo: Catalogos;
  form: FormGroup;
  edicion: boolean = false;

  constructor(
    private catalogoService: CatalogosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
 
   // 'idCatalogo', 'dsNombre', 'itMantenible',
   this.catalogo =  new Catalogos();

   this.form = new FormGroup({
    'idCatalogo' : new FormControl(0),
    'dsNombre': new FormControl(''),
    'itMantenible' : new FormControl('')
   });

   this.route.params.subscribe((params: Params) => {
    this.id = params['id'];

    this.edicion = params['id'] != null;
    this.initForm();
  });

  }



  initForm() {
    if (this.edicion) {
      this.catalogoService.listarPorId(this.id).subscribe(data => {
        let id = data.idCatalogo;
        let nombre = data.dsNombre;
        let itMantenible = data.itMantenible

        this.form = new FormGroup({
          'idCatalogo': new FormControl(id),
          'dsNombre': new FormControl(nombre),
          'itMantenible': new FormControl(itMantenible)
        });
      });
    }
  }




  operar() {
    this.catalogo.idCatalogo = this.form.value['idCatalogo'];
    this.catalogo.dsNombre = this.form.value['dsNombre'];
    this.catalogo.itMantenible = this.form.value['itMantenible'];
  
    if (this.catalogo != null && this.catalogo.idCatalogo > 0) {
      //BUENA PRACTICA
      this.catalogoService.modificar(this.catalogo).pipe(switchMap(() => {
        return this.catalogoService.listar();
      })).subscribe(data => {
        this.catalogoService.setCatalogosCambio(data);
        Swal.fire({
          icon: 'success',
          title: 'Se modifico correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      });
    } else {
      //PRACTICA COMUN
      this.catalogoService.registrar(this.catalogo).pipe(switchMap(() => {
        return this.catalogoService.listar();
      })).subscribe(data => {
        this.catalogoService.setCatalogosCambio(data);
        Swal.fire({
          icon: 'success',
          title: 'Se registro correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al registrar el catálogo.',
          confirmButtonText: 'Ok'
        });
      });
    }
    
    this.router.navigate(['catalogos']);

  }
  
}