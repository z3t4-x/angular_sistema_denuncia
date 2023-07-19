import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestUsuario, Usuario } from '../_model/usuario';
import { rolesDTO } from '../_model/rol';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `${environment.HOST}/auth`;

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: RequestUsuario): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/nuevoUsuario`, usuario);
  }

  modificarUsuario(usuario: RequestUsuario): Observable<RequestUsuario> {
    return this.http.put<RequestUsuario>(`${this.baseUrl}/modificar`, usuario);
  }

  listarUsuarios(): Observable<RequestUsuario[]> {
    return this.http.get<RequestUsuario[]>(`${this.baseUrl}/`);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  buscarPorId(id: number): Observable<RequestUsuario> {
    return this.http.get<RequestUsuario>(`${this.baseUrl}/${id}`);
  }

  obtenerUsuariosPorRolYFiscalia(): Observable<Usuario[]> {
    const url = `${this.baseUrl}/usuarioRolFiscalia`;
    return this.http.get<Usuario[]>(url);
  }


  obtenerRolesUsuario(): Observable<rolesDTO[]> {
    const url = `${this.baseUrl}/usuario`;
    return this.http.get<rolesDTO[]>(url);
  }


}
