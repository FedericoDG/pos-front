import { ReactNode, useContext, useMemo, useState, useCallback } from 'react';
import { useSteps } from '@chakra-ui/react';

import { CartItem, SelectedClient, SelectedWarehouse, SelectedPriceList, posContext } from '.';

interface Props {
  children: ReactNode;
}

export const PosProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [client, setClient] = useState<SelectedClient | null>({} as SelectedClient);
  const [warehouse, setWarehouse] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);
  const [priceList, setPriceList] = useState<SelectedPriceList | null>({} as SelectedPriceList);

  const updateCartWithError = useCallback(
    (error: number[]) => {
      const updatedCart = cart.map((item) => {
        if (error.includes(item.id!)) {
          return {
            ...item,
            error: true,
          };
        }

        return item;
      });

      setCart(updatedCart);
    },
    [cart]
  );

  const addItem = (product: CartItem) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: Number(item.quantity) + Number(product.quantity),
              price: Number(product.price),
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

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Lista de Precio, Depósito y Cliente' },
      { title: 'Paso 2', description: 'Agregar Productos' },
      { title: 'Paso 3', description: 'Finalizar Venta' },
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
      client,
      setClient,
      priceList,
      setPriceList,
      updateCartWithError,
    }),
    [
      activeStep,
      cart,
      client,
      goToNext,
      goToPrevious,
      priceList,
      setActiveStep,
      steps,
      totalCart,
      totalCartItems,
      warehouse,
      updateCartWithError,
    ]
  );

  return <posContext.Provider value={values}>{children}</posContext.Provider>;
};

export const usePosContext = () => {
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
    client,
    setClient,
    priceList,
    setPriceList,
    updateCartWithError,
  } = useContext(posContext);

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
    client,
    setClient,
    priceList,
    setPriceList,
    updateCartWithError,
  };
};
