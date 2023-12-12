import { Dispatch, SetStateAction, createContext } from 'react';

import {
  Client,
  InvoceType,
  Pricelists,
  CashMovementsDetail,
  Warehouse,
} from '../../../interfaces';

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

interface PosContext {
  activeStep: number;
  addItem: (product: CashMovementsDetail) => void;
  cart: CashMovementsDetail[];
  emptyCart: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  invoceType: SelectedInvoceType | null;
  removeItem: (id: number) => void;
  setActiveStep: (index: number) => void;
  setInvoceType: Dispatch<SetStateAction<SelectedInvoceType | null>>;
  steps: Step[];
  subTotalCart: number;
  totalCart: number;
  totalIvaCart: number;
  totalCartItems: number;
  recalculateCart: (num: number) => void;
}

export const posContext = createContext({} as PosContext);
