const formatCurrency = (number: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(number);

export const formatTwoDigits = (number: number) =>
  new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  }).format(number);

export default formatCurrency;
