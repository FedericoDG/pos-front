import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Transfer } from '../../../interfaces';

export const exportToexcel = (products: Transfer[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Fecha',
      B: 'Depósito de Origen',
      C: 'Depósito de Destino',
      D: 'Usuario',
    },
  ];

  products?.forEach((el) => {
    tabla.push({
      A: el.createdAt,
      B: el.warehouseOrigin.code,
      C: el.warehouseDestination.code,
      D: `${el.user?.name} ${el.user?.lastname}`,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Transferencias');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `transferencia_${today}.xlsx`);
  }, 500);
};
