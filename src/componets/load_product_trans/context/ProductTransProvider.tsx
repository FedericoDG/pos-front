import { ReactNode, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { CartItem, SelectedWarehouse, productTransContext } from '.';

interface Props {
  children: ReactNode;
}

export const ProductTransProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [warehouse, setWarehouse] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);
  const [warehouse2, setWarehouse2] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);

  const addItem = (product: CartItem) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
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

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Depósitos' },
      { title: 'Paso 2', description: 'Transferencia de stock' },
    ],
    []
  );

  const { goToNext, goToPrevious, activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const values = useMemo(
    () => ({
      activeStep,
      addItem,
      cart,
      emptyCart,
      goToNext,
      goToPrevious,
      removeItem,
      setActiveStep,
      setWarehouse,
      setWarehouse2,
      steps,
      totalCartItems,
      warehouse,
      warehouse2,
    }),
    [
      activeStep,
      cart,
      goToNext,
      goToPrevious,
      setActiveStep,
      steps,
      totalCartItems,
      warehouse,
      warehouse2,
    ]
  );

  return <productTransContext.Provider value={values}>{children}</productTransContext.Provider>;
};

export const useProductTransContext = () => {
  const {
    activeStep,
    addItem,
    cart,
    emptyCart,
    goToNext,
    goToPrevious,
    removeItem,
    setActiveStep,
    setWarehouse,
    setWarehouse2,
    steps,
    totalCartItems,
    warehouse,
    warehouse2,
  } = useContext(productTransContext);

  return {
    activeStep,
    addItem,
    cart,
    emptyCart,
    goToNext,
    goToPrevious,
    removeItem,
    setActiveStep,
    setWarehouse,
    setWarehouse2,
    steps,
    totalCartItems,
    warehouse,
    warehouse2,
  };
};
