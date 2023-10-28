export const getInvoiceName = (num: number) => {
  switch (num) {
    case 1:
      return 'FACTURA';
    case 3:
      return 'NOTA DE CRÉDITO';
    case 6:
      return 'FACTURA';
    case 8:
      return 'NOTA DE CRÉDITO';
    case 11:
      return 'FACTURA';
    case 13:
      return 'NOTA DE CRÉDITO';
    case 51:
      return 'FACTURA';
    case 53:
      return 'NOTA DE CRÉDITO';
    default:
      return 'NOTA DE CRÉDITO';
  }
};
