import { createContext } from 'react';

import { Stock2 } from '../../../interfaces';

export interface CartItem extends Stock2 {
  cost: number;
}

interface CostsContext {
  addItem: (product: CartItem) => void;
  cart: CartItem[];
  emptyCart: () => void;
  removeItem: (id: number) => void;
  totalCartItems: number;
}

export const costsContext = createContext({} as CostsContext);
