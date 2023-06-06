
//import { CatalogosValores } from "./catalogosValores";
//import { CatalogosValores } from "./catalogosValores";
import { DenunciaPersona } from "./denunciaPersona";


export class Denuncia {

    idDenuncia: number;
    CatalogosValores: CatalogosValores;
    mesaParte: CatalogosValores;
    tipoDelito: CatalogosValores;
    fcHechos: string;
    nmDenuncia:String;
    estadoDenuncia: CatalogosValores;
    fcAltaDenuncia: string;
    fcPlazo: string;
    auxiliar: CatalogosValores;
    dsDescripcion: string;
    tipoDocumento: CatalogosValores;
    fcIngresoDocumento: string;
    nmDocumento: string;
    lstDenunciantes: DenunciaPersona[] ;
    lstDenunciados: DenunciaPersona[];
    diasRestantes: number;
    nmExpedientePreparatoria: string;
    nmExpedienteInvPreliminar: string;

}

 export interface RequestDenuncia {
  //CatalogosValores: CatalogosValores;
  //mesaParte: CatalogosValores;
  //idDenuncia: number
  tipoDelito: CatalogosValores;
  fcHechos: string;
  auxiliar: CatalogosValores;
  dsDescripcion: string;
  tipoDocumento: CatalogosValores;
  fcIngresoDocumento: string;
  nmDocumento: string;
  lstDenunciantes: LstDenunciante[];
  lstDenunciados: LstDenunciado[];
 // estadoDenuncia: CatalogosValores;
 
}

export interface LstDenunciado {
  personaDTO: PersonaDTO;
  genero: CatalogosValores;
  tipoIdentificacion: CatalogosValores;
  grado: CatalogosValores;
}

export interface LstDenunciante {
  personaDTO: PersonaDTO;
  genero: CatalogosValores;
  tipoIdentificacion: CatalogosValores;
  grado: CatalogosValores;
}

export interface PersonaDTO {
  idPersona: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  telefono: string;
  fcNacimiento: string | null;
  dni: string;
}

export interface CatalogosValores {
  idValor: number;
}