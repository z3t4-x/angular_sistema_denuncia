import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Denuncia, RequestDenuncia } from '../_model/denuncia';
import { Observable } from 'rxjs';
import { DenunciaPersona } from '../_model/denunciaPersona';
import { RequestDenunciaModif } from '../_model/denunciaModif';
import * as moment from 'moment';
import { DenunciaSearch } from '../_model/denunciaSearch';
import { RequestDenunciaHistorico } from '../_model/denunciaHistorico';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {

  private baseUrl  = `${environment.HOST}/denuncias`;

  constructor(private http: HttpClient) { }

  listarDenuncias(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.baseUrl}`);
  }

  listarPreliminar(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.baseUrl}/preliminar`);
  }

  listarPreparatoria(): Observable<Denuncia[]> {
    return this.http.get<Denuncia[]>(`${this.baseUrl}/preparatoria`);
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


  /**
   * método para filtrar campos de la denuncia.
   */
  filtrarCamposDenuncia(
    fechaAltaDenuncia: Date,
    fcIngresoDocumento: Date,
    fechaHechos: Date,
    tipoDelito: string,
    investigador: string,
    nmDenuncia: string,
    estadoDenuncia: string,
    tipoDocumento:string,
    nmExpedienteInvPreliminar: string,
    nmExpedientePreparatoria: string, 
    nmDocumento: string
  ): Observable<Denuncia[]> {
    let params = new HttpParams()
      .set('tipoDelito', tipoDelito)
      .set('investigador', investigador)
      .set('nmDenuncia', nmDenuncia)
      .set('estadoDenuncia', estadoDenuncia)
      .set('nmDocumento', nmDocumento)
      .set('tipoDocumento', tipoDocumento)
      .set('nmExpedienteInvPreliminar', nmExpedienteInvPreliminar)
      .set('nmExpedientePreparatoria', nmExpedientePreparatoria);

    // Verificar y agregar la fecha de alta de denuncia si es válida
    if (fechaAltaDenuncia) {
      const formattedFechaAltaDenuncia = fechaAltaDenuncia.toISOString().split('T')[0];
      params = params.set('fcAltaDenuncia', formattedFechaAltaDenuncia);
    }
      // Verificar y agregar la fecha de ingreso de documento si es válida
      if (fcIngresoDocumento) {
        const formattedFcIngresoDocumento = fcIngresoDocumento.toISOString().split('T')[0];
        params = params.set('fcIngresoDocumento', formattedFcIngresoDocumento);
      }
    
    // Verificar y agregar la fecha de hechos si es válida
    if (fechaHechos) {
      const formattedFechaHechos = fechaHechos.toISOString().split('T')[0];
      params = params.set('fcHechos', formattedFechaHechos);
    }
   
    return this.http.get<Denuncia[]>(`${this.baseUrl}/buscar`, { params: params });
  }

  /**
   * buscar por campos de la denuncia
   * @param denuncia 
   * @returns 
   */
  buscarDenuncias(denuncia: DenunciaSearch): Observable<DenunciaSearch[]> {
    let params = new HttpParams();  
    if (denuncia.fcAltaDenuncia) {
      params = params.set('fcAltaDemuncia', denuncia.fcAltaDenuncia);
    }

    if (denuncia.tipoDelito) {  
      console.log("TIPO DEL => ",denuncia.tipoDelito);
      params = params.set('tipoDelito', denuncia.tipoDelito);
    }    
    if (denuncia.fcHechos) {
      params = params.set('fcHechos', denuncia.fcHechos);
    }
    if (denuncia.investigador) {
      params = params.set('investigador', denuncia.investigador);
    }
    if (denuncia.nmDenuncia) {
      params = params.set('nmDenuncia', denuncia.nmDenuncia);
    }
    if (denuncia.estadoDenuncia) {
      params = params.set('estadoDenuncia', denuncia.estadoDenuncia);
    }
    if (denuncia.tipoDocumento ) {
      params = params.set('tipoDocumento', denuncia.tipoDocumento);
    }
    if (denuncia.fcIngresoDocumento) {
      params = params.set('fcIngresoDocumento', denuncia.fcIngresoDocumento);
    }
    if (denuncia.nmDocumento) {
      params = params.set('nmDocumento', denuncia.nmDocumento);
    }
    if (denuncia.nmExpedientePreparatoria) {
      params = params.set('nmExpedientePreparatoria', denuncia.nmExpedientePreparatoria);
    }
    if (denuncia.nmExpedienteInvPreliminar) {
      params = params.set('nmExpedienteInvPreliminar', denuncia.nmExpedienteInvPreliminar);
    }   
    console.log("PARAMS => ", params);    
      return this.http.get<DenunciaSearch[]>(`${this.baseUrl}/buscar`, { params });
  }
  


/**
 * se lista el historico de cada denuncia.
 * @param idDenuncia 
 * @returns 
 */
obtenerHistoricoDenuncia(idDenuncia: number): Observable<RequestDenunciaHistorico[]> {
  const url = `${this.baseUrl}/historico/${idDenuncia}`;
  return this.http.get<RequestDenunciaHistorico[]>(url);
}





  
  /**
   * reportes
   * @returns 
   */
  
  public generarInforme(): Observable<any> {
    const url = `${this.baseUrl}/reportes`;
    return this.http.get<any>(url);
  }
  
  

}
