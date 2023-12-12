import * as XLSX from 'xlsx';

import { formatDate, formatDateAndHour } from '../../../utils';
import { CashRegister } from '../../../interfaces';

export const exportToexcel = (cashRegister: CashRegister) => {
  const libro = XLSX.utils.book_new();
  const hoja = XLSX.utils.json_to_sheet([]);

  const tabla: Record<string, any>[] = [];

  tabla.push({
    Estado: cashRegister.isOpen ? 'abierta' : 'cerrada',
    Apertura: formatDateAndHour(cashRegister.openingDate),
    ['Monto Inicial']: cashRegister.initialBalance,
    Ventas: cashRegister.finalBalance,
    ['Total a Rendir']: cashRegister.initialBalance + cashRegister.finalBalance,
    Usuario: `${cashRegister.user?.name} ${cashRegister.user?.lastname}`,
  });

  XLSX.utils.sheet_add_json(hoja, tabla);
  XLSX.utils.book_append_sheet(libro, hoja, 'Estado de Caja');

  const today = formatDate(new Date().toString());

  setTimeout(() => {
    XLSX.writeFile(libro, `estado_caja_${today}.xlsx`);
  }, 500);
};
