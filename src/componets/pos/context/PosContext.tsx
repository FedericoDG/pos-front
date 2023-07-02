import { Dispatch, SetStateAction, createContext } from 'react';

import { Client, Pricelists, Product, Warehouse } from '../../../interfaces';

interface Step {
  description: string;
  title: string;
}

export interface SelectedClient extends Client {
  label: string;
  value: number | undefined;
}

export interface SelectedWarehouse extends Warehouse {
  label: string;
  value: number | undefined;
}

export interface SelectedPriceList extends Pricelists {
  label: string;
  value: number | undefined;
}

export interface CartItem extends Product {
  price: number;
  quantity: number;
}

interface PosContext {
  activeStep: number;
  addItem: (product: CartItem) => void;
  cart: CartItem[];
  client: SelectedClient | null;
  emptyCart: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  priceList: SelectedPriceList | null;
  removeItem: (id: number) => void;
  setActiveStep: (index: number) => void;
  setClient: Dispatch<SetStateAction<SelectedClient | null>>;
  setPriceList: Dispatch<SetStateAction<SelectedPriceList | null>>;
  setWarehouse: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  steps: Step[];
  totalCart: number;
  totalCartItems: number;
  warehouse: SelectedWarehouse | null;
}

export const posContext = createContext({} as PosContext);
