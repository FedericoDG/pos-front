import { Dispatch, SetStateAction, createContext } from 'react';

import { Product, Supplier, Warehouse } from '../../../interfaces';

interface Step {
  description: string;
  title: string;
}
export interface ProductAndAmout extends Product {
  amount: number;
}

export interface SelectedSupplier extends Supplier {
  label: string;
  value: number | undefined;
}
export interface SelectedWarehouse extends Warehouse {
  label: string;
  value: number | undefined;
}

export interface CartItem extends Product {
  price: number;
  quantity: number;
}

interface PurchasesContext {
  activeStep: number;
  addItem: (product: Product, quantity: number, price: number) => void;
  cart: CartItem[];
  driver: string;
  emptyCart: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  removeItem: (id: number) => void;
  setActiveStep: (index: number) => void;
  setDriver: Dispatch<SetStateAction<string>>;
  setSupplier: Dispatch<SetStateAction<SelectedSupplier | null>>;
  setTransport: Dispatch<SetStateAction<string>>;
  setWarehouse: Dispatch<SetStateAction<SelectedWarehouse | null>>;
  steps: Step[];
  supplier: SelectedSupplier | null;
  totalCart: number;
  totalCartItems: number;
  transport: string;
  warehouse: SelectedWarehouse | null;
}

export const purchasesContext = createContext({} as PurchasesContext);
