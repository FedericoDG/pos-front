export const sessionStorage = {
  write: (key: string, value: Record<string, any>) =>
    window.sessionStorage.setItem(key, JSON.stringify(value)),
  read: (key: string) => {
    const value = window.sessionStorage.getItem(key);

    if (typeof value === 'string') {
      return JSON.parse(value);
    }
  },
  remove: (key: string) => window.sessionStorage.removeItem(key),
};
