import { CatalogosValores } from "./catalogosValores";
import { DenunciaPersona } from "./denunciaPersona";
//import { Usuario } from "./usuario";

export class Persona {
    idPersona: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
   // grado?: CatalogosValores;
    grado? : CatalogosValores ;
    genero: CatalogosValores;
    tipoIdentificacion: CatalogosValores;
    dni: string;
    fcNacimiento: Date;
    telefono: string;
  //  usuario: Usuario;
    lstDenunciasPersonas: DenunciaPersona[];
   // denunciasPersonas: DenunciaPersona[];

}