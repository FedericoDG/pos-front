/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useContext, useMemo, useState } from 'react';

import { Product } from '../../../interfaces';

import { CartItem, SelectedSupplier, SelectedWarehouse, purchasesContext } from '.';

interface Props {
  children: ReactNode;
}

export const PurchasesProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [supplier, setSupplier] = useState<SelectedSupplier | null>({} as SelectedSupplier);
  const [warehouse, setWarehouse] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);
  const [transport, setTransport] = useState('');
  const [driver, setDriver] = useState('');

  const addItem = (product: Product, quantity: number, price: number) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + quantity, price };
          }

          return item;
        });

        return updatedItems;
      }

      return [...currentItems, { ...product, quantity, price }];
    });
  };

  const removeItem = (id: number) => {
    return setCart((currentItems) => [...currentItems.filter((item) => item.id !== id)]);
  };

  const emptyCart = () => {
    return setCart([]);
  };

  const totalCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [cart]
  );

  const totalCartItems = useMemo(() => cart.length, [cart]);

  const values = useMemo(
    () => ({
      cart,
      supplier,
      warehouse,
      transport,
      driver,
      setSupplier,
      setWarehouse,
      setTransport,
      setDriver,
      addItem,
      removeItem,
      emptyCart,
      totalCart,
      totalCartItems,
    }),
    [cart, supplier, warehouse]
  );

  return <purchasesContext.Provider value={values}>{children}</purchasesContext.Provider>;
};

export const usePurchaseContext = () => {
  const {
    cart,
    supplier,
    warehouse,
    transport,
    driver,
    setSupplier,
    setWarehouse,
    setTransport,
    setDriver,
    addItem,
    removeItem,
    emptyCart,
    totalCart,
    totalCartItems,
  } = useContext(purchasesContext);

  return {
    cart,
    supplier,
    warehouse,
    transport,
    driver,
    setSupplier,
    setWarehouse,
    setTransport,
    setDriver,
    addItem,
    removeItem,
    emptyCart,
    totalCart,
    totalCartItems,
  };
};
