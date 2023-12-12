import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { CashRegister } from '../../../interfaces';

export const exportToexcel = (products: CashRegister[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  products?.forEach((el) => {
    tabla.push({
      Estado: el.isOpen ? 'abierta' : 'cerrada',
      Apertura: el.openingDate,
      Cierre: el.closingDate,
      ['Monto Inicial']: el.initialBalance,
      Ventas: el.finalBalance,
      ['Total a Rendir']: el.initialBalance + el.finalBalance,
      Usuario: `${el.user?.name} ${el.user?.lastname}`,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Cajas');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `cajas_${today}.xlsx`);
  }, 500);
};
