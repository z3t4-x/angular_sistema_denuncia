
  
 export interface DenunciaSearch {
  fcAltaDenuncia: string;
  tipoDelito: number;
  fcHechos: string;
  nmDenuncia: string;
  fcPlazo: string;
  estadoDenuncia: number;
  nmExpedientePreparatoria: string;
  nmExpedienteInvPreliminar: string;
  investigador: number;
  tipoDocumento: number;
  fcIngresoDocumento: string;
  nmDocumento: string;
 // lstDenunciantes: any[];
 // lstDenunciados: any[];
}

export interface Investigador {
  idUsuario: number;
}

export interface CatalogosValores {
  idValor: number;
}