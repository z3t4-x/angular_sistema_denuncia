import { catchError, tap, throwError } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { error } from 'jquery';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RequestUsuario } from 'src/app/_model/usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  columnas: string[] = ['nombre', 'apellido', 'cdUsuario', 'email', 'fiscalia', 'acciones'];
  dataSource = new MatTableDataSource<RequestUsuario>();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.listarUsuarios();

  }

  /**
   * listar usuarios
   */
  listarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      },
      error => {
        console.log(error);
      }
    );


  }


  /**
   * Eliminar usuario
   * @param id 
   */
  eliminarUsuario(idUsuario: number) {
      Swal.fire({
        title: '¿Estás seguro de que quieres eliminar el usuario?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuario(idUsuario).pipe(
            tap(() => {
              this.listarUsuarios();
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Se eliminó el usuario selccionado'
              });
            }),
            catchError((error) => {
              Swal.fire(
                'Error',
                'Se produjo un error al eliminar al usuario: ' + error,
                'error'
              );
              return throwError(() => new Error(error));
            })
          ).subscribe();
        }
      });
    }
    

}
