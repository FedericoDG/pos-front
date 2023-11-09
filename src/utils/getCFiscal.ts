export const getCFiscal = (num: number) => {
  switch (num) {
    case 1:
      return 'R.I.';
    case 2:
      return 'R.N.I.';
    case 3:
      return 'IVA No R.';
    case 4:
      return 'IVA S. Exc.';
    case 5:
      return 'C.F.';
    case 6:
      return 'R.M.';
    case 7:
      return 'S.N.C.';
    case 8:
      return 'P.D.E.';
    case 9:
      return 'C.D.E.';
    case 10:
      return 'IVA L.';
    case 11:
      return 'R.I. A.P';
    case 12:
      return 'P.C.E.';
    case 13:
      return 'M.E.';
    case 14:
      return 'P.C.E.S.';
    default:
      return 'X';
  }
};
