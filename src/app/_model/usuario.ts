export class Usuario {
    
    idUsuario : number;
    nombre: string;
    apellido: string;
    cdUsuario: string;
    password: string;
    email: string;
    fiscalia: CatalogosValores;
    mesaParte: CatalogosValores;
   // rolesDTO: RolesDTO[];


}


  export interface RequestUsuario {
  nombre: string;
  apellido: string;
  cdUsuario: string;
  password: string;
  email: string;
  mesaParte: CatalogosValores | null;
  fiscalia: CatalogosValores | null;
  rolesDTO: RolesDTO[];
}

export interface RolesDTO {
  idRol: number;
}

export interface CatalogosValores {
    idValor: number;
    dsValor: string;
    cdCodigo: string;
  }