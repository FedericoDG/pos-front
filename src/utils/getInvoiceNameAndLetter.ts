export const getInvoiceNameAndLetter = (num: number) => {
  switch (num) {
    case 1:
      return 'FA';
    case 3:
      return 'NA';
    case 6:
      return 'FB';
    case 8:
      return 'NB';
    case 11:
      return 'FC';
    case 13:
      return 'NC';
    case 51:
      return 'FM';
    case 53:
      return 'NM';
    default:
      return 'X';
  }
};
