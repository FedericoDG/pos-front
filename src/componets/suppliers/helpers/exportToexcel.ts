import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Supplier } from '../../../interfaces';

export const exportToexcel = (products: Supplier[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'CUIT',
      B: 'Razón Social',
      C: 'Email',
      D: 'Teléfono',
      E: 'Celular',
      F: 'Dirección',
    },
  ];

  products?.forEach((el) => {
    tabla.push({
      A: el.cuit,
      B: el.name,
      C: el.email,
      D: el.phone,
      E: el.mobile,
      F: el.address,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Proveedores');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `proveedores_${today}.xlsx`);
  }, 500);
};
