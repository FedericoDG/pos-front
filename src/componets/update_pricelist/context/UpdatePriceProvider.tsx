import { ReactNode, useContext, useMemo, useState } from 'react';
import { useSteps } from '@chakra-ui/react';

import { CartItem, SelectedPriceList, UpdatePriceContext } from '.';

interface Props {
  children: ReactNode;
}

export const UpdatePriceProvider = ({ children }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [priceList, setPriceList] = useState<SelectedPriceList | null>({} as SelectedPriceList);

  const addItem = (product: CartItem) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              newPrice: Number(product.price),
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

  const totalCartItems = useMemo(() => cart.length, [cart]);

  const steps = useMemo(
    () => [
      { title: 'Paso 1', description: 'Lista de Precio' },
      { title: 'Paso 2', description: 'Agregar Productos' },
      { title: 'Paso 3', description: 'Finalizar Actualización' },
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
      isDisabled,
      priceList,
      removeItem,
      setActiveStep,
      setIsDisabled,
      setPriceList,
      steps,
      totalCartItems,
    }),
    [
      activeStep,
      cart,
      goToNext,
      goToPrevious,
      isDisabled,
      priceList,
      setActiveStep,
      steps,
      totalCartItems,
    ]
  );

  return <UpdatePriceContext.Provider value={values}>{children}</UpdatePriceContext.Provider>;
};

export const useUpdatePriceContext = () => {
  const {
    activeStep,
    addItem,
    cart,
    emptyCart,
    goToNext,
    goToPrevious,
    isDisabled,
    priceList,
    removeItem,
    setActiveStep,
    setIsDisabled,
    setPriceList,
    steps,
    totalCartItems,
  } = useContext(UpdatePriceContext);

  return {
    activeStep,
    addItem,
    cart,
    emptyCart,
    goToNext,
    goToPrevious,
    isDisabled,
    priceList,
    removeItem,
    setActiveStep,
    setIsDisabled,
    setPriceList,
    steps,
    totalCartItems,
  };
};
