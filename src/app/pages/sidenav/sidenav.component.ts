import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() isSidenavOpened: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
  }

  redireccionarListaDenuncia(codigoEstadoDenuncia:string){
    sessionStorage.setItem("codigoEstadoDenuncia", codigoEstadoDenuncia);
    this.router.navigate(['/denuncia']);
  }

}
