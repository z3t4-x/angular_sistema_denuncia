import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Catalogos } from 'src/app/_model/catalogos';
import { CatalogosService } from 'src/app/_service/catalogos.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {

  displayedColumns = ['idCatalogo', 'dsNombre', 'itMantenible', 'acciones'];
  dataSource: MatTableDataSource<Catalogos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private catalogosService: CatalogosService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.catalogosService.getCatalogosCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.catalogosService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'Aviso', {
        duration: 2000,
      });
    });

    this.catalogosService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /**
   * Eliminar
   * @param catalogos 
   */
  eliminar(catalogos: Catalogos) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este catálogo?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.catalogosService.eliminar(catalogos.idCatalogo).pipe(switchMap(() => {
          return this.catalogosService.listar();
        })).subscribe(data => {
          this.catalogosService.setCatalogosCambio(data);
          this.catalogosService.setMensajeCambio('Se eliminó');
          Swal.fire(
            'Eliminado',
            'El catálogo ha sido eliminado correctamente.',
            'success'
          );
        });
      }
    });
  }
  


  }

