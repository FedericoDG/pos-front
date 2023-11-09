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

  const tabla: Record<string, any>[] = [];

  cosas.stocks?.forEach((el) => {
    tabla.push({
      Nombre: el.products.name,
      ['Código']: el.products.code,
      ['Código de Barra']: el.products.barcode,
      ['Stock Total']: el.stock,
      [`Stock ${cosas.warehouses[0].code}`]: el.products?.stocks![0].stock,
      [`Stock ${cosas.warehouses[1].code}`]: el.products?.stocks![1].stock,
      Costo: el.products?.costs![0].price,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Stock');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `stock_${today}.xlsx`);
  }, 500);
};
