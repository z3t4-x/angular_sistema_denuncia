import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Denuncia, RequestDenuncia } from '../_model/denuncia';
import { Observable } from 'rxjs';
import { DenunciaPersona } from '../_model/denunciaPersona';
import { RequestDenunciaModif } from '../_model/denunciaModif';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {

  private baseUrl  = `${environment.HOST}/denuncias`;

  constructor(private http: HttpClient) { }

  listarDenuncias(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.baseUrl}`);
  }

  obtenerDenunciaPorId(id: number): Observable<Denuncia> {
    return this.http.get<Denuncia>(`${this.baseUrl}/${id}`);
  }

  registrarDenuncia(denuncia: RequestDenuncia): Observable<Denuncia> {
    return this.http.post<Denuncia>(`${this.baseUrl}`, denuncia);
  }

  modificarDenuncia(denuncia: RequestDenunciaModif): Observable<Denuncia> {
    return this.http.put<Denuncia>(`${this.baseUrl}`, denuncia);
  }

  eliminarDenuncia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }



}
