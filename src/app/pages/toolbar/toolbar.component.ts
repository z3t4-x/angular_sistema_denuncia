import { Component, OnInit, ViewChild, Output, EventEmitter  } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LoginService } from 'src/app/_service/login.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() toggleSidenav: EventEmitter<void> = new EventEmitter<void>();
  isSidenavOpened: boolean = true;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }
//*ngIf="!isLoggedIn()"
  isLoggedIn(): boolean {
    return this.loginService.isAuthenticated();
  }
  logout(): void {
    this.loginService.logout();
  }


  onToggleSidenav(): void {
    console.log('Evento toggleSidenav recibido');
    this.isSidenavOpened = !this.isSidenavOpened;
    this.toggleSidenav.emit();
  }

}
