import { Persona } from "./persona";
import { CatalogosValores } from "./catalogosValores";
//import { Denuncia } from "./denuncia";
import { DenunciaPersonaPK } from "./denunciaPersonaPK";
import { Denuncia } from "./denuncia";

export class DenunciaPersona{

    denunciaPersonaPK: DenunciaPersonaPK;
    persona: Persona;
    denuncia: Denuncia;
    fcAlta: Date;
    tipoPersona: CatalogosValores[];

}