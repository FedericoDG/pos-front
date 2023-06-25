import { ReactNode, useContext, useMemo, useState } from 'react';

import { CartItem, costsContext } from '.';

interface Props {
  children: ReactNode;
}

export const CostsProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addItem = (product: CartItem) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              cost: product.cost,
            };
          }

          return item;
        });

        return updatedItems;
      }

      return [...currentItems, { ...product }];
    });
  };

  const removeItem = (id: number) => {
    return setCart((currentItems) => [...currentItems.filter((item) => item.productId !== id)]);
  };

  const emptyCart = () => {
    return setCart([]);
  };

  const totalCartItems = useMemo(() => cart.length, [cart]);

  const values = useMemo(
    () => ({
      addItem,
      cart,
      emptyCart,
      removeItem,
      totalCartItems,
    }),
    [cart, totalCartItems]
  );

  return <costsContext.Provider value={values}>{children}</costsContext.Provider>;
};

export const useCostsContext = () => {
  const { addItem, cart, emptyCart, removeItem, totalCartItems } = useContext(costsContext);

  return {
    addItem,
    cart,
    emptyCart,
    removeItem,
    totalCartItems,
  };
};
