import { Persona } from "./persona";
import { CatalogosValores } from "./catalogosValores";

export class DenunciaPersona{

    idDenunciaPersona: number;
    persona: Persona;
    idDenuncia: number;
    fcAlta: Date;
    tipoPersona: CatalogosValores[];
    itBaja: string;
}
