
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Persona } from '../_model/persona';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {


  private personaCambio = new Subject<Persona[]>();


  private url = `${environment.HOST}/personas`;

  constructor(private http : HttpClient) { }

  listar(){
    return this.http.get<Persona[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get<Persona>(`${this.url}/${id}`);
  }
/*
  registrar(persona : Persona){
    return this.http.post(this.url, persona);
  }

**/
registrar(persona : Persona){
  return this.http.post(this.url, persona)
      .pipe(
          catchError((error: any) => {
              console.error('Error al registrar persona: ', error);
              let mensaje = '';
              if (error.error instanceof ErrorEvent) {
                  // Error de cliente
                  mensaje = `Error: ${error.error.message}`;
              } else {
                  // Error del servidor
                  mensaje = `Error Code: ${error.status}\nMessage: ${error.message}`;
              }
              return throwError(mensaje);
          })
      );
}




  modificar(persona : Persona){
    return this.http.put(this.url, persona);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  buscarPorDNI(dni: string): Observable<Persona> {
    const url = `${this.url}/buscarPorDNI/${dni}`;
    return this.http.get<Persona>(url);
  }

  //** get set subjects */

  getPersonasCambio(){
    return this.personaCambio.asObservable();
  }

  setPersonasCambio(persona : Persona[]){
    this.personaCambio.next(persona);
  }


}
