import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogosEdicionComponent } from './pages/catalogos/catalogos-edicion/catalogos-edicion.component';
import { CatalogosComponent } from './pages/catalogos/catalogos.component';
import { PersonasComponent } from './personas/personas.component';
import { PersonasEdicionComponent } from './personas/personas-edicion/personas-edicion.component';
import { DenunciasComponent } from './pages/denuncias/denuncias.component';
import { PreliminarComponent } from './pages/preliminar/preliminar.component';
import { PreliminarEdicionComponent } from './pages/preliminar/preliminar-edicion/preliminar-edicion.component';
import { DenunciasEdicionComponent } from './pages/denuncias/denuncias-edicion/denuncias-edicion.component';
import { PreparatoriaComponent } from './pages/preparatoria/preparatoria.component';
import { PreparatoriaEdicionComponent } from './pages/preparatoria/preparatoria-edicion/preparatoria-edicion.component';
import { DenunciasNuevoComponent } from './pages/denuncias/denuncias-nuevo/denuncias-nuevo.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { UsuarioEdicionComponent } from './pages/usuario/usuario-edicion/usuario-edicion.component';
import { UsuarioNuevoComponent } from './pages/usuario/usuario-nuevo/usuario-nuevo.component';
import { BusquedaDenunciaComponent } from './pages/busquedas/busqueda-denuncia/busqueda-denuncia.component';
import { ReportesDenunciaComponent } from './pages/reportes/reportes-denuncia/reportes-denuncia.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a LoginComponent
  {path: 'logout', component: LoginComponent},

  {  path: 'catalogos', component: CatalogosComponent, children: [
    { path: 'nuevo', component: CatalogosEdicionComponent },
    { path: 'edicion/:id', component: CatalogosEdicionComponent }
  ]

},
{
    path: 'personas', component: PersonasComponent
},

{
  path: 'personaNuevo', component: PersonasEdicionComponent
},
{
  path: 'personaEditar/:id', component: PersonasEdicionComponent
}
,
{
  path: 'denuncia', component: DenunciasComponent
},
{
  path: 'denunciaNuevo', component: DenunciasNuevoComponent
},
{
  path: 'denunciaEditar/:id', component: DenunciasEdicionComponent
},
{
  path: 'preliminar', component: DenunciasComponent
},
{
  path: 'preparatoria', component: DenunciasComponent
},

{
  path: 'usuario', component: UsuarioComponent
},
{
  path: 'usuarioNuevo', component: UsuarioNuevoComponent
},
{
  path: 'usuarioEditar/:id', component: UsuarioEdicionComponent
},
{
  path: 'busquedaDenuncia', component: BusquedaDenunciaComponent
},

{
  path: 'reporteDenuncia', component: ReportesDenunciaComponent
},
/*
{
  path: 'preliminar', component: PreliminarComponent
},

{
  path: 'preliminarEliminar:id', component: PreliminarEdicionComponent
},

{
  path: 'preparatoria', component: PreparatoriaComponent
},
{
  path: 'preparatoriaEditar:id', component: PreparatoriaEdicionComponent
},*/

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
