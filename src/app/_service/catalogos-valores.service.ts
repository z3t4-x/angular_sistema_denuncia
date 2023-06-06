import { Injectable } from '@angular/core';
import { CatalogosValores } from '../_model/catalogosValores';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Subject, map } from 'rxjs';
import { Catalogos } from '../_model/catalogos';

@Injectable({
  providedIn: 'root'
})

export class CatalogosValoresService {

  private catalogosCambio = new Subject<CatalogosValores[]>();


  private url = `${environment.HOST}/catalogosValores`;

  constructor(private http : HttpClient) { }

  listar(){
    return this.http.get<CatalogosValores[]>(this.url);
  }



  listarPorId(id: number){
    return this.http.get<CatalogosValores>(`${this.url}/${id}`);
  }

  registrar(catalogosValores : CatalogosValores){
    return this.http.post(this.url, catalogosValores);
  }

  modificar(catalogosValores : CatalogosValores){
    return this.http.put(this.url, catalogosValores);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }


  buscarPorIdCatalogo(id: number): Observable<CatalogosValores[]> {
    return this.http.get<CatalogosValores[]>(`${this.url}/catalogo/${id}`);
  }

  buscarPorNombreCatalogo(nombre: string): Observable<CatalogosValores[]> {
    return this.http.get<CatalogosValores[]>(`${this.url}/nombreCatalogo/${nombre}`);
  }
  

  

  //** get set subjects */

  getCatalogosCambio(){
    return this.catalogosCambio.asObservable();
  }

  setCatalogosCambio(catalogosValores : CatalogosValores[]){
    this.catalogosCambio.next(catalogosValores);
  }




}
