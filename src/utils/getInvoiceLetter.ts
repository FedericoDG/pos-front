export const getInvoiceLetter = (num: number) => {
  switch (num) {
    case 1:
      return 'A';
    case 3:
      return 'A';
    case 6:
      return 'B';
    case 8:
      return 'B';
    case 11:
      return 'C';
    case 13:
      return 'C';
    case 51:
      return 'M';
    case 53:
      return 'M';
    default:
      return 'X';
  }
};
