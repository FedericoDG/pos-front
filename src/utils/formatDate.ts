export const formatDate = (date = '01-01-1990') =>
  `${new Intl.DateTimeFormat('es', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date))}`;

export const formatDateAndHour = (date = '01-01-1990') =>
  `${new Intl.DateTimeFormat('es', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))} hs.`;

export const formatENDate = (date: Date) => new Date(date).toISOString().split('T')[0];
