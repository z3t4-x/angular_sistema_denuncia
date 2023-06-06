import { Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Persona } from '../_model/persona';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaService } from '../_service/persona.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CatalogosValores } from '../_model/catalogosValores';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { catchError, tap } from 'rxjs';
import { throwError } from 'rxjs';



@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  grado: CatalogosValores;
  genero: CatalogosValores;
  tipoIdentificacion: CatalogosValores;

  dataSource: MatTableDataSource<Persona> = new MatTableDataSource<Persona>([]);

  columnas: string[] = ['idPersona', 'nombre', 'apellido1', 'apellido2', 'grado', 'genero', 'tipoIdentificacion', 'dni', 'fcNacimiento', 'telefono', 'acciones'];

  constructor(
    private personaService: PersonaService,   
    private snackBar: MatSnackBar
  ) { 
   
  }

  ngOnInit() {

    this.obtenerPersonas();
  
  }

  obtenerPersonas() {
    this.personaService.listar().subscribe(personas => {
      this.dataSource = new MatTableDataSource(personas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  



  eliminar(persona: Persona) {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar la persona?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personaService.eliminar(persona.idPersona).pipe(
          tap(() => {
            this.obtenerPersonas();
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Se eliminó la persona'
            });
          }),
          catchError((error) => {
            Swal.fire(
              'Error',
              'Se produjo un error al eliminar la persona: ' + error,
              'error'
            );
            return throwError(() => new Error(error));
          })
        ).subscribe();
      }
    });
  }
  
  
  



 
}


