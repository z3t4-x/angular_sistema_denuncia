import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/_model/loginModel';
import { LoginService } from 'src/app/_service/login.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  loginData: LoginModel;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {

    this.loginData = new LoginModel();
    this.loginForm = this.formBuilder.group({
      cdUsuario: ['', Validators.required], // Modificar el nombre del control a 'cdUsuario'
      password: ['', Validators.required]
    });
   }

  ngOnInit() {
    this.isLoggedIn = this.loginService.isAuthenticated();
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const cdUsuario = this.loginForm.get('cdUsuario')?.value;
    const password = this.loginForm.get('password')?.value;

    this.loginService.login(cdUsuario, password).subscribe(
      response => {
        const token = response.token;
        const cdUsuario = response.cdUsuario;
        const authorities = response.authorities;
        // Almacenar el token y otros datos en el almacenamiento local
        
        console.log("token ==> " + token);
        
        
        localStorage.setItem('token', token);
        localStorage.setItem('cdUsuario', cdUsuario);
        localStorage.setItem('authorities', JSON.stringify(authorities));
        this.isLoggedIn = true;
        // Redirigir al usuario a la página principal o a la página deseada después del login
        this.router.navigate(['/denuncia']);
      },
      error => {
        console.error('Error en el login:', error);
      }
    );
  }


  logout() {
    this.loginService.logout();
    this.isLoggedIn = false;
  }



  
  
    // Resto del código del componente

}


  
