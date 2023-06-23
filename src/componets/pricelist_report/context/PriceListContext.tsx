import { Dispatch, createContext } from 'react';

interface Step {
  title: string;
  description: string;
}

interface PriceListContext {
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  priceListsList: number[];
  productList: number[];
  setPriceListsList: Dispatch<React.SetStateAction<number[]>>;
  setProductList: Dispatch<React.SetStateAction<number[]>>;
  setWarehousesList: Dispatch<React.SetStateAction<number[]>>;
  steps: Step[];
  warehousesList: number[];
}

export const priceListContext = createContext({} as PriceListContext);
