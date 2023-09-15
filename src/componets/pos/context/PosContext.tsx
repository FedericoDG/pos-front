import { Dispatch, SetStateAction, createContext } from 'react';

import { Client, InvoceType, Pricelists, Product, Warehouse } from '../../../interfaces';

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
export interface SelectedInvoceType extends InvoceType {
  label: string;
  value: number | undefined;
}

export interface CartItem extends Product {
  price: number;
  quantity: number;
  tax: number;
  error: boolean;
  allow: boolean;
  hasDiscount: boolean;
  discount: number;
}

interface PosContext {
  activeStep: number;
  addItem: (product: CartItem) => void;
  cart: CartItem[];
  client: SelectedClient | null;
  emptyCart: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  invoceType: SelectedInvoceType | null;
  iva: boolean;
  priceList: SelectedPriceList | null;
  removeItem: (id: number) => void;
  setActiveStep: (index: number) => void;
  setClient: Dispatch<SetStateAction<SelectedClient | null>>;
  setInvoceType: Dispatch<SetStateAction<SelectedInvoceType | null>>;
  setIva: Dispatch<SetStateAction<boolean>>;
  setPriceList: Dispatch<SetStateAction<SelectedPriceList | null>>;
  setWarehouse: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  steps: Step[];
  totalCart: number;
  totalCartItems: number;
  updateCartWithError: (arr: number[]) => void;
  warehouse: SelectedWarehouse | null;
}

export const posContext = createContext({} as PosContext);
