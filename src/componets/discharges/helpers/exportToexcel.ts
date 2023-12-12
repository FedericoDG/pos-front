import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Discharge } from '../../../interfaces';

export const exportToexcel = (products: Discharge[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  products?.forEach((el) => {
    tabla.push({
      Fecha: el.createdAt,
      ['Pérdida']: el.cost,
      ['Depósito']: el.warehouses?.code,
      Usuario: `${el.user?.name} ${el.user?.lastname}`,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Bajas-Pérdidas');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `bajas_productos_${today}.xlsx`);
  }, 500);
};
