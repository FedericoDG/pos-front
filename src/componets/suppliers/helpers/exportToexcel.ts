import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Supplier } from '../../../interfaces';

export const exportToexcel = (products: Supplier[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  products?.forEach((el) => {
    tabla.push({
      CUIT: el.cuit,
      ['Razón Social']: el.name,
      Email: el.email,
      ['Teléfono']: el.phone,
      Celular: el.mobile,
      ['Dirección']: el.address,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Proveedores');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `proveedores_${today}.xlsx`);
  }, 500);
};
