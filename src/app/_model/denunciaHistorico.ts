export interface RequestDenunciaHistorico {
  denuncia: Denuncia;
  fcAltaDenuncia: string;
  tipoDelito: CatalogosValores;
  fcHechos: string;
  investigador: Investigador;
  numDenuncia: string;
  fcPlazo: string;
  estadoExpediente: CatalogosValores;
  tipoDocumento: CatalogosValores;
  fcIngresoDocumento: string;
  numDocumento: string;
  descripcion: string;
  cdExpedientePreparatoria: string;
  cdExpedientePreliminar: string;
  cdUsuAlta: string;
  cdUsuModif:string;
  fcModifFila: string;
  
}

export interface Investigador {
  idUsuario: number;
  nombre: string;
  apellido: string;
}

export interface CatalogosValores {
  idValor: number;
  dsValor: string;
  cdCodigo : string
}

interface Denuncia {
  idDenuncia: number;
}