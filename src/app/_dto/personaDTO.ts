import { CatalogosValores } from "../_model/catalogosValores";
import { DenunciaPersona } from "../_model/denunciaPersona";

export class PersonaDTO {
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
   // lstDenunciasPersonas: DenunciaPersona[];
   // denunciasPersonas: DenunciaPersona[];

}