import { ReactNode, useContext, useMemo, useState } from 'react';

import { Supplier, Warehouse } from '../../../interfaces';

import { ProductAndAmout, purchasesContext } from '.';

interface Props {
  children: ReactNode;
}

export const PurchasesProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<ProductAndAmout[]>([]);
  const [supplier, setSupplier] = useState<Supplier>({} as Supplier);
  const [warehouse, setWarehouse] = useState<Warehouse>({} as Warehouse);

  const values = useMemo(
    () => ({
      cart,
      supplier,
      warehouse,
      setCart,
      setSupplier,
      setWarehouse,
    }),
    [cart, supplier, warehouse]
  );

  return <purchasesContext.Provider value={values}>{children}</purchasesContext.Provider>;
};

export const usePriceListContext = () => {
  const { cart, supplier, warehouse, setCart, setSupplier, setWarehouse } =
    useContext(purchasesContext);

  return {
    cart,
    supplier,
    warehouse,
    setCart,
    setSupplier,
    setWarehouse,
  };
};
