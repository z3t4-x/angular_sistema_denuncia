import { Component, OnInit, Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestDenunciaHistorico } from 'src/app/_model/denunciaHistorico';
import { DenunciaService } from 'src/app/_service/denuncia.service';

@Component({
  selector: 'app-historico-dialog',
  templateUrl: './historico-dialog.component.html',
  styleUrls: ['./historico-dialog.component.css']
})
export class HistoricoDialogComponent implements OnInit {

  columnas: string[] = ['numDenuncia', 'estadoDenuncia', 'cdExpedientePreliminar', 'cdExpedientePreparatoria',  'fcHechos', 'investigador', 'tipoDocumento', 'fcIngresoDocumento', 'nmDocumento', 'cdUsuAlta','fcAltaDenuncia', 'cdUsuModif', 'fcModifFila', ];
  dataSource: RequestDenunciaHistorico[];

  constructor(
    private denunciaService: DenunciaService,
    public dialogRef: MatDialogRef<HistoricoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idDenuncia: number }
  ) { }

  ngOnInit(): void {
    this.obtenerHistorico();
  }

  obtenerHistorico(): void {
    this.denunciaService.obtenerHistoricoDenuncia(this.data.idDenuncia).subscribe((historico: RequestDenunciaHistorico[]) => {
      this.dataSource = historico;
      console.log("DATASOURCE => ", this.dataSource);
      
    });
  }
}

