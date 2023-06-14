import { Dispatch, createContext } from 'react';

import { Product } from '../../../interfaces';
import { Supplier, Warehouse } from '../../../interfaces/interfaces';

export interface ProductAndAmout extends Product {
  amount: number;
}

interface PurchasesContext {
  cart: ProductAndAmout[];
  supplier: Supplier;
  warehouse: Warehouse;
  setCart: Dispatch<React.SetStateAction<ProductAndAmout[]>>;
  setSupplier: Dispatch<React.SetStateAction<Supplier>>;
  setWarehouse: Dispatch<React.SetStateAction<Warehouse>>;
}

export const purchasesContext = createContext({} as PurchasesContext);
