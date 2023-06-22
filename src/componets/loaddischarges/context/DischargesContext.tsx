import { Dispatch, SetStateAction, createContext } from 'react';

import { Stock2, Warehouse } from '../../../interfaces';

interface Step {
  title: string;
  description: string;
}

export interface SelectedWarehouse extends Warehouse {
  value: number | undefined;
  label: string;
}

export interface CartItem extends Stock2 {
  reasonId: number;
  quantity: number;
  cost: number;
  info: string;
}

interface DischargesContext {
  cart: CartItem[];
  warehouse: SelectedWarehouse | null;
  setWarehouse: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  addItem: (product: CartItem) => void;
  removeItem: (id: number) => void;
  emptyCart: () => void;
  totalCart: number;
  totalCartItems: number;
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  steps: Step[];
  setActiveStep: (index: number) => void;
}

export const dischargesContext = createContext({} as DischargesContext);
