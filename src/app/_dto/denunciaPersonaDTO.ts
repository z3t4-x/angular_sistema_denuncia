import { CatalogosValores } from "../_model/catalogosValores";
import { DenunciaDTO } from "./denunciaDTO";
import { PersonaDTO } from "./personaDTO";


export class DenunciaPersonaDTO{


    personaDTO: PersonaDTO;
    denunciaDTO: DenunciaDTO;
    fcAlta: Date;
    tipoPersona: CatalogosValores[];

}