import * as XLSX from 'xlsx';

import { formatDate, formatDateAndHour } from '../../../utils';
import { CashRegister } from '../../../interfaces';

export const exportToexcel = (cashRegister: CashRegister) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [
    {
      A: 'Estado',
      B: 'Apertura',
      C: 'Monto Inicial',
      D: 'Ventas',
      E: 'Total A Rendir',
      F: 'Usuario',
    },
  ];

  tabla.push({
    A: cashRegister.isOpen ? 'abierta' : 'cerrada',
    B: formatDateAndHour(cashRegister.openingDate),
    C: cashRegister.initialBalance,
    D: cashRegister.finalBalance,
    E: cashRegister.initialBalance + cashRegister.finalBalance,
    F: `${cashRegister.user?.name} ${cashRegister.user?.lastname}`,
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Estado de Caja');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `estado_caja_${today}.xlsx`);
  }, 500);
};
