import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Product } from '../../../interfaces';

export const exportToexcel = (products: Product[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  products?.forEach((el) => {
    tabla.push({
      Nombre: el.name,
      ['Código']: el.code,
      Stock: el.stocks?.reduce((acc, el) => acc + el.stock, 0) || 0,
      Costo: el?.costs ? el.costs[0] : 0,
      Estado: el.status === 'ENABLED' ? 'HABILITADO' : 'NO HABILITADO',
      ['Stock Negativo']: el.allownegativestock === 'ENABLED' ? 'HABILITADO' : 'NO HABILITADO',
      ['Alerta Stock Bajo']: el.alertlowstock === 'ENABLED' ? 'HABILITADO' : 'NO HABILITADO',
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `ingresos_${today}.xlsx`);
  }, 500);
};
