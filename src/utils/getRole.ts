export const getRole = (role: string) => {
  if (role === 'SUPERADMIN') return 'Súper Administrador';
  if (role === 'ADMIN') return 'Administrador';
  if (role === 'SELLER') return 'Vendedor';
  if (role === 'DRIVER') return 'Chofer';
  if (role === 'USER') return 'Usuario';
};
