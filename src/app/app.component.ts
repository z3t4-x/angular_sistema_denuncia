
import { LoginService } from './_service/login.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

 @ViewChild('sidenav') sidenav: MatSidenav;
  title = 'vocalia_front';
  sidenavOpened = true;

  constructor(private loginService: LoginService) {}

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

}

