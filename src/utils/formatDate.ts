export const formatDate = (date = '01-01-1990') =>
  `${new Intl.DateTimeFormat('es', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date))}`;

export const formatENDate = (date: Date) => new Date(date).toISOString().split('T')[0];
