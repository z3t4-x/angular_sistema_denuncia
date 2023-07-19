
//import { CatalogosValores } from "./catalogosValores";
//import { CatalogosValores } from "./catalogosValores";
import { Catalogos } from "./catalogos";
import { DenunciaPersona } from "./denunciaPersona";
import { Usuario } from "./usuario";


export class Denuncia {

    idDenuncia: number;
    CatalogosValores: CatalogosValores;
    mesaParte: CatalogosValores;
    tipoDelito: CatalogosValores;
    fcHechos: string;
    nmDenuncia:string;
    estadoDenuncia: CatalogosValores;
    fcAltaDenuncia: string;
    fcPlazo: string;
    auxiliar: CatalogosValores;
    fiscalia: CatalogosValores;
    investigador: UsuarioDTO;
    dsDescripcion: string;
    tipoDocumento: CatalogosValores;
    fcIngresoDocumento: string;
    nmDocumento: string;
    lstDenunciantes: DenunciaPersona[] ;
    lstDenunciados: DenunciaPersona[];
    diasRestantes: number;
    nmExpedientePreparatoria: string;
    nmExpedienteInvPreliminar: string;
    fcAltaFila: string;
    cdUsuAlta: string;
    fcModifFila: string;
    cdUsuModif: string;
    estadoExpedienteEtapa: CatalogosValores;
    fcProrroga?: string;
    nmArchivo?:string;
    linkFile?:string;
    anaquel? : number| null;
    banda? :  number | null;
    paquete? : number | null;
    codigoArchivo?: string | null;

}

 export interface RequestDenuncia {
  //CatalogosValores: CatalogosValores;
  //mesaParte: CatalogosValores;
  //idDenuncia: number
  tipoDelito: CatalogosValores;
  fcHechos: string;
  investigador: UsuarioDTO;
  fiscalia: CatalogosValores;
  mesaParte: CatalogosValores;
  dsDescripcion: string;
  tipoDocumento: CatalogosValores;
  fcIngresoDocumento: string;
  nmDocumento: string;
  lstDenunciantes: LstDenunciante[];
  lstDenunciados: LstDenunciado[];
  linkFile?:string | null;
  nmArchivo?:string | null;
  anaquel? : number| null;
  banda? :  number | null;
  paquete? : number | null;
  codigoArchivo?: string | null;
 // estadoDenuncia: CatalogosValores;

}

export interface LstDenunciado {
  personaDTO: PersonaDTO;
  genero: CatalogosValores;
  tipoIdentificacion: CatalogosValores;
  grado: CatalogosValores;
  itBaja: string;
}

export interface LstDenunciante {
  personaDTO: PersonaDTO;
  genero: CatalogosValores;
  tipoIdentificacion: CatalogosValores;
  grado: CatalogosValores;
  itBaja: string;
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
  dsValor: string;
  cdCodigo: string;
}

export interface UsuarioDTO {
  idUsuario: number;
  nombre: string;
  apellido: string;
}
