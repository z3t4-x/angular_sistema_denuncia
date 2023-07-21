import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private baseUrl = `${environment.HOST}/denuncias-personas`;

  constructor(private http: HttpClient) { }
  
/*
  exportarDenunciasExcel(fecha: string, estadoInvestigacion: number): Observable<ArrayBuffer> {
    const url = `${this.baseUrl}/exportar-denuncias?fecha=${fecha}&estadoInvestigacion=${estadoInvestigacion}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }
  

  exportarDenunciasExcel(fecha: string, estadoInvestigacion: number): Observable<any> {
    const url = `${this.baseUrl}/exportar-denuncias?fecha=${fecha}&estadoInvestigacion=${estadoInvestigacion}`;
    return this.http.get(url, { responseType: 'arraybuffer' });
  }
*/

exportarDenunciasExcel(fecha?: string, estadoInvestigacion?: number): Observable<HttpResponse<Blob>> {
  let params = new HttpParams();

  if (fecha) {
    params = params.append('fecha', fecha);
  }

  if (estadoInvestigacion !== null && estadoInvestigacion !== undefined) {
    params = params.append('estadoInvestigacion', estadoInvestigacion.toString());
  }

  return this.http.get<Blob>(`${this.baseUrl}/exportar-denuncias`, {
    observe: 'response',
    responseType: 'blob' as 'json',
    params: params
});
}

  
}


