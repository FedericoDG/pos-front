import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Client } from '../../../interfaces';

export const exportToexcel = (products: Client[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  products?.forEach((el) => {
    tabla.push({
      Nombre: el.name,
      ['Identificación']: el.identification?.description,
      ['Número']: el.document,
      Email: el.email,
      ['Teléfono']: el.phone,
      Celular: el.mobile,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Clientes');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `clientes_${today}.xlsx`);
  }, 500);
};
