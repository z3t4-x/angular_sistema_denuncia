import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DenunciaPersona } from '../_model/denunciaPersona';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DenunciaPersonaService {

  
  private baseUrl  = `${environment.HOST}/denuncias-personas`;
  constructor(private http:HttpClient) { }


  obtenerDenunciantes(idDenuncia: number): Observable<DenunciaPersona[]> {
    const url = `${this.baseUrl}/denunciantes/${idDenuncia}`;
    return this.http.get<DenunciaPersona[]>(url);
  }

  obtenerDenunciados(idDenuncia: number): Observable<DenunciaPersona[]> {
    const url = `${this.baseUrl}/denunciados/${idDenuncia}`;
    return this.http.get<DenunciaPersona[]>(url);
  }
  
}

