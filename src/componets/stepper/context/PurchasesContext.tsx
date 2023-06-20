import { Dispatch, SetStateAction, createContext } from 'react';

import { Product, Supplier, Warehouse } from '../../../interfaces';

interface Step {
  title: string;
  description: string;
}
export interface ProductAndAmout extends Product {
  amount: number;
}

export interface SelectedSupplier extends Supplier {
  value: number | undefined;
  label: string;
}
export interface SelectedWarehouse extends Warehouse {
  value: number | undefined;
  label: string;
}

export interface CartItem extends Product {
  quantity: number;
  price: number;
}

interface PurchasesContext {
  cart: CartItem[];
  supplier: SelectedSupplier | null;
  warehouse: SelectedWarehouse | null;
  transport: string;
  driver: string;
  setSupplier: Dispatch<SetStateAction<SelectedSupplier | null>>;
  setWarehouse: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  setTransport: Dispatch<SetStateAction<string>>;
  setDriver: Dispatch<SetStateAction<string>>;
  addItem: (product: Product, quantity: number, price: number) => void;
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

export const purchasesContext = createContext({} as PurchasesContext);
