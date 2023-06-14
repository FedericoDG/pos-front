import { Dispatch, createContext } from 'react';

interface PriceListContext {
  productList: number[];
  priceListsList: number[];
  warehousesList: number[];
  setProductList: Dispatch<React.SetStateAction<number[]>>;
  setPriceListsList: Dispatch<React.SetStateAction<number[]>>;
  setWarehousesList: Dispatch<React.SetStateAction<number[]>>;
  activeStep: number;
  goToNext: () => void;
  goToPrevious: () => void;
  steps: Step[];
}

interface Step {
  title: string;
  description: string;
}

export const priceListContext = createContext({} as PriceListContext);
