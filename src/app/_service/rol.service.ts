import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { rolesDTO } from '../_model/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private baseUrl = `${environment.HOST}/roles`;

  constructor(private http: HttpClient) { }


  listarRoles(): Observable<rolesDTO[]> {
    return this.http.get<rolesDTO[]>(`${this.baseUrl}`);
  }

}
