import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Purchase } from '../../../interfaces';

export const exportToexcel = (products: Purchase[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  products?.forEach((el) => {
    tabla.push({
      Fecha: el.createdAt,
      Proveedor: el.supplier?.name,
      Transporte: el.transport,
      Chofer: el.driver,
      ['Depósito']: el.warehouse?.code,
      Usuario: `${el.user?.name} ${el.user?.lastname}`,
      Total: el.total,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Compras');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `compras_${today}.xlsx`);
  }, 500);
};
