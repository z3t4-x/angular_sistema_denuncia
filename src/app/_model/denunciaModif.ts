import { Usuario } from "./usuario";



export interface RequestDenunciaModif {
  idDenuncia: number;
  fcAltaDenuncia: string;
  tipoDelito: CatalogosValores;
  fcHechos: string;
 // auxiliar: CatalogosValores;
  nmDenuncia: string;
  fcPlazo: string;
  estadoDenuncia: CatalogosValores;
  dsDescripcion: string;
  tipoDocumento: CatalogosValores;
  fcIngresoDocumento: string;
  nmDocumento: string;
  nmExpedientePreparatoria?: any;
  nmExpedienteInvPreliminar?: any;
  lstDenunciantes: LstDenunciante[];
  lstDenunciados: LstDenunciado[];
  investigador: UsuarioDTO;
  fiscalia: CatalogosValores;
  mesaParte: CatalogosValores;
  fcAltaFila: string;
  cdUsuAlta: string;
  fcModifFila: string;
  cdUsuModif: string;
  estadoExpedienteEtapa: CatalogosValores;
  fcProrroga ?:string | null;
}

export interface LstDenunciado {
    idDenunciaPersona: number;
    idDenuncia: number;
    personaDTO: PersonaDTO;
    genero: CatalogosValores;
    tipoIdentificacion: CatalogosValores;
    grado: CatalogosValores;
}

export interface LstDenunciante {
    idDenunciaPersona: number;
    idDenuncia: number;
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

export interface UsuarioDTO {
  idUsuario: number;
  nombre:string;
  apellido:string;
}
