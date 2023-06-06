import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = `${environment.HOST}/auth/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  login(cdUsuario: string, password: string) {
    const body = {
      cdUsuario: cdUsuario,
      password: password
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
     // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  
    return this.http.post<any>(this.baseUrl, body, { headers: headers }).pipe(
      map(response => {
        // Almacenar el token en el almacenamiento local (localStorage o sessionStorage)
        const token = response.token;
        localStorage.setItem('token', token);
  
          // Opcional: Devolver la respuesta para un procesamiento adicional en el componente
        return response;
      })
    );
  }


  logout() {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de login
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    // Verificar si el token está presente en el almacenamiento local
    const token = localStorage.getItem('token');
    return !!token;
  }
}