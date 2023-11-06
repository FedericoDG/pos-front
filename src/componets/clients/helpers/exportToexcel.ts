import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Client } from '../../../interfaces';

export const exportToexcel = (products: Client[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Nombre',
      B: 'Identificación',
      C: 'Número',
      D: 'Email',
      E: 'Teléfono',
      F: 'Celular',
    },
  ];

  products?.forEach((el) => {
    tabla.push({
      A: el.name,
      B: el.identification?.description,
      C: el.document,
      D: el.email,
      E: el.phone,
      F: el.mobile,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Clientes');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `clientes_${today}.xlsx`);
  }, 500);
};
