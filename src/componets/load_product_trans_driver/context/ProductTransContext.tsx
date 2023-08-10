import { Dispatch, SetStateAction, createContext } from 'react';

import { Stock2, Warehouse } from '../../../interfaces';

interface Step {
  description: string;
  title: string;
}

export interface SelectedWarehouse extends Warehouse {
  label: string;
  value: number | undefined;
}

export interface CartItem extends Stock2 {
  quantity: number;
}

interface ProductTransContext {
  activeStep: number;
  addItem: (product: CartItem) => void;
  cart: CartItem[];
  emptyCart: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  removeItem: (id: number) => void;
  setActiveStep: (index: number) => void;
  setWarehouse: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  setWarehouse2: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  steps: Step[];
  totalCartItems: number;
  warehouse: SelectedWarehouse | null;
  warehouse2: SelectedWarehouse | null;
}

export const productTransContext = createContext({} as ProductTransContext);
