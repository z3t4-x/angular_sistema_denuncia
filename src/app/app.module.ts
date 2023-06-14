import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CatalogosComponent } from './pages/catalogos/catalogos.component';
import { DenunciasComponent } from './pages/denuncias/denuncias.component';
import { CatalogosEdicionComponent } from './pages/catalogos/catalogos-edicion/catalogos-edicion.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonasComponent } from './personas/personas.component';
import { PersonasEdicionComponent } from './personas/personas-edicion/personas-edicion.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SpanishPaginatorIntl } from './_utils/SpanishPaginatorIntl';
import {MatSortModule} from '@angular/material/sort';
import { CatalogosValoresComponent } from './pages/catalogos-valores/catalogos-valores.component';
import { ValoresEdicionComponent } from './pages/catalogos-valores/valores-edicion/valores-edicion.component';
import { DenunciasEdicionComponent } from './pages/denuncias/denuncias-edicion/denuncias-edicion.component';
import { PreliminarComponent } from './pages/preliminar/preliminar.component';
import { PreliminarEdicionComponent } from './pages/preliminar/preliminar-edicion/preliminar-edicion.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { UsuarioEdicionComponent } from './pages/usuario/usuario-edicion/usuario-edicion.component';
import { PreparatoriaComponent } from './pages/preparatoria/preparatoria.component';
import { PreparatoriaEdicionComponent } from './pages/preparatoria/preparatoria-edicion/preparatoria-edicion.component';
import { DenunciasNuevoComponent } from './pages/denuncias/denuncias-nuevo/denuncias-nuevo.component';
import { LoginComponent } from './pages/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { ToolbarComponent } from './pages/toolbar/toolbar.component';
import { AuthInterceptor } from './auth.interceptor';
import { UsuarioNuevoComponent } from './pages/usuario/usuario-nuevo/usuario-nuevo.component';



@NgModule({
  declarations: [
    AppComponent,
    CatalogosComponent,
    DenunciasComponent,
    CatalogosEdicionComponent,
    PersonasComponent,
    PersonasEdicionComponent,   
    CatalogosValoresComponent,
    ValoresEdicionComponent,
    DenunciasEdicionComponent,
    PreliminarComponent,
    PreliminarEdicionComponent,
    UsuarioComponent,
    UsuarioNuevoComponent,
    UsuarioEdicionComponent,
    PreparatoriaComponent,
    PreparatoriaEdicionComponent,
    DenunciasNuevoComponent,
    LoginComponent,
    SidenavComponent,
    ToolbarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatCardModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
