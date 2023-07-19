
import { LoginService } from './_service/login.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { RolesDTO } from './_model/usuario';
import { UsuarioService } from './_service/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


   esAdministrador:boolean= false;
   esArchivador:boolean= false;
   esAuxiliarInvestigador:boolean= false;
   esMesaDePartes:boolean= false;



 @ViewChild('sidenav') sidenav: MatSidenav;
  title = 'vocalia_front';
  sidenavOpened = true;

  constructor(private loginService: LoginService,
                              private router: Router,
                              private usuarioService: UsuarioService)
                               {
                                this.router.events.subscribe(event => {
                                  if (event instanceof NavigationStart) {
                                    // Reinicia los roles al navegar a una nueva ruta
                                    this.obtenerRolesUsuario();
                                  }
                                });
                              }
                              


  ngOnInit() {

    this.obtenerRolesUsuario();
  }

  isLoggedIn(): boolean {
    return this.loginService.isAuthenticated();
  }

  logout(): void {
    this.loginService.logout();
    this.closeSidenav();
    this.resetRoles();
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

  obtenerRolesUsuario() {
    this.usuarioService.obtenerRolesUsuario().subscribe((roles: RolesDTO[]) => {
      this.resetRoles(); 
      console.log("Roles del usuario:", roles);
      this.esAdministrador = roles.some(rol => rol.rolNombre === 'ADMINISTRADOR');
      this.esArchivador = roles.some(rol => rol.rolNombre === 'ARCHIVADOR');
      this.esAuxiliarInvestigador = roles.some(rol => rol.rolNombre === 'AUXILIAR INVESTIGADOR');
      this.esMesaDePartes = roles.some(rol => rol.rolNombre === 'MESA DE PARTES');
      console.log("Administrador => ", this.esAdministrador);
      console.log("Archivador => ", this.esArchivador);
      console.log("Auxiliar Investigador => ", this.esAuxiliarInvestigador);
      console.log("Mesa de Partes => ", this.esMesaDePartes);
    });
  }
  
  resetRoles(): void {
    this.esAdministrador = false;
    this.esArchivador = false;
    this.esAuxiliarInvestigador = false;
    this.esMesaDePartes = false;
  }

}

