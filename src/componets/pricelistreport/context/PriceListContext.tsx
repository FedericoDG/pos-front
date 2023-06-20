import { Dispatch, createContext } from 'react';

interface Step {
  title: string;
  description: string;
}

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

export const priceListContext = createContext({} as PriceListContext);
