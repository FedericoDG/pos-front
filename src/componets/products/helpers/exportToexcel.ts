import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Product } from '../../../interfaces';

export const exportToexcel = (products: Product[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Nombre',
      B: 'Código',
      C: 'Stock',
      D: 'Costo',
      E: 'Estado',
      F: 'Stock Negativo',
      G: 'Alerta Stock Bajo',
    },
  ];

  products?.forEach((el) => {
    tabla.push({
      A: el.name,
      B: el.code,
      C: el.stocks?.reduce((acc, el) => acc + el.stock, 0) || 0,
      D: el?.costs ? el.costs[0] : 0,
      E: el.status === 'ENABLED' ? 'HABILITADO' : 'NO HABILITADO',
      F: el.allownegativestock === 'ENABLED' ? 'HABILITADO' : 'NO HABILITADO',
      G: el.alertlowstock === 'ENABLED' ? 'HABILITADO' : 'NO HABILITADO',
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `ingresos_${today}.xlsx`);
  }, 500);
};
