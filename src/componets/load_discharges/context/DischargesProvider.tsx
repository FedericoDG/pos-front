import { ReactNode, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { CartItem, SelectedWarehouse, dischargesContext } from '.';

interface Props {
  children: ReactNode;
}

export const DischargesProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [warehouse, setWarehouse] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);

  const addItem = (product: CartItem) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
              cost: product.cost,
              reasonId: product.reasonId,
              info: product.info,
            };
          }

          return item;
        });

        return updatedItems;
      }

      return [{ ...product }, ...currentItems];
    });
  };

  const removeItem = (id: number) => {
    return setCart((currentItems) => [...currentItems.filter((item) => item.productId !== id)]);
  };

  const emptyCart = () => {
    return setCart([]);
  };

  const totalCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * item.cost, 0),
    [cart]
  );

  const totalCartItems = useMemo(() => cart.length, [cart]);

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Depósito' },
      { title: 'Paso 2', description: 'Cargar Pérdida de Stock' },
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
      steps,
      totalCart,
      totalCartItems,
      warehouse,
    }),
    [
      activeStep,
      cart,
      goToNext,
      goToPrevious,
      setActiveStep,
      steps,
      totalCart,
      totalCartItems,
      warehouse,
    ]
  );

  return <dischargesContext.Provider value={values}>{children}</dischargesContext.Provider>;
};

export const useDischargesContext = () => {
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
    steps,
    totalCart,
    totalCartItems,
    warehouse,
  } = useContext(dischargesContext);

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
    steps,
    totalCart,
    totalCartItems,
    warehouse,
  };
};
