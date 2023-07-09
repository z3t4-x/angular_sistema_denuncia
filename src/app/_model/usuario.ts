//import { CatalogosValores } from "./catalogosValores";
export class Usuario {
    
  idUsuario : number;
  nombre: string;
  apellido: string;
  cdUsuario: string;
  password: string;
  email: string;
  fiscalia: CatalogosValores;
  mesaParte: CatalogosValores;
  rolesDTO: RolesDTO[];
}

export interface RequestUsuario {
  nombre: string;
  apellido: string;
  cdUsuario: string;
  password: string;
  email: string;
  mesaParte: CatalogosValores;
  fiscalia: CatalogosValores;
  rolesDTO: RolesDTO[];
}

export interface RolesDTO {
  idRol: number;
  rolNombre: string;
}

export interface CatalogosValores {
    idValor: number;
    dsValor: string;
    cdCodigo: string;
  }

 