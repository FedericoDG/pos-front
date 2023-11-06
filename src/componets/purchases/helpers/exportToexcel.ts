import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Purchase } from '../../../interfaces';

export const exportToexcel = (products: Purchase[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Fecha',
      B: 'Proveedor',
      C: 'Transporte',
      D: 'Chofer',
      E: 'Depósito',
      F: 'Usuario',
      G: 'Total',
    },
  ];

  products?.forEach((el) => {
    tabla.push({
      A: el.createdAt,
      B: el.supplier?.name,
      C: el.transport,
      D: el.driver,
      E: el.warehouse?.code,
      F: `${el.user?.name} ${el.user?.lastname}`,
      G: el.total,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Compras');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `compras_${today}.xlsx`);
  }, 500);
};
