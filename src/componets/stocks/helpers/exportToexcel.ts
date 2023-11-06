import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { Stock2, Warehouse } from '../../../interfaces';

interface Fede {
  stocks: Stock2[];
  warehouses: Warehouse[];
}

export const exportToexcel = (cosas: Fede) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Nombre',
      B: 'Código',
      C: 'Código de Barra',
      D: 'Stock Total',
      E: `Stock ${cosas.warehouses[0].code}`,
      F: `Stock ${cosas.warehouses[0].code}`,
      G: 'Costo',
    },
  ];

  cosas.stocks?.forEach((el) => {
    tabla.push({
      A: el.products.name,
      B: el.products.code,
      C: el.products.barcode,
      D: el.stock,
      E: el.products?.stocks![0].stock,
      F: el.products?.stocks![1].stock,
      G: el.products?.costs![0].price,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Stock');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `stock_${today}.xlsx`);
  }, 500);
};
