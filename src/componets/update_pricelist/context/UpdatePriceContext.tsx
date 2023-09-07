import { Dispatch, SetStateAction, createContext } from 'react';

import { Pricelists, ProductWithPrice } from '../../../interfaces';

interface Step {
  description: string;
  title: string;
}

export interface SelectedPriceList extends Pricelists {
  label: string;
  value: number | undefined;
}

export interface CartItem extends ProductWithPrice {
  newPrice: number;
}

interface UpdatePriceContext {
  activeStep: number;
  addItem: (product: CartItem) => void;
  cart: CartItem[];
  emptyCart: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  priceList: SelectedPriceList | null;
  removeItem: (id: number) => void;
  setActiveStep: (index: number) => void;
  setPriceList: Dispatch<SetStateAction<SelectedPriceList | null>>;
  steps: Step[];
  totalCartItems: number;
}

export const UpdatePriceContext = createContext({} as UpdatePriceContext);
