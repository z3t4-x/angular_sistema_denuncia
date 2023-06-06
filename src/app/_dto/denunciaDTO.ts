import { CatalogosValores } from "../_model/catalogosValores";
import { DenunciaPersonaDTO } from "./denunciaPersonaDTO";

export class DenunciaDTO {

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
    lstDenunciantes: DenunciaPersonaDTO[] ;
    lstDenunciados: DenunciaPersonaDTO[];
    diasRestantes: number;
    nmExpedientePreparatoria: string;
    nmExpedienteInvPreliminar: string;

}