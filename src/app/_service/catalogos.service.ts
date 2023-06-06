
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Catalogos } from '../_model/catalogos';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {


  private catalogosCambio = new Subject<Catalogos[]>();
  private mensajeCambio = new Subject<string>();

  private url = `${environment.HOST}/catalogos`;

  constructor(private http : HttpClient) { }

  listar(){
    return this.http.get<Catalogos[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get<Catalogos>(`${this.url}/${id}`);
  }

  registrar(catalogos : Catalogos){
    return this.http.post(this.url, catalogos);
  }

  modificar(catalogos : Catalogos){
    return this.http.put(this.url, catalogos);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  //** get set subjects */

  getCatalogosCambio(){
    return this.catalogosCambio.asObservable();
  }

  setCatalogosCambio(catalogos : Catalogos[]){
    this.catalogosCambio.next(catalogos);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }
}
