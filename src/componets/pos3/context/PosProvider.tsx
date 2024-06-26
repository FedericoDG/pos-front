import { ReactNode, useContext, useMemo, useState, useCallback } from 'react';
import { useSteps } from '@chakra-ui/react';

import {
  CartItem,
  SelectedClient,
  SelectedWarehouse,
  SelectedPriceList,
  posContext,
  SelectedInvoceType,
} from '.';

interface Props {
  children: ReactNode;
}

export const PosProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [client, setClient] = useState<SelectedClient | null>({} as SelectedClient);
  const [invoceType, setInvoceType] = useState<SelectedInvoceType | null>({} as SelectedInvoceType);
  const [priceList, setPriceList] = useState<SelectedPriceList | null>({} as SelectedPriceList);
  const [warehouse, setWarehouse] = useState<SelectedWarehouse | null>({} as SelectedWarehouse);
  const [iva, setIva] = useState<boolean>(true);

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

  const subTotalCart = useMemo(
    () => cart.reduce((acc, item) => acc + (item.quantity * item.price - item.totalDiscount), 0),
    [cart]
  );

  const totalIvaCart = useMemo(
    () =>
      cart.reduce(
        (acc, item) => acc + (item.quantity * item.price - item.totalDiscount) * item.tax,
        0
      ),
    [cart]
  );

  const totalCart = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc + item.quantity * (item.price + item.price * item.tax) - item.totalDiscount,
        0
      ),
    [cart]
  );

  const recalculateCart = useCallback(
    (num: number) => {
      const newCart: CartItem[] = [];

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
      client,
      emptyCart,
      goToNext,
      goToPrevious,
      invoceType,
      iva,
      priceList,
      removeItem,
      setActiveStep,
      setClient,
      setInvoceType,
      setIva,
      setPriceList,
      setWarehouse,
      steps,
      totalCart,
      totalCartItems,
      updateCartWithError,
      warehouse,
      subTotalCart,
      totalIvaCart,
      recalculateCart,
      totalDiscount,
      setTotalDiscount,
    }),
    [
      activeStep,
      cart,
      client,
      goToNext,
      goToPrevious,
      invoceType,
      iva,
      priceList,
      setActiveStep,
      steps,
      totalCart,
      totalCartItems,
      updateCartWithError,
      warehouse,
      subTotalCart,
      totalIvaCart,
      recalculateCart,
      totalDiscount,
    ]
  );

  return <posContext.Provider value={values}>{children}</posContext.Provider>;
};

export const usePosContext = () => {
  const {
    activeStep,
    addItem,
    cart,
    client,
    emptyCart,
    goToNext,
    goToPrevious,
    invoceType,
    iva,
    priceList,
    removeItem,
    setActiveStep,
    setClient,
    setInvoceType,
    setIva,
    setPriceList,
    setWarehouse,
    steps,
    totalCart,
    totalCartItems,
    updateCartWithError,
    warehouse,
    subTotalCart,
    totalIvaCart,
    recalculateCart,
    totalDiscount,
    setTotalDiscount,
  } = useContext(posContext);

  return {
    activeStep,
    addItem,
    cart,
    client,
    emptyCart,
    goToNext,
    goToPrevious,
    invoceType,
    iva,
    priceList,
    removeItem,
    setActiveStep,
    setClient,
    setInvoceType,
    setIva,
    setPriceList,
    setWarehouse,
    steps,
    totalCart,
    totalCartItems,
    updateCartWithError,
    warehouse,
    subTotalCart,
    totalIvaCart,
    recalculateCart,
    totalDiscount,
    setTotalDiscount,
  };
};
