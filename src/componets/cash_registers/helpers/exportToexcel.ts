import * as XLSX from 'xlsx';

import { formatDate } from '../../../utils';
import { CashRegister } from '../../../interfaces';

export const exportToexcel = (products: CashRegister[]) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Estado',
      B: 'Apertura',
      C: 'Cierre',
      D: 'Monto Inicial',
      E: 'Ventas',
      F: 'Total A Rendir',
      G: 'Usuario',
    },
  ];

  products?.forEach((el) => {
    tabla.push({
      A: el.isOpen ? 'abierta' : 'cerrada',
      B: el.openingDate,
      C: el.closingDate,
      D: el.initialBalance,
      E: el.finalBalance,
      F: el.initialBalance + el.finalBalance,
      G: `${el.user?.name} ${el.user?.lastname}`,
    });
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Cajas');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `cajas_${today}.xlsx`);
  }, 500);
};
