export const sessionStorage = {
  write: (key: string, value: Record<string, any>) =>
    window.localStorage.setItem(key, JSON.stringify(value)),
  read: (key: string) => {
    const value = window.localStorage.getItem(key);

    if (typeof value === 'string') {
      return JSON.parse(value);
    }
  },
  remove: (key: string) => window.localStorage.removeItem(key),
  write2: (key: string, value: string) => window.localStorage.setItem(key, JSON.stringify(value)),
};
