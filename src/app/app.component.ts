
import { LoginService } from './_service/login.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

 @ViewChild('sidenav') sidenav: MatSidenav;
  title = 'vocalia_front';
  sidenavOpened = true;

  constructor(private loginService: LoginService,private router: Router) {}

  isLoggedIn(): boolean {
    return this.loginService.isAuthenticated();
  }

  logout(): void {
    this.loginService.logout();
    this.closeSidenav();
  }

  toggleSidenav() {
    if (this.isLoggedIn()) {
      this.sidenav.toggle();
      this.sidenavOpened = this.sidenav.opened;
    }

  }

  closeSidenav() {
    this.sidenavOpened = false;
  }

  redireccionarListaDenuncia(codigoEstadoDenuncia:string){
    sessionStorage.setItem("codigoEstadoDenuncia", codigoEstadoDenuncia);

    if( codigoEstadoDenuncia  == 'DCIA' ){
      this.router.navigate(['/denuncia']);
    }else if( codigoEstadoDenuncia  == 'PRM' ){
      this.router.navigate(['/preliminar']);
    }else if( codigoEstadoDenuncia  == 'PRPA' ){
      this.router.navigate(['/preparatoria']);
    }

  }


}

