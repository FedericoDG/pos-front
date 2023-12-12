import { ReactNode, useContext, useMemo, useState, useCallback } from 'react';
import { useSteps } from '@chakra-ui/react';

import { CashMovementsDetail } from '../../../interfaces';

import { posContext, SelectedInvoceType } from '.';

interface Props {
  children: ReactNode;
}

export const PosProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CashMovementsDetail[]>([]);
  const [invoceType, setInvoceType] = useState<SelectedInvoceType | null>({} as SelectedInvoceType);

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

  const addItem = (product: CashMovementsDetail) => {
    setCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: Number(item.quantity) + Number(product.quantity),
              price: Number(product.price),
              tax: Number(product.tax),
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

  const subTotalCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * item.price, 0),
    [cart]
  );

  const totalIvaCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * item.price * item.tax, 0),
    [cart]
  );

  const totalCart = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity * (item.price + item.price * item.tax), 0),
    [cart]
  );

  const recalculateCart = useCallback(
    (num: number) => {
      const newCart: CashMovementsDetail[] = [];

      for (let i = 0; i < cart.length; i++) {
        const percent = (cart[i].quantity * cart[i].price) / subTotalCart;

        const element = { ...cart[i], price: cart[i].price + percent * num };

        newCart.push(element);
      }

      setCart(newCart);
    },
    [cart, subTotalCart]
  );

  const totalCartItems = useMemo(() => cart.length, [cart]);

  const steps = useMemo(() => [{ title: 'Paso 1', description: 'Editar comprobante' }], []);

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
      invoceType,
      removeItem,
      setActiveStep,
      setInvoceType,
      steps,
      totalCart,
      totalCartItems,
      updateCartWithError,
      subTotalCart,
      totalIvaCart,
      recalculateCart,
    }),
    [
      activeStep,
      cart,
      goToNext,
      goToPrevious,
      invoceType,
      recalculateCart,
      setActiveStep,
      steps,
      subTotalCart,
      totalCart,
      totalCartItems,
      totalIvaCart,
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
    invoceType,
    removeItem,
    setActiveStep,
    setInvoceType,
    steps,
    totalCart,
    totalCartItems,
    subTotalCart,
    totalIvaCart,
    recalculateCart,
  } = useContext(posContext);

  return {
    activeStep,
    addItem,
    cart,
    emptyCart,
    goToNext,
    goToPrevious,
    invoceType,
    removeItem,
    setActiveStep,
    setInvoceType,
    steps,
    totalCart,
    totalCartItems,
    subTotalCart,
    totalIvaCart,
    recalculateCart,
  };
};
