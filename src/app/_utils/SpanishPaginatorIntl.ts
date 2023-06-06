import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class SpanishPaginatorIntl  extends MatPaginatorIntl {
    override itemsPerPageLabel = 'Items por página';
    override nextPageLabel = 'Siguiente página';
    override previousPageLabel = 'Página anterior';
    override firstPageLabel = 'Primera página';
    override lastPageLabel = 'Última página';
}
